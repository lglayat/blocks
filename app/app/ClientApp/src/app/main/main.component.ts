import { Component,
    OnInit,
    Input,
    Directive,
    ViewChild
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NewsService } from "../services/news.service";
import { SearchService } from '../services/search.service';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import  { AppState } from '../store/app-state.model';
import  { Stock }  from '../store/stock.model';
import {AddStockAction } from '../store/stock.actions';
import { BlockComponent } from '../block/block.component'


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @ViewChild(BlockComponent, { static: false }) child;
  @ViewChild('sidenav2', { static: false }) sidenav2;

  latestTicker: string;
  items$: Observable<Array<Stock>>;
  stocks: string[] = [];
  newStock: Stock = {ticker: ''};
  message: string = "false"
  allNewsData: any[];

  constructor(private store: Store<AppState>,
              private _newsService: NewsService,
              private _searchService: SearchService) { }

  ngOnInit() {
    this.items$ = this.store.select(store => store.stocks);
    this.items$.subscribe(
      x => this.doThing(x),
      err => console.error('Observer got an error: ' + err),
      () => console.log('Observer got a complete notification')
    );

    this._newsService.newsAnnounced$.subscribe(
      interval => {
        this.getNews(interval);
      })
  }

  doThing(data){
    this.stocks = [];

    for(var item in data){
      this.stocks.push(data[item].ticker)
    }
  }

  trackStocks(index: number, element: any){
    return element ? element.ticker : null
  }

  getNews(data) {
    this._searchService.searchStockNews(data)
      .subscribe(res => this.drawNews(res));
  }

  drawNews(data) {
    
    var obj = JSON.parse(data["_body"]);

    console.log(obj["data"])

    //handle all button interactions
    if (JSON.stringify(obj["data"]) == JSON.stringify(this.allNewsData)) {
      this.message = "false";
      this.allNewsData = [];
    }
    else if (this.message == "true") {
      this.message = "false";
      this.allNewsData = [];
      this.allNewsData = obj["data"]
      this.message = "true";
    }
    else {
      this.allNewsData = []
      this.allNewsData = obj["data"]
      this.message = "true"
    }
 
  }

  toggleRightNav() {

    if (this.message == "true") {
      this.message = "false";
    }
    else {
      this.message = "true"
    }

    this.sidenav2.toggle();
  }
  

}
