import { Component,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ComponentFactoryResolver,
    ComponentRef,
    ComponentFactory
} from '@angular/core';
import { SearchService } from '../services/search.service';
import { FormControl } from '@angular/forms';
import  { AppState } from '../store/app-state.model';
import  { Stock }  from '../store/stock.model';
import {AddStockAction } from '../store/stock.actions';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { BlockComponent } from '../block/block.component'

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  //to save the stock info once clicked
  items$: Observable<Array<Stock>>;
  newStock: Stock = {ticker: ''};
  stocks: string[] = [];
  //for getting autocomplete results
  results: any[] = [];
  ticker: FormControl = new FormControl();

  constructor( private _searchService: SearchService, private store: Store<AppState>) { }

  ngOnInit() {
    //autocomplete logic
    this.ticker.valueChanges
    .debounceTime(200)
    .distinctUntilChanged()
    .switchMap( (query) => this._searchService.search(query) )
    .subscribe( response => this.results = JSON.parse(response["_body"]).ResultSet.Result ) ;


    //logic for populating stock <ul>
    this.items$ = this.store.select(store => store.stocks);
    this.items$.subscribe(
      x => this.stocks.push( x.slice(-1).pop().ticker  ),
      err => console.error('Observer got an error: ' + err),
      () => console.log('Observer got a complete notification')
    );

  }

  addStockChart(name, ticker){
      let arr = ticker.innerText.split('|');
      this.newStock = {ticker: arr[0].trim() };
      this.store.dispatch(new AddStockAction(this.newStock));
      this.newStock = { ticker: '' };
  }



}
