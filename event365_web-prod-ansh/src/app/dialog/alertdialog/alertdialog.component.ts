import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { localString } from 'src/app/shared/utils/strings';

@Component({
  selector: 'app-alertdialog',
  templateUrl: './alertdialog.component.html',
  styleUrls: ['./alertdialog.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class AlertdialogComponent implements OnInit {
  STRINGS: any = localString;
  messageerror : any =''
  errorBlock : boolean = true;
  successIcon : boolean = false;
  errorIcon : boolean = true;
  venueRemovedDateAndTime: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: AlertdialogComponent, public dialog: MatDialog,public dialogRef: MatDialogRef<AlertdialogComponent>) { }

  ngOnInit(): void {
    this.messageerror = this.data;
    if(this.messageerror.name == "Your profile has been blocked cause of you attemped 5 time wrong password.") {
      this.messageerror.name = "Your profile is locked due to entering wrong password for 5 times. Please contact administrator to enable your account."
      this.errorBlock = !this.errorBlock;
    }
    if(this.messageerror.name == "Your account has been restricted. Please send us a message to resolve this issue") {
      this.errorBlock = !this.errorBlock;
    }
    if(this.messageerror.name == "Your Profile updated successfully") {
      this.successIcon = !this.successIcon;
      this.errorIcon = !this.errorIcon;
    }
    if(this.messageerror.name == "'Email already exists'") {
      this.errorBlock = !this.errorBlock;
    }
    if(this.messageerror.name == "'Start time & End time should not be same'") {
      this.errorBlock = !this.errorBlock;
    }
    if(this.messageerror.name == "'You can select upto 5 Sub Categories maximum'") {
      this.errorBlock = !this.errorBlock;
    }
    if(this.messageerror.name == "'Email Not Available'") {
      this.errorBlock = !this.errorBlock;
    }
    if(this.messageerror.name == "'Contact Number Not Available'") {
      this.errorBlock = !this.errorBlock;
    }
    if(this.messageerror.name == "'Website Not Available'") {
      this.errorBlock = !this.errorBlock;
    }
    if(this.messageerror.name == "'Either ticket detail is not found or ticket number has been already checked-in or cancelled'") {
      this.errorBlock = !this.errorBlock;
    }
    if (this.data.removeVenue != null){
      this.venueRemovedDateAndTime = true;
      this.errorBlock = false;
      this.messageerror.name = " Updated Time and Date cause you to select venue again"
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
}

removeVenue() {
  localStorage.setItem("removeVenue", "yes");
  this.dialogRef.close();
}

}
