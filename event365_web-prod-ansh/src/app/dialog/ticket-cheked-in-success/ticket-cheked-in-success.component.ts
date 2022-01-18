import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { localString } from 'src/app/shared/utils/strings';

@Component({
  selector: 'app-ticket-cheked-in-success',
  templateUrl: './ticket-cheked-in-success.component.html',
  styleUrls: ['./ticket-cheked-in-success.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class TicketChekedInSuccessComponent implements OnInit,OnDestroy {
  STRINGS: any = localString;
  errorget:boolean = false;
  error:any
  username:any

  constructor(@Inject(MAT_DIALOG_DATA) public data: TicketChekedInSuccessComponent, public dialog: MatDialog,public dialogRef: MatDialogRef<TicketChekedInSuccessComponent>) { 
    this.error =data.error
    this.username =data.username
    // console.log(this.username)
  }

  ngOnInit(): void {
   const ticketNotAvaibale = localStorage.getItem("error");
   if(ticketNotAvaibale?.includes("Ticket not available")){
     this.errorget= true
   }
  }
  ngOnDestroy(): void {
    localStorage.removeItem('error');
  }
}
