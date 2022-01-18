import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-no-sub-venue',
  templateUrl: './alert-no-sub-venue.component.html',
  styleUrls: ['./alert-no-sub-venue.component.scss']
})
export class AlertNoSubVenueComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<AlertNoSubVenueComponent>) { }

  ngOnInit(): void {
  }
  closePopup(){
    this.dialogRef.close();
  }
}
