import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-youreventalert',
  templateUrl: './youreventalert.component.html',
  styleUrls: ['./youreventalert.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class YoureventalertComponent implements OnInit {
  alertimg = '../../../assets/img/right-tick.png';

  constructor(@Inject(MAT_DIALOG_DATA) public data: YoureventalertComponent,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<YoureventalertComponent>,
              private utilityService: UtilityService) { }
  eventName: any;
  eventCode: any;
  response: any;
  name: any;
  message: any;
  update: any;
  alertMsg: any;

  ngOnInit(): void {
   // console.log(this.data);
    if (this.data.name === 'Bank Details has been created successfully'){
       this.alertMsg = 'You have successfully added your bank account.';
       return;
     }
    if (this.data.name === 'Ticket is cancelled'){
      this.alertMsg = 'Ticket is cancelled';
      return;
    }
    if (this.data.response.data) {
      this.alertMsg = 'Event has been posted successfully';
      this.eventCode = this.data.response.data.eventCode;
      this.eventName = this.data.response.data.name;
    }
    if (this.data.response.message === 'Event has been updated successfully'){
      this.alertMsg = 'Event has been updated successfully';
    }
    if (this.data.response.message === 'Event has been deleted successfully'){
      this.alertMsg = 'Event has been deleted successfully';
    }
    if (this.data.response.message === 'User has been created successfully'){
      this.alertMsg = 'User has been created successfully';
    }
    if (this.data.response.message === 'User has been updated successfully'){
      this.alertMsg = 'User has been updated successfully';
    }

    if (this.data.response.message === 'User have been deleted suceessfully'){
      this.alertMsg = 'User have been deleted suceessfully';
    }
    
  }

  // ngOnDestroy(): void {
  //   this.utilityService.createEventDetails.(next) {}
  // }
}
