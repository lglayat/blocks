import { Stock } from './stock.model';

export interface AppState {
  readonly stocks: Array<Stock>
};
