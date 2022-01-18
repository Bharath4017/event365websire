import { Inject } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EventService } from 'src/app/pages/event/event.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AlerteventComponent } from '../alertevent/alertevent.component';
import { YoureventalertComponent } from '../your-event-alert/youreventalert.component';

@Component({
  selector: 'app-postevent',
  templateUrl: './postevent.component.html',
  styleUrls: ['./postevent.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class PosteventComponent implements OnInit {
  selection: number = 1;
  formData:any;
  create: any;
  update: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PosteventComponent,
    private eventService : EventService,
    private utilityService: UtilityService,
    private router: Router,
    public dialog: MatDialog,public dialogRef: MatDialogRef<PosteventComponent>) { }

  ngOnInit(): void {
   // console.log("in post event ", this.data);
  }
  succesfullRes: string = "";

  alertevent(){
    const dialogRef = this.dialog.open(AlerteventComponent, {
      width: '540px',
      data: {
        name : name
      },
      panelClass: 'custom_dilog'
    });
  }

  yourevent(){
    const dialogRef = this.dialog.open(YoureventalertComponent, {
      width: '420px',
      data: {
        response : this.succesfullRes
      },
      panelClass: 'custom_dilog'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['home']);
      this.utilityService.createEventDetails.next("");
      this.utilityService.venueDetails.next("")
    });
  }
  Proceed(){
    if(this.selection == 0 ) {
      localStorage.setItem('isThisFreeEvent', 'true');
      this.utilityService.startLoader();
      this.dialogRef.close();
      this.dialog.open(AlerteventComponent, {
        width: '520px',
        data: {
          formData: this.data.formData
        },
        panelClass: 'custom_dilog',
      });
      // if(this.data.create){
      //   this.eventService.postEvent(this.data.formData).then((response : any) => {
      //     if (response.success) {
      //       this.succesfullRes = response;
      //       this.utilityService.startLoader(); 
      //       this.router.navigate(['/home'])
      //       this.yourevent(); 
      //     }
      // }, (error) => {
      // this.utilityService.routingAccordingToError;
      // console.log(error);
      // this.utilityService.stopLoader();
      // })}
    }
      if(this.selection == 1 ){
        localStorage.setItem('isThisFreeEvent', 'false');
        // this.router.navigate(['/event/your-event'])
        this.dialogRef.close();
        this.dialog.open(AlerteventComponent, {
          width: '520px',
          data: {
            formData: this.data.formData
          },
          panelClass: 'custom_dilog',
        });
      }  
    else{
      // this.alertevent();
      this.onNoClick();
      this.utilityService.stopLoader();
    }
  }
  onNoClick(): void {
    
    this.dialogRef.close();
  }
}
