import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SearchService } from '../services/search.service';
import { ToolbarService } from "../services/toolbar.service";
import { NewsService } from "../services/news.service";
import { Summary } from './Summary';
import { first } from 'rxjs/operators';
import { timer } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store/app-state.model';
import { DeleteStockAction } from '../store/stock.actions';
import { Stock }  from '../store/stock.model';
import * as moment from 'moment'

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockComponent implements OnInit, OnDestroy {

  @Input() ticker: string;
  @Output() destroyCheck: EventEmitter<string> = new EventEmitter<string>();

  //booleans for showing/hiding charts
  public showSummary: boolean = false;
  public showChart: boolean = false;
  public showIntraday: boolean = true;
  public isIntradayAvailable: boolean = false;
  public isDataAvailable: boolean = false;
  public isSummaryAvailable: boolean = false;

  //time interval
  currentInterval: string;
  afterHours: boolean;

  //data 
  public summary: Summary;
  public globalHistoricalData: any[];
  public globalIntradayData = [];

  //chart variables
  title = this.ticker;
  type = 'CandlestickChart';
  intradayData = [];
  historicalData: any[] = [];
  columnNames = ["Date", "Price", "Low", "Open", "Close"];
  options = {};
  width = 500;
  height = 300;

  constructor(
    private _searchService: SearchService,
    private store: Store<AppState>,
    private _toolbarService: ToolbarService,
    private _newsService: NewsService) {

    _toolbarService.intervalsAnnounced$.subscribe(
      interval => {
        this.updateInterval(interval);
      })

  }


  ngOnInit() {

    console.log("Ticker: " + this.ticker);

    var obs = this._searchService.searchStockDetail(this.ticker).pipe(first())
      .subscribe(res => this.makeSummary(res["_body"]));;

    var obs2 = this._searchService.searchStockHistorical(this.ticker).pipe(first())
      .subscribe(res => this.drawHistorical(res["_body"]));

    var obs3 = this._searchService.searchStockIntraday(this.ticker);
    obs3.subscribe(res => this.drawIntraday(res["_body"]));
    



    var format = 'hh:mm:ss'
    var time = moment()
    var beforeTime = moment('09:30:00', format)
    var afterTime = moment('16:00:00', format)

    if (time.isBetween(beforeTime, afterTime)) {

      console.log('market is open: live updating...')
      const source = timer(0, 60000 /*300000*/);
      const s = source.subscribe(val => this._searchService.searchStockIntraday(this.ticker)
        .subscribe(res => this.drawIntraday(res["_body"])));

      this.afterHours = false;

    } else {

      console.log('after hours')
      var obs2 = this._searchService.searchStockIntraday(this.ticker).pipe(first())
        .subscribe(res => this.drawIntraday(res["_body"]));

    }
  }


  toggleNews() {
    console.log()
    this._newsService.announceNews(this.ticker);
   }


  drawIntraday(data) {
     console.log("drawing intraday")
      var returnObj = []
      var obj = JSON.parse(data);

      console.log(obj)

    let counter = 0;
    for (var item in obj["intraday"]) {
      if (counter < 40) {
        var ref = obj["intraday"][item];
        var arr = item.split(' '); //get label
        let label = arr[1].slice(0, -3)
        returnObj.push([label, parseFloat(ref["low"]), parseFloat(ref["open"]), parseFloat(ref["close"]), parseFloat(ref["high"])])
        counter++;
      }
   
     }



    this.intradayData = returnObj.splice(0,50).reverse();
     this.isIntradayAvailable = true;
  }

  updateInterval(data){
    //console.log("new interval "  + data);
    var cutOff;

    if(data == "1 Month"){
      cutOff = moment().subtract(1, 'months');
    }
    else if (data == "3 Months") {
      cutOff = moment().subtract(3, 'months');
    }
    else if(data == "6 Months"){
      cutOff = moment().subtract(6, 'months');
    }
    else if(data == "1 Year"){
      cutOff = moment().subtract(1, 'year');
    }
    else if(data == "5 Years"){
      cutOff = moment().subtract(5, 'years');
    }
    else if(data == "10 Years"){
      cutOff = moment().subtract(10, 'years');
    }

    var returnObj = []

    
    //filter out old data 
    for(let i = 0; i < this.globalHistoricalData.length;i++ ){
      var itemDate = moment(this.globalHistoricalData[i][0])
      if (itemDate.isSameOrAfter(cutOff)) {
        console.log(this.globalHistoricalData[i])
        returnObj.push(this.globalHistoricalData[i] );
      }
    }
    this.historicalData = returnObj;
  }


  makeSummary(data){
    var obj = JSON.parse(data);
    var ref = obj["data"][0];

    var s : Summary = <Summary> {
      symbol: ref.symbol,
      name: ref.name,
      currency:  ref.currency,
      price: ref.price,
      priceopen:ref.price_open,
      dayhigh: ref.day_high,
      daylow: ref.day_low,
      daychange: ref.day_change,
      changepct:ref.change_pct,
      closeyesterday:ref.close_yesterday,
      marketcap: ref.market_cap,
      volume:ref.volume,
      shares: ref.shares,
      stockexchangelong: ref.stock_exchange_long,
      stockexchangeshort: ref.stock_exchange_short,
      pe: ref.pe,
      eps: ref.eps
    };

    //console.log(s);
    if(s.symbol != null){
      this.summary = s;

      this.isSummaryAvailable = true;
    }
  }

  drawHistorical(data){

    var returnObj = []

    //create data object for charting library with response data
    var obj = JSON.parse(data);
    let counter = 1;
    for (var item in obj["history"]){
      if (counter == 10) {
        var ref = obj["history"][item];
        var arr = item.split(' '); //get label
        let label = arr[0]//.substring(2)
        returnObj.push([ label, parseFloat(ref["low"]), parseFloat(ref["open"]), parseFloat(ref["close"]), parseFloat(ref["high"])])
        counter = 1;
      }
      counter++;
    }

    this.historicalData = returnObj;
    this.globalHistoricalData = returnObj;
    this.isDataAvailable = true
  }

  deleteStock(){
    console.log(this.ticker)
    var newStock: Stock = {ticker: this.ticker};
    this.store.dispatch(new DeleteStockAction(newStock));
  }

  ngOnDestroy(){
    this.destroyCheck.emit('destroyed');
  }

  public toggleChart(){
    this.showChart = true;
    this.showSummary = false;
    this.showIntraday = false;
  }

  public toggleSummary(){
    this.showSummary = true;
    this.showChart = false;
    this.showIntraday = false;
  }

  public toggleIntraday(){
    this.showIntraday = true;
    this.showChart = false;
    this.showSummary = false;
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }


}
