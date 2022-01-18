import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef,  MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { localString } from 'src/app/shared/utils/strings';

@Component({
  selector: 'app-send-message-alert',
  templateUrl: './send-message-alert.component.html',
  styleUrls: ['./send-message-alert.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SendMessageAlertComponent implements OnInit {
  STRINGS: any = localString;
  message: any =''
  constructor(@Inject(MAT_DIALOG_DATA) public data: SendMessageAlertComponent, public dialog: MatDialog,public dialogRef: MatDialogRef<SendMessageAlertComponent>) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
