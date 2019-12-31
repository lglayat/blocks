import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {

  private intervalSource = new Subject<string>();
  private intradayIntervalSource = new Subject<string>();

  intervalsAnnounced$ = this.intervalSource.asObservable();
  intradayIntervalsAnnounced$ = this.intradayIntervalSource.asObservable();

  constructor() { }

  announceNewInterval(interval: string) {
        this.intervalSource.next(interval);
  }

  announceNewIntradayInterval(interval: string) {
    this.intradayIntervalSource.next(interval);
  }

}
