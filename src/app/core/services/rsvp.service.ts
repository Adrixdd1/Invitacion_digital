import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface GuestRSVP {
  guestName: string;
  companionCount: number;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RsvpService {
  private firestore: Firestore | null = null;

  constructor() {
    try {
      // Proactively inject Firestore if Firebase is configured properly
      this.firestore = inject(Firestore);
    } catch (e) {
      console.warn('Firebase / Firestore could not be initialized. Using mock mode.', e);
    }
  }

  saveRSVP(rsvp: GuestRSVP): Observable<{ success: boolean; id?: string; error?: string }> {
    const isPlaceholder = environment.firebase.apiKey === 'YOUR_API_KEY';

    if (isPlaceholder || !this.firestore) {
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

    // Real Firebase execution
    const guestsCollection = collection(this.firestore, 'guests');
    return from(addDoc(guestsCollection, rsvp)).pipe(
      map(docRef => ({ success: true, id: docRef.id })),
      catchError(err => {
        console.error('Error saving RSVP to Firestore:', err);
        return of({ success: false, error: err.message || 'Error connecting to Firestore' });
      })
    );
  }
}
