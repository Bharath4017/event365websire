import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { YoureventalertComponent } from 'src/app/dialog/your-event-alert/youreventalert.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Router } from '@angular/router';
import { localString } from 'src/app/shared/utils/strings';
import { PaymentService } from '../../payment/payment.service';
declare let Stripe: any;
import { loadStripe } from '@stripe/stripe-js';
import { EventService } from '../event.service';
import * as moment from 'moment';
import { SuccessDialogComponent } from 'src/app/dialog/success-dialog/success-dialog.component';
@Component({
  selector: 'app-yourevent',
  templateUrl: './yourevent.component.html',
  styleUrls: ['./yourevent.component.scss']
})
export class YoureventComponent implements OnInit {
  STRINGS: any = localString;
  location = '../../../assets/img/Pin.svg';
  createEventDetails: any;
  eventName: any;
  sessionId: any;
  quantity = 2;
  stripePromise = loadStripe('pk_live_SA1hCRyhG9jwKOv5otXSEylr00ZREyZFGr');
  amount: any = 0;
  constructor(
    private sharedService: SharedService,
    private utilityService: UtilityService,
    private router: Router,
    public dialog: MatDialog,
    private payment: PaymentService,
    private eventService: EventService,
  ) {
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.header.yourEvent,
      headerSize: this.STRINGS.headerSize.small,
      isBack: true,
    });
  }

  ngOnInit(): void {
    this.utilityService.createEventDetails.subscribe(res => {
      this.createEventDetails = res;
      if (res) {
        this.eventName = res.name;
      }
      else {
        this.router.navigate(['/event/create-event']);
      }
      // console.log(res);
      this.fetchPriceEvent();
    });
  }
  paymentMethod(): void {
   // this.router.navigate(['/payment/payment-method']);
   this.postEvent();
  }
  fetchPriceEvent(): void {
    let lastLogin = '';
    if (localStorage.getItem('lastLoggedin')) {
      lastLogin = JSON.parse(localStorage.getItem('lastLoggedin') || '');
    }
    const body = {
      lastLoginTime: lastLogin
    };
    this.utilityService.startLoader();
    this.eventService.postEventPrice(body)
      .then((response: any) => {
        this.amount = response.data.amount;
        this.utilityService.eventAmount.next({
          eventAmount: this.amount
        });
        this.utilityService.stopLoader();
      }).catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  postEvent(): void {
    this.utilityService.startLoader();
    let body: any;
    const startDate = moment(this.createEventDetails.start).format('YYYY-MM-DD');
    const startTime = moment(this.createEventDetails.startTime, 'HH:mm:ss').format('hh:mm a');
    const endDate = moment(this.createEventDetails.end).format('YYYY-MM-DD');
    const endTime = moment(this.createEventDetails.endTime, 'HH:mm:ss').format('hh:mm a');
    const contactHostData = JSON.parse(sessionStorage.getItem('contactHostData') || '');
    // console.log('contactHostData', contactHostData)
    body = {
      eventType: this.createEventDetails.eventType,
      categoryId: this.createEventDetails.categoryId,
      subCategoryId: JSON.stringify(this.createEventDetails.subCategoryId),
      name: this.createEventDetails.name,
      eventOccurrenceType: this.createEventDetails.eventOccurrenceTypeName,
      occurredOn: JSON.stringify(this.createEventDetails.occurredOn),
      start: startDate + ' ' + startTime,
      end: endDate + ' ' + endTime,
      venueId: this.createEventDetails.venueDetails.id,
      venueName: this.createEventDetails.venueDetails.venueName,
      venueAddress: this.createEventDetails.venueDetails.venueAddress,
      subVenueEvent: JSON.stringify(this.createEventDetails.subVenueEvent),
      // countryCode: '+91',
      city: 'Pune',
      venueLatitude: this.createEventDetails.venueDetails.latitude,
      venueLongitude: this.createEventDetails.venueDetails.longitude,
      paidType: 'paid',
      isEventPaid: '1',
      sellingStart: moment(this.createEventDetails.start).format('YYYY-MM-DD hh:mm a'),
      sellingEnd: moment(this.createEventDetails.end).format('YYYY-MM-DD hh:mm a'),
      description: this.createEventDetails.description,
      description2: this.createEventDetails.description2,
      hostMobile: contactHostData?.hostMobile ? contactHostData?.hostMobile : '',
      countryCode: contactHostData?.countryCode ? contactHostData?.countryCode : '',
      hostAddress: contactHostData?.hostAddress ? contactHostData?.hostAddress : '',
      websiteUrl: contactHostData?.websiteUrl ? contactHostData?.websiteUrl : '',
      otherWebsiteUrl: contactHostData?.otherWebsiteUrl ? contactHostData?.otherWebsiteUrl : '',
      amount: this.amount
    };


    // if (this.freeEvent.length > 0) {
    //   body['free'] = JSON.stringify(this.freeEvent);
    // }
    // if (this.paidEvent.length > 0) {
    //   body['regularPaid'] = JSON.stringify(this.paidEvent);
    // }
    // if (this.rsvpEvent.length > 0) {
    //   body['regularSeatings'] = JSON.stringify(this.rsvpEvent);
    // }
    // if (this.tableSeating.length > 0) {
    //   body['tableSeatings'] = JSON.stringify(this.tableSeating);
    // }
    // if (this.vipEvent.length > 0) {
    //   body['vipSeatings'] = JSON.stringify(this.vipEvent);
    // }
    const formData: any = new FormData();
    // tslint:disable-next-line: forin
    for (const key in body) {
      formData.append(key, body[key]);
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.createEventDetails.selectedImages.length; i++) {
      formData.append('images', this.createEventDetails.selectedImages[i]);
    }
    // console.log(body);
    // console.log(formData);
    this.eventService.reviewEventPostApi(formData).then((response: any) => {
      if (response.success){
        this.utilityService.eventId.next({
          eventId: response.data.eventId
        });
        if (this.amount === 0) {
          this.utilityService.stopLoader();
          const dialogRef = this.dialog.open(YoureventalertComponent, {
            width: '420px',
            data: {
              response
            },
            panelClass: 'custom_dilog'
          });
          dialogRef.afterClosed().subscribe(() => {
            localStorage.removeItem('eventData');
            // localStorage.removeItem('reviewDetails');
            this.utilityService.createEventDetails.next('');
            this.utilityService.venueDetails.next('');
            this.utilityService.detailedEvent.next('');
            this.router.navigate(['/home']);
            this.utilityService.stopLoader();
          });
        }else{
          const dialogRef = this.dialog.open(SuccessDialogComponent, {
            width: '460px',
            data: {
              message: 'Event uploaded successfully',
            },
            panelClass: 'custom_dilog',
          });
          this.utilityService.stopLoader();
          this.router.navigate(['/payment/payment-method']);
        }
      }
      this.utilityService.stopLoader();
    })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });

    sessionStorage.removeItem('contactHostData');
  }
}
