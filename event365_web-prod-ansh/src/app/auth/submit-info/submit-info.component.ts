import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { localString } from '../../shared/utils/strings';
import { Router } from '@angular/router';
import { ProfileService } from '../../pages/profile/profile.service';
import { UtilityService } from '../../shared/services/utility.service';
import { SharedService } from '../../shared/shared.service';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { FunctionsService } from '../../shared/utils/functions.service';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { MapsAPILoader } from '@agm/core';
declare let google: any;
declare let $: any;
@Component({
  selector: 'app-submit-info',
  templateUrl: './submit-info.component.html',
  styleUrls: ['./submit-info.component.scss'],
})
export class SubmitInfoComponent implements OnInit, AfterViewInit {
  STRINGS: any = localString;
  infoForm!: FormGroup;
  isSubmitted: any = false;
  userDetails: any;
  userType:any;
  errorMessage: any;
  showErrorMessage: any = false;
  @ViewChild('searchTextField') search: ElementRef | undefined;
  mapObject: any = {
    country: '',
    state: '',
    city: '',
    street: '',
    zipcode: '',
    latitude: '',
    longitude: ''
  };
  ipAddress = '';
  deviceInfo!: DeviceInfo;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private profileService: ProfileService,
    private utilityService: UtilityService,
    private sharedService: SharedService,
    private http: HttpClient,
    private deviceDetectorService: DeviceDetectorService,
    private functionService: FunctionsService,
    private mapsAPILoader: MapsAPILoader,
  ) {
    this.sharedService.headerLayout.emit({ headerSize: this.STRINGS.headerSize.medium });
    if (localStorage.getItem('userDetails')) {
      this.userDetails = JSON.parse(
        localStorage.getItem('userDetails') || '{}'
      );
    }
    if (localStorage.getItem('userType')) {
      this.userType = JSON.parse(localStorage.getItem('userType') || '');
    }
  }

  ngOnInit(): void {
    this.getIPAddress();
    this.infoForm = this.formBuilder.group({
      address: ['', [Validators.required, Validators.maxLength(150)]],
      // Validators.pattern('^[a-zA-Z \-\']+')]
      // Validators.pattern('^[a-zA-Z \-\']+')]
      city: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      zip: [ '', [Validators.required,Validators.minLength(4),Validators.maxLength(10),Validators.pattern(/^-?([0-9]\d*)?$/)]],
    });
  }
  ngAfterViewInit(): any {
    this.mapsAPILoader.load().then(() => {
    const input = this.search?.nativeElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      // console.log('plece output--', place)
      // this.infoForm.controls.address.setValue(place.formatted_address);
      // this.infoForm.controls.address.updateValueAndValidity();
      this.mapObject.latitude = place.geometry.location.lat();
      this.mapObject.longitude = place.geometry.location.lng();
      let address = '';
      for (let i = 0; i < place.address_components.length; i++) {
        switch (place.address_components[i].types[0]) {
          case 'country':
            this.mapObject.country = place.address_components[i].long_name;
            break;
          case 'administrative_area_level_1':
            this.mapObject.state = place.address_components[i].long_name;
            this.infoForm.controls.state.setValue(
              place.address_components[i].long_name
            );
            this.infoForm.controls.state.updateValueAndValidity();
            break;
          case 'locality':
            this.mapObject.city = place.address_components[i].long_name;
            this.infoForm.controls.city.setValue(
              place.address_components[i].long_name
            );
            this.infoForm.controls.city.updateValueAndValidity();
            break;
          case 'postal_code':
            this.mapObject.zipcode = place.address_components[i].long_name;
            this.infoForm.controls.zip.setValue(
              place.address_components[i].long_name
            );
            this.infoForm.controls.zip.updateValueAndValidity();
            break;
          case 'street_number':
            address = place.address_components[i].short_name;
            break;
          case 'route':
            address += address ? ' '+ place.address_components[i].short_name : place.address_components[i].short_name;
            break;
          // case 'neighborhood':
          //   address += ', '+ place.address_components[i].short_name;
          //   break;
          case 'sublocality_level_3':
            address += address ? ', '+ place.address_components[i].short_name : place.address_components[i].short_name;
            break;
          case 'sublocality_level_2':
            address += address ? ', '+ place.address_components[i].short_name : place.address_components[i].short_name ;
            break;
          case 'sublocality_level_1':
            address += address ? ', '+ place.address_components[i].short_name : place.address_components[i].short_name;
            break;
          default:
            // console.log('address', address);
            this.infoForm.controls.address.updateValueAndValidity();
            this.infoForm.controls.address.setValue(address);
           
        }
      }
    });
  });
  }
  submitDetails(): any {
    if (this.infoForm.invalid) {
      this.isSubmitted = true;
      return;
    }
    if (this.mapObject.latitude === '' && this.mapObject.longitude === '') {
      $('#alert-modal').modal('show');
      this.sharedService.modalContent.emit({ content: this.STRINGS.alert.validLatLong });
      return;
    }
    this.utilityService.startLoader();
    let body: any = {
      address: this.infoForm.value.address,
      city: this.infoForm.value.city,
      state: this.mapObject.state,
      zip: this.infoForm.value.zip,
      latitude: this.mapObject.latitude,
      longitude: this.mapObject.longitude,
      countryName: this.mapObject.country,
      contactVia: JSON.stringify(['email'])
    };
    const formData: any = new FormData();
    if (this.userDetails?.user?.userType == 'customer' && this.userType == 'customer' ) {
      body = {
        ...body,
        deviceToken: '7fb1de907129a45ac318abefca8e7440b0d266f98f38d41d797d29871102a208',
        deviceType: this.deviceInfo.deviceType,
        platform: this.deviceInfo.browser,
        OS: this.deviceInfo.os_version,
        deviceId: this.functionService.getDeviceId(),
        // deviceId: window.navigator.userAgent.replace(/\D+/g, ''),
        // deviceId: this.deviceInfo.browser_version,
        sourceIp: this.ipAddress
      };
    }
    // tslint:disable-next-line:forin
    for (const key in body) {
      formData.append(key, body[key]);
    }
    if (this.userDetails?.user?.userType !== 'customer' || this.userType !== 'customer') {
      this.profileService
        .postOrganiserUpdateProfile(formData)
        .then((response: HttpResponse<any>) => {
          if (response.headers.get('Authorization')) {
            localStorage.setItem(
              'authToken',
              response.headers.get('Authorization') || ''
            );
          }
          // console.log('api call2', this.userDetails.user.userType ===
          // this.STRINGS.userType.lowerCaseVenuer)
          // if ( 
          //   this.userDetails.user.userType ===
          //   this.STRINGS.userType.lowerCaseVenuer
          // ) {
          //   console.log('condtion true')
          //   this.router.navigate(['/auth/account-creation']);
          //   this.sharedService.headerContent.emit({ isLogin: true });

          //   //  this.router.navigate(['venue/create']);
          // } else {
          //   console.log('condtion false')
          //   this.router.navigate(['/auth/account-creation']);
          //   this.sharedService.headerContent.emit({ isLogin: true });

          // }
          localStorage.setItem('isProfileUpdated', 'true');
          this.router.navigate(['/auth/account-creation']);
          this.utilityService.stopLoader();
        })
        .catch((error: any) => {
          this.utilityService.stopLoader();
          this.utilityService.routingAccordingToError(error);
        });
    } else if (this.userDetails?.user?.userType == 'customer' || this.userType == 'customer') {
      this.profileService
        .postUserUpdateProfile(formData)
        .then((response: HttpResponse<any>) => {
          if (response.headers.get('Authorization')) {
            localStorage.setItem(
              'authToken',
              response.headers.get('Authorization') || ''
            );
          }
          this.router.navigate(['/auth/user-account-creation']);
          this.sharedService.headerContent.emit({ isLogin: true });
          this.utilityService.stopLoader();
        })
        .catch((error: any) => {
          this.utilityService.stopLoader();
          this.utilityService.routingAccordingToError(error);
        });
    }
  }
  getIPAddress(): any {
    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  skipSubmitInfo(): any {
    this.router.navigate(['/auth/user-account-creation']);
  }
  integerOnly(event: any): void {
    const e = event as KeyboardEvent;
    if (e.key === 'Tab' || e.key === 'TAB') {
        return;
    }
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(e.key) === -1) {
        e.preventDefault();
    }
}
}
