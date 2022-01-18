import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { HomeService } from '../../home/home.service';
import { UserService } from '../user.service';
import * as moment from 'moment';

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
  selector: 'app-booked-events',
  templateUrl: './booked-events.component.html',
  styleUrls: ['./booked-events.component.scss']
})
export class BookedEventsComponent implements OnInit {
  selectedEventType: any = 1;
  STRINGS: any = localString;
  attendedBookedEvents: any = [];
  upcomingBookedEvents: any = [];
  isUpcoming: any = false;
  dataNotFound: any = false;
  maxArrayUpcomingEvents: any = 4;
  currentDate = new Date
  daysToGo: any;
  
  constructor(private sharedService: SharedService, private userService: UserService, private utilityService: UtilityService,  private router: Router,) {
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.bookedEvent.bookedEventPageHeading,
      isBack: true,
      headerSize: this.STRINGS.headerSize.small,
    });

  }

  ngOnInit(): void {
    this.userBookedEvents(); 
  }

  userBookedEvents(): any {
    this.utilityService.startLoader();
    this.userService.getBookedEvent().then((events: any) => {
      this.attendedBookedEvents = events.data.attendentEvent;  
      this.attendedBookedEvents.forEach((event: any) => {
        event.start = event.start.replace('Z', '');
        event.end = event.end.replace('Z', '');
      });

      this.upcomingBookedEvents = events.data.upcomingEvent;
      for (let i = 0; i < this.upcomingBookedEvents.length; i++) {
        this.upcomingBookedEvents[i].start = this.upcomingBookedEvents[i].start.replace('Z', '');
        let date = new Date(this.upcomingBookedEvents[i].start);
        let currentDate = new Date();
        let days = Math.floor((date.getTime() - currentDate.getTime() ) / 1000 / 60 / 60 / 24);
        this.upcomingBookedEvents[i].daysToGo = days + 1
      }
      if (!this.upcomingBookedEvents.length) {
        this.dataNotFound = true;
      }
      this.utilityService.stopLoader();
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      this.utilityService.routingAccordingToError(error);
    });
  }
  attendedEvent(): any {
    this.dataNotFound = false;
    this.isUpcoming = true;
    this.selectedEventType = 2;
    if (!this.attendedBookedEvents.length) {
      this.dataNotFound = true;
    }
  }
  upcomingEvent(): any {
    this.isUpcoming = false;
    this.selectedEventType = 1;
    if (!this.upcomingBookedEvents.length) {
      this.dataNotFound = true;
    }
  }
  redirect(id : any){
 this.router.navigate(['event/detail/' +id]);
  }
  todayDateComparision(endDates:any){
  let dateCompare =  moment(endDates).isBefore(this.currentDate) 
  if(dateCompare){
      return 'expire '
  }else{
    return 'ongoing'
  }
  }
}

