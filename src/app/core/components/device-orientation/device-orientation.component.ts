import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-device-orientation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="orientation-blocker" *ngIf="isPortrait">
      <div class="blocker-content">
        <div class="rotating-phone">
          <i class="fa-solid fa-mobile-screen-button phone-icon"></i>
          <i class="fa-solid fa-rotate rotate-arrow"></i>
        </div>
        <h2 class="comic-title">¡MISION ESPECIAL!</h2>
        <p class="instruction-text">
          Gira tu dispositivo horizontalmente para ingresar al <strong>Pup Pad de Ryder</strong>.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .orientation-blocker {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #002d62 0%, #0057b7 100%);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      text-align: center;
    }

    .blocker-content {
      max-width: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 30px;
      border-radius: 20px;
      border: 3px dashed var(--paw-yellow);
      box-shadow: var(--shadow-premium);
    }

    .rotating-phone {
      position: relative;
      font-size: 5rem;
      color: #ffffff;
      margin-bottom: 25px;
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .phone-icon {
      animation: rotatePhone 2.5s infinite ease-in-out;
      text-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }

    .rotate-arrow {
      position: absolute;
      font-size: 2.2rem;
      color: var(--paw-yellow);
      bottom: 5px;
      right: 5px;
      animation: spinArrow 2.5s infinite linear;
    }

    .instruction-text {
      font-family: var(--font-primary);
      font-size: 1.2rem;
      color: #f8f9fa;
      margin-top: 15px;
      line-height: 1.5;
      letter-spacing: 0.5px;
    }

    strong {
      color: var(--paw-yellow);
      font-weight: 700;
    }

    @keyframes rotatePhone {
      0% {
        transform: rotate(0deg);
      }
      35% {
        transform: rotate(90deg);
      }
      65% {
        transform: rotate(90deg);
      }
      100% {
        transform: rotate(0deg);
      }
    }

    @keyframes spinArrow {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `]
})
export class DeviceOrientationComponent implements OnInit {
  isPortrait: boolean = false;

  ngOnInit(): void {
    this.checkOrientation();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkOrientation();
  }

  private checkOrientation(): void {
    // True if screen height > screen width
    this.isPortrait = window.innerHeight > window.innerWidth;
  }
}
