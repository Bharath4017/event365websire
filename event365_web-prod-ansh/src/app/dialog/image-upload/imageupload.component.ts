import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-imageupload',
  templateUrl: './imageupload.component.html',
  styleUrls: ['./imageupload.component.scss'],
  encapsulation: ViewEncapsulation.None,

})

export class ImageuploadComponent implements OnInit {
  alertimg = '../../../assets/img/imgupload.png';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public _DomSanitizationService: DomSanitizer, public dialog: MatDialog,public dialogRef: MatDialogRef<ImageuploadComponent>) {
  }

  ngOnInit(): void {

  }
  fileToUpload: any;

  onFileDropped(files: Array<any>) {
    if (files) {
    for (const file of files) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (file.type.indexOf("image") > -1) {
        this.data.push({
          eventImage:e.target.result
        });
      }
    };
      reader.readAsDataURL(file);
    }
    this.dialogRef.close(files);
  }
}

  onSelectFile(e: any) {
    const files = e.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (file.type.indexOf("image") > -1) {
            this.data.push({
              eventImage:e.target.result
            });
          }
        };
        reader.readAsDataURL(file);
      }
      this.dialogRef.close(files);
    }
  }
}
