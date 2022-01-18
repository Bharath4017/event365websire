import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Console } from 'console';
import { localString } from 'src/app/shared/utils/strings';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.scss']
})
export class SuccessDialogComponent implements OnInit, OnDestroy {

  STRINGS: any = localString;
  errorget = false;
  error: any;
  username: any;
  messageerror: any = '';


  constructor(@Inject(MAT_DIALOG_DATA)
              public data: SuccessDialogComponent,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<SuccessDialogComponent>) {
              this.error = data.error;
              this.username = data.username;
    // console.log(this.username);
  }

  ngOnInit(): void {
    this.messageerror = this.data;
    if (this.messageerror.message === 'Your venue was successfully created!') {
      this.messageerror = 'Your venue was successfully added.';
    }
    if (this.messageerror.message === 'Your venue was successfully updated!') {
      this.messageerror = 'Your venue was successfully updated!';
    }
    if (this.messageerror.message === 'Password has been updated') {
      this.messageerror = 'Password has been updated';
    }
    if (this.messageerror.message === 'Preferences added successfully') {
      this.messageerror = 'Preferences added successfully';
    }
    if (this.messageerror.message === 'Category deleted successfully') {
      this.messageerror = 'Category deleted successfully';
    }
    if (this.messageerror.message === 'Sub Category deleted successfully') {
      this.messageerror = 'Sub Category deleted successfully';
    }
    if (this.messageerror.message === 'Your Profile updated successfully') {
      this.messageerror = 'Your Profile updated successfully';
    }
    if (this.messageerror.message === 'Notify status has been changed Successfully') {
      this.messageerror = 'Notify status has been changed Successfully';
    }
    if (this.messageerror.message === 'remind is updated') {
      this.messageerror = 'Remind is updated';
    }
    if (this.messageerror.message === 'Notify is updated') {
      this.messageerror = 'Notify is updated';
    }
    if (this.messageerror.message === 'Ticket Successfully Created') {
      this.messageerror = 'Ticket Successfully Created';
    }
    if (this.messageerror.message === 'Event uploaded successfully'){
      this.messageerror = 'Event uploaded successfully';
    }
    if (this.messageerror.message === 'SuccessFully Payment Done and Event is Created'){
      this.messageerror = 'SuccessFully Payment Done and Event is Created';
    }
  }
  ngOnDestroy(): void {
    localStorage.removeItem('error');
  }

}
