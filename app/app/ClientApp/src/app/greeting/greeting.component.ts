import { Component,
    OnInit,
    Inject
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



@Component({
    selector: 'app-greeting',
    templateUrl: './greeting.component.html',
    styleUrls: ['./greeting.component.css']
})

export class GreetingComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<GreetingComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  }
