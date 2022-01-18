import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SubVenueAvaliableAlertComponent } from 'src/app/dialog/sub-venue-avaliable-alert/sub-venue-avaliable-alert.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { VenueService } from '../venue.service';

@Component({
  selector: 'app-venue-list',
  templateUrl: './venue-list.component.html',
  styleUrls: ['./venue-list.component.scss']
})
export class VenueListComponent implements OnInit {
  venueList: any = {};
  venueOwner = false;
  STRINGS: any = localString;
  previouslyUsed: any = false;
  myVenues: any;
  constructor(private venueService: VenueService, private sharedService: SharedService,
              private router: Router, public utilityService: UtilityService,
              public dialog: MatDialog) {
      this.sharedService.headerLayout.emit({
        headerName:  this.STRINGS.header.selectVenue,
        headerSize: this.STRINGS.headerSize.medium,
        isBack: true
      });
    }

  ngOnInit(): void {
    this.getVenues();
    const userType = localStorage.getItem('userType')?.toString();
    if (!userType?.includes('customer')  && !userType?.includes('guestUser')) {
      this.venueOwner = true;
    }
  }
  getVenues(): void {
    this.utilityService.startLoader();
    this.venueService.getuserVenueList().then((response: any) => {
      this.venueList = response.data;
      if (this.venueList === undefined){
        this.previouslyUsed = false;
      }else{
        if (this.venueList.previouslyUsed.length === 0){
          this.previouslyUsed = false;
        }else{
          this.previouslyUsed = true;
        }
      }
      this.utilityService.stopLoader();
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      console.log(error);
      this.previouslyUsed = false;
      this.utilityService.routingAccordingToError(error);
    });
  }
  nevigateSearch(): void {
    this.router.navigate(['venue/list/search']);
  }

  id: any;
  venueDetail: any = {};
  locid: any;
  subVenueList: any;
  subVenuePopup(venueId:any) {
    
    if (this.subVenueList.length !== 0) {
        this.venueService.shareComponentSubvenueList(venueId);
        this.setVenueLocalStorage();
        this.dialog.open(SubVenueAvaliableAlertComponent, {
          width: '460px'
        });
      }
      else {
        this.venueService.shareComponentSubvenueList(0);
        this.setVenueLocalStorage();
        this.router.navigate([localStorage.getItem('createEventRoute')]);
        localStorage.removeItem('createEventRoute');
     }
  }
  getVenueDetail(id:any): void {
    this.utilityService.startLoader();
    // let id = this.id;
    // if (this.id == null){
    //   id = this.locid;
    // }
    
    this.venueService.getVenuebyid(id)
      .then((response: any) => {
        this.venueDetail = response.data;
        this.subVenueList = this.venueDetail.subVenues;
        this.sharedService.headerLayout.emit({
          headerName: this.venueDetail.venueName,
          headerSize: this.STRINGS.headerSize.medium,
          isBack: true
        });
        this.utilityService.stopLoader();
        this.subVenuePopup(id)
      }).catch((error: any) => {
        this.utilityService.stopLoader();
        console.log(error);
        this.utilityService.routingAccordingToError(error);
      });
    if (localStorage.getItem('eventEndDateTime') !== null && localStorage.getItem('eventStartDateTime') !== null){
      const body = {
        eventEndDateTime: localStorage.getItem('eventEndDateTime')?.toString(),
        eventStartDateTime: localStorage.getItem('eventStartDateTime')?.toString(),
        };
      this.venueService.getBookedVenuebyid(id, body) .then((response: any) => {
          console.log(response)
          // this.isBooked = response.data.isBooked;
          this.utilityService.stopLoader();
        }).catch((error: any) => {
          this.utilityService.stopLoader();
          console.log(error);
          this.utilityService.routingAccordingToError(error);
        });
    }
  }
  setVenueLocalStorage(): void{
    this.utilityService.venueDetails.next(
      {venueDetail : this.venueDetail}
    );
    this.utilityService.venueSubmitEvent.next(
      {
        venueId: this.id,
        subVenues: []
      }
    )
  }

}
