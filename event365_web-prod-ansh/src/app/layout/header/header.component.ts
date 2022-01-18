import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthService } from 'src/app/auth/auth.service';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Input,
} from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from '../../shared/utils/strings';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { navMobOptions, navOptions, userProfileOptions } from './headerOptions';
import { HomeService } from '../../pages/home/home.service';
import { SwiperOptions } from 'swiper';
declare let $: any;
declare let google: any;
import { MatDatepicker } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CustomDatepickerComponent } from '../../components/customdatepicker/custom-datepicker/custom-datepicker.component';
import { NotificationService } from 'src/app/pages/notification/notification.service';
import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, windowCount } from 'rxjs/operators';
import { MessagingService } from 'src/app/shared/messaging.service';
import { ProfileService } from 'src/app/pages/profile/profile.service';
import { MatSidenav } from '@angular/material/sidenav';
import { PagesService } from '../../pages/pages.service';
export const MATERIAL_DATEPICKER_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
class CustomDateAdapter extends MomentDateAdapter {
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): any {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MATERIAL_DATEPICKER_FORMATS },
  ],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  customHeader = CustomDatepickerComponent;
  STRINGS: any = localString;
  header: any = false;
  displayNav = false;
  filterForm!: FormGroup;
  @ViewChild('locationField') Location: ElementRef | undefined;
  minCurrentDate = new Date();
  latitude: any = '';
  longitude: any = '';
  mapObject: any = {};
  headerSize: any = '';
  headerName: any = '';
  isHome: any = false;
  partnerSideLogo: any = false;
  userType: any = '';
  PendingRsvpCount: any;
  NotificationCount: any;
  HeaderImageSliders: any = [];
  topBannerContent: any = [];
  isProfileUpdated: any;
  navHeader: any = [];
  navMobHeader: any = [];
  userProfile: any = [];
  isActiveNav: any = '';
  isBack: any = false;
  clearAll: any = true;
  userDetails: any;
  todaysDate: any;
  TomorrowDate: any;
  weekStartDate: any;
  weekEndDate: any;
  currentAddress: any = '';
  selectedDateSelection: any;
  notificationList: any;
  unreadNotificationCount: any;
  options: string[] = [];
  filteredOptions!: Observable<string[]>;
  @Input() item: any;
  profilePic: any;
  isApiCall: boolean = false;
  userTypeCustomer: any;
  isActive: boolean = false;
  timeInterval!: any;
  superUser: any;
  rolesManageUser: any;
  clearAllString: boolean = true;
  @ViewChild('headerdatepickerFooter', { static: false })
  headerdatepickerFooter: ElementRef | undefined;
  @ViewChild('headerdatepicker', { static: false }) headerdatepicker:
    | MatDatepicker<any>
    | undefined;
  @Input() messageEvent: any;
  private headerSubscription: Subscription;
  private headerContentSubscription: Subscription;
  private locationContentSubscription: Subscription;
  lat: any;
  lng: any;
  checkLocation: any = 'test';
  defolutHeaderImage = '../../../assets/img/header_bg.png';
  TotalNotiCount: any;
  constructor(
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private location: Location,
    private authService: AuthService,
    private router: Router,
    private utilityService: UtilityService,
    private homeService: HomeService,
    private notificationService: NotificationService,
    private mapsAPILoader: MapsAPILoader,
    private messagingService: MessagingService,
    public profileService: ProfileService,
    public PagesService: PagesService
  ) {
    this.fetchHeaderSlider();
    this.headerSubscription = this.sharedService.headerLayout.subscribe(
      (data) => {
        this.headerSize = data.headerSize ?? '';
        this.headerName = data.headerName ?? '';
        this.isHome = data.isHome ?? false;
        this.isActiveNav = data.isActive ?? '';
        this.isBack = data.isBack ?? false;
      }
    );
    this.headerContentSubscription = this.sharedService.headerContent.subscribe(
      (data) => {
        if (data.isLogin && localStorage.getItem('userType')) {
          this.userType = JSON.parse(localStorage.getItem('userType') || '');
          this.navHeader = navOptions[this.userType];
          this.navMobHeader = navMobOptions[this.userType];
          // if(this.userType == 'host'){
          //   this.userProfile = userProfileOptions[this.STRINGS.userType.partner];
          // }
          this.getHeaderProfile();
          this.fetchHeaderSlider();
        }
      }
    );
    this.locationContentSubscription = this.sharedService.filterData.subscribe(
      (data) => {
        if (data.currentAddress) {
          let place = '';
          if (this.lat && this.lng) {
            this.latitude = this.lat;
            this.longitude = this.lng;
          } else {
            this.latitude = data.currentAddress[0]?.geometry.location.lat()
              ? data.currentAddress[0].geometry.location.lat()
              : data.currentAddress.latitude
              ? data.currentAddress.latitude
              : '';
            this.longitude = data.currentAddress[0]?.geometry.location.lng()
              ? data.currentAddress[0].geometry.location.lng()
              : data.currentAddress.longitude
              ? data.currentAddress.longitude
              : '';
          }
          for (
            let i = 0;
            i < data.currentAddress[0]?.address_components.length;
            i++
          ) {
            switch (data.currentAddress[0].address_components[i].types[0]) {
              case 'locality':
                place = data.currentAddress[0]?.address_components[i].long_name;
                break;
              case 'country':
                place += place
                  ? ', ' +
                    data.currentAddress[0]?.address_components[i].long_name
                  : data.currentAddress[0]?.address_components[i].long_name;
                break;
            }
          }
          const input = this.Location?.nativeElement;
          if (this.checkLocation || input?.value) {
            this.checkLocation = null;
            this.filterForm.controls.location.patchValue(place);
          } else {
            this.checkLocation = input?.value;
            this.filterForm.controls.location.patchValue('');
          }
          if (data.currentAddress.region_name) {
            this.filterForm.controls.location.patchValue(
              data.currentAddress.region_name
            );
          }
          if (data.isSetData) {
            this.submitFilterValues(false);
          }
        }
      }
    );
    this.sharedService.refreshPage.subscribe((data) => {
      this.ngOnInit();
    });
  }
  ngOnInit(): void {
    const authToken = localStorage.getItem('authToken');
    if (authToken != null) {
      this.AllRsvpCountPendingStatus();
    }
    this.fetchBanner();
    this.fetchHeaderSlider();
    if (localStorage.getItem('userType')) {
      this.userTypeCustomer = JSON.parse(
        localStorage.getItem('userType') || ''
      );
    }
    this.profileService.PermissionStatusUpdate$.subscribe(
      (permissionupdate: any) => {
        console.log(this.rolesManageUser, 'permissionupdate');
        this.fetchHeaderSlider();
      }
    );
    this.profileService.profileImageUpdate$.subscribe((profileImage: any) => {
      setTimeout(() => {
        this.userDetails = JSON.parse(
          localStorage.getItem('userDetails') || ''
        );
      }, 1000);
    });
    this.profileService.RsvpPendingStatusUpdate$.subscribe((RsvpCount: any) => {
      this.AllRsvpCountPendingStatus();
      this.PendingRsvpCount = RsvpCount;
    });
    this.notificationService.notificationStatusUpdate$.subscribe(
      (NotificationCounts: any) => {
        this.getNotificationCount();
        this.TotalNotiCount = NotificationCounts;
      }
    );
    if (localStorage.getItem('authToken')) {
      this.getNotificationCount();
    }
    let message = localStorage.getItem('message');
    let customerUser;
    if (localStorage.getItem('userType')) {
      customerUser = JSON.parse(localStorage.getItem('userType') || '');
    } else {
      customerUser = 'customer';
    }
    if (customerUser == 'customer') {
      this.isProfileUpdated = 'true';
    } else {
      this.isProfileUpdated = localStorage.getItem('isProfileUpdated');
    }
    this.allowBrowserLocation();
    this.initializeFilterForm();
    // this.filterForm.controls.search.valueChanges
    this.filteredOptions = this.filterForm.controls.search.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.navHeader = navOptions[this.STRINGS.userType.guestUser];
    this.navMobHeader = navMobOptions[this.STRINGS.userType.guestUser];
    if (JSON.parse(localStorage.getItem('isPassReset') || '{}') == 'true') {
    } else {
      if (localStorage.getItem('userType') && this.isProfileUpdated == 'true') {
        this.userType = JSON.parse(localStorage.getItem('userType') || '');
        this.navHeader = navOptions[this.userType];
        this.navMobHeader = navMobOptions[this.userType];
        this.getHeaderProfile();
      }
    }
  }
  allowBrowserLocation() {
    this.latitude = '';
    this.longitude = '';
    this.lat = '';
    this.lng = '';
    this.checkLocation = 'test';
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.locateCurrentLocation();
      });
    } else {
      $('#alert-modal').modal('show');
      this.sharedService.modalContent.emit({
        content: 'Geolocation is not supported by this browser',
      });
    }
  }
  private _filter(value: string): string[] {
    if (value.length < 3) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  initializeFilterForm(): any {
    this.filterForm = this.formBuilder.group({
      search: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      location: '',
      startDate: '',
      endDate: '',
    });
  }
  getHeaderProfile(): any {
    switch (this.userType) {
      case 'venuer':
        this.userProfile = userProfileOptions[this.STRINGS.userType.partner];
        if (localStorage.getItem('authToken')) {
          this.fetchOrganiserProfile();
        }
        break;
      case 'promoter':
        this.userProfile = userProfileOptions[this.STRINGS.userType.partner];
        // console.log(
        //   this.userProfile,
        //   this.STRINGS.userType.lowerCasePromoter,
        //   'promoter'
        // );
        if (localStorage.getItem('authToken')) {
          this.fetchOrganiserProfile();
        }
        break;
      case 'customer':
        this.userProfile = userProfileOptions[this.STRINGS.userType.user];
        console.log(this.userProfile, 'this.userProfile');
        if (localStorage.getItem('authToken')) {
          this.fetchOrganiserProfile();
        }
        break;
      case 'host':
        this.userProfile =
          userProfileOptions[this.STRINGS.userType.lowerCaseHost];
        if (localStorage.getItem('authToken')) {
          this.fetchOrganiserProfile();
        }
        break;
      case 'member':
        this.userProfile = userProfileOptions[this.STRINGS.userType.member];
        if (localStorage.getItem('authToken')) {
          this.fetchOrganiserProfile();
        }
        break;
      default:
    }
    if (localStorage.getItem('userType')) {
      if (
        this.userType == 'host' ||
        this.userType == 'venuer' ||
        this.userType == 'promoter'
      ) {
        this.partnerSideLogo = true;
      } else {
        this.partnerSideLogo = false;
      }
    }
  }
  oldLatitude: any;
  oldLongitude: any;
  callEventApiforAutoComplete() {
    if (
      this.options.length == 0 ||
      (this.oldLatitude !== this.latitude &&
        this.oldLongitude !== this.longitude)
    ) {
      this.fetchAllEvent();
    }
    this.oldLatitude = this.latitude;
    this.oldLongitude = this.longitude;
  }
  fetchAllEvent(): any {
    // this.utilityService.startLoader();
    this.options = [];
    let body = {
      miles: '500',
      latitude: this.latitude,
      longitude: this.longitude,
    };
    this.homeService
      .getAllEvent(body)
      .then((response: any) => {
        if (response.success) {
          response.data.forEach((element: any) => {
            this.options.push(element.name);
          });
        }
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  fetchUserProfile(): any {
    this.utilityService.startLoader();
    this.homeService
      .getUserProfile()
      .then((response: any) => {
        if (response.success) {
          this.userDetails = response.data;
          this.utilityService.stopLoader();
        }
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  fetchOrganiserProfile(): any {
    this.utilityService.startLoader();
    this.homeService
      .getOrganiserProfile()
      .then((response: any) => {
        if (response.success) {
          this.userDetails = response.data;
          this.utilityService.stopLoader();
        }
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  ngAfterViewInit(): any {
    let options = {
      types: ['(regions)'],
      componentRestrictions: { country: ['US', 'IN', 'UK'] },
    };
    this.mapsAPILoader.load().then(() => {
      const input = this.Location?.nativeElement;
      const autocomplete = new google.maps.places.Autocomplete(input, options);
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        this.filterForm.controls.location.setValue(place.formatted_address);
        this.filterForm.controls.location.updateValueAndValidity();
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.lat = place.geometry.location.lat();
        this.lng = place.geometry.location.lng();
      });
    });
  }
  submitFilterValuesOnPlaceChange() {
    const input = this.Location?.nativeElement;
    if (input?.value) {
      setTimeout(() => {
        this.submitFilterValues(true);
      }, 1000);
    } else {
      setTimeout(() => {
        this.submitFilterValues(false);
        this.filterForm.controls.location.patchValue('');
      }, 1000);
    }
  }
  backClick(): any {
    this.location.back();
  }
  openNav(): any {
    this.displayNav = true;
  }
  closeNav(): any {
    this.displayNav = false;
  }
  submitFilterValues(isSetData: boolean): any {
    if (this.filterForm.invalid) {
      return;
    }
    const startDateFormat = this.filterForm.value.startDate;
    const endDateFormat = this.filterForm.value.endDate;
    if (startDateFormat) {
      if (!endDateFormat) {
        $('#alert-modal').modal('show');
        this.sharedService.modalContent.emit({
          content: 'Please select end date',
        });
        return;
      }
    }
    const searchDetails = {
      search: this.filterForm.value.search,
      location: [this.latitude, this.longitude],
      location2: this.filterForm.value.location,
      startdate: startDateFormat
        ? moment(startDateFormat).format('YYYY-MM-DD')
        : '',
      endDate: endDateFormat ? moment(endDateFormat).format('YYYY-MM-DD') : '',
    };
    this.sharedService.filterData.emit({
      searchDetail: searchDetails,
      isSetData: isSetData,
    });
  }
  locateCurrentLocation(): any {
    this.checkLocation = 'test';
    this.mapsAPILoader.load().then(() => {
      this.filterForm.controls.location.setValue('');
      this.filterForm.controls.location.updateValueAndValidity();
      this.submitFilterValues(true);
    });
  }
  ngOnDestroy(): any {
    this.headerSubscription.unsubscribe();
    this.headerContentSubscription.unsubscribe();
    this.locationContentSubscription.unsubscribe();
  }
  logOutBtn(): any {
    this.displayNav = false;
    const myItem: any = localStorage.getItem('tokenserviceworker');
    this.utilityService.startLoader();
    const body: any = {};
    this.authService
      .logOut(body)
      .then((response: any) => {
        this.utilityService.createEventDetails.next('');
        this.utilityService.venueDetails.next('');
        localStorage.clear();
        localStorage.setItem('tokenserviceworker', myItem);
        localStorage.setItem(
          'userType',
          JSON.stringify(this.STRINGS.userType.guestUser)
        );
        this.router.navigate(['/home']);
        //this.location.back();
        this.sharedService.headerContent.emit({ isLogin: true });
        this.utilityService.stopLoader();
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  onOpenDatePicker(): any {
    this.appendFooter();
  }
  private appendFooter(): any {
    const matCalendar = document.getElementsByClassName(
      'mat-datepicker-content'
    )[0] as HTMLElement;
    matCalendar.appendChild(this.headerdatepickerFooter?.nativeElement);
  }
  dateSelection(selected: any): any {
    this.selectedDateSelection = selected;
    if (selected === this.STRINGS.header.today) {
      this.todaysDate = moment().format();
      const body = {
        startDate: moment(this.todaysDate).toDate(),
        endDate: moment(this.todaysDate).toDate(),
      };
      this.filterForm.patchValue(body);
    }
    if (selected === this.STRINGS.header.tomorrow) {
      this.TomorrowDate = moment(new Date(+new Date() + 86400000)).format();
      const body = {
        startDate: moment(this.TomorrowDate).toDate(),
        endDate: moment(this.TomorrowDate).toDate(),
      };
      this.filterForm.patchValue(body);
    }
    if (selected === this.STRINGS.header.thisWeek) {
      this.weekStartDate = moment().format();
      this.weekEndDate = moment(new Date(+new Date() + 86400000 * 6)).format();
      const body = {
        startDate: moment(this.weekStartDate).toDate(),
        endDate: moment(this.weekEndDate).toDate(),
      };
      this.filterForm.patchValue(body);
    }
  }
  getIimeDiff(DateTime: any) {
    let dateTime1 = moment(DateTime).format('YYYY-MM-DD HH:mm:ss');
    var now = moment(new Date()); //todays date
    var end = moment(dateTime1); // another date
    var duration = moment.duration(now.diff(end));
    if (Math.floor(duration.years()) > 0) {
      if (Math.floor(duration.years()) == 1) {
        return Math.floor(duration.years()) + ' year';
      } else {
        return Math.floor(duration.years()) + ' years';
      }
    } else if (Math.floor(duration.months()) > 0) {
      if (Math.floor(duration.months()) == 1) {
        return Math.floor(duration.months()) + ' month';
      } else {
        return Math.floor(duration.months()) + ' months';
      }
    } else if (Math.floor(duration.weeks()) > 0) {
      if (Math.floor(duration.weeks()) == 1) {
        return Math.floor(duration.weeks()) + ' week';
      } else {
        return Math.floor(duration.weeks()) + ' weeks';
      }
    } else if (Math.floor(duration.asDays()) > 0) {
      if (Math.floor(duration.asDays()) == 1) {
        return Math.floor(duration.asDays()) + ' day';
      } else {
        return Math.floor(duration.asDays()) + ' days';
      }
    } else if (Math.floor(duration.hours()) > 0) {
      if (Math.floor(duration.hours()) == 1) {
        return Math.floor(duration.hours()) + ' hour';
      } else {
        return Math.floor(duration.hours()) + ' hours';
      }
    } else if (Math.floor(duration.minutes()) > 0) {
      return Math.floor(duration.minutes()) + ' min';
    } else {
      return Math.floor(duration.minutes()) + ' min';
    }
  }
  @ViewChild('sidenav') sidenav: MatSidenav | any;
  opened!: boolean;
  clickHandler() {
    this.sidenav.close();
  }
  filterstep1: boolean = false;
  FilterMobileShow() {
    this.filterstep1 = !this.filterstep1;
    this.profileService.headerFilterChange$.next(this.filterstep1);
  }
  public headerconfig: SwiperOptions = {
    a11y: { enabled: true },
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: true,
    mousewheel: false,
    scrollbar: false,
    navigation: false,
    pagination: false,
    loop: true,
    autoplay: {
      delay: this.timeInterval,
      disableOnInteraction: false,
    },
  };
  fetchHeaderSlider(): any {
    this.utilityService.startLoader();
    this.PagesService.headerBannerImageSlider()
      .then((response: any) => {
        if (response.success) {
          this.utilityService.stopLoader();
          this.HeaderImageSliders = response.data;
          if (localStorage.getItem('userDetails')) {
            this.superUser = JSON.parse(
              localStorage.getItem('userDetails') || ''
            );
            let majorRoles = this.superUser.roles
              ? this.superUser.roles
              : this.superUser.user.roles || '';
            let majorRolesarray = [];
            switch (this.userType) {
              case 'venuer':
                this.userProfile =
                [
                  { title: this.STRINGS.header.manageUsers, path: '/profile/user-list' },
                  { title: this.STRINGS.header.getPaid, path: '/getpaid' },
                  { title: this.STRINGS.header.help, path: '/user/contact-us' },
                  { title: this.STRINGS.header.settings, path: '/profile/settings' },
                ];
                break;
              case 'promoter':
                this.userProfile =
                [
                  { title: this.STRINGS.header.manageUsers, path: '/profile/user-list' },
                  { title: this.STRINGS.header.getPaid, path: '/getpaid' },
                  { title: this.STRINGS.header.help, path: '/user/contact-us' },
                  { title: this.STRINGS.header.settings, path: '/profile/settings' },
                ];
                if (this.superUser.id !== this.superUser.createdBy ||  this.superUser.user.id !== this.superUser.user.createdBy

                  ) {
                  this.userProfile =  userProfileOptions[this.STRINGS.userType.partner];
                  const removeIndex = this.userProfile.findIndex(
                    (itm: any) => itm.title === 'Get Paid'
                  );
                  if (removeIndex !== -1) {
                    this.userProfile.splice(removeIndex, 1);
                  }
                  if (majorRoles.includes('user_management')) {
                    majorRolesarray.push('user_management');
                  }
                  if (majorRoles.includes('event_management')) {
                    majorRolesarray.push('event_management');
                  }
                  if (majorRoles != null) {
                    var eventKey = majorRolesarray.find(
                      (x) => x == 'event_management'
                    );
                    var userKey = majorRolesarray.find(
                      (x) => x == 'user_management'
                    );
                    if (userKey && eventKey) {
                      this.userProfile = [
                        {
                          title: this.STRINGS.header.manageUsers,
                          path: '/profile/user-list',
                        },
                        {
                          title: this.STRINGS.header.help,
                          path: '/user/contact-us',
                        },
                        {
                          title: this.STRINGS.header.settings,
                          path: '/profile/settings',
                        },
                      ];
                    } else {
                      if (userKey) {
                        this.userProfile = [
                          {
                            title: this.STRINGS.header.manageUsers,
                            path: '/profile/user-list',
                          },
                          {
                            title: this.STRINGS.header.help,
                            path: '/user/contact-us',
                          },
                          {
                            title: this.STRINGS.header.settings,
                            path: '/profile/settings',
                          },
                        ];
                      } else if (eventKey) {
                        console.log(this.rolesManageUser, 'event_management');
                        this.userProfile =
                          userProfileOptions[this.STRINGS.userType.partner];
                        console.log(this.userProfile, 'event_management');
                        const removeIndex = this.userProfile.findIndex(
                          (itm: any) => itm.title === 'Manage Users'
                        );
                        if (removeIndex !== -1) {
                          this.userProfile.splice(removeIndex, 1);
                        }
                      }
                    }
                  }
                }
             
                if (localStorage.getItem('authToken')) {
                  this.fetchOrganiserProfile();
                }
             
                break;
              case 'host':
                if (this.superUser.id !== this.superUser.createdBy) {
                  this.userProfile =
                   [
                    { title: this.STRINGS.header.getPaid, path: '/getpaid' },
                    { title: this.STRINGS.header.help, path: '/user/contact-us' },
                    { title: this.STRINGS.header.settings, path: '/profile/settings' },
                   ];
                  const removeIndex = this.userProfile.findIndex(
                    (itm: any) => itm.title === 'Get Paid'
                  );
                  if (removeIndex !== -1) {
                    this.userProfile.splice(removeIndex, 1);
                  }
                  if (majorRoles.includes('event_management')) {
                    majorRolesarray.push('event_management');
                  }
                  if (majorRoles != null) {
                    majorRolesarray.forEach((element: any) => {
                      if (element.includes('user_management')) {
                        this.rolesManageUser = element;
                        this.userProfile =
                          userProfileOptions[
                            this.STRINGS.userType.lowerCaseHost
                          ];
                      }
                    });
                  }
                }
                break;
              default:
            }
          }
          // console.log(this.userProfile, 'this.userProfile')
          if (
            this.HeaderImageSliders[0].time == null ||
            this.HeaderImageSliders[0].time == undefined ||
            this.HeaderImageSliders[0].time == 0 ||
            this.HeaderImageSliders.length == 1
          ) {
            // this.timeInterval = 3 * 1000
            $('.swiper-wrapper').addClass('disabled');
            // $('.swiper-pagination').addClass( "disabled" );
          } else {
            this.timeInterval = this.HeaderImageSliders[0].time * 1000;
            this.headerconfig = {
              a11y: { enabled: true },
              direction: 'horizontal',
              slidesPerView: 1,
              keyboard: true,
              mousewheel: false,
              scrollbar: false,
              navigation: false,
              pagination: false,
              loop: true,
              autoplay: {
                delay: this.timeInterval,
                disableOnInteraction: false,
              },
            };
          }
          this.utilityService.stopLoader();
        }
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  fetchBanner(): any {
    this.utilityService.startLoader();
    this.PagesService.topBanners()
      .then((response: any) => {
        if (response.success) {
          this.utilityService.stopLoader();
          this.topBannerContent = response.data;
          this.isActive = response.data.isActive;
          this.utilityService.stopLoader();
        }
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  AllRsvpCountPendingStatus() {
    this.utilityService.startLoader();
    this.PagesService.AllRsvpCountPending()
      .then((response: any) => {
        if (response.success) {
          this.PendingRsvpCount = response.data.RSPVPendingCount[0].count;
          this.utilityService.stopLoader();
        }
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  // Notification Implementation
  getNotifications(notificationType: any, notificationTab: any) {
    if (this.userTypeCustomer == 'customer') {
      this.notificationService
        .getUserNotification(4, 1, notificationType, notificationTab)
        .then(
          (Response: any) => {
            //console.log(Response, 'Response Response')
            if (Response.success) {
              this.notificationList = Response.data.NotificationList;
            }
          },
          (error: any) => {
            this.utilityService.routingAccordingToError;
            console.log(error);
            this.utilityService.stopLoader();
          }
        );
    } else {
      this.notificationService.getNotification(4, 1, notificationType, ``).then(
        (Response: any) => {
          //console.log(Response, 'Response Response')
          if (Response.success) {
            this.notificationList = Response.data.NotificationList;
          }
        },
        (error: any) => {
          this.utilityService.routingAccordingToError;
          console.log(error);
          this.utilityService.stopLoader();
        }
      );
    }
  }
  getNotificationCount() {
    this.utilityService.startLoader();
    this.notificationService.getNotificationCount().then(
      (Response: any) => {
        if (Response.success) {
          this.TotalNotiCount =
            Number(Response.data.eventCount.count) +
            Number(Response.data.rsvpCount.count) +
            Number(Response.data.transactionCount.count) +
            Number(Response.data.organizationCount.count);
          if (this.TotalNotiCount == 0) {
            this.clearAll = false;
          } else {
            this.clearAll = true;
          }
          this.utilityService.stopLoader();
        }
      },
      (error: any) => {
        this.utilityService.routingAccordingToError;
        console.log(error);
        this.utilityService.stopLoader();
      }
    );
  }
  readAllNotification(notificationType: any, notificationTab: any) {
    let body = {
      notificationType: notificationType,
      notificationTab: notificationTab,
    };
    this.notificationService.readAllNotification(body).then(
      (Response: any) => {
        if (Response.success) {
          this.getNotificationCount();
        }
      },
      (error: any) => {
        this.utilityService.routingAccordingToError;
        console.log(error);
      }
    );
  }
  notificationListing() {
    this.getNotifications('1,2,3,4', '');
    // this.getNotifications('') // user empty string to get latest 4 notification
  }
  clearall(event: any) {
    event.stopPropagation();
    this.readAllNotification('', '');
    this.getNotifications('4', '');
    this.clearAllString = !this.clearAllString;
  }
}
