import { Action, createReducer, on } from '@ngrx/store';
import  { Stock }  from "./stock.model";
import  { StockState } from './stock.state';
import { StockAction, StockActionTypes } from './stock.actions';


const initialState: Array<Stock> =  [
  {
    ticker: 'AAPL'
  }
];

export function StockReducer(
  state: Array<Stock> = initialState,
  action: StockAction
){
  switch(action.type){
    case StockActionTypes.ADD_STOCK:
      return [...state, action.payload];
    case StockActionTypes.DELETE_STOCK:
      return state.filter( stock => stock.ticker !== action.payload.ticker );
    default:
      return state;
  }
}
