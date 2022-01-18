import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { localString } from '../../../shared/utils/strings';
import { SharedService } from './../../../shared/shared.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { CustomDatepickerComponent } from '../../../components/customdatepicker/custom-datepicker/custom-datepicker.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker, } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';


import * as moment from 'moment';
export const MATERIAL_DATEPICKER_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
import { environment } from 'src/environments/environment';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseShortLinkService } from 'src/app/shared/services/firebase-short-link.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
import { LoginDialogComponent } from 'src/app/dialog/login-dialog/login-dialog.component';
declare let $: any;
declare let google: any;
class CustomDateAdapter extends MomentDateAdapter {
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): any {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }
}
interface CategoryList {
  categoryImage: any;
  categoryName: string;
  id: number;
}
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
  favorite: any;
}
@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {
  baseUrl = environment.shareBaseUrl;
  customHeader = CustomDatepickerComponent;
  STRINGS: any = localString;
  milesValue: any = 500;
  latitude: any;
  longitude: any;
  maxArrayRecommandation: any = 8;
  RecommandationList: any = [];
  isMarkFav: any;
  shareUrl: any;
  userType: any = '';
  @ViewChild('homepicker', { static: true }) homepicker: MatDatepicker<Date> | undefined;

  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private firebaseService: FirebaseShortLinkService,
    private userService: UserService,
    private sharedService: SharedService,
    private utilityService: UtilityService,
    private route: Router,
  ) {
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.recommondation.pageHeadding,
      headerSize: this.STRINGS.headerSize.betMedSmall,
      isActive: this.STRINGS.header.recommendation,
      isBack: true
    });

    this.sharedService.refreshPage.subscribe(() => {
      this.ngOnInit();
    });
  }
  ngOnInit(): void {
    this.handlePermission();
    if (localStorage.getItem('userType')) {
      this.userType = JSON.parse(localStorage.getItem('userType') || '');
    }
  }
  async getLocation(): Promise<void> {
    return await new Promise((resolve, reject) => {

       if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position.coords.latitude + 'Longitude:' + position.coords.longitude);
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.getRecommondation();
       },
       (error) => {
        // do error handling
        this.utilityService.stopLoader();
        this.dialogopen('Something Went Wrong Please Refresh Page');
        console.log(error)
      }, {
        maximumAge: 60000, timeout: 3000,
        enableHighAccuracy: true
      }
      );
    } else {
      this.dialogopen('Geolocation is not supported by this browser');
    }
    });
  }
  handlePermission(): void {
    if( navigator.permissions && (navigator.permissions.query)){
      navigator.permissions.query({name: 'geolocation'}).then((result) => {
        if (result.state === 'granted') {
          this.report(result.state);
          this.getLocation();
         // geoBtn.style.display = 'none';
        } else if (result.state === 'prompt') {
          this.report(result.state);
          this.dialogopen('Please Allow Location Click on Allow');
        } else if (result.state === 'denied') {
          this.report(result.state);
          this.getRecommondation();
        }
        result.onchange = (res => {
          this.report(result.state);
        });
      });
    }else{
      this.getLocation();
    }
   
  }
  report(state: any): void {
    console.log('Permission ' + state);
  }

  getRecommondation(): void {
    this.utilityService.startLoader()
    const body = {
      page: 1,
      limit: 10,
      latitude: this.latitude,
      longitude: this.longitude,
      miles: this.milesValue
    };
    this.userService.getreCommandationsEvent(body)
      .then((response: any) => {
        // console.log(response.data.eventList, "getreCommandationsEvent")
        if (response.success) {
          this.RecommandationList = response.data.eventList;

          this.RecommandationList.forEach((event: any) => {
            event.start = event.start.replace('Z', '');
            event.end = event.end.replace('Z', '');
          });

          if (response.data.eventList.length === 0) {
            this.dialogopen('Events not found for your preferences');
          }
          this.utilityService.stopLoader();
        }
      })
      .catch((error: any) => {
        if (error.error.includes('Unauthorized')){
          const dialogRef = this.dialog.open(LoginDialogComponent, {
            width: '500px',
            height: '600px',
            panelClass: 'custom_dilog',
            data: {
              recommendations : true
            }
              });
          this.utilityService.stopLoader();
         // this.utilityService.routingAccordingToError(error);
        }else{
          this.utilityService.stopLoader();
          this.dialogopen('something went wrong please try again');
          this.utilityService.routingAccordingToError(error);
        }
      });
  }
  openSocialMedia(eventdetail: any, SocialMedia: any): void {
    try {
      const body = JSON.stringify(
        {
          dynamicLinkInfo:
          {
            domainUriPrefix: 'https://365live.page.link',
            link: this.baseUrl + 'event/detail/' + eventdetail.id,
            socialMetaTagInfo: {
              socialTitle: eventdetail.name,
              socialDescription: 'FIND SOMETHING FUN TO DO Discover Fun Events Near You',
              socialImageLink: eventdetail.eventImages[0]?.eventImage
            },
            androidInfo: {androidPackageName: 'com.ebabu.event365live.host'},
          }
        });

      this.firebaseService.postDynamicLink(body).then((response: any) => {
        this.shareUrl = response.shortLink;
        if (SocialMedia.includes('facebook')){
          window.open('http://www.facebook.com/sharer/sharer.php?u=' + this.shareUrl, '_blank' );
        }
        if (SocialMedia.includes('twitter')){
          window.open('https://twitter.com/intent/tweet?text=' + this.shareUrl, '_blank' );
        }
        if (SocialMedia.includes('mail')){
           window.open('mailto:?subject=You are invited to +' + eventdetail.name +
           'Event&body=Check out this site I came across ' + this.shareUrl);
        }
      });
    } catch (error) {
      console.log(error);
      this.dialogopen('something went wrong try again latter');
    }
  }
  markFavorites(event: EventList): void {
    const body = {
      eventId: event.id,
      isFavorite: event.favorite ? !event.favorite.isFavorite : true
    };
    const value = event.favorite ? !event.favorite.isFavorite : true;
    const message = value ? 'marked' : 'unmarked';
    this.utilityService.startLoader();
    this.userService.putMarkFavorite(body)
      .then((response: any) => {
        this.snackBar.open('Event name is ' + message + ' as favorite', 'Success', {
          duration: 2000,
        });
        this.getRecommondation();
        this.utilityService.stopLoader();
      }).catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }

  navigateEventDetail(id: any): any {
    this.route.navigate(['event/detail/' + id]);
  }


  viewAll(type: string, arrayName: string): any {
    // this[type] = this[arrayName].length;
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
  getFormattedDate(originalDate: string | undefined): string | undefined {
    return  moment(originalDate).format('hh:mm A');
  }
  getDistance(dis: number): number{
    if (!isNaN(dis)){
      return dis;
    }else{
      return 0;
    }
  }

  redirect(id : any){
    this.route.navigate(['event/detail/' +id]);
     }
     convertDateUTC(originalDate: string){
      return  moment.utc(originalDate).format('DD');
    }

    likeDislikeEvent(eventId: any, type: number): any{
      const body = {
        eventId,
        type
      };
      this.userService.EventLikeDislike(body).then((response: any) => {
        if (response.success) {
          this.getRecommondation();
          this.snackBar.open(response.message + ' Event', 'Success', {
            duration: 2000,
          });
          this.utilityService.stopLoader();
        }
      })
        .catch((error: any) => {
          this.utilityService.stopLoader();
          this.utilityService.routingAccordingToError(error);
        });
    }

}



