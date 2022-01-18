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
  alertimg = '../../../assets/img/e-tick.svg';
  constructor(@Inject(MAT_DIALOG_DATA) public data: AlertdialogComponent, public dialog: MatDialog, public dialogRef: MatDialogRef<AlertdialogComponent>) { }

  ngOnInit(): void {
    this.messageerror = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
}
}
