import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { HomeService } from '../../home/home.service';
import { EventService } from '../event.service';

interface EventList {
  id: number;
  eventImages: any;
  start: Date;
  end: Date;
  name: string;
  guestCount: any;
  currentLikeCount: string;
  currentDisLikeCount: string;
  venueEvents: any;
  distance: string;
  description: any;
}

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  STRINGS: any = localString;
  partnerPastEvents: EventList[] = [];
  partnerUpcomingEvents:  EventList[] = [];
  clonepartnerPastEvents = < any > [];
  clonepartnerUpcomingEvents = < any > [];

  partnerDetails: any;
  selectedFavType: any = true;
  latitude: any = '';
  longitude: any = '';
  maxArrayPastEvents: any = 6;
  maxArrayUpcomingEvents: any = 6;
  datanotFound: boolean = false;
  [key: string]: any;
  constructor(
    private router: Router, private sharedService: SharedService,  private route: ActivatedRoute, private utilityService: UtilityService, private homeService: HomeService, private eventService: EventService
  ) {

    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.eventInfo.eventInfoPageHeading,
      isBack: true,
      headerSize: this.STRINGS.headerSize.small,
      isActive: this.STRINGS.header.event
    });
  }
  ngOnInit(): void {
    if (localStorage.getItem('userDetails')){
      this.superUser =  JSON.parse(localStorage.getItem('userDetails') || '');
      try {
        let roles = JSON.parse(this.superUser.roles || '');
        if(roles!= null){
          roles.forEach((element:any) => {
            if(element == 'event_management'){
              this.rolesManageUser = element;
             // console.log( this.rolesManageUser, ' this.rolesManageUser')
            }
        });
        }
      } catch (error) {
        console.log(error)
      }
    }
    this.fetchPartnerEvents()
  }

  applyUpcomingFilter(e: any) {
    this.partnerUpcomingEvents = this.clonepartnerUpcomingEvents;
    var filterResult = this.partnerUpcomingEvents.filter((item: any) =>
      Object.keys(item).some(k => item[k] != null &&
        item[k].toString().toLowerCase()
        .includes(e.target.value))
    );
    this.partnerUpcomingEvents = filterResult;
    if (this.partnerUpcomingEvents.length == 0) {
      this.datanotFound = true;
    } else {
      this.datanotFound = false;
     
    }
  }
  applyPastFilter(e: any) {
    this.partnerPastEvents = this.clonepartnerPastEvents;
    var filterResult = this.partnerPastEvents.filter((item: any) =>
      Object.keys(item).some(k => item[k] != null &&
        item[k].toString().toLowerCase()
        .includes(e.target.value))
    );
    this.partnerPastEvents = filterResult;
    if (this.partnerPastEvents.length == 0) {
 
      this.datanotFound = true;
    } else {
      this.datanotFound = false;
     
    }
  }


  applyinputFilter(e: any) {
    this.partnerUpcomingEvents = this.clonepartnerUpcomingEvents;
    this.partnerPastEvents = this.clonepartnerPastEvents;
    var filterResult = this.partnerUpcomingEvents.filter((item: any) =>
      Object.keys(item).some(k => item[k] != null &&
        item[k].toString().toLowerCase()
        .includes(e.target.value))
    );
    var filterResult = this.partnerPastEvents.filter((item: any) =>
      Object.keys(item).some(k => item[k] != null &&
        item[k].toString().toLowerCase()
        .includes(e.target.value))
    );
   // console.log(filterResult)
    this.partnerPastEvents = filterResult;
    this.partnerUpcomingEvents = filterResult;
        if(this.partnerPastEvents){
           // console.log("partnerPastEvents")
        }
        if(this.partnerUpcomingEvents){
         // console.log("partnerUpcomingEvents")
        }
  }


  pastEvent(): any {
    this.selectedFavType = false;
    this.maxArrayPastEvents = 6;
    this.maxArrayUpcomingEvents = 6;
  }
  upcomingEvent(): any {
    this.selectedFavType = true;
    this.maxArrayPastEvents = 6;
    this.maxArrayUpcomingEvents = 6;
  }
  
  viewAll(type: any, arrayName: any): any {
    this[type] = this[arrayName].length;
  }

  navCreateEvent(){
   
    this.router.navigate(['event/create-event']);
  }
  navEventDetails(id:any){
    this.router.navigate(['event/update-event/' + id]);
  }
 
  navEditEvent(id:any){
    this.router.navigate(['event/detail/' + id]);
  }
 
  fetchPartnerEvents(): any {
    this.utilityService.startLoader();
    this.homeService
      .getAllPartnerEvents({ lat: this.latitude, lng: this.longitude })
      .then((response: any) => {
      //  console.log(response)
        if (response.success) {
          this.partnerPastEvents = response.data.pastEvent;
          this.partnerUpcomingEvents = response.data.upcomingEvent;
          this.clonepartnerPastEvents = [...this.partnerPastEvents]
          this.clonepartnerUpcomingEvents = [...this.partnerUpcomingEvents]
          this.utilityService.stopLoader();
        }
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }

  redirect(id : any){
    this.router.navigate(['event/view-event/' +id]);
     }
  
}
