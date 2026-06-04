import { Routes } from '@angular/router';
import { PupPadEntranceComponent } from './features/invitation/pages/pup-pad-entrance/pup-pad-entrance.component';

export const routes: Routes = [
  { path: '', component: PupPadEntranceComponent },
  { path: '**', redirectTo: '' }
];

