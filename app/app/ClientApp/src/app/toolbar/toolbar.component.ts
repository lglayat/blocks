import { Component, OnInit } from '@angular/core';
import { ToolbarService } from '../services/toolbar.service';
import * as moment from 'moment'
import { timer } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  afterHours: boolean;
  interval: string = ''


  constructor(private _toolbarService: ToolbarService) { }

  ngOnInit() {
    var format = 'hh:mm:ss'
    var time = moment()
    var beforeTime = moment('09:30:00', format)
    var afterTime = moment('16:00:00', format)
    var d = new Date();
    var day = d.getDay();

    if (time.isBetween(beforeTime, afterTime) && day > 6) {

      this.afterHours = false;

    } else {

      this.afterHours = true;

    }
  }

  setInterval(event){
    console.log(event.path[0].innerText)

    this.interval = event.path[0].innerText;
    this._toolbarService.announceNewInterval(event.path[0].innerText);
  }



 

}
