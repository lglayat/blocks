import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private newsSource = new Subject<string>();

  newsAnnounced$ = this.newsSource.asObservable();

  constructor() { }

  announceNews(news: string) {
    this.newsSource.next(news);
  }
}
