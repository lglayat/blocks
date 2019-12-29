import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {

  private intervalSource = new Subject<string>();

  intervalsAnnounced$ = this.intervalSource.asObservable();
  
  constructor() { }

  announceNewInterval(interval: string) {
        this.intervalSource.next(interval);
  }

}
