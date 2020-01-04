import { Component, OnInit, ViewChild,  ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import  { AppState } from '../store/app-state.model';
import  { Stock }  from '../store/stock.model';
import {AddStockAction, DeleteStockAction } from '../store/stock.actions';

import { GreetingComponent } from '../greeting/greeting.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  mode = new FormControl('over');
  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  items$: Observable<Array<Stock>>;
  stocks: string[] = [];
  busy = false;

  constructor(private store: Store<AppState>, public dialog: MatDialog){}

  ngOnInit() {
    this.items$ = this.store.select(store => store.stocks);
    this.items$.subscribe(
      x => this.resetStocks(x),
      err => console.error('Observer got an error: ' + err),
      () => console.log('Observer got a complete notification')
    );

    this.openDialog();
  }

  deleteStock(event){
    var newStock: Stock = {ticker: event.path[1].id};
    this.store.dispatch(new DeleteStockAction(newStock));
  }

  resetStocks(data){
    console.log(data)
    this.stocks = data;
  }

  trackStocks(index: number, element: any){
    return element ? element.ticker : null
  }


  openDialog(): void {
    this.busy = true;
    const dialogRef = this.dialog.open(GreetingComponent, {
      width: '50%',
      height: '50%'
    });

    dialogRef.afterOpened().subscribe(result => {
      this.busy = false;
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

}
