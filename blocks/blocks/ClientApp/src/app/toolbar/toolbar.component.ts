import { Component, OnInit } from '@angular/core';
import { ToolbarService } from '../services/toolbar.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  interval: string = ''

  constructor(private _toolbarService: ToolbarService) { }

  ngOnInit() {
  }

  setInterval(event){
    console.log(event.path[0].innerText)

    this.interval = event.path[0].innerText;
    this._toolbarService.announceNewInterval(event.path[0].innerText);
  }

}
