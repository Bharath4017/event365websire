import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
import { FirebaseShortLinkService } from 'src/app/shared/services/firebase-short-link.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { environment } from 'src/environments/environment';
import { UserService } from '../../user/user.service';
import { EventService } from '../event.service';
import * as moment from 'moment';
@Component({
  selector: 'app-related-event',
  templateUrl: './related-event.component.html',
  styleUrls: ['./related-event.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RelatedEventComponent implements OnInit {

  STRINGS: any = localString;
  realtedEventDeatil: any = [];
  eventdetail: any;
  id: any;
  baseUrl = environment.shareBaseUrl;
  shareUrl: any;
  userType: any = '';
  latitude: any;
  longitude: any;
  constructor( private eventService: EventService,
               private userService: UserService,
               private firebaseService: FirebaseShortLinkService,
               private router: Router,
               private route: ActivatedRoute,
               public dialog: MatDialog,
               private snackBar: MatSnackBar,
               private utilityService: UtilityService,
               private sharedService: SharedService) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.sharedService.headerLayout.emit({
      headerSize: this.STRINGS.headerSize.small,
      headerName: this.STRINGS.viewEvent.RelatedEvent,
      isBack: true
    });
   }

  ngOnInit(): void {
    this.getLocation();
    if (localStorage.getItem('userType')) {
      this.userType = JSON.parse(localStorage.getItem('userType') || '');
    }
  }
  getUserEventDetail(id: any): void {
    this.utilityService.startLoader();
    let url = id;
    this.eventService.getUserEventdetailbyid(url, '')
      .then((response: any) => {
        if (response.success) {
          this.eventdetail = response.data;
          this.relatedEventList(this.eventdetail.subCategories);
          this.utilityService.stopLoader();
        }
      }).catch((error: any) => {
        this.utilityService.stopLoader();
        this.router.navigate(['/home']);
        this.utilityService.routingAccordingToError(error);
      });
    }
    relatedEventList(idArray: any): void{
      const body = {
        page: 1,
        limit: 100,
        latitude: this.latitude,
        longitude: this.longitude,
        miles: 500
      };
      this.eventService.getRelatedEventList(idArray, this.id, body).then((response: any) => {
        if (response.success) {
          this.realtedEventDeatil = response.data;
          this.realtedEventDeatil.forEach((event: any) => {
            event.start = event.start.replace('Z', '');
            event.end = event.end.replace('Z', '');
          });
        }
      }).catch((error: any) => {
          this.dialogopen(error.error.message);
        });
    }
    markFavorites(event: any): void {
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
          this.getUserEventDetail(this.id);
          this.utilityService.stopLoader();
        }).catch((error: any) => {
          this.utilityService.stopLoader();
          this.utilityService.routingAccordingToError(error);
        });
    }
    navigateEventDetail(id: any): any {
      this.router.navigate(['event/detail/' + id]);
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

    getFormattedDate(originalDate: string | undefined): string | undefined {
      return  moment(originalDate).format('hh:mm A');
    }
    dialogopen(name: any): void {
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        width: '450px',
        data: {
          name
        }
      });
      dialogRef.afterClosed().subscribe(() => {
      });
    }
    getDistance(dis: number): number{
      if (!isNaN(dis)){
        return dis;
      }else{
        return 0;
      }
    }
 /////////////////////////////////////////
 getLocation(): void {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      // console.log(position.coords.latitude + 'Longitude:' + position.coords.longitude);
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.getUserEventDetail(this.id);
    });
  } else {
    this.dialogopen('Geolocation is not supported by this browser');
  }
  this.handlePermission();
}


handlePermission(): void {
  if( navigator.permissions && (navigator.permissions.query)){
    navigator.permissions.query({name: 'geolocation'}).then((result) => {
      if (result.state === 'granted') {

        this.report(result.state);
       // geoBtn.style.display = 'none';
      } else if (result.state === 'prompt') {
        this.report(result.state);
        this.dialogopen('Please Allow Location Click on Allow');
      } else if (result.state === 'denied') {
        this.report(result.state);
        this.getUserEventDetail(this.id);
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
convertDateUTC(originalDate: string){
  return  moment.utc(originalDate).format('DD');
}

todayAndYesterday(date:any){
  //console.log(date, moment(date).isSame(moment(), "day"))
  let dateZ = date.replace('Z', '');
  if(moment(dateZ).isSame(moment(), "day")){
    return moment(dateZ).isSame(moment(), "day") ? "Today" : false;
  }else{
    return moment(dateZ).isSame(moment().add(1, 'day'), "day") ? "Tommorow" : false;
  }
}
likeDislikeEvent(eventId: any, type: number): any{
  const body = {
    eventId,
    type
  };
  this.userService.EventLikeDislike(body).then((response: any) => {
    if (response.success) {
      this.getUserEventDetail(this.id);
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
