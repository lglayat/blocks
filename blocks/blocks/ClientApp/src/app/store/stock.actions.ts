import { Action } from '@ngrx/store';
import  { Stock } from './stock.model';

export enum StockActionTypes{
   ADD_STOCK = '[Stock] Add',
   GET_STOCK = '[Stock] Get',
   DELETE_STOCK = '[Stock] Delete'
}

export class AddStockAction implements Action {
  readonly type = StockActionTypes.ADD_STOCK;

  constructor(public payload: Stock) {}
}

export class DeleteStockAction implements Action {
  readonly type = StockActionTypes.DELETE_STOCK;

  constructor(public payload: Stock) {}
}



export type StockAction = AddStockAction | DeleteStockAction;
