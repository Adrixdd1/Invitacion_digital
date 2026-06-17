import os
import re
import sys
import shutil
import subprocess
import static_ffmpeg

# Configure stdout to use UTF-8 to prevent encoding errors on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

def extract_and_split():
    print("Inicializando FFmpeg...")
    static_ffmpeg.add_paths()

    # Find input file
    input_file = None
    extensions = ['.mp4', '.mp3', '.wav', '.m4a', '.webm', '.mkv']
    for ext in extensions:
        potential_path = f"patrulla{ext}"
        if os.path.exists(potential_path):
            input_file = potential_path
            break
    
    if not input_file:
        print("ERROR: No se encontro ningun archivo de origen en el directorio raiz.")
        print("Por favor guarda el archivo como 'patrulla.mp4' o 'patrulla.mp3'.")
        sys.exit(1)

    print(f"Archivo de origen: {input_file}")

    # Create sound directories
    os.makedirs("src/assets/sounds/raw", exist_ok=True)

    master_wav = "temp_master.wav"
    if os.path.exists(master_wav):
        try:
            os.remove(master_wav)
        except:
            pass
        
    print("Convirtiendo audio a formato temporal WAV...")
    subprocess.run([
        "ffmpeg", "-y", "-i", input_file, 
        "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", 
        master_wav
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    if not os.path.exists(master_wav):
        print("ERROR: Fallo la conversion a WAV.")
        sys.exit(1)

    # Get duration
    dur_result = subprocess.run([
        "ffprobe", "-v", "error", "-show_entries", "format=duration", 
        "-of", "default=noprint_wrappers=1:nokey=1", master_wav
    ], capture_output=True, text=True, encoding="utf-8")
    try:
        total_duration = float(dur_result.stdout.strip())
    except:
        total_duration = 90.0

    print(f"Duracion total del audio: {total_duration:.2f} segundos")

    # We will try different thresholds to find the best cut
    best_segments = []
    selected_thresh = -35
    
    print("Buscando el mejor umbral para separar las frases (debido al ruido/musica de fondo)...")
    for thresh in [-35, -30, -26, -22, -19, -16, -13, -10]:
        cmd = [
            "ffmpeg", "-i", master_wav, 
            "-af", f"silencedetect=noise={thresh}dB:d=0.35", 
            "-f", "null", "-"
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
        stderr = result.stderr

        silence_starts = []
        silence_ends = []

        for line in stderr.splitlines():
            if "silence_start:" in line:
                match = re.search(r"silence_start:\s*([\d\.]+)", line)
                if match:
                    silence_starts.append(float(match.group(1)))
            elif "silence_end:" in line:
                match = re.search(r"silence_end:\s*([\d\.]+)", line)
                if match:
                    silence_ends.append(float(match.group(1)))

        # Reconstruct intervals
        events = []
        for s in silence_starts:
            events.append(('start', s))
        for e in silence_ends:
            events.append(('end', e))
        events.sort(key=lambda x: x[1])

        temp_segments = []
        last_sound_start = 0.0

        if len(events) > 0 and events[0][0] == 'start':
            if events[0][1] > 0.2:
                temp_segments.append((0.0, events[0][1]))
        
        for i in range(len(events)):
            etype, etime = events[i]
            if etype == 'end':
                last_sound_start = etime
            elif etype == 'start':
                if last_sound_start < etime and (etime - last_sound_start) > 0.4:
                    temp_segments.append((last_sound_start, etime))
        
        if len(events) > 0 and events[-1][0] == 'end':
            if total_duration - events[-1][1] > 0.4:
                temp_segments.append((events[-1][1], total_duration))

        print(f" - Umbral {thresh}dB: detecto {len(temp_segments)} frases")

        # The target number of segments is around 13-15
        if 12 <= len(temp_segments) <= 16:
            best_segments = temp_segments
            selected_thresh = thresh
            break
        
        # If we don't hit the target, keep the one that got closest to 14 segments
        if not best_segments or abs(len(temp_segments) - 14) < abs(len(best_segments) - 14):
            best_segments = temp_segments
            selected_thresh = thresh

    print(f"Umbral seleccionado: {selected_thresh}dB (encontro {len(best_segments)} frases)")

    if not best_segments:
        print("ERROR: No se detectaron frases.")
        sys.exit(1)

    # Clean old files in raw
    for file in os.listdir("src/assets/sounds/raw"):
        if file.startswith("segment_") and file.endswith(".wav"):
            try:
                os.remove(os.path.join("src/assets/sounds/raw", file))
            except:
                pass

    # Extract segments
    print("Recortando frases...")
    for idx, (start, end) in enumerate(best_segments):
        seg_num = idx + 1
        output_path = f"src/assets/sounds/raw/segment_{seg_num:02d}.wav"
        duration = end - start
        
        subprocess.run([
            "ffmpeg", "-y", "-ss", f"{start:.3f}", "-i", master_wav, 
            "-t", f"{duration:.3f}", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", output_path
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f" -> Guardado Segmento {seg_num:02d}: {start:.2f}s a {end:.2f}s (duracion: {duration:.2f}s)")

    # Mapping segments to puppies based on the detected list
    # If the number of segments matches or is close to 14, we map them directly.
    # Otherwise we map relative to total count to be safe.
    
    num_segs = len(best_segments)
    print(f"\nMapeando audios (Total segmentos: {num_segs})...")
    
    mapping = {}
    if num_segs == 14:
        # Perfect match
        mapping = {
            "chase": 4,     # "Patrulla lista para entrar en accion, senor"
            "rocky": 7,     # "Antes de tirarlo, ¡reciclarlo!"
            "marshall": 9,  # "Listos para el guau guau rescate"
            "skye": 10,     # "¡A volar se ha dicho!"
            "rubble": 11    # "Rubble a toda maquina"
        }
    else:
        # Heuristics if count is slightly different
        # We will dynamically map based on relative positions
        # Let's find segments by index
        mapping = {
            "chase": min(4, num_segs),
            "rocky": min(7, num_segs),
            "marshall": min(9, num_segs),
            "skye": min(10, num_segs),
            "rubble": min(11, num_segs)
        }

    for name, segment_idx in mapping.items():
        src_segment = f"src/assets/sounds/raw/segment_{segment_idx:02d}.wav"
        dest_sound = f"src/assets/sounds/{name}.wav"
        
        if os.path.exists(src_segment):
            shutil.copy(src_segment, dest_sound)
            print(f" - Asignado Segmento {segment_idx:02d} a '{name}.wav'")
        else:
            print(f" - No se encontro el Segmento {segment_idx:02d} para '{name}.wav'")

    # Clean up temp file
    if os.path.exists(master_wav):
        try:
            os.remove(master_wav)
        except:
            pass
        
    print("\nProceso completado con exito!")
    print("Puedes escuchar los audios en 'src/assets/sounds/raw/' y renombrar manualmente si lo deseas.")

if __name__ == "__main__":
    extract_and_split()
