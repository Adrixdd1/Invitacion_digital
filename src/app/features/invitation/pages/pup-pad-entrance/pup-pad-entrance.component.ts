import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import anime from 'animejs';
import { AudioService } from '../../../../core/services/audio.service';

@Component({
  selector: 'app-pup-pad-entrance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Sky Background (No Tech Grid) -->
    <div class="sky-background">
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
      <div class="cloud cloud-4"></div>
      
      <div class="bg-paws">
        <i class="fa-solid fa-paw bg-paw paw-1"></i>
        <i class="fa-solid fa-paw bg-paw paw-2"></i>
        <i class="fa-solid fa-paw bg-paw paw-3"></i>
        <i class="fa-solid fa-paw bg-paw paw-4"></i>
        <i class="fa-solid fa-paw bg-paw paw-5"></i>
      </div>
    </div>

    <div class="entrance-container">
      <!-- Fullscreen Toggle Button (Mobile Friendly) -->
      <button class="fullscreen-toggle-btn" (click)="toggleFullscreen()" aria-label="Pantalla completa">
        <i class="fa-solid" [class.fa-expand]="!isFullscreen" [class.fa-compress]="isFullscreen"></i>
        <span class="btn-tooltip">Pantalla Completa</span>
      </button>

      <!-- Friendly Call Banner -->
      <div class="incoming-call-banner" *ngIf="state === 'calling'">
        <h2 class="call-title">🚨 ¡MISION ENTRANTE! 🚨</h2>
        <p class="call-subtitle">Toca el escudo de Farid para contestar la llamada</p>
      </div>

      <!-- Ryder's Physical Pup Pad Console (vibrates in calling mode) -->
      <div class="pup-pad-frame" 
           [class.vibrating]="isRinging && state === 'calling'">
        
        <!-- Top & Bottom Textured Bumper Grips (4 protuberancias estriadas) -->
        <div class="pad-bumper bumper-top-left">
          <span class="stripe"></span><span class="stripe"></span><span class="stripe"></span>
        </div>
        <div class="pad-bumper bumper-top-right">
          <span class="stripe"></span><span class="stripe"></span><span class="stripe"></span>
        </div>
        <div class="pad-bumper bumper-bottom-left">
          <span class="stripe"></span><span class="stripe"></span><span class="stripe"></span>
        </div>
        <div class="pad-bumper bumper-bottom-right">
          <span class="stripe"></span><span class="stripe"></span><span class="stripe"></span>
        </div>

        <!-- Left Accent Stripe (Red Curved Band) with Sky Blue Circular Cutout -->
        <div class="pad-accent-side accent-left">
          <div class="circle-cutout cutout-left">
            <div class="cutout-bg sky-bg"></div>
          </div>
        </div>

        <!-- Right Accent Stripe (Light Blue Curved Band) with Silver Circular Cutout -->
        <div class="pad-accent-side accent-right">
          <div class="circle-cutout cutout-right">
            <div class="cutout-bg silver-bg"></div>
          </div>
        </div>

        <!-- Silver-Gray Inner Bezel -->
        <div class="pup-pad-silver-bezel">
          <!-- Inner Screen -->
          <div class="pup-pad-screen">
          
          <!-- State 1: Incoming Call Screen -->
          <div class="calling-screen-content" *ngIf="state === 'calling'" (click)="onAnswerCall()">
            <!-- Ryder Pager Pulse Waves -->
            <div class="pulse-wave wave-1"></div>
            <div class="pulse-wave wave-2"></div>
            
            <div class="cta-container">
              <div class="logo-wrapper">
                <h3 class="tap-label">¡LLAMADA DE FARID!</h3>
              </div>
              
              <button class="shield-farid-btn" aria-label="Contestar">
                <svg viewBox="0 0 100 110" class="shield-svg">
                  <defs>
                    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#e11b22" />
                      <stop offset="100%" stop-color="#9a0e13" />
                    </linearGradient>
                    <linearGradient id="silverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#ffffff" />
                      <stop offset="100%" stop-color="#a6a6a6" />
                    </linearGradient>
                    <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.5"/>
                    </filter>
                  </defs>
                  
                  <path d="M 50,2 L 95,20 L 85,80 Q 50,108 5,80 L 15,20 Z" fill="url(#silverGrad)" filter="url(#dropShadow)" />
                  <path d="M 50,8 L 89,24 L 80,76 Q 50,100 11,76 L 20,24 Z" fill="url(#shieldGrad)" />
                  <polygon points="50,22 58,40 78,41 62,54 68,73 50,61 32,73 38,54 22,41 42,40" fill="#ffcc00" stroke="#d4ab00" stroke-width="1.5" />
                  <rect x="35" y="12" width="30" height="6" rx="3" fill="#ffffff" />
                </svg>
                
                <span class="shield-name">FARID</span>
                <span class="shield-age">3</span>
              </button>
              
              <p class="pulse-text">TOCA PARA CONTESTAR</p>
            </div>
          </div>

          <!-- State 2: Mission Briefing Screen -->
          <div class="briefing-screen-content" *ngIf="state === 'briefing'">
            <div class="screen-background"></div>

            <div class="screen-content">
              <!-- Header section -->
              <header class="anim-item header-section">
                <h1 class="comic-title-custom">¡TODOS A LA TORRE!</h1>
                <h2 class="comic-subtitle-custom">Farid nos está llamando para festejar su cumpleaños</h2>
                <div class="horizontal-divider-blue"></div>
              </header>

              <!-- Date Row -->
              <div class="anim-item date-row">
                <span class="label-custom font-rubik-bold">SÁBADO</span>
                <span class="number-custom text-outline-blue">29</span>
                <span class="label-custom font-rubik-bold">DE AGOSTO</span>
              </div>

              <div class="horizontal-divider-blue"></div>

              <!-- Two Event Columns: Misa + Recepción -->
              <main class="event-columns">
                <!-- Left Column: Misa -->
                <div class="anim-item event-column" (click)="openParroquiaMaps()">
                  <span class="event-label misa-label">MISA: ACCIÓN DE GRACIAS</span>
                  <span class="event-sublabel">HORA</span>
                  <span class="event-time text-outline-blue">12:00</span>
                  <div class="event-venue-row">
                    <i class="fa-solid fa-location-dot event-pin"></i>
                    <div class="event-venue-text">
                      <span class="event-venue">PARROQUIA DE LA ASUNCIÓN</span>
                      <span class="event-address">Esq. Ferrocarril y Benito Juárez</span>
                    </div>
                  </div>
                </div>

                <!-- Paw Divider -->
                <div class="paw-divider anim-item">
                  <i class="fa-solid fa-paw"></i>
                </div>

                <!-- Right Column: Recepción -->
                <div class="anim-item event-column" (click)="openGoogleMaps()">
                  <span class="event-label recepcion-label">RECEPCIÓN</span>
                  <span class="event-sublabel">HORA</span>
                  <span class="event-time text-outline-blue">4:00</span>
                  <div class="event-venue-row">
                    <i class="fa-solid fa-location-dot event-pin"></i>
                    <div class="event-venue-text">
                      <span class="event-venue">LA QUINTA "DOÑA CARMEN"</span>
                      <span class="event-address">Ctra. Loma Bonita - Desparramadero</span>
                    </div>
                  </div>
                </div>
              </main>

              <!-- Draggable Floating Pups -->
              <!-- Skye in the air (top right) -->
              <div class="anim-item pup-wrapper skye-wrapper"
                   [style.transform]="'translate(' + pupPositions['skye'].x + 'px, ' + pupPositions['skye'].y + 'px)'"
                   (mousedown)="onDragStart($event, 'skye')"
                   (touchstart)="onDragStart($event, 'skye')">
                <div class="speech-bubble-pup" [class.visible]="pupSpeeches['skye'].visible">
                  <div class="bubble-tail"></div>
                  <p>{{ pupSpeeches['skye'].text }}</p>
                </div>
                <img src="assets/skye.png" class="character-pup character-skye" alt="Skye Paw Patrol" (click)="onPupClick('skye', '¡A volar por el cumple de Farid! 🚁💖')">
              </div>

              <!-- Chase -->
              <div class="anim-item pup-wrapper chase-wrapper"
                   [style.transform]="'translate(' + pupPositions['chase'].x + 'px, ' + pupPositions['chase'].y + 'px)'"
                   (mousedown)="onDragStart($event, 'chase')"
                   (touchstart)="onDragStart($event, 'chase')">
                <div class="speech-bubble-pup" [class.visible]="pupSpeeches['chase'].visible">
                  <div class="bubble-tail"></div>
                  <p>{{ pupSpeeches['chase'].text }}</p>
                </div>
                <img src="assets/chase-full.png" class="character-pup character-chase" alt="Chase Paw Patrol" (click)="onPupClick('chase', '¡Vamos a divertirnos! 🎉🐶')">
              </div>

              <!-- Marshall -->
              <div class="anim-item pup-wrapper marshall-wrapper"
                   [style.transform]="'translate(' + pupPositions['marshall'].x + 'px, ' + pupPositions['marshall'].y + 'px)'"
                   (mousedown)="onDragStart($event, 'marshall')"
                   (touchstart)="onDragStart($event, 'marshall')">
                <div class="speech-bubble-pup" [class.visible]="pupSpeeches['marshall'].visible">
                  <div class="bubble-tail"></div>
                  <p>{{ pupSpeeches['marshall'].text }}</p>
                </div>
                <img src="assets/marshall.png" class="character-pup character-marshall" alt="Marshall Paw Patrol" (click)="onPupClick('marshall', '¡Listo para jugar! 🚒🔥')">
              </div>

              <!-- Rubble -->
              <div class="anim-item pup-wrapper rubble-wrapper"
                   [style.transform]="'translate(' + pupPositions['rubble'].x + 'px, ' + pupPositions['rubble'].y + 'px)'"
                   (mousedown)="onDragStart($event, 'rubble')"
                   (touchstart)="onDragStart($event, 'rubble')">
                <div class="speech-bubble-pup" [class.visible]="pupSpeeches['rubble'].visible">
                  <div class="bubble-tail"></div>
                  <p>{{ pupSpeeches['rubble'].text }}</p>
                </div>
                <img src="assets/rubble.png" class="character-pup character-rubble" alt="Rubble Paw Patrol" (click)="onPupClick('rubble', '¡Rubble a toda marcha! 🛠️💛')">
              </div>

              <!-- Rocky -->
              <div class="anim-item pup-wrapper rocky-wrapper"
                   [style.transform]="'translate(' + pupPositions['rocky'].x + 'px, ' + pupPositions['rocky'].y + 'px)'"
                   (mousedown)="onDragStart($event, 'rocky')"
                   (touchstart)="onDragStart($event, 'rocky')">
                <div class="speech-bubble-pup" [class.visible]="pupSpeeches['rocky'].visible">
                  <div class="bubble-tail"></div>
                  <p>{{ pupSpeeches['rocky'].text }}</p>
                </div>
                <img src="assets/rocky.png" class="character-pup character-rocky" alt="Rocky Paw Patrol" (click)="onPupClick('rocky', '¡Verde significa ir! ♻️💚')">
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      <!-- Skye's Gift Modal -->
      <div class="skye-modal-overlay" *ngIf="showSkyeModal" (click)="closeSkyeModal()">
        <div class="skye-modal-card" (click)="$event.stopPropagation()">
          <button class="skye-modal-close-btn" (click)="closeSkyeModal()">&times;</button>
          
          <div class="skye-badge-wrapper">
            <div class="skye-badge">
              <i class="fa-solid fa-gift"></i>
            </div>
          </div>
          
          <div class="skye-modal-body">
            <h3 class="skye-modal-title font-display">SUGERENCIA DE REGALOS</h3>
            <div class="skye-modal-divider"></div>
            
            <div class="skye-modal-message font-primary">
              <p class="modal-paragraph">"¡Ayuda a nuestro pequeño cachorro a cumplir sus sueños con una misión especial! Si deseas, puedes dejar tu regalo en efectivo en el buzón especial de la Torre de Control en la entrada. Pero si prefieres, ¡cualquier otro detalle o juguete físico también será recibido con mucha alegría y ladridos de emoción! ¡Gracias por ser parte de su tripulación!"</p>
            </div>
          </div>
          
          <div class="skye-modal-footer">
            <button class="skye-modal-action-btn font-display" (click)="closeSkyeModal()">¡ENTENDIDO!</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PupPadEntranceComponent implements OnInit, AfterViewInit, OnDestroy {
  state: 'calling' | 'briefing' = 'calling';
  isRinging: boolean = false;

  isFullscreen: boolean = false;

  activePup: 'chase' | 'marshall' | 'rubble' | 'rocky' | 'skye' | null = null;
  activeSpeechBubbleText: string = '¡Acepta esta misión para divertirte! 👮‍♂️💙';

  showSkyeModal: boolean = false;

  pupSpeeches: { [key: string]: { text: string; visible: boolean } } = {
    chase: {
      text: '¡Vamos a divertirnos! 🎉🐶',
      visible: false
    },
    marshall: {
      text: '¡Listo para jugar! 🚒🔥',
      visible: false
    },
    rubble: {
      text: '¡Rubble a toda marcha! 🛠️💛',
      visible: false
    },
    rocky: {
      text: '¡Verde significa ir! ♻️💚',
      visible: false
    },
    skye: {
      text: '¡A volar por el cumple de Farid! 🚁💖',
      visible: false
    }
  };

  // Draggable Coordinate Tracker
  pupPositions: { [key: string]: { x: number, y: number } } = {
    chase: { x: 0, y: 0 },
    marshall: { x: 0, y: 0 },
    rubble: { x: 0, y: 0 },
    rocky: { x: 0, y: 0 },
    skye: { x: 0, y: 0 }
  };

  private isDragging = false;
  private dragPup: string | null = null;
  private dragStartX = 0;
  private dragStartY = 0;
  private hasMoved = false;

  constructor(
    private audioService: AudioService
  ) { }

  ngOnInit(): void {
    // Calling state is active initially
  }

  ngAfterViewInit(): void {
    // Animate the physical Pup Pad entering cleanly and smoothly from the bottom at 1.0 scale
    anime({
      targets: '.pup-pad-frame',
      translateY: ['100vh', '0px'],
      opacity: [0, 1],
      easing: 'easeOutQuart',
      duration: 1200,
      complete: () => {
        // Start physical console vibration after entry completes
        this.isRinging = true;
      }
    });

    // Pulse action button infinitely to draw clicks in calling mode
    anime({
      targets: '.shield-farid-btn',
      scale: [1, 1.06],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      duration: 800
    });
  }

  onAnswerCall(): void {
    this.isRinging = false;
    this.audioService.playPupPadRing();

    // Detach pulse loop animation
    anime.remove('.shield-farid-btn');

    // Subtle tactile click scale bounce when answering
    anime({
      targets: '.pup-pad-frame',
      scale: [1, 0.96, 1],
      easing: 'easeInOutQuad',
      duration: 300,
      complete: () => {
        // Toggle template state to show briefing contents inside the screen
        this.state = 'briefing';

        // Stagger internal elements appearance once DOM renders
        setTimeout(() => {
          this.initBriefingAnims();
        }, 50);
      }
    });
  }

  private initBriefingAnims(): void {
    // Play alert sound for screen loading
    this.audioService.playBeep();

    // Cascaded animation for all briefing screen items
    anime({
      targets: '.anim-item',
      translateY: [40, 0],
      opacity: [0, 1],
      easing: 'easeOutBack',
      duration: 800,
      delay: anime.stagger(120)
    });

    // Subtly float individual bottom crew puppies infinitely
    anime({
      targets: '.character-chase',
      translateY: [0, -8, 0],
      easing: 'easeInOutSine',
      duration: 2000,
      loop: true
    });

    anime({
      targets: '.character-marshall',
      translateY: [0, -7, 0],
      easing: 'easeInOutSine',
      duration: 2100,
      loop: true,
      delay: 200
    });

    anime({
      targets: '.character-rubble',
      translateY: [0, -6, 0],
      easing: 'easeInOutSine',
      duration: 1900,
      loop: true,
      delay: 400
    });

    anime({
      targets: '.character-rocky',
      translateY: [0, -7, 0],
      easing: 'easeInOutSine',
      duration: 2050,
      loop: true,
      delay: 600
    });

    // Flying floating loop animation for Skye (hovering in top-right sky)
    anime({
      targets: '.character-skye',
      translateY: [0, -14, 0],
      translateX: [0, 4, 0],
      rotate: [0, -2, 2, 0],
      easing: 'easeInOutSine',
      duration: 3200,
      loop: true
    });
  }

  // --- INTERACTIVE DRAG AND DROP ---
  onDragStart(event: MouseEvent | TouchEvent, pup: string): void {
    this.isDragging = true;
    this.dragPup = pup;
    this.hasMoved = false;

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    this.dragStartX = clientX - this.pupPositions[pup].x;
    this.dragStartY = clientY - this.pupPositions[pup].y;
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onDragMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging || !this.dragPup) return;

    if (event.cancelable) {
      event.preventDefault();
    }

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    const newX = clientX - this.dragStartX;
    const newY = clientY - this.dragStartY;

    const deltaX = newX - this.pupPositions[this.dragPup].x;
    const deltaY = newY - this.pupPositions[this.dragPup].y;

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      this.hasMoved = true;
    }

    this.pupPositions[this.dragPup] = { x: newX, y: newY };
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onDragEnd(): void {
    this.isDragging = false;
    this.dragPup = null;
  }

  onPupClick(pup: 'chase' | 'marshall' | 'rubble' | 'rocky' | 'skye', text: string): void {
    if (this.hasMoved) {
      this.hasMoved = false;
      return;
    }
    this.triggerPupSpeech(pup, text);
  }

  triggerPupSpeech(pup: 'chase' | 'marshall' | 'rubble' | 'rocky' | 'skye', text: string): void {
    const willBeVisible = !this.pupSpeeches[pup].visible;
    if (willBeVisible) {
      this.audioService.playPupSound(pup);
    }
    this.pupSpeeches[pup].text = text;
    this.pupSpeeches[pup].visible = willBeVisible;

    // Bounce clicked puppy using anime.js
    const targetClass = `.character-${pup}`;
    anime.remove(targetClass);

    if (pup === 'skye') {
      anime({
        targets: targetClass,
        scale: [1, 1.18, 1],
        rotate: [0, -10, 10, 0],
        easing: 'easeOutBack',
        duration: 650,
        complete: () => {
          anime({
            targets: targetClass,
            translateY: [0, -14, 0],
            translateX: [0, 4, 0],
            rotate: [0, -2, 2, 0],
            easing: 'easeInOutSine',
            duration: 3200,
            loop: true
          });
        }
      });
    } else {
      anime({
        targets: targetClass,
        scale: [1, 1.1, 1],
        rotate: [0, -5, 5, 0],
        easing: 'easeOutSine',
        duration: 550,
        complete: () => {
          let floatDur = 2000;
          if (pup === 'marshall') floatDur = 2100;
          if (pup === 'rubble') floatDur = 1900;
          if (pup === 'rocky') floatDur = 2050;

          anime({
            targets: targetClass,
            translateY: [0, -6, 0],
            easing: 'easeInOutSine',
            duration: floatDur,
            loop: true
          });
        }
      });
    }
  }

  openSkyeModal(event: Event): void {
    event.stopPropagation();
    this.audioService.playBeep();
    this.showSkyeModal = true;
  }

  closeSkyeModal(): void {
    this.audioService.playBeep();
    this.showSkyeModal = false;
  }

  toggleFullscreen(): void {
    this.audioService.playBeep();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        this.isFullscreen = true;
      }).catch(err => {
        console.error('Error enabling fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        this.isFullscreen = false;
      });
    }
  }

  @HostListener('document:fullscreenchange', ['$event'])
  onFullscreenChange(): void {
    this.isFullscreen = !!document.fullscreenElement;
  }

  openGoogleMaps(): void {
    this.audioService.playBeep();
    const addressUrl = 'https://www.google.com/maps/search/?api=1&query=La+Quinta+Dona+Carmen+Loma+Bonita+-+Desparramadero';
    window.open(addressUrl, '_blank');
  }

  openParroquiaMaps(): void {
    this.audioService.playBeep();
    const addressUrl = 'https://www.google.com/maps/search/?api=1&query=Parroquia+de+la+Asuncion+Ferrocarril+y+Benito+Juarez';
    window.open(addressUrl, '_blank');
  }

  ngOnDestroy(): void {
    anime.remove('*');
  }
}
