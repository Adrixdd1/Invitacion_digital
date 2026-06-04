import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeviceOrientationComponent } from './core/components/device-orientation/device-orientation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DeviceOrientationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'invitacion-fari';
}
