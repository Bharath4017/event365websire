import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EventService } from 'src/app/pages/event/event.service';
import { ProfileService } from 'src/app/pages/profile/profile.service';
import { VenueService } from 'src/app/pages/venue/venue.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { localString } from 'src/app/shared/utils/strings';
import { AlertdialogComponent } from '../alertdialog/alertdialog.component';
import { SubVenueAvaliableAlertComponent } from '../sub-venue-avaliable-alert/sub-venue-avaliable-alert.component';
import { YoureventalertComponent } from '../your-event-alert/youreventalert.component';

@Component({
  selector: 'app-twenty-min-pop-up',
  templateUrl: './twenty-min-pop-up.component.html',
  styleUrls: ['./twenty-min-pop-up.component.scss']
})
export class TwentyMinPopUpComponent implements OnInit {
  subVenues: any = [];
  STRINGS: any = localString;
  deleteEventID: any;
  selection !: string;
  deleteEvent?: any;
  update!: any;
  succesfullRes: any;
  formData: any;
  deleteUserID:any;
  deleteUser?:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TwentyMinPopUpComponent,
    public dialogRef: MatDialogRef<TwentyMinPopUpComponent>,
    public venueService: VenueService, public router: Router,
    public dialog: MatDialog,
    private eventService: EventService,
    private utilityService: UtilityService,
    private profileService: ProfileService
    ) { }

  ngOnInit(): void {
    this.update = this.data?.update;
    this.deleteEventID = this.data?.deleteEvent;
    this.deleteUserID = this.data?.deleteUser;
  }
  closePopup(): void {
    this.dialogRef.close();
    this.utilityService.stopLoader();
  }
  openSubVenue(): void {
    this.dialogRef.close();
    this.venueService.currentvenueID.subscribe(venuelist => this.subVenues = venuelist);

    if (this.subVenues.length === undefined) {
      this.router.navigate([localStorage.getItem('createEventRoute')]);
      localStorage.removeItem('createEventRoute');
    } else {
      this.dialog.open(SubVenueAvaliableAlertComponent, {
        width: '420px'
      });
    }
  }

  deleteEventProceed(): void{
    this.utilityService.startLoader();
    this.dialogRef.close();
    this.eventService.deleteOrganiserEvent(this.deleteEventID).then((response) => {
      this.succesfullRes = response;
      this.router.navigate(['home']);
      this.yourevent();
      this.utilityService.stopLoader();
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      if (error){
        if (error.error.message.includes('delete') || error.error.message.includes('$$') || error.error.message.includes('(') ){
          this.dialogopen('something went wrong please try');
        }
        else{
          this.dialogopen(error.error.message);
        }
      }
      this.utilityService.routingAccordingToError(error);
    });
  }

  deleteUserProceed(): void{
    this.utilityService.startLoader();
    this.dialogRef.close();
    this.profileService.deleteOrganiserUser(this.deleteUserID).then((response:any) => {
      this.succesfullRes = response;
      this.redirectTo('/profile/user-list')
      this.utilityService.stopLoader();
    this.youreventDelete();
    });
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }
  updateEvent(): void{
    this.utilityService.startLoader();
    this.dialogRef.close();
    this.eventService.editOrganizerEvent(this.data.formData).then((response: any) => {
    if (response.success) {
    this.succesfullRes = response;
    this.yourevent();
    }
    }, (error) => {
    this.utilityService.routingAccordingToError(error);
    console.log(error);
    this.utilityService.stopLoader();
    });
  }

  yourevent(): void {
    const dialogRef = this.dialog.open(YoureventalertComponent, {
      width: '420px',
      data: {
        update: 'update',
        response: this.succesfullRes
      },
      panelClass: 'custom_dilog'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['home']);
      this.utilityService.createEventDetails.next('');
      this.utilityService.venueDetails.next('');
    });
  }
  youreventDelete(): void {
    const dialogRef = this.dialog.open(YoureventalertComponent, {
      width: '420px',
      data: {
        update: 'update',
        response: this.succesfullRes
      },
      panelClass: 'custom_dilog'
    });
  }
  dialogopen(name: any): void {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: '460px',
      data: {
        name,
      },
      panelClass: 'custom_dilog',
    });
  }
}
