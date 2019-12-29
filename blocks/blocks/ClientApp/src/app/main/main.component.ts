import { Component,
    OnInit,
    Input,
    Directive,
    ViewChild,
    ViewContainerRef,
    ComponentFactoryResolver,
    ComponentRef,
    ComponentFactory
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import  { AppState } from '../store/app-state.model';
import  { Stock }  from '../store/stock.model';
import {AddStockAction } from '../store/stock.actions';
import { BlockComponent } from '../block/block.component'

@Directive({selector: 'chart'})
export class Chart {
  @Input() id !: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @ViewChild('charts', { read: ViewContainerRef, static: false }) charts: ViewContainerRef;

  componentRef: any;
  latestTicker: string;
  items$: Observable<Array<Stock>>;
  stocks: string[] = [];
  newStock: Stock = {ticker: ''};

  constructor(private store: Store<AppState>, private resolver: ComponentFactoryResolver){}

  ngOnInit() {
    this.items$ = this.store.select(store => store.stocks);
    this.items$.subscribe(
      x => this.doThing(x),
      err => console.error('Observer got an error: ' + err),
      () => console.log('Observer got a complete notification')
    );
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
  

}
