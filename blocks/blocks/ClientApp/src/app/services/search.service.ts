import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  baseUrl: string = "http://d.yimg.com/autoc.finance.yahoo.com/autoc?query=";
  UrlSuffix: string = "&lang=ENG";
  API_TOKEN: string ="0TfbCcPV56v84s9bTk3LeNL7GOwu4Wx5UC4wFr3okoOPslKoR91nEhvzzj3Z";


  constructor(private _http: Http) { }

  search(queryString: string) {
      let _URL = this.baseUrl + queryString + this.UrlSuffix;

      return this._http.get(_URL);
  }

  searchStockDetail(queryString: string) {
    return this._http.get("https://api.worldtradingdata.com/api/v1/stock?symbol=" + queryString + "&api_token=" + this.API_TOKEN);
    /*.then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      return data;
     })
     .catch(error => console.log(error));*/
 }

  searchStockAnalysis(queryString: string) {
    fetch("https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-analysis?symbol="+ queryString, {
    	"method": "GET",
    	"headers": {
    		"x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
    		"x-rapidapi-key": "1v5lffmskPmshF2wBBGo5ITgyFfap1qrpFUjsnWlXmSVs6tmd9"
    	}
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      return data;
    });
  }

  searchStockHistorical(queryString: string){
    return this._http.get("https://api.worldtradingdata.com/api/v1/history?symbol=" + queryString + "&sort=asc&api_token=0TfbCcPV56v84s9bTk3LeNL7GOwu4Wx5UC4wFr3okoOPslKoR91nEhvzzj3Z")
  }

  searchStockIntraday(queryString: string){
    return this._http.get("https://intraday.worldtradingdata.com/api/v1/intraday?symbol=" + queryString + "&sort=asc&range=1&interval=5&api_token=" + this.API_TOKEN);
  }

  searchStockNews(queryString: string){
    return this._http.get("https://stocknewsapi.com/api/v1?tickers=" + queryString + "&items=50&token=ocfez4et2jnati5hqfzj41s646clu6gisc6stqtm");
  }
  
}
