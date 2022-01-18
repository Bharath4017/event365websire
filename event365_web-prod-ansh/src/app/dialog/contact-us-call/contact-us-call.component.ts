import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { localString } from 'src/app/shared/utils/strings';

@Component({
  selector: 'app-contact-us-call',
  templateUrl: './contact-us-call.component.html',
  styleUrls: ['./contact-us-call.component.scss']
})
export class ContactUsCallComponent implements OnInit {

  STRINGS: any = localString;
  message: any =''
  constructor(@Inject(MAT_DIALOG_DATA) public data: ContactUsCallComponent, public dialog: MatDialog,public dialogRef: MatDialogRef<ContactUsCallComponent>) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
