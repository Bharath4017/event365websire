import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { localString } from '../../../shared/utils/strings';
import { ProfileService } from 'src/app/pages/profile/profile.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';


import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FunctionsService } from 'src/app/shared/utils/functions.service';
import { HttpClient } from '@angular/common/http';
import { SuccessDialogComponent } from 'src/app/dialog/success-dialog/success-dialog.component';
import { HomeService } from '../../home/home.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { MapsAPILoader } from '@agm/core';
declare let google: any;
declare let $: any;
interface Profile {

  isPhoneVerified: any;
  id: number;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  countryCode: string;
  country_code: number;
  latitude: number;
  longitude: number;
  zip: any;
  phoneNo: string;
  URL: string;
  profilePic: any;
  shortInfo: string;
  isContactVia: boolean;
  userType: string;
  contactVia: [];
}
@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UpdateProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  // Your Profile updated successfully
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  selectedCountry!: CountryISO ;
  updateProfileForm!: FormGroup;
  url = '';
  profileDetails!: Profile;
  isGuest: any = false;
  verifyemail = '../../../assets/img/checked.svg';
  // configOption1: ConfigurationOptions;
  checkboxLabel = [
    { name: 'In app only', value: '', isChecked: false },
    { name: 'Phone call', value: 'phone_calls', isChecked: false },
    { name: 'Email', value: 'email', isChecked: false },
  ];
  // checkboxValue: any = [];
  disabled: any;
  STRINGS: any = localString;
  isSubmitted: any = false;
  /* Preloaded Properties */
  // profileDetails!: Profile; // will create an interface for this
  isProfileloaded = false;
  userType!: any;
  /* Properties for profile form */
  // updateProfileForm!: FormGroup;
  isContactViaChecked = false;
  profilePic!: FormControl;
  // File Upload
  file!: File;
  imgUrl = '';
  disableEmail = true;
  // map for latitude and logngitude
  @ViewChild('searchTextField') search: ElementRef | undefined;
  @ViewChild('previewImg') previewImg!: ElementRef;
  isImageError = false;
  submitted = false;
  uploadError = '';
  errorMessage: any;
  showErrorMessage: any = false;
  // customCountryList1: CustomCountryModel[] = [];
  latitude: any = '';
  longitude: any = '';
  mapObject: any = {};
  isProfileImageExist = false;
  mobileSubscription: Subscription;
  NumberModel: any = '';
  phoneDetails: any;
  userDetails: any;
  mobileNumber: any;
  deviceInfo: any;
  ipAddress: any;
  country_Code: any;
  mobileVerification: any;
  onChangeMobileNumber: any;

  constructor(
    private sharedService: SharedService,
    private profileService: ProfileService,
    private utilityService: UtilityService,
    private mapsAPILoader: MapsAPILoader,
    public dialog: MatDialog,
    private http: HttpClient,
    private profileservice: ProfileService,
    private deviceDetectorService: DeviceDetectorService,
    private functionService: FunctionsService,
    private homeService: HomeService
  ) {
    this.mobileSubscription = this.sharedService.modalContent.subscribe((data) => {
      if (data.otp) {
        const getUserId = JSON.parse(localStorage.getItem('userDetails') || '{}');
        const userId = this.userDetails.id ? this.userDetails.id : getUserId.user.id;
        const body = {
          id: userId,
          countryCode: this.phoneDetails,
          country_code: 'us',
          phoneNo: this.mobileNumber,
          otp: data.otp,
          currencyCode: 'usd',
          deviceToken: '7fb1de907129a45ac318abefca8e7440b0d266f98f38d41d797d29871102a208',
          deviceType: this.deviceInfo.deviceType,
          platform: this.deviceInfo.browser,
          OS: this.deviceInfo.os,
          deviceId: this.functionService.getDeviceId(),
          sourceIp: this.ipAddress,

        };
        this.profileservice.verifyMobileNumber(body).then((response: any) => {
          console.log('header data', response.headers.get('Authorization'));
          localStorage.setItem('authToken', response.headers.get('Authorization' || '')
          );
          if (response.body.success) {
            this.sharedService.modalContent.emit({ content: response.body.message, modelClose: true });
            $('#success-modal').modal('show');
          }
        }).catch((error: any) => {
          console.log(error.error.message);
          this.sharedService.modalContent.emit({ message: error.error.message });
          this.utilityService.routingAccordingToError(error);
        });
      }
      if (data.resendOtp) {
        const body = {
          id: this.userDetails.id,
          countryCode: this.phoneDetails,
          phoneNo: this.mobileNumber
        };
        this.profileservice.sendOtp(body).then((response: any) => {
          if (response.success) {
            this.sharedService.modalContent.emit({ Timer: 30  });
          }
        }).catch((error: any) => {
          this.utilityService.routingAccordingToError(error);
        });
      }
    });

   // this.configOption1 = new ConfigurationOptions();
   //  this.configOption1.SelectorClass = 'WithBasic';
   //  this.configOption1.SelectorClass = 'India';
   //  this.configOption1.SortBy = SortOrderEnum.CountryName;
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.udpateProfile.pageHeadding,
      isBack: true
    });
    this.userType = JSON.parse(localStorage.getItem('userType') || '{}');
  }
  ngOnInit(): void {

  this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
  this.updateProfileForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)] ),
    email: new FormControl({value: '', disabled: true}),
    city: new FormControl({value: '', disabled: true} , [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
    // countryCode: new FormControl(''),
    state: new FormControl({value: '', disabled: true},  [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
    zip: new FormControl('', [Validators.required, Validators.pattern(/^-?([0-9]\d*)?$/), ]),
    phoneNo: new FormControl(null),
    URL: new FormControl('', [Validators.pattern('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$')] ),
    shortInfo: new FormControl('', [Validators.maxLength(250)]),
    address: new FormControl('', [Validators.maxLength(250)]),
    contactVia: new FormControl([]),
    isContactVia: new FormControl(''),
    profilePic: new FormControl(''),
  });
  this.getIPAddress();
  this.getProfile();
  this.handlePermission();

}
getIPAddress(): any {
  this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
  this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
    this.ipAddress = res.ip;
    console.log(this.deviceInfo);
  });
}
ngAfterViewInit(): any {
  this.mapsAPILoader.load().then(() => {
  const input = this.search?.nativeElement;
  const autocomplete = new google.maps.places.Autocomplete(input);
  google.maps.event.addListener(autocomplete, 'place_changed', () => {
    const place = autocomplete.getPlace();
    console.log('plece output--', place)
    // this.updateProfileForm.controls.address.setValue(place.formatted_address);
    // this.updateProfileForm.controls.address.updateValueAndValidity();
    this.mapObject.latitude = place.geometry.location.lat();
    this.mapObject.longitude = place.geometry.location.lng();
    this.latitude = place.geometry.location.lat();
    this.longitude = place.geometry.location.lng();
    let address = '';
    for (let i = 0; i < place.address_components.length; i++) {
      switch (place.address_components[i].types[0]) {
        case 'country':
          this.mapObject.country = place.address_components[i].long_name;
          break;
        case 'administrative_area_level_1':
          this.mapObject.state = place.address_components[i].long_name;
          this.updateProfileForm.controls.state.setValue(
            place.address_components[i].long_name
          );
          this.updateProfileForm.controls.state.updateValueAndValidity();
          break;
        case 'locality':
          this.mapObject.city = place.address_components[i].long_name;
          this.updateProfileForm.controls.city.setValue(
            place.address_components[i].long_name
          );
          this.updateProfileForm.controls.city.updateValueAndValidity();
          break;
        case 'postal_code':
          this.mapObject.zipcode = place.address_components[i].long_name;
          this.updateProfileForm.controls.zip.setValue(
            place.address_components[i].long_name
          );
          this.updateProfileForm.controls.zip.updateValueAndValidity();
          break;
        case 'street_number':
          address = place.address_components[i].short_name;
          break;
        case 'route':
          address += address ? ' '+ place.address_components[i].short_name : place.address_components[i].short_name;
          break;
        // case 'neighborhood':
        //   address += ', '+ place.address_components[i].long_name;
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
          this.updateProfileForm.controls.address.setValue(address);
          this.updateProfileForm.controls.address.updateValueAndValidity();
      }
    }
  });
});
}

getProfile(): void {
  this.utilityService.startLoader();
  if (this.userType === 'customer') {
    this.profileService.getUserProfile().subscribe(
      (response: any) => {
        this.utilityService.stopLoader();
        this.profileDetails = response.data;
        this.phoneDetails = this.profileDetails.countryCode;
        this.latitude = this.profileDetails.latitude;
        this.longitude = this.profileDetails.longitude;
        this.mobileVerification = {
          isPhoneVerified : this.profileDetails.isPhoneVerified,
          countryCode     : this.profileDetails.countryCode,
          phoneNo         : this.profileDetails.phoneNo

        };
        if (this.profileDetails.profilePic) {
          this.isProfileImageExist = true;
        }
        this.createFormGroup();
      },
      (error: any) => {
        this.utilityService.stopLoader();
        if (error?.error?.message) {
          this.showErrorMessage = true;
          this.errorMessage = error.error.message;
        }
        this.utilityService.routingAccordingToError(error);
      }
    );
  } else {
    this.profileService.getOrganizerProfile().subscribe(
      (response: any) => {
        this.utilityService.stopLoader();
        this.profileDetails = response.data;
        this.latitude = this.profileDetails.latitude;
        this.longitude = this.profileDetails.longitude;
        this.createFormGroup();
        this.mobileVerification = {
          isPhoneVerified : this.profileDetails.isPhoneVerified,
          countryCode     : this.profileDetails.countryCode,
          phoneNo         : this.profileDetails.phoneNo

        };

        if (this.profileDetails.isContactVia === true) {
          this.isContactViaChecked = true;
        }

        if (this.profileDetails.profilePic) {
          this.previewImg.nativeElement.src = this.profileDetails.profilePic;
          this.isProfileImageExist = true;
        }

        this.userType = this.profileDetails.userType;
        // Preparing the Array of contactVia returned by response
        const contactViaRespArray: any = [];
        const contactVia = response.data.contactVia;
        contactVia.forEach((element: any) => {
          contactViaRespArray.push(element.contactVia);
        });


        // If the checkboxLabel's value exist in contactViaRespArray, set isChecked to true
        this.checkboxLabel.forEach(element => {
          if (contactViaRespArray.includes(element.value)) {
            element.isChecked = true;
          }
        });

        if (this.profileDetails.profilePic) {
          this.previewImg.nativeElement.src = this.profileDetails.profilePic;
          this.isProfileImageExist = true;
        }

        this.createFormGroup();
      },
      (error: any) => {
        this.utilityService.startLoader();
        if (error?.error?.message) {
          this.showErrorMessage = true;
          this.errorMessage = error.error.message;
        }
        this.utilityService.routingAccordingToError(error);
        this.utilityService.stopLoader();
      }
    );
  }
}

onMobileChange(): void{
  let phoneNumber = this.mobileNumber =  this.updateProfileForm.value.phoneNo?.number;
  phoneNumber = phoneNumber?.replace(/[^+\d]+/g, '');
  phoneNumber = phoneNumber?.replace(this.phoneDetails, '');
  if (this?.mobileVerification?.countryCode !== undefined ){
    this.mobileVerification.countryCode = this?.mobileVerification?.countryCode?.replace(/[^+\d]+/g, '');
  }
  this.phoneDetails = this.updateProfileForm.value.phoneNo?.dialCode;
  if (this?.mobileVerification?.isPhoneVerified === 1){

    if (phoneNumber === this.mobileVerification.phoneNo
      && this.phoneDetails === this?.mobileVerification?.countryCode  ){
      this.profileDetails.isPhoneVerified = 1;
      this.showErrorMessage = false
    }else{
      this.profileDetails.isPhoneVerified = 0;
    }
  }
}
getLocation(): void {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      // console.log(position.coords.latitude + 'Longitude:' + position.coords.longitude);
      this.mapObject.latitude = position.coords.latitude;
      this.mapObject.longitude = position.coords.longitude;
      this.getUserCurrentLocation();
    });
  } else {
    this.dialogopen('Geolocation is not supported by this browser');
  }
}

handlePermission(): void {
  this.utilityService.startLoader();
  if( navigator.permissions && (navigator.permissions.query)){
    navigator.permissions.query({name: 'geolocation'}).then((result) => {
      if (result.state === 'granted') {
        this.report(result.state);
       // geoBtn.style.display = 'none';
        this.getLocation();
      } else if (result.state === 'prompt') {
        this.utilityService.stopLoader();
        this.report(result.state);
        this.dialogopen('Please Allow Location Click on Allow');
      } else if (result.state === 'denied') {
        this.report(result.state);
        this.utilityService.stopLoader();
        this.dialogopen('Please Allow Location or Enter Location Manually in Search Location Box');
      }
      result.onchange = (res => {
        this.report(result.state);
      });
    });
  }else{
    this.getLocation();
  }
  
}
getUserCurrentLocation(): void {
  const latitude = this.mapObject.latitude;
  const longitude = this.mapObject.longitude;
  if (latitude && longitude) {
    this.mapsAPILoader.load().then(() => {
    const googlemapPosition = new google.maps.LatLng(
      latitude,
      longitude
    );
    const googlemapsGeocoder = new google.maps.Geocoder();
    console.log(googlemapsGeocoder, 'google.maps');
    googlemapsGeocoder.geocode(
      { location: googlemapPosition },
      (results: any, status: any) => {
        console.log(results, 'results');
        // this.CurrentLocation = results[0].formatted_address;
        for (let i = 0; i < results[0].address_components.length; i++) {
          switch (results[0].address_components[i].types[0]) {
            case 'country':
              this.mapObject.country = results[0].address_components[i].short_name;
              this.selectedCountry = this.getEnumValue(this.mapObject.country);
              break;
          }
        }
      }
    );
  });
  } else {
   // this.locateMe();
  }
 }
 getEnumValue(event: any): CountryISO {
   event = event.toLowerCase();
   return Object.values(CountryISO).includes(event) ? event : null;
}
report(state: any): void {
  console.log('Permission ' + state);
}
createFormGroup(): any {
  this.phoneDetails = this.profileDetails?.countryCode?.replace(/[^+\d]+/g, '');
  this.NumberModel =  this.profileDetails?.phoneNo?.replace(this.phoneDetails, '' );
  // this.URL = new FormControl(this.profileDetails.URL);
  this.profilePic = this.profileDetails.profilePic;
  this.country_Code = 'us'; // this hard code becuase get paid functionlity work only for us
  this.updateProfileForm.patchValue({
    name: this.profileDetails.name === null || this.profileDetails.name === 'null' ? '' : this.profileDetails.name,
    email: this.profileDetails.email,
    city:  this.profileDetails.city === null || this.profileDetails.city === 'null' ? '' : this.profileDetails.city,
    state: this.profileDetails.state === null || this.profileDetails.state === 'null'? '' : this.profileDetails.state,
    zip: this.profileDetails.zip == null || this.profileDetails.zip == 'null' ? '' : this.profileDetails.zip,
    URL:  this.profileDetails.URL === null || this.profileDetails.URL === 'null' ? '' : this.profileDetails.URL,
    shortInfo: this.profileDetails.shortInfo === null || this.profileDetails.shortInfo === 'null' ? '' : this.profileDetails.shortInfo,
    address: this.profileDetails.address === null || this.profileDetails.address === 'null' ? '' : this.profileDetails.address,
    contactVia: this.profileDetails.contactVia,
    isContactVia: this.profileDetails.isContactVia,
    profilePic: this.profileDetails.profilePic,
    phoneNo: this.NumberModel? this.NumberModel: '',
  });
}
// convenience getter for easy access to form fields
get f(): any {
  return this.updateProfileForm.controls;
}
// file Upload
OnImageSelect(e: any): any {
  this.file = e.target.files[0];
  if (
    this.file.type === 'image/png' ||
    this.file.type === 'image/jpeg' ||
    this.file.type === 'image/jpg'
  ) {
    this.isProfileImageExist = true;
    // this.previewImg.nativeElement.src = window.URL.createObjectURL(this.file);
    this.updateProfileForm.patchValue({ profilePic: this.file });

    // this.updateProfileForm.value('profilePic').updateValueAndValidity();
    // console.log( 'profile image', URL.createObjectURL(this.file) )
    // this.profileDetails.profilePic = URL.createObjectURL(this.file);
    const reader = new FileReader();
    reader.onload = e => this.profileDetails.profilePic = reader.result;
    reader.readAsDataURL(this.file);
  } else {
    this.dialogopen('Please upload jpeg or png image');
  }
}
showValidationMsg(formGroup: FormGroup): void {
  for (const key in formGroup.controls) {
    if (formGroup.controls.hasOwnProperty(key)) {
      const control: FormControl = formGroup.controls[key] as FormControl;
      if (Object.keys(control).includes('controls')) {
        const formGroupChild: FormGroup = formGroup.controls[key] as FormGroup;
        this.showValidationMsg(formGroupChild);
      }
      control.markAsTouched();
    }
  }
}

updateProfile(): void {
  this.showValidationMsg(this.updateProfileForm);
  this.mobileNumber = this.updateProfileForm.value?.phoneNo?.number;
  this.mobileNumber = this.mobileNumber?.replace(/[^+\d]+/g, '');
  if (this.updateProfileForm.invalid) {
    this.isSubmitted = true;
    if (this.updateProfileForm.controls.phoneNo.status === 'INVALID'){
      this.showErrorMessage = true;
      return;
   }
    return;
  }
  if (this.latitude === '' && this.longitude === '') {
    this.dialogopen(this.STRINGS.alert.validLatLong);
    return;
  }
  this.utilityService.startLoader();
  const formData = new FormData();
  formData.append('name', this.updateProfileForm.controls.name.value);
  formData.append('email', this.updateProfileForm.controls.email.value);
  formData.append('city', this.updateProfileForm.controls.city.value);
  if (this.phoneDetails !== null && this.phoneDetails !== undefined ){
  formData.append('countryCode', this.phoneDetails);
  }
  formData.append(
    'country_code',
    this.country_Code ? this.country_Code : ''
  );
  formData.append('state', this.updateProfileForm.controls.state.value);
  formData.append('zip', this.updateProfileForm.controls.zip.value);
  if (this.mobileNumber !== null && this.mobileNumber !== undefined ){
    formData.append('phoneNo', this.mobileNumber);
  }
  formData.append('URL', this.updateProfileForm.controls.URL.value);
  formData.append('address', this.updateProfileForm.controls.address.value);
  formData.append(
    'shortInfo',
    this.updateProfileForm.controls.shortInfo.value
  );
  formData.append(
    'isContactVia',
    this.updateProfileForm.controls.isContactVia.value
  );
  formData.append(
    'profilePic',
    this.updateProfileForm.controls.profilePic.value
  );
  this.latitude ? formData.append('latitude', this.latitude) :  '';
  this.longitude ? formData.append('longitude', this.longitude) : '';
  this.mapObject.country ? formData.append('countryName', this.mapObject.country) : '';

  const checkboxValue: any = [];
  this.checkboxLabel.forEach(element => {
    if (element.isChecked) {
      checkboxValue.push(element.value);
    }
  });

  formData.append('contactVia', JSON.stringify(checkboxValue));
  formData.append('deviceId', '');
  if (this.userType !== 'customer') {
    this.profileService.postOrganiserProfileUpdate(formData).subscribe(
      (response: any) => {
        this.utilityService.stopLoader();
        if (response.code === 200) {
          this.getUpdateUserProfile();
          this.successDialogopen('Your Profile updated successfully');
          const profileImage: any = this.file;
          this.profileService.profileImageUpdate$.next( profileImage);

        }
      },
      (error) => {
        this.dialogopen(error.error.message);
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      }
    );
  } else if (this.userType === 'customer') {
    this.profileService.postUserProfileUpdate(formData).subscribe(
      (response: any) => {
        this.utilityService.stopLoader();
        if (response.code === 200) {
          this.getUpdateUserProfile();
          this.successDialogopen('Your Profile updated successfully');
          const profileImage: any = this.file;
          this.profileService.profileImageUpdate$.next( profileImage);
          // this.dialogopen();
        }
      },
      (error) => {
        this.dialogopen(error.error.message);
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      }
    );
  }
}

getUpdateUserProfile(): any {
  const userType = JSON.parse(localStorage.getItem('userType') || '{}');
  if (userType == 'customer'){
   this.utilityService.startLoader();
   this.homeService.getUserProfile()
     .then((response: any) => {
       if (response.success) {
         localStorage.setItem('userDetails', JSON.stringify(response.data));
         this.utilityService.stopLoader();
       }

     })
     .catch((error: any) => {
       this.utilityService.stopLoader();
       this.utilityService.routingAccordingToError(error);
     });
  }else{
   this.utilityService.startLoader();
   const getUserId = JSON.parse(localStorage.getItem('userDetails') || '{}');
   const userId = this.userDetails.id ? this.userDetails.id : getUserId.user.id;
   this.homeService.getUserProfileById(userId)
     .then((response: any) => {
       if (response.success) {
         localStorage.setItem('userDetails', JSON.stringify(response.data));
         this.utilityService.stopLoader();
       }

     })
     .catch((error: any) => {
       this.utilityService.stopLoader();
       this.utilityService.routingAccordingToError(error);
     });
  }

 }

dialogopen(message: any): void {
  const dialogRef = this.dialog.open(AlertdialogComponent, {
    width: '420px',
    data: {
      name: message,
    },
    panelClass: 'custom_dilog',
  });
}

// On change of contactVia checkbox, update the isChecked status
toggleContactViaCheckbox(event: any, element: string): void {
  if (event.checked) {
    this.checkboxLabel.forEach(checkboxLabelElement => {
      if (checkboxLabelElement.value === element) {
        checkboxLabelElement.isChecked = true;
      }
    });
  } else {
    this.checkboxLabel.forEach(checkboxLabelElement => {
      if (checkboxLabelElement.value === element) {
        checkboxLabelElement.isChecked = false;
      }
    });
  }
}

verifyMobile(): void {
  if (this.updateProfileForm.controls.phoneNo.status === 'INVALID'){
     this.showErrorMessage = true;
     return;
  }
  if(this.updateProfileForm.value.phoneNo.dialCode === ''){
    this.showErrorMessage = true;
    this.errorMessage = 'Please select country code.';
    return;
  }
  this.mobileNumber = this.updateProfileForm.value.phoneNo.number;
  this.mobileNumber = this.mobileNumber.replace(/[^+\d]+/g, '');
  console.log(this.mobileNumber);
  const body = {
    id: this.userDetails.id ?  this.userDetails.id : this.userDetails.user.id,
    countryCode: this.updateProfileForm.value.phoneNo.dialCode,
    phoneNo: this.mobileNumber
  };
  console.log(body);
  this.profileservice.sendOtp(body).then((response: any) => {
    if (response.success) {
      this.showErrorMessage = false;
      const showNumber = this.mobileNumber.substr((this.mobileNumber.length - 4), this.mobileNumber.length);
      $('#mobile-verification').modal('show');
      this.sharedService.modalContent.emit({ contactNum: showNumber });
      this.showErrorMessage = false;
    }
  }).catch((error: any) => {
    this.errorMessage = error.error.message;
    console.log(this.errorMessage);
    this.showErrorMessage = true;
    this.utilityService.routingAccordingToError(error);
  });
}
onNumberChange(outputResult: any): any {
  console.log(outputResult);
  console.log('call onNumberChange');
  this.phoneDetails = outputResult.CountryModel.CountryPhoneCode;
  this.NumberModel = outputResult.Number;
  this.country_Code = outputResult.CountryModel.ISOCode;
}

successDialogopen(name: any): void {
  const dialogRef = this.dialog.open(SuccessDialogComponent, {
    width: '460px',
    data: {
      message: name,
    },
    panelClass: 'custom_dilog',
  });
}
ngOnDestroy(): any {
  this.mobileSubscription.unsubscribe();
}
}
