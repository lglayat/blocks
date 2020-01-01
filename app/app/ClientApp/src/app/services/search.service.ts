import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  baseUrl: string = "https://d.yimg.com/autoc.finance.yahoo.com/autoc?query=";
  UrlSuffix: string = "&lang=ENG";
  API_TOKEN: string = "0TfbCcPV56v84s9bTk3LeNL7GOwu4Wx5UC4wFr3okoOPslKoR91nEhvzzj3Z";


  constructor(private _http: Http) { }

  search(queryString: string) {
    //let _URL = "https://d.yimg.com/autoc.finance.yahoo.com/autoc?query=" + queryString + "&lang=ENG";

    return this._http.get("https://api.worldtradingdata.com/api/v1/stock_search?search_term=" + queryString +  "&search_by=symbol,name&limit=5&page=1&api_token=" + this.API_TOKEN);
  }

  searchStockDetail(queryString: string) {
    return this._http.get("https://api.worldtradingdata.com/api/v1/stock?symbol=" + queryString + "&api_token=" + this.API_TOKEN); 
  }

  searchStockHistorical(queryString: string){
    return this._http.get("https://api.worldtradingdata.com/api/v1/history?symbol=" + queryString + "&sort=asc&api_token=0TfbCcPV56v84s9bTk3LeNL7GOwu4Wx5UC4wFr3okoOPslKoR91nEhvzzj3Z")
  }

  searchStockIntraday(queryString: string){
    return this._http.get("https://intraday.worldtradingdata.com/api/v1/intraday?symbol=" + queryString + "&sort=asc&range=3&interval=15&api_token=0TfbCcPV56v84s9bTk3LeNL7GOwu4Wx5UC4wFr3okoOPslKoR91nEhvzzj3Z");
  }

  searchStockNews(queryString: string){
    return this._http.get("https://stocknewsapi.com/api/v1?tickers=" + queryString + "&items=50&token=ocfez4et2jnati5hqfzj41s646clu6gisc6stqtm");
  }
  
}
