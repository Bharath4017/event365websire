import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { localString } from 'src/app/shared/utils/strings';
import { EventService } from '../event.service';
import { LoginDialogComponent } from 'src/app/dialog/login-dialog/login-dialog.component';
import { SwiperOptions } from 'swiper';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
import { SharedService } from 'src/app/shared/shared.service';
import { ShareDialogComponent } from 'src/app/dialog/share-dialog/share-dialog.component';
import { ViewEncapsulation } from '@angular/core';
import { AddCalendarEventComponent } from 'src/app/dialog/add-calendar-event/add-calendar-event.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../user/user.service';
import * as _moment from 'moment';
import {
  BreakpointObserver,
  BreakpointState
} from '@angular/cdk/layout';
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
  address: any;
  isLike: number;
  guestcount: any;
  ticketBooked: any;
  GuestData: any;
  isFavorite: any;
}
@Component({
  selector: 'app-eventdetail',
  templateUrl: './eventdetail.component.html',
  styleUrls: ['./eventdetail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class EventdetailComponent implements OnInit {
  mobileQuery!: MediaQueryList;

  starRating = 0;
  eventdetail: any = {};
  allUserReviews: any = [];
  realtedEventDeatil: any = [];
  ratingArr: any = [];
  disabledbtn = true;
  CurrentDate = new Date();
  id: any = 0;
  hostname: any;
  hostprofilePic: any;
  lat = 0;
  long = 0;
  googleMapType = 'satellite';
  img = '';
  descClicked = false;
  addInfoClicked = false;
  readBtn = false;
  readBtnAddInfo = false;
  theme: 'light' | 'dark' = 'dark';
  interestedBtn = false;
  contactHostBtn = false;
  user?: any;
  STRINGS: any = localString;
  veneueAdress: any;
  userType = false;
  parentIndex: any = 6;
  isMarkFav = false;
  favoriteICON = false;
  websiteUrl = false;
  ticketWebsiteUrl = false;
  bookingRsvpBtn = false;
  latitude: any;
  longitude: any;
  public config: SwiperOptions = {
    a11y: { enabled: true },
    direction: 'horizontal',
    slidesPerView: 5,
    keyboard: true,
    mousewheel: false,
    scrollbar: false,
    navigation: true,
    pagination: false,
    loop: true,
    breakpoints: {
      300: {
        direction: 'horizontal',
        slidesPerView: 3,
      },
      600: {
        direction: 'horizontal',
        slidesPerView: 4,
      },
      959: {
        direction: 'horizontal',
        slidesPerView: 4,
      },

      960: {
        slidesPerView: 4,
      },
      1600: {
        slidesPerView: 5,
      }
    }
  };

  public configHorizontal: SwiperOptions = {
    a11y: { enabled: true },
    direction: 'horizontal',
    spaceBetween: 20,
    keyboard: true,
    mousewheel: false,
    scrollbar: false,
    navigation: true,
    pagination: false,
    loop: true,
    breakpoints: {
      300: {
        slidesPerView: 1,
      },
      600: {
        slidesPerView: 1.5,
      },
      900: {
        slidesPerView: 2.5,
      },
      1300: {
        slidesPerView: 3.5,
      },
      1600: {
        slidesPerView: 3.5,
      },
      1800: {
        slidesPerView: 4.5,
        spaceBetween: 20,
      }
    }
  };

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




  public configHorizontal2: SwiperOptions = {
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




  public disabled = false;
  venueName: any;
  phonecalls = false;
  email = false ;

  constructor(private eventService: EventService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private utilityService: UtilityService,
              private sharedService: SharedService,
              public breakpointObserver: BreakpointObserver) {



    this.id = this.route.snapshot.paramMap.get('id');
    this.user = localStorage.getItem('userDetails');
    if (localStorage.getItem('userType')?.includes('customer') ||
      localStorage.getItem('userType')?.includes('guestUser') || localStorage.getItem('userType') == null) {
      this.userType = true;
    }

  }




  ngOnInit(): void {
    this.breakpoint();

    this.route.params.subscribe(routeParams => {
      this.getUserEventDetail(routeParams.id, routeParams.eventUrl);
    });
  }

  getUserEventDetail(Eid: any, withCusUrl:any): void {
    this.utilityService.startLoader();
    let id = Eid;
    if (localStorage.getItem('authToken')) {
      if (this.userType) {
        id = 'auth/' + id + '/1';
        this.favoriteICON = true;
      }
      else {
        id = id;
      }
    }
    let eventUrl = withCusUrl?withCusUrl: '';
   // console.log(withCusUrl, "withCusUrl")
    this.eventService.getUserEventdetailbyid(id , eventUrl)
      .then((response: any) => {
        if (response.success) {
          this.eventdetail = response.data;
         // console.log("this.eventdetail", this.eventdetail);
          // code for dynamic event detail page title
          this.breakpointObserver
              .observe(['(min-width: 959px)'])
              .subscribe((state: BreakpointState) => {
                if (state.matches) {
                  this.descClicked = false;
                  this.readBtn = false;
                  this.sharedService.headerLayout.emit({
                    headerSize: this.STRINGS.headerSize.medium,
                    headerName: this.eventdetail.categoryName,
                    isBack: true
                  });
                } else {
                  this.descClicked = true;
                  this.readBtn = true;
                  this.sharedService.headerLayout.emit({
                    headerSize: this.STRINGS.headerSize.small,
                    isBack: true
                  });
                }
              });
          // console.log('this.eventdetail', this.eventdetail);
          this.hostname = this.eventdetail.host.name;
          this.hostprofilePic = this.eventdetail.host.profilePic;
          this.ratingArr = [];
          for (let star = 0; star < this.eventdetail.rating; star++) {

            this.ratingArr.push(star);

          }
          const enddate: Date = new Date(this.eventdetail.end);
          if (enddate >= this.CurrentDate) {
            this.disabledbtn = false;
          }
          else {
            this.disabledbtn = true;
          }
          this.eventdetail.address.every((googleMap: any) => {
            this.veneueAdress = googleMap.venueAddress;
            this.venueName = googleMap.venueName;
            this.lat = Number(googleMap.latitude);
            this.long = Number(googleMap.longitude);
          });
          this.eventdetail.eventImages.every((img: { eventImage: any; }) => {
            this.thumbnailimageOnClick(img.eventImage);
          });
          // this.descriptionLength(this.eventdetail.description);
          this.addInfoLength(this.eventdetail.additional_info);
          this.allUserReviews = this.eventdetail.reviews;
          // condition given by swati isTicketAvailable != null && isTicketAvailable ||
          // isExternalTicketStatus != null && isExternalTicketStatus
          // if (this.eventdetail.otherWebsiteUrl != null) {
          //   this.ticketWebsiteUrl = true;
          // }
          // else {
          //   if (this.eventdetail.is_availability ||
          //     this.eventdetail.isExternalTicketStatus != null
          //     && this.eventdetail.isExternalTicket || this.eventdetail.ticket_info != null) {
          //     this.interestedBtn = true;
          //     this.contactHostBtn = false;
          //   }
          //   else {
          //     this.contactHostBtn = true;
          //     this.interestedBtn = false;
          //   }
          // }
          if (this.eventdetail.is_availability || this.eventdetail.isExternalTicket ) {
              if(this.eventdetail.ticket_info!=null){
                this.interestedBtn = true;
                this.contactHostBtn = false;
                this.bookingRsvpBtn = false;
                this.ticketWebsiteUrl = false;
              }else{
                this.interestedBtn = false;
                this.contactHostBtn = true;
                this.bookingRsvpBtn = false;
                this.ticketWebsiteUrl = false;
              }
            
          }
          else{
            if (this.eventdetail.paidType){
              const paidtype = this.eventdetail.paidType.toLowerCase();
              if (paidtype.includes('paid')){
                //ticket seating
                if (this.eventdetail.otherWebsiteUrl && this.eventdetail.otherWebsiteUrl !== 'null' &&
                this.eventdetail.otherWebsiteUrl !== ''  ){
                this.ticketWebsiteUrl = true;
                this.bookingRsvpBtn = false;
                this.contactHostBtn = false;
                this.interestedBtn = false;
              }
              else{
                this.contactHostBtn = true;
                this.ticketWebsiteUrl = false;
                this.bookingRsvpBtn = false;
                this.interestedBtn = false;
              }
        }
              if (paidtype.includes('free')){
              if (this.eventdetail.otherWebsiteUrl && this.eventdetail.otherWebsiteUrl !== 'null' &&
              this.eventdetail.otherWebsiteUrl !== '' ){
             // continue for Booking / RSVP
               this.bookingRsvpBtn = true;
               this.contactHostBtn = false;
               this.ticketWebsiteUrl = false;
               this.interestedBtn = false;
              }else{
             //  Please contact host for tickets and RSVP's
             this.contactHostBtn = true;
             this.bookingRsvpBtn = false;
             this.ticketWebsiteUrl = false;
             this.interestedBtn = false;
            }
        }
            }else{
              if (this.eventdetail.otherWebsiteUrl && this.eventdetail.otherWebsiteUrl !== 'null' ){
                // continue for Booking / RSVP
                  this.bookingRsvpBtn = true;
                  this.contactHostBtn = false;
                  this.ticketWebsiteUrl = false;
                  this.interestedBtn = false;
                 }else{
                //  Please contact host for tickets and RSVP's
                this.contactHostBtn = true;
                this.bookingRsvpBtn = false;
                this.ticketWebsiteUrl = false;
                this.interestedBtn = false;
               }
            }
          }
          if(this.eventdetail?.host?.contactVia){
            this.eventdetail?.host?.contactVia.forEach((contact: any) => {
             if (contact.contactVia === 'phone_calls'){
               this.phonecalls  = true;
             }
             if (contact.contactVia === 'email'){
              this.email  = true;
            }
            });
          }
          if (this.userType) {
            this.handlePermission()
          }
          this.utilityService.stopLoader();
        }
      }).catch((error: any) => {
        this.utilityService.stopLoader();
        this.router.navigate(['/home']);
        this.utilityService.routingAccordingToError(error);
      });
  }

  relatedEventList(idArray: any): void {
    this.realtedEventDeatil = [];
    const body = {
      page: 1,
      limit: 10,
      latitude: this.latitude,
      longitude: this.longitude,
      miles: 500
    };
    this.eventService.getRelatedEventList(idArray, this.id, body).then((response: any) => {
      if (response.success) {
        this.realtedEventDeatil = response.data;
      }
    }).catch((error: any) => {
      this.dialogopen(error.error.message);
    });
  }
  showDesc(): void {
    this.descClicked = !this.descClicked;
  }
  showAddInfo(): void {
    this.addInfoClicked = !this.addInfoClicked;
  }
  // descriptionLength(des: string): void {
  //   if (des.length >= 120) {
  //     this.readBtn = true;
  //   }
  // }
  addInfoLength(info: string): void {
    if (info.length >= 120) {
      this.readBtnAddInfo = true;
    }
  }
  eventDetailRealted(id: any): void {
    this.router.navigate(['event/detail/' + id]);
    this.getUserEventDetail(id, '');
  }


  openSharePopup(): void {
    localStorage.setItem('evendetail', JSON.stringify(this.eventdetail));
    this.dialog.open(ShareDialogComponent);
  }

  openAddToEventPopup(): void {
    localStorage.setItem('evendetail', JSON.stringify(this.eventdetail));
    this.dialog.open(AddCalendarEventComponent, {
      width: '500px',
    });
  }

  navigateToSection(section: string): void {
    const el: any = document.getElementById(section);
    el.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  }
  nevigateReview(): void {
    const authToken = localStorage.getItem('authToken');
    this.user = localStorage.getItem('userDetails');
    if (this.user == null || authToken == null) {
      const dialogRef = this.dialog.open(LoginDialogComponent, {
        width: '500px',
        height: '600px',
        panelClass: 'custom_dilog',
      });
    }
    else {
      this.router.navigate(['user/add-review-customer/' + this.id]);
    }
  }
  nevigateCustomerReview(): void {
    const authToken = localStorage.getItem('authToken');
    if (this.user == null || authToken == null) {
      const dialogRef = this.dialog.open(LoginDialogComponent, {
        width: '500px',
        height: '600px',
        panelClass: 'custom_dilog',
      });
    }
    else {
      this.router.navigate(['user/customer-review/' + this.id]);
    }
  }
  dialogopen(name: any): void {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: '700px',
      data: {
        name
      }
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  thumbnailimageOnClick(src: string): void {
    this.img = src;
  }

  navigatoBookTicket(): void {
    const authToken = localStorage.getItem('authToken');
    this.user = localStorage.getItem('userDetails');
    if (this.user == null || authToken == null) {
      const dialogRef = this.dialog.open(LoginDialogComponent, {
        width: '500px',
        height: '600px',
        panelClass: 'custom_dilog',
      });
      // dialogRef.afterClosed().subscribe(() => {
      //   window.location.reload()
      // });
    }
    else {
      this.router.navigate(['event/book-ticket/' + this.id]);
    }
  }
  markFavorites(event: EventList): void {
    this.isMarkFav = true;
    // event.preventDefault();
    const body = {
      eventId: event.id,
      isFavorite: event.isFavorite ? !event.isFavorite : true
    };
    const value = event.isFavorite ? !event.isFavorite : true;
    const message = value ? 'marked' : 'unmarked';
    this.utilityService.startLoader();
    this.userService.putMarkFavorite(body)
      .then((response: any) => {
        this.getUserEventDetail(event.id, '');
        this.snackBar.open('Event name is ' + message + ' as favorite', 'Success', {
          duration: 2000,
        });
        this.isMarkFav = false;
        this.utilityService.stopLoader();
      }).catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }



  getUserReviews(id: any): void {
    this.utilityService.startLoader();
    this.userService.getAllUserReviews(id).then((response: any) => {
      if (response.success) {
        this.utilityService.stopLoader();
        this.allUserReviews = response.data;
      }
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      this.utilityService.routingAccordingToError(error);
    });
  }

  getFormattedDate(originalDate: string): string {
    return _moment.utc(originalDate).format('hh:mm A');
    // let timeZone = localStorage.getItem('LocalTimeZone')
    // const moment = require('moment-timezone')
    // return moment(originalDate).tz(timeZone).format('hh:mm A');
  }
  breakpoint(): void {
    // this.breakpointObserver
    //   .observe(['(min-width: 959px)'])
    //   .subscribe((state: BreakpointState) => {
    //     if (state.matches) {
    //       this.descClicked = false;
    //       this.readBtn = false;
    //       this.sharedService.headerLayout.emit({
    //         headerSize: this.STRINGS.headerSize.medium,
    //         headerName: this.eventdetail.categoryName,
    //         isBack: true
    //       });
    //     } else {
    //       this.descClicked = true;
    //       this.readBtn = true;
    //       this.sharedService.headerLayout.emit({
    //         headerSize: this.STRINGS.headerSize.small,
    //         isBack: true
    //       });
    //     }
    //   });
  }
  openExternalLink(): void {
    if (this.eventdetail.otherWebsiteUrl.includes('http')){
      window.open(this.eventdetail.otherWebsiteUrl, '_blank');
    }
    else{
      window.open('//' + this.eventdetail.otherWebsiteUrl, '_blank');
    }
  }

  onTalentSlideChange(): void {
  //  console.log('slide change');
  }

  mailAppOpen(email: any): void {

    // window.location.href = 'mailto:Event365@gmail.com?subject=Query Related Event';
    if (email){
      window.location.href = `mailto:${email}?subject=Query Related Event`;
    }else{
      this.dialog.open(AlertdialogComponent, {
        width: '460px',
        data: {
          name: 'Email Not Available',
        },
        panelClass: 'custom_dilog',
      });
      return;
    }
  }
  openDailer(mobileNo: any): void {
    if (mobileNo){
      document.location.href = 'tel:' + mobileNo;
      this.snackBar.open('copy to clipboard', 'Success', {
        duration: 2000,
      });
    }else{
      this.dialog.open(AlertdialogComponent, {
        width: '460px',
        data: {
          name: 'Contact Number Not Available',
        },
        panelClass: 'custom_dilog',
      });
      return;
    }
  }
  openHostLink(hostWebsite: any): void {
    if (hostWebsite){
      if (hostWebsite.includes('http')){
        window.open(hostWebsite, '_blank');
      }
      else{
        window.open('//' + hostWebsite, '_blank');
      }
      this.snackBar.open('copy to clipboard', 'Success', {
        duration: 2000,
      });
    }else{
      this.dialog.open(AlertdialogComponent, {
        width: '460px',
        data: {
          name: 'Website Not Available',
        },
        panelClass: 'custom_dilog',
      });
      return;
    }
  }
  //Date fetching conversion to UTC
  convertDateUTC(originalDate: string){
    return  _moment.utc(originalDate).format('DD MMM');
  }
  convertRelatedDateUTC(originalDate: string){
    return  _moment.utc(originalDate).format('DD');
  }
  // getRandomColor() {
  //   var color = Math.floor(0x1000000 * Math.random()).toString(16);
  //   return '#' + ('000000' + color).slice(-6);
  // }
  
  todayAndYesterday(date:any){
    //console.log(date, moment(date).isSame(moment(), "day"))
    let dateZ = date.replace('Z', '');
    if( _moment(dateZ).isSame( _moment(), "day")){
      return  _moment(dateZ).isSame( _moment(), "day") ? "Today" : false;
    }else{
      return  _moment(dateZ).isSame( _moment().add(1, 'day'), "day") ? "Tommorow" : false;
    }
  }
    getDistance(dis: number): number{
      if (!isNaN(dis)){
        return dis;
      }else{
        return 0;
      }
    }
    getLocation(): void {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          // console.log(position.coords.latitude + 'Longitude:' + position.coords.longitude);
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.relatedEventList(this.eventdetail.subCategories);
        });
      } else {
        this.relatedEventList(this.eventdetail.subCategories);
        this.dialogopen('Geolocation is not supported by this browser');
      }
    }
    
    
    handlePermission(): void {
      if( navigator.permissions && (navigator.permissions.query)){
        navigator.permissions.query({name: 'geolocation'}).then((result) => {
          if (result.state === 'granted') {
            this.getLocation()
            this.report(result.state);
           // geoBtn.style.display = 'none';
          } else if (result.state === 'prompt') {
            this.report(result.state);
            this.dialogopen('Please Allow Location Click on Allow');
            this.relatedEventList(this.eventdetail.subCategories);
          } else if (result.state === 'denied') {
            this.report(result.state);
            this.relatedEventList(this.eventdetail.subCategories);
          }
          result.onchange = (res => {
            this.report(result.state);
          });
        });
      }else{
        this.getLocation()
      } 
    }

    report(state: any): void {
      console.log('Permission ' + state);
    }
}

