import { Component, OnInit, OnDestroy, ViewChild, Renderer2 } from '@angular/core';
import { localString } from '../../../shared/utils/strings';
import { Observable, Subject, Subscription } from 'rxjs';
import { SharedService } from './../../../shared/shared.service';
import { HomeService } from '../home.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { CustomDatepickerComponent } from '../../../components/customdatepicker/custom-datepicker/custom-datepicker.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { UserService } from '../../user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseShortLinkService } from 'src/app/shared/services/firebase-short-link.service';
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
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { environment } from 'src/environments/environment';
import { ProfileService } from '../../profile/profile.service';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { RsvpService } from '../../rsvp/rsvp.service';
import { PagesService } from '../../pages.service';
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
  start: string;
  end: string;
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
  host: any;
  eventChooseSubcategory: any;
  eventUrl: any;
  archivedBy: any;
  recuringDate: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MATERIAL_DATEPICKER_FORMATS },
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  baseUrl = environment.shareBaseUrl;

  customHeader = CustomDatepickerComponent;
  STRINGS: any = localString;
  categoryList: any = [];
  subCategoryList: any = [];
  featuredCategories: CategoryList[] = [];
  selectedCategory: any = '';
  searchFilter: any;
  limit: any = 10;
  page: any = 1;
  eventsListNearBy: EventList[] = [];
  maxValue: any;
  costValue: any = 0;
  milesValue: any = 500;
  userType: any = '';
  partnerDetails: any;
  isUpcomingEvent: any = true;
  selectedSubCategory: any;
  partnerPastEvents: EventList[] = [];
  partnerUpcomingEvents: EventList[] = [];
  latitude: any = '';
  longitude: any = '';
  isViewAllClicked: any = true;
  isloggedin: any;
  maxArrayPastEvents: any = 8;
  maxArrayUpcomingEvents: any = 8;
  maxArrayFeatuedEvents: any = 8;
  maxArrayNearByEvents: any = 8;
  maxArrayFeaturedCategory: any = 5;
  featuredEvents: EventList[] = [];
  [key: string]: any;
  private searchFilterSubscription: Subscription;
  private headerContentSubscription: Subscription;
  upcomingEventDates: any = [];
  pastEventDates: any = [];
  isMarkFav = false;
  superUser:any;
  rolesManageUser:any;
  @ViewChild('homepicker', { static: true }) homepicker: MatDatepicker<Date> | undefined;
  filtervalue!: boolean;
  constructor(
    private renderer: Renderer2,
    private homeService: HomeService,
    private sharedService: SharedService,
    private utilityService: UtilityService,
    private route: Router,
    private userService: UserService,
    public rsvp_service: RsvpService,
    private _snackBar: MatSnackBar,
    private firebaseService: FirebaseShortLinkService,
    private mapsAPILoader: MapsAPILoader,
    private profileService: ProfileService,
    public PagesService: PagesService,
    private http: HttpClient
  ) {
    this.getIpGeolocation();
    this.sharedService.headerLayout.emit({
      headerSize: this.STRINGS.headerSize.large,
      isHome: true,
      isActive: this.STRINGS.header.home,
    });
    this.searchFilterSubscription = this.sharedService.filterData.subscribe(
      (data) => {
        if (data.searchDetail) {
          this.searchFilter = data.searchDetail;
          this.latitude = this.searchFilter.location[0] !== '' ? this.searchFilter.location[0] : this.latitude;
          this.longitude = this.searchFilter.location[1] !== '' ? this.searchFilter.location[1] : this.longitude;
          if (this.searchFilter.location[0] === '' && this.searchFilter.location[1] === '') {
            this.locateMe(data.isSetData);
          } else {
            if (this.latitude && this.longitude) {
              this.mapsAPILoader.load().then(() => {
                const google_map_position = new google.maps.LatLng(
                  this.latitude,
                  this.longitude
                );
                const google_maps_geocoder = new google.maps.Geocoder();
                google_maps_geocoder.geocode(
                  { latLng: google_map_position },
                  (results: any, status: any) => {
                    this.sharedService.filterData.emit({ currentAddress: results, isSetData: data.isSetData });
                    this.searchNearBy();
                  }
                );
              })
            } else {
              this.searchNearBy();
            }
          }
        }
      }
    );
    this.headerContentSubscription = this.sharedService.headerContent.subscribe(
      (data) => {
        if (data.isLogin && localStorage.getItem('userType')) {
          this.userType = JSON.parse(localStorage.getItem('userType') || '');
          this.ngOnInit();
        }
      }
    );
  }
  ngOnInit(): void {
    if (localStorage.getItem('userDetails')){
      this.superUser =  JSON.parse(localStorage.getItem('userDetails') || '');
     
      try {
        let majorRoles = this.superUser.roles? this.superUser.roles : this.superUser.user.roles || '';
        let majorRolesarray =[]
        if(majorRoles.includes('event_management')) {
          majorRolesarray.push('event_management')
        }
        if(majorRoles.includes('user_management')) {
          majorRolesarray.push('user_management')
        }
        if(majorRoles!= null){
          majorRolesarray.forEach((element:any) => {
            if(element.includes('event_management')){
              this.rolesManageUser = element;
            //  console.log( this.rolesManageUser, ' this.rolesManageUser')
            }
        });
        }
      } catch (error) {
        console.log(error)
      }
      // let roles = JSON.parse(this.superUser.roles);
      // // if(roles!= null){
      // //   roles.forEach((element:any) => {
      // //     if(element == 'event_management'){
      // //       this.rolesManageUser = element;
      // //       console.log( this.rolesManageUser, ' this.rolesManageUser')
      // //     }
      // // });
      // // }
    }
    this.profileService.headerFilterChange$.subscribe((FilterHide: any) => {
      this.filtervalue = FilterHide
      //this.filtervalue = !this.filtervalue
    });
    this.locateMe(false);
    if (localStorage.getItem('userType')) {
      this.userType = JSON.parse(localStorage.getItem('userType') || '');
      if (
        this.userType === this.STRINGS.userType.lowerCaseHost ||
        this.userType === this.STRINGS.userType.lowerCasePromoter ||
        this.userType === this.STRINGS.userType.lowerCaseVenuer ||  this.userType === this.STRINGS.userType.member
      ) {
        this.fetchOrganiserCount();
        this.fetchPartnerEvents();
      }
    }
    if (
      this.userType !== this.STRINGS.userType.lowerCaseHost &&
      this.userType !== this.STRINGS.userType.lowerCasePromoter &&
      this.userType !== this.STRINGS.userType.lowerCaseVenuer &&
      this.userType !== this.STRINGS.userType.member
    ) {
      this.fetchAllCategories();
    }
    // this.searchNearBy();
    this.profileService.footerlogoChange$.next(this.userType);
    if(this.userType == 'customer'){
      this.fetchUserPendingRsvpDetils();
    } 

    if (this.homeService.pastEvent) {
      this.isUpcomingEvent = false;
      this.homeService.pastbackButton(false);
    }

    // this.utilityService.pastEventBack.subscribe(res => {
    //   if (res.pastEventBack)
    //   {
    //     this.isUpcomingEvent = false;
    //   }
    // });
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
            androidInfo: { androidPackageName: 'com.ebabu.event365live.host' },
          }
        });

      this.firebaseService.postDynamicLink(body).then((response: any) => {
        this.shareUrl = response.shortLink;
        if (SocialMedia.includes('facebook')) {
          window.open('http://www.facebook.com/sharer/sharer.php?u=' + this.shareUrl, '_blank');
        }
        if (SocialMedia.includes('twitter')) {
          window.open('https://twitter.com/intent/tweet?text=' + this.shareUrl, '_blank');
        }
        if (SocialMedia.includes('mail')) {
          window.open('mailto:?subject=You are invited to +' + eventdetail.name +
            'Event&body=Check out this site I came across ' + this.shareUrl);
        }
      });
    } catch (error) {
      console.log(error);
      alert('something went wrong try again latter');
    }
  }

  


  fetchAllCategories(): any {
    this.utilityService.startLoader();
    this.homeService
      .getAllCategorys()
      .then((response: any) => {
        if (response.success) {
          this.categoryList = response.data.category;
          // console.log(this.categoryList, "categoryList")
          this.maxValue = response.data.maxPrice.max;
          this.costValue = this.maxValue;
          if (localStorage.getItem('authToken')) {
            this.fetchUserProfile();
          } else {
            this.locateMe(true);
          }
          this.utilityService.stopLoader();
        }
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  fetchUserProfile(): any {
    this.utilityService.startLoader();
    this.homeService.getUserProfile()
      .then((response: any) => {
        if (response.success) {
          this.latitude = response.data.latitude;
          this.longitude = response.data.longitude;
          localStorage.setItem('lastLoggedin', JSON.stringify(response.data.lastLoginTime));
          if (this.latitude && this.longitude) {
            this.mapsAPILoader.load().then(() => {
              const google_map_position = new google.maps.LatLng(
                this.latitude,
                this.longitude
              );
              const google_maps_geocoder = new google.maps.Geocoder();
              google_maps_geocoder.geocode(
                { latLng: google_map_position },
                (results: any, status: any) => {
                  this.sharedService.filterData.emit({ currentAddress: results, isSetData: true });
                }
              );
              this.searchNearBy();
            })
          } else {
            this.locateMe(true);
          }
          this.utilityService.stopLoader();

        }

      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  selectAllCategory(): void {
    this.selectedCategory = '';
    this.selectedSubCategory = '';
   this.searchNearBy();
   $('.dropdown-menu-category').addClass( "dropdown-menu-sub-category" );

  }
  // selectAllCategoryAll(category: any): any{
  //   this.selectedCategory = '';
  //   this.selectedSubCategory = '';
  //   this.searchNearBy();
  // }
  selectCategory(category: any): any {
    $('.dropdown-menu-category').removeClass( "dropdown-menu-sub-category" );
    if (this.selectedCategory && this.selectedCategory.id === category.id) {
      this.selectedCategory = '';
    }
    else {
      this.selectedCategory = { id: category.id, name: category.categoryName };
      const body = {
        categoryId: [category.id],
      };
      this.searchNearBy();
      this.selectedSubCategory = '';
      this.homeService
        .postSubCategoryByCategory(body)
        .then((response: any) => {
          if (response.success) {
            this.subCategoryList = response.data;
          }
        })
        .catch((error: any) => {
          this.utilityService.routingAccordingToError(error);
        });
    }
  }
  selectSubCategory(subCategory: any): any {
    if (this.selectedSubCategory && this.selectedSubCategory.id === subCategory.id) {
      this.selectedSubCategory = '';
    } else {
      this.selectedSubCategory = {
        id: subCategory.id,
        name: subCategory.subCategoryName,
      };
      this.searchNearBy();
    }
  }
  searchNearBy(): any {
    this.utilityService.startLoader();
    //console.log('filter value --', this.searchFilter);
    const body = {
      categoryId: this.selectedCategory ? this.selectedCategory.id : '',
      endDate: this.searchFilter ? this.searchFilter.endDate : '',
      miles: this.milesValue,
      longitude: this.searchFilter?.location2 ? this.longitude : '',
      cost: this.costValue,
      startDate: this.searchFilter ? this.searchFilter.startdate : '',
      latitude: this.searchFilter?.location2 ? this.latitude : '',
      subCategoryId: this.selectedSubCategory
        ? [this.selectedSubCategory.id]
        : '',
      keyword: this.searchFilter ? this.searchFilter.search : ''
    };
    if (localStorage.getItem('authToken') && !this.searchFilter) {
      this.isloggedin = null
    } else if (localStorage.getItem('authToken')) {
      this.isloggedin = 'NearBy/auth';
    } else {
      this.isloggedin = 'nearBy';
    }

    if (this.isloggedin) {
      this.homeService
        .postSearchNearBy(body, this.isloggedin)
        .then((response: any) => {
          this.eventsListNearBy = response.data.eventList;
          this.featuredCategories = response.data.category;
          this.getFeaturedEvents(body);
          //  this.featuredEvents = response.data.FeatureEvent;
          this.utilityService.stopLoader();
        })
        .catch((error: any) => {
          this.utilityService.stopLoader();
          this.utilityService.routingAccordingToError(error);
          if (error.error.message && error.error.message.includes('Event is not available')) {
            this.eventsListNearBy = error.error.data.eventList;
            this.featuredCategories = error.error.data.category;
          }
        });
    }
  }

  fetchOrganiserCount(): any {
    this.utilityService.startLoader();
    this.homeService
      .getOrganiserCount()
      .then((response: any) => {
        if (response.success) {
          this.partnerDetails = response.data;
         // console.log( this.partnerDetails, ' this.partnerDetails')
          localStorage.setItem('lastLoggedin', JSON.stringify(response.data.user.lastLoginTime));
        }
        this.utilityService.stopLoader();
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  costValueChange(event: any): any {
    this.costValue = event.value;
    this.searchNearBy();
  }
  milesValueChange(event: any): any {
    this.milesValue = event.value;
    this.searchNearBy();
  }
  resetFilterValues(): any {
    this.costValue = this.maxValue;
    this.milesValue = 500;
    this.selectedCategory = '';
    this.selectedSubCategory = '';
    this.searchNearBy();
  }
  ngOnDestroy(): any {
    this.searchFilterSubscription.unsubscribe();
    this.headerContentSubscription.unsubscribe();
  }
  pastEvent(): any {
    this.maxArrayPastEvents = 8;
    this.maxArrayUpcomingEvents = 8;
    this.isUpcomingEvent = false;
  }
  upcomingEvent(): any {
    this.maxArrayPastEvents = 8;
    this.maxArrayUpcomingEvents = 8;
    this.isUpcomingEvent = true;
  }
  fetchPartnerEvents(): any {
    this.utilityService.startLoader();
    this.homeService
      .getAllPartnerEvents({ lat: this.latitude, lng: this.longitude })
      .then((response: any) => {
        if (response.success) {
          this.partnerPastEvents = response.data.pastEvent;
          this.partnerUpcomingEvents = response.data.upcomingEvent;

        //  console.log(this.partnerUpcomingEvents, 'this.partnerUpcomingEvents')
          this.upcomingEventDates = this.partnerUpcomingEvents.map((data) => new Date(moment(data.start).format('l')));
          this.pastEventDates = this.partnerPastEvents.map((data) => new Date(moment(data.start).format('l')));
          this.utilityService.stopLoader();
        }
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  viewAll(type: string, arrayName: string): any {
    this[type] = this[arrayName].length;
  }
  navigateEventDetail(id: any, customUrl:any, isPast: boolean, categoryId?: any): any {
    if (!this.isMarkFav) {
      if (this.userType.includes('customer') || this.userType.includes('guestUser') || (this.userType == null || this.userType == '')) {
        if (categoryId) {
          categoryId = categoryId.eventChooseSubcategory[0].categoryId
        }
        if (this.userType.includes('customer')) {
          this.updateCategoryCount(categoryId);
        }
        let cusUrl = customUrl.trim()
        if(cusUrl){
        //  console.log(cusUrl, "custom url")
          this.route.navigate(['event/detail/' + id + '/' + customUrl]);
        }else{
         // console.log("hi")
          this.route.navigate(['event/detail/' + id ] );
        }
        
        //this.route.navigate(['event/detail/' + customUrl]);
        
      }
      else {
        // this.route.navigate(['event/view-event/' + id]);
        if (isPast) {
          this.route.navigate(['event/view-event/' + id + '/pastEvent']);
        } else {
          this.route.navigate(['event/view-event/' + id]);
        }
      }
    }
  }
  public dateClass = (date: Date) => {
    if (moment(date).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) {
      return ['todaySelected'];
    }
    if (this.findUpcomingDate(date) !== -1) {
      return ['upcomingSelected'];
    } else if (this.findPastDate(date) !== -1) {
      return ['pastSelected'];
    }
    return [];
  }
  private findUpcomingDate(date: Date): number {
    return this.upcomingEventDates.map((m: any) => +m).indexOf(+date);
  }
  private findPastDate(date: Date): number {
    return this.pastEventDates.map((m: any) => +m).indexOf(+date);
  }
  getFeaturedEvents(data: any): void {
   // console.log(data);
    let url = '';
    if (localStorage.getItem('authToken')) {
      url = '/auth';
    }
    this.utilityService.startLoader();
    this.homeService
      .postfeaturedEvent(data, url)
      .then((response: any) => {
        //console.log(response, 'this.featuredEvents')
        if (response.success) {
          this.featuredEvents = response.data.eventList;
        }
        this.utilityService.stopLoader();
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  markFavorites(event: EventList): void {
    this.isMarkFav = true;
    // event.preventDefault();
    const body = {
      eventId: event.id,
      isFavorite: event.favorite ? !event.favorite.isFavorite : true
    };
    const value = event.favorite ? !event.favorite.isFavorite : true;
    const message = value ? 'marked' : 'unmarked';
    this.utilityService.startLoader();
    this.userService.putMarkFavorite(body)
      .then((response: any) => {
        this.searchNearBy();
        this._snackBar.open('Event name is ' + message + ' as favorite', 'Success', {
          duration: 2000,
        });
        this.isMarkFav = false;
        this.utilityService.stopLoader();
      }).catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }

  updateCategoryCount(CategoryId: any) {
    const body = {
      categoryId: CategoryId,
    };
    this.utilityService.startLoader();
    this.homeService.postUpdateCategoryCount(body)
      .then((response: any) => {
        this.utilityService.stopLoader();
      }).catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }


  getFormattedDate(originalDate: string | undefined): string | undefined {
    return moment.utc(originalDate).format('hh:mm A');
    // let timeZone = localStorage.getItem('LocalTimeZone')
    // const moment = require('moment-timezone')
    // return moment(originalDate).tz(timeZone).format('hh:mm A');
  }
  async locateMe(isSetData: boolean) {

    return await new Promise((resolve, reject) => {
      try {
        if (navigator.permissions && (navigator.permissions.query)) {
          navigator.permissions &&
            navigator.permissions
              .query({ name: 'geolocation' })
              .then((PermissionStatus): any => {
                if (PermissionStatus.state === 'granted') {
                  try {
                    navigator.geolocation.getCurrentPosition((position) => {
                    //  console.log("position", position.coords.latitude, position.coords.longitude);
                      this.mapsAPILoader.load().then(() => {
                        const geocoder = new google.maps.Geocoder();
                        const latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        const request = { latLng: latlng };
                        geocoder.geocode(request, (results: any, status: any) => {

                          this.sharedService.filterData.emit({ currentAddress: results, isSetData: isSetData });

                          if (status === 'REQUEST_DENIED') {
                            console.log("request denied")
                            $('#alert-modal').modal('show');
                            this.sharedService.modalContent.emit({
                              content: 'Permission wasn\'t granted. Allow a retry.',
                              denied: true
                            });
                            this.searchNearBy();
                            return;
                          }
                        })
                      });
                    }, (error) => {
                      //do error handling
                      console.log(error)
                      setTimeout(() => {
                        if(this.getIpGeolocationData.latitude && this.getIpGeolocationData.longitude){
                          this.latitude = this.getIpGeolocationData.latitude;
                          this.longitude = this.getIpGeolocationData.longitude;
                          this.sharedService.filterData.emit({ currentAddress: this.getIpGeolocationData, isSetData: isSetData });
                          this.searchNearBy();
                        }else{
                          this.searchNearBy();
                         // console.log("hi")
                        }
                      }, 1000);
                      
                      // this.searchNearBy();
                      // $('#alert-modal').modal('show');
                      // this.sharedService.modalContent.emit({
                      //   content: this.STRINGS.alert.alertLocation,
                      // });

                    }, {
                      maximumAge: 60000, timeout: 2000,
                      enableHighAccuracy: true
                    });
                  } catch (error) {
                    setTimeout(() => {
                      if(this.getIpGeolocationData.latitude && this.getIpGeolocationData.longitude){
                        this.latitude = this.getIpGeolocationData.latitude;
                        this.longitude = this.getIpGeolocationData.longitude;
                        this.sharedService.filterData.emit({ currentAddress: this.getIpGeolocationData, isSetData: isSetData });
                        this.searchNearBy();
                      }else{
                        this.searchNearBy();
                      }
                    }, 1000);
                    // console.log('Inner Catch', error)
                    // this.searchNearBy();
                    // $('#alert-modal').modal('show');
                    // this.sharedService.modalContent.emit({
                    //   content: this.STRINGS.alert.alertLocation,
                    // });
                  }
                } else {
                  setTimeout(() => {
                    if(this.getIpGeolocationData?.latitude && this.getIpGeolocationData?.longitude){
                      this.latitude = this.getIpGeolocationData.latitude;
                      this.longitude = this.getIpGeolocationData.longitude;
                      this.sharedService.filterData.emit({ currentAddress: this.getIpGeolocationData, isSetData: isSetData });
                      this.searchNearBy();
                    }else{
                      this.searchNearBy();
                    }
                  },1000);
                  // this.searchNearBy();
                  // $('#alert-modal').modal('show');
                  // this.sharedService.modalContent.emit({
                  //   content: this.STRINGS.alert.alertLocation,
                  // });
                }
              });
        } else {
          navigator.geolocation.getCurrentPosition((position) => {
           // console.log("position", position.coords.latitude, position.coords.longitude);
            this.mapsAPILoader.load().then(() => {
              const geocoder = new google.maps.Geocoder();
              const latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
              const request = { latLng: latlng };
              geocoder.geocode(request, (results: any, status: any) => {

                this.sharedService.filterData.emit({ currentAddress: results, isSetData: isSetData });

                if (status === 'REQUEST_DENIED') {
                  console.log("request denied")
                  $('#alert-modal').modal('show');
                  this.sharedService.modalContent.emit({
                    content: 'Permission wasn\'t granted. Allow a retry.',
                    denied: true
                  });
                  this.searchNearBy();
                  return;
                }
              })
            });
          }, (error) => {
            //do error handling
            setTimeout(() => {
              if(this.getIpGeolocationData.latitude && this.getIpGeolocationData.longitude){
                this.latitude = this.getIpGeolocationData.latitude;
                this.longitude = this.getIpGeolocationData.longitude;
                this.sharedService.filterData.emit({ currentAddress: this.getIpGeolocationData, isSetData: isSetData });
                this.searchNearBy();
              }else{
                this.searchNearBy();
              }
            }, 1000);
            // this.searchNearBy();
            // $('#alert-modal').modal('show');
            // this.sharedService.modalContent.emit({
            //   content: this.STRINGS.alert.alertLocation,
            // });
            console.log(error)
          }, {
            maximumAge: 60000, timeout: 2000,
            enableHighAccuracy: true
          });
        }
      } catch (error) {
        setTimeout(() => {
          if(this.getIpGeolocationData.latitude && this.getIpGeolocationData.longitude){
            this.latitude = this.getIpGeolocationData.latitude;
            this.longitude = this.getIpGeolocationData.longitude;
            this.sharedService.filterData.emit({ currentAddress: this.getIpGeolocationData, isSetData: isSetData });
            this.searchNearBy();
          }else{
            this.searchNearBy();
          }
        }, 1000);
        // console.log('Outer catch', error)
        // this.searchNearBy();
        // $('#alert-modal').modal('show');
        // this.sharedService.modalContent.emit({
        //   content: this.STRINGS.alert.alertLocation,
        // });
      }
    });
  }
  getIpGeolocationData:any;
  getIpGeolocation() {
    this.http.get('https://api64.ipify.org?format=json').subscribe(
      (value: any) => {
      //  console.log('ip', value.ip);
        this.http.get(`https://api.ipstack.com/${value.ip}?access_key=fd37876b65523495b94f0bb4e3e43da4`).subscribe(Response =>{
          this.getIpGeolocationData = Response;
          localStorage.setItem('LocalTimeZone',this.getIpGeolocationData.time_zone.id)
        })
      },
      (error: any) => {
        console.log(error);
        this.utilityService.stopLoader();
      }
    );
  }


  convertDateUTC(originalDate: string){
    return  moment.utc(originalDate).format('DD');
  }
  // filterstep1:boolean = false;
  // FilterMobileShow(){
  //     this.filterstep1 = ! this.filterstep1
  // }
  fetchUserPendingRsvpDetils(): void {
    this.utilityService.startLoader();
    const body = {
      page: 1,
      limit: 10,
      status: 'pending'
    };
    this.rsvp_service.getUserRsvpDetails(body).then((response: any) => {
      if (response.success) {
        let totalCountPending = response.data.RSPVPendingCount[0] ? response.data.RSPVPendingCount[0].count : 0;
        this.profileService.RsvpPendingStatusUpdate$.next(totalCountPending);

        this.utilityService.stopLoader();
      }
    })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  likeDislikeEvent(eventId: any, type: number): any{
    const body = {
      eventId,
      type
    };
    this.homeService.EventLikeDislike(body).then((response: any) => {
      if (response.success) {
        this.searchNearBy();
        this._snackBar.open(response.message + ' Event', 'Success', {
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

