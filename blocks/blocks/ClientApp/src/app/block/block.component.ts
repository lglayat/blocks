import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SearchService } from '../services/search.service';
import { ToolbarService } from "../services/toolbar.service";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Summary } from './Summary';
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
  @Output() destroyCheck:EventEmitter<string>=new EventEmitter<string>();
 
  //instance variables
  public showSummary: boolean = false;
  public showChart: boolean = false;
  public showIntraday: boolean = true;
  public isIntradayAvailable: boolean = false;
  public isDataAvailable: boolean = false;
  public isSummaryAvailable: boolean = false;
  
  //time interval
  currentInterval: string;

  //data objects
  public summary: Summary;
  public globalLineChartData: any[];

  // chart options
  view: any[] = [500, 300];
  public lineChartData: any[] = [];
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  yAxisTicksIntraday: any[] = []
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Price';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  //candlestick
  title = this.ticker;
  type = 'CandlestickChart';
  intradayData = [];
  columnNames = ["Date", "High", "Low", "Open", "Close"];
  options = { };
  width = 500;
  height = 300;


  constructor(
    private _searchService: SearchService,
    private store: Store<AppState>, 
    private _toolbarService: ToolbarService) {
    
      _toolbarService.intervalsAnnounced$.subscribe(
        interval => {
          this.updateInterval(interval);
        })
  }
     

  ngOnInit() {

     console.log("Ticker: " + this.ticker);
     //this block gets the historical chart data
     var obs1 = this._searchService.searchStockHistorical(this.ticker);
     obs1.subscribe( res => this.drawHistorical(res["_body"])  );
     //this block gets the stock details
     var obs2 = this._searchService.searchStockDetail(this.ticker);
     obs2.subscribe( res =>  this.makeSummary(res["_body"]));
     //get intraday data
     var obs3 = this._searchService.searchStockIntraday(this.ticker);
     obs3.subscribe( res =>  this.drawIntraday(res["_body"]));
     


     //this one pulls news im working on it
     
     var obs4 = this._searchService.searchStockNews(this.ticker);
     obs4.subscribe( res =>  this.drawNews(res["_body"]));
     
   }

   toggleNews(){
     
   }

   drawNews(data){
     console.log(data)
   }

   drawIntraday( data){
     //console.log(data)
    var returnObj = []

    var obj = JSON.parse(data);
    let counter = 1;
    
    for (var item in obj["intraday"]){
      if(counter == 5){
        var ref = obj["intraday"][item];
        var arr = item.split(' '); //get label    
        returnObj.push([arr[1], parseFloat(ref["open"]), parseFloat(ref["close"]), parseFloat(ref["high"]), parseFloat(ref["low"])])
        counter = 1;
      }
      counter++;
    }
    console.log(returnObj)
   this.intradayData = returnObj;
   this.isIntradayAvailable = true;
  }

  updateInterval(data){
    //console.log("new interval "  + data);
    var cutOff;

    if(data == "3 Months"){
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

    var returnObj = [
      {
        name: "Open",
        series: []
      },
      {
        name: "Close",
        series: []
      }
    ]

    
    //filter out old data 
    for(let i = 0; i < this.globalLineChartData[0].series.length;i++ ){
      var itemDate = moment(this.globalLineChartData[0].series[i].name)
      if( itemDate.isSameOrAfter(cutOff) ){
        returnObj[0].series.push( this.globalLineChartData[0].series[i] );
        returnObj[1].series.push( this.globalLineChartData[1].series[i] );
      }
    }
    this.lineChartData = returnObj;
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

    var returnObj = [
      {
        name: "Open",
        series: []
      },
      {
        name: "Close",
        series: []
      }
    ]

    //create data object for charting library with response data
    var obj = JSON.parse(data);
    let counter = 1;
    for (var item in obj["history"]){
      if(counter == 15){
        var arr = item.split(' '); //get label
        returnObj[0]["series"].push({name: arr[0] ,value: obj["history"][item]["open"] });
        returnObj[1]["series"].push({name: arr[0] ,value: obj["history"][item]["close"] });
        counter = 1;
      }
      counter++;
    }


    //supply the data for the chart
    this.lineChartData = returnObj;
    //save all data in case we zoom in or out
    this.globalLineChartData = returnObj;
    //let page know it can render the chart
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
