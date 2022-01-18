import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { localString } from 'src/app/shared/utils/strings';
import { EventService } from '../event.service';
import { SwiperOptions } from 'swiper';
import * as moment from 'moment';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { YoureventalertComponent } from 'src/app/dialog/your-event-alert/youreventalert.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
declare let $: any;
@Component({
  selector: 'app-review-event',
  templateUrl: './review-event.component.html',
  styleUrls: ['./review-event.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReviewEventComponent implements OnInit, OnDestroy {
  STRINGS: any = localString;
  reviewEventDetails: any = '';
  imagePreview: any = '';
  freeEvent: any = '';
  paidEvent: any = '';
  rsvpEvent: any = '';
  tableSeating: any = '';
  vipEvent: any = '';
  venueDetails: any = '';
  readBtn = false;
  descClicked = false;
  tagListColors: any = [];
  userType = false;
  colorsList: any = ['linear-gradient(30deg, #4fc1fc 13%, #95aefb 87%)', 'linear-gradient(30deg, #fa9680 17%, #f36d9c 83%)', 'linear-gradient(30deg, #d857dd 17%, #9255cf 83%)', 'linear-gradient(47deg, #dda357 30%, #ea8b5a 70%)', 'linear-gradient(35deg, #5b84e4 22%, #7155cf 78%)'];
  public configreview: SwiperOptions = {
    a11y: { enabled: true },
    direction: 'horizontal',
    spaceBetween: 20,
    keyboard: true,
    mousewheel: false,
    scrollbar: false,
    navigation: true,
    pagination: false,
    breakpoints: {
      300: {
        slidesPerView: 1,
      },
      600: {
        slidesPerView: 2,
      },
      900: {
        slidesPerView: 3.5,
      },
      1300: {
        slidesPerView: 3.5,
      },
      1600: {
        slidesPerView: 4.5,
      }
    }
  };
  disabled: any = false;
  url: any = '';
  weekDays: any = [
    { name: 'Monday', value: 1 },
    { name: 'Tuesday', value: 2 },
    { name: 'Wednesday', value: 3 },
    { name: 'Thursday', value: 4 },
    { name: 'Friday', value: 5 },
    { name: 'Saturday', value: 6 },
    { name: 'Sunday', value: 7 },
  ]
  occurredOnName: any = [];
  eventSubscribe: Subscription;

  public TalentHorizontal: SwiperOptions = {
    a11y: { enabled: true },
    direction: 'horizontal',
    spaceBetween: 30,
    keyboard: true,
    slidesPerView: 6,
    mousewheel: false,
    scrollbar: false,
    pagination: false,
    loop: false,
    navigation: {
      nextEl: '#button-next-swiper',
      prevEl: '#button-prev-swiper ',
    },
    breakpoints: {
      300: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      600: {
        slidesPerView: 3,
      },
      900: {
        slidesPerView: 4,
      },
      1300: {
        slidesPerView: 6,
      },
      1600: {
        slidesPerView: 6,
      }
    }
  }; 
  constructor(
    private eventservice: EventService,
    private utilityService: UtilityService,
    private sharedService: SharedService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.eventSubscribe = this.utilityService.detailedEvent.subscribe(res => {
      if (res.body) {
        this.reviewEventDetails = res.body;
        console.log('reviewEventDetails', this.reviewEventDetails);
        
        // localStorage.setItem('reviewDetails', JSON.stringify(this.reviewEventDetails));
        this.imagePreview = this.reviewEventDetails?.createEvent.images[0].eventImage;
        if (this.reviewEventDetails?.createEvent.eventOccurrenceType === 'weekly' || this.reviewEventDetails?.createEvent.eventOccurrenceType === 'daily') {
            for (const w of this.weekDays) {
              if (this.reviewEventDetails?.createEvent.occurredOn.includes(w.value)) {
                this.occurredOnName.push(w.name);
              }
            }
        }else {
          this.occurredOnName = this.reviewEventDetails?.createEvent.occurredOn.sort((a: any, b: any) => {return a - b});;
        }
     //   console.log(this.imagePreview);
        this.filterTicket();
        this.generateRandomColors();
      }
    });
    this.sharedService.headerLayout.emit({
      headerName: '',
      isBack: true,
    });
  }
  ngOnInit(): void {
         // if (localStorage.getItem('reviewDetails')) {
    //   this.reviewEventDetails = JSON.parse(localStorage.getItem('reviewDetails') || '');
    //   this.imagePreview = this.reviewEventDetails?.createEvent.images[0].url;
    //   $('.ticket-preview-img').css('background-image', 'url(' + this.imagePreview + ')');
    //   this.filterTicket();
    //   this.generateRandomColors();
    // }
   
    if (this.reviewEventDetails === '') {
      this.router.navigate(['/event/create-event']);
    }
    setTimeout(() => {
      $('#generated-ticket').css('background-image', `url(${this.imagePreview})`);
    }, 1000);
  }
  filterTicket(): any {
    const freeEventdetails = this.reviewEventDetails?.ticketDetails.filter(
      (data: any) => data.ticketType === 'Free',
    );
    freeEventdetails.forEach((element: any[]) => {
      this.freeEvent = freeEventdetails.map((data: any) => ({
        description: data.ticketDescription,
        ticketName: data.ticketName,
        totalQuantity: data.ticketQuantity,
        discount: data.discount,
        sellingStartDate: moment(data.ticketStartDate).format('YYYY-MM-DD'),
        sellingStartTime: moment(data.ticketStartTime).format('HH:mm:ss'),
        sellingEndDate: moment(data.ticketEndDate).format('YYYY-MM-DD'),
        sellingEndTime: moment(data.ticketEndTime).format('HH:mm:ss')
      }));
    });
    const paidEventdetails = this.reviewEventDetails?.ticketDetails.filter((data: any) => {
      return data.ticketType === 'Paid';
    });
    paidEventdetails.forEach((element: any[]) => {
      this.paidEvent = paidEventdetails.map((data: any) => ({
        description: data.ticketDescription,
        ticketName: data.ticketName,
        totalQuantity: data.ticketQuantity,
        discount: data.discount,
        pricePerTicket: data.ticketPrice,
        cancellationChargeInPer: data.cancellationCharge,
        sellingStartDate: moment(data.ticketStartDate).format('YYYY-MM-DD'),
        sellingStartTime: moment(data.ticketStartTime).format('HH:mm:ss'),
        sellingEndDate: moment(data.ticketEndDate).format('YYYY-MM-DD'),
        sellingEndTime: moment(data.ticketEndTime).format('HH:mm:ss')
      }));
    });
    const rsvpEventdetails = this.reviewEventDetails?.ticketDetails.filter((data: any) => {
      return data.ticketType === 'RSVP';
    });
    rsvpEventdetails.forEach((element: any[]) => {
      this.rsvpEvent = rsvpEventdetails.map((data: any) => ({
        description: data.ticketDescription,
        ticketName: data.ticketName,
        totalQuantity: data.ticketQuantity
      }));
    });
    const vipEventdetails = this.reviewEventDetails?.ticketDetails.filter((data: any) => {
      return data.ticketType === 'VIP';
    });
    vipEventdetails.forEach((element: any[]) => {
      this.vipEvent = vipEventdetails.map((data: any) => ({
        description: data.ticketDescription,
        ticketName: data.ticketName,
        totalQuantity: data.ticketQuantity,
        discount: data.discount,
        pricePerTicket: data.ticketPrice,
        cancellationChargeInPer: data.cancellationCharge,
        sellingStartDate: moment(data.ticketStartDate).format('YYYY-MM-DD'),
        sellingStartTime: moment(data.ticketStartTime).format('HH:mm:ss'),
        sellingEndDate: moment(data.ticketEndDate).format('YYYY-MM-DD'),
        sellingEndTime: moment(data.ticketEndTime).format('HH:mm:ss')
      }));
    });
    const tableseatingdetails = this.reviewEventDetails?.ticketDetails.filter((data: any) => {
      return data.ticketType === 'Tables & Seatings';
    });
    tableseatingdetails.forEach((element: any[]) => {
      this.tableSeating = tableseatingdetails.map((data: any) => ({
        cancellationChargeInPer: data.cancellationCharge,
        description: data.ticketDescription,
        ticketName: data.categoryName,
        pricePerTicket: data.ticketPrice,
        discount: data.discount,
        personPerTable: data.persons,
        noOfTables: data.tables,
        sellingStartDate: moment(data.ticketStartDate).format('YYYY-MM-DD'),
        sellingStartTime: moment(data.ticketStartTime).format('HH:mm:ss'),
        sellingEndDate: moment(data.ticketEndDate).format('YYYY-MM-DD'),
        sellingEndTime: moment(data.ticketEndTime).format('HH:mm:ss')
      }));
    });
  }
  generateRandomColors(): any {
    this.reviewEventDetails.createEvent.subCategoryName.forEach((element: any, index: any) => {
      const random = Math.floor(Math.random() * this.colorsList.length);
      this.tagListColors.push(this.colorsList[random]);
    });
  //  console.log('this.tagListColors', this.tagListColors);
  }
  showDesc(): void {
    this.descClicked = !this.descClicked;
  }
  thumbnailImageOnClick(src: any): any {
    this.imagePreview = src;
    $('#generated-ticket').css('background-image', `url(${this.imagePreview})`);
  }
  submitEvent(): any {
    this.utilityService.startLoader();
    let startDate = moment(this.reviewEventDetails.createEvent.start).format('YYYY-MM-DD')
    let startTime = moment(this.reviewEventDetails.createEvent.startTime, 'HH:mm:ss').format('hh:mm a');
    let endDate = moment(this.reviewEventDetails.createEvent.end).format('YYYY-MM-DD')
    let endTime = moment(this.reviewEventDetails.createEvent.endTime, 'HH:mm:ss').format('hh:mm a');
    let body: any;
    body = {
      eventType: this.reviewEventDetails.createEvent.eventType,
      categoryId: this.reviewEventDetails.createEvent.categoryId,
      subCategoryId: JSON.stringify(this.reviewEventDetails.createEvent.subCategoryId),
      name: this.reviewEventDetails.createEvent.name,
      eventUrl: this.reviewEventDetails.createEvent.eventUrl,
      eventOccurrenceType: this.reviewEventDetails.createEvent.eventOccurrenceType,
      occurredOn: JSON.stringify(this.reviewEventDetails.createEvent.occurredOn),
      start: startDate + ' ' + startTime,
      end: endDate + ' ' + endTime,
      venueId: this.reviewEventDetails.createEvent.venueDetails.id,
      venueName: this.reviewEventDetails.createEvent.venueDetails.venueName,
      venueAddress: this.reviewEventDetails.createEvent.venueDetails.venueAddress,
      countryCode: '+91',
      city: 'Pune',
      venueLatitude: this.reviewEventDetails.createEvent.venueDetails.latitude,
      venueLongitude: this.reviewEventDetails.createEvent.venueDetails.longitude,
      paidType: 'free',
      isEventPaid: '0',
      sellingStart: moment(this.reviewEventDetails.createEvent.startTime).format('YYYY-MM-DD HH:mm:ss'),
      sellingEnd: moment(this.reviewEventDetails.createEvent.endTime).format('YYYY-MM-DD HH:mm:ss'),
      description: this.reviewEventDetails.createEvent.description,
      description2: this.reviewEventDetails.createEvent.description2,
      subVenueEvent: JSON.stringify(this.reviewEventDetails.createEvent.subVenueEvent)
    };
    if (this.freeEvent.length > 0) {
      body['free'] = JSON.stringify(this.freeEvent);
    }
    if (this.paidEvent.length > 0) {
      body['regularPaid'] = JSON.stringify(this.paidEvent);
    }
    if (this.rsvpEvent.length > 0) {
      body['regularSeatings'] = JSON.stringify(this.rsvpEvent);
    }
    if (this.tableSeating.length > 0) {
      body['tableSeatings'] = JSON.stringify(this.tableSeating);
    }
    if (this.vipEvent.length > 0) {
      body['vipSeatings'] = JSON.stringify(this.vipEvent);
    }
    const formData: any = new FormData();
    // tslint:disable-next-line: forin
    for (const key in body) {
      formData.append(key, body[key]);
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.reviewEventDetails.createEvent.selectedImages.length; i++) {
      formData.append('images', this.reviewEventDetails.createEvent.selectedImages[i]);
    }
    for (let i = 0; i < this.reviewEventDetails.createEvent.selectedtelentImages.length; i++) {
      formData.append('telentImages', this.reviewEventDetails.createEvent.selectedtelentImages[i]);
    }
    for (let i = 0; i < this.reviewEventDetails.createEvent.selectedSponserImages.length; i++) {
      formData.append('sponserImages', this.reviewEventDetails.createEvent.selectedSponserImages[i]);
    }
    // console.log(body);
    // console.log(formData);
    this.eventservice.reviewEventPostApi(formData).then((response: any) => {
     // console.log(response);
      const dialogRef = this.dialog.open(YoureventalertComponent, {
        width: '420px',
        data: {
          response
        },
        panelClass: 'custom_dilog'
      });
      dialogRef.afterClosed().subscribe(() => {
        localStorage.removeItem('eventData');
        localStorage.removeItem('matClockStartDateTime');
        localStorage.removeItem('matClockEndDateTime');
        // localStorage.removeItem('reviewDetails');
        this.utilityService.createEventDetails.next('');
        this.utilityService.venueDetails.next('');
        this.utilityService.detailedEvent.next('');
        this.utilityService.stopLoader();
        this.router.navigate(['/home']);
      });
    })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  ngOnDestroy(): void {
    this.eventSubscribe.unsubscribe();
  }
}