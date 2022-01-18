import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarOptions, GoogleCalendar, ICalendar, OutlookCalendar, YahooCalendar } from 'datebook';
export class EventDetail {}
import * as _moment from 'moment';
@Component({
  selector: 'app-add-calendar-event',
  templateUrl: './add-calendar-event.component.html',
  styleUrls: ['./add-calendar-event.component.scss']
})

export class AddCalendarEventComponent implements OnInit, OnDestroy {
  config!: CalendarOptions;
  eventName = '';
  CurrentDate = new Date();
  constructor() { }

  ngOnInit(): void {
    const eventJson = localStorage.getItem('evendetail');
    const eventdDetail = eventJson !== null ? JSON.parse(eventJson) : new  EventDetail();
    this.eventName = eventdDetail.name;
    let setStartDate = new Date(eventdDetail.start) ;
    let setEndDateCal = new Date(eventdDetail.end);
    const hour = setStartDate.getHours();
    const min = setStartDate.getMinutes();
    const endhour  = setEndDateCal.getHours();
    const endmin  = setEndDateCal.getMinutes();
    if (new Date(eventdDetail.start.replace('Z', '')) <= this.CurrentDate  ){
      setStartDate  =  new Date();
      setStartDate.setDate(setStartDate.getDate() + 1) ;
      setStartDate.setHours(hour);
      setStartDate.setMinutes(min);
      setEndDateCal = new Date();
      setEndDateCal.setDate(setEndDateCal.getDate() + 1);
      setEndDateCal.setHours(endhour);
      setEndDateCal.setMinutes(endmin);
    }else{
      setEndDateCal  =  new Date(eventdDetail.start.replace('Z', ''));
    }
    this.config = {
    title: eventdDetail.name,
    location: eventdDetail.address[0].venueAddress,
    description: eventdDetail.description,
    start: setStartDate,
    end: setEndDateCal,
    attendees: [
    ],
    // an event that recurs every two weeks:
    recurrence: {
      frequency: '',
      interval: 1
    }
  };
  }
  ngOnDestroy(): void {
    localStorage.removeItem('evendetail');
  }

  downloadIcsFile(): void {
    const icalendar = new ICalendar(this.config);
    icalendar.download();
  }
  googleCalendar(): void {
    const googleCalendar = new GoogleCalendar(this.config);
    window.open(
      googleCalendar.render(),
      '_blank' // <- This is what makes it open in a new window.
    );
  }

  yahooCalendar(): void{
    const yahooCalendar = new YahooCalendar(this.config);
    window.open(
      yahooCalendar.render(),
      '_blank' // <- This is what makes it open in a new window.
    );
  }
  outlookCalendar(): void{
    const outlookCalendar = new OutlookCalendar(this.config);
    window.open(
      outlookCalendar.render(),
      '_blank' // <- This is what makes it open in a new window.
    );
  }

}
