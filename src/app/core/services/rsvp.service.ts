import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface GuestRSVP {
  guestName: string;
  companionCount: number;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RsvpService {
  saveRSVP(rsvp: GuestRSVP): Observable<{ success: boolean; id?: string; error?: string }> {
    console.log('--- RSVP Service [Mock Mode] ---');
    console.log('Saving RSVP guest details:', rsvp);
    
    // Simulate network latency
    return of({ success: true, id: 'mock_' + Math.random().toString(36).substr(2, 9) }).pipe(
      map(res => {
        // Store in localStorage for debug demonstration
        const savedStr = localStorage.getItem('rsvp_guests') || '[]';
        const currentList = JSON.parse(savedStr);
        currentList.push({ ...rsvp, id: res.id, date: new Date().toISOString() });
        localStorage.setItem('rsvp_guests', JSON.stringify(currentList));
        return res;
      })
    );
  }
}
