import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { localString } from '../../shared/utils/strings';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { AuthService } from '../auth.service';
import { UtilityService } from '../../shared/services/utility.service';
import { SharedService } from '../../shared/shared.service';
import { HttpClient } from '@angular/common/http';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { FunctionsService } from '../../shared/utils/functions.service';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LowerCasePipe } from '@angular/common';
declare let $: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [LowerCasePipe],
})
export class RegisterComponent implements OnInit {
  isSubmitted: any = false;
  registerForm!: FormGroup;
  STRINGS: any = localString;
  isRegisterUser: any = true;
  userType: any = 1;
  partnerType: any = this.STRINGS.userType.lowerCaseVenuer;
  user!: SocialUser;
  fieldTextType!: boolean;
  isSelectPartner: any = false;
  becomepartner: any;
  partnerTypeValue: any = {
    [this.STRINGS.userType.lowerCaseVenuer]: this.STRINGS.userType.venueOwner,
    [this.STRINGS.userType.lowerCaseHost]: this.STRINGS.userType.host,
    [this.STRINGS.userType.lowerCasePromoter]: this.STRINGS.userType.promoter,
  };
  ipAddress = '';
  deviceInfo!: DeviceInfo;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private socialAuthService: SocialAuthService,
    private authService: AuthService,
    private utilityService: UtilityService,
    private sharedService: SharedService,
    private http: HttpClient,
    private deviceDetectorService: DeviceDetectorService,
    private functionService: FunctionsService,
    private lowerCasePipe: LowerCasePipe
  ) {
    this.sharedService.headerLayout.emit({ headerSize: this.STRINGS.headerSize.medium });
    this.becomepartner = this.route.snapshot.paramMap.get('partner');
  }
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern('^[a-zA-Z0-9_ ]*$')]],
      email: [
        null,
        [Validators.required, Validators.email,  Validators.maxLength(50)],
      ],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*\d).{8,30}$/)]],
    });
    this.socialAuthService.authState.subscribe((user: any) => {
      this.user = user;
    });
    this.getIPAddress();
    localStorage.removeItem('authToken');
    localStorage.removeItem('userDetails');
    if (this.becomepartner){
      this.selectUserRegister(2);
    }
  }

  selectUserRegister(type: any): any {
    this.registerForm.reset();
    this.isSubmitted = false;
    this.isSelectPartner = false;
    this.partnerType = this.STRINGS.userType.lowerCaseVenuer;
    if (type === 1) {
      this.isRegisterUser = true;
      this.userType = type;
    } else {
      this.isSelectPartner = true;
      this.isRegisterUser = false;
      this.userType = type;
    }
  }
  selectPartnerType(type: any): any {
    this.isSelectPartner = true;
    this.partnerType = type;
  }
  submitPartnerType(): any {
    if (this.partnerType) {
      this.userType = 1;
    }
  }
  submitdetails(): any {
    if (this.registerForm.invalid) {
      this.isSubmitted = true;
      return;
    }
    this.utilityService.startLoader();
    this.isSubmitted = false;
    const userRole =
      this.partnerType && this.isSelectPartner && this.userType === 1
        ? this.partnerType
        : this.STRINGS.userType.lowercaseUser;
    let body = {};
    body = {
      name: this.registerForm.value.name,
      email: this.lowerCasePipe.transform(this.registerForm.value.email),
      password: this.registerForm.value.password,
    };
    if (this.partnerType && this.isSelectPartner && this.userType === 1) {
      body = {
        ...body,
        userType: userRole,
      };
      localStorage.removeItem('isPassReset');
      this.authService
        .postOrganiserSignup(body)
        .then((response: any) => {
          if (response.success) {
            response.data['userEmail'] = this.lowerCasePipe.transform(this.registerForm.value.email);
            response.data['userType'] = userRole;
            localStorage.setItem('userDetails', JSON.stringify(response.data));
            this.router.navigate(['/auth/email-verification']);
            this.utilityService.stopLoader();
          }
        })
        .catch((error: any) => {
          this.utilityService.stopLoader();
          if (error.error.message.includes('email already exists')) {
            $('#alert-modal').modal('show');
            this.sharedService.modalContent.emit({ content: this.STRINGS.alert.accountAlreadyExists });
          }
          this.utilityService.routingAccordingToError(error);
        });
    } else if (!(this.partnerType && this.isSelectPartner && this.userType === 1)) {
      this.authService
        .postUserSignup(body)
        .then((response: any) => {
          if (response.success) {
            response.data['userEmail'] = this.registerForm.value.email;
            localStorage.setItem('userDetails', JSON.stringify(response.data));
            this.router.navigate(['/auth/email-verification']);
            this.utilityService.stopLoader();
          }
        })
        .catch((error: any) => {
          this.utilityService.stopLoader();
          if (error.error.message.includes('email already exists')) {
            $('#alert-modal').modal('show');
            this.sharedService.modalContent.emit({ content: this.STRINGS.alert.accountAlreadyExists });
          }
          this.utilityService.routingAccordingToError(error);
        });
    }
  }
  signInWithFB(): any {
    this.socialAuthService
      .signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((data) => {
        if (data) {
          this.socialLoginApi(data);
        }
      });
  }
  signInWithGoogle(): any {
    this.socialAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((data) => {
        if (data) {
          this.socialLoginApi(data);
        }
      });
  }

  showpassword(): any {
    this.fieldTextType = !this.fieldTextType;
  }

  socialLoginApi(data: any): any {
    const userRole =
      this.partnerType && this.userType === 1 && this.isSelectPartner
        ? this.partnerType
        : this.STRINGS.userType.lowercaseUser;
    const body = {
      name: data.name,
      email: data.email,
      socailUserId: data.id,
      loginType: data.provider,
      deviceToken: '7fb1de907129a45ac318abefca8e7440b0d266f98f38d41d797d29871102a208',
      deviceType: this.deviceInfo.deviceType ? this.deviceInfo.deviceType : '',
      platform: this.deviceInfo.browser ? this.deviceInfo.browser : '',
      OS: this.deviceInfo.os_version ? this.deviceInfo.os_version : '',
      deviceId: this.functionService.getDeviceId(),
      // deviceId: window.navigator.userAgent.replace(/\D+/g, ''),
      // deviceId: this.deviceInfo.browser_version ? this.deviceInfo.browser_version : '',
      sourceIp: this.ipAddress ? this.ipAddress : '',
      userType: userRole
    };
    localStorage.removeItem('isPassReset');
    this.authService
      .postSocialLogin(body)
      .then((response: any) => {
        localStorage.setItem(
          'authToken',
          response.headers.get('Authorization' || '')
        );
        if (response.body.data.userType) {
          localStorage.setItem('userType',JSON.stringify(response.body.data.userType));
          localStorage.setItem('isProfileUpdated', response.body.data.isProfileUpdated);

        } else {
          localStorage.setItem('userType', JSON.stringify(response.body.data.user.userType));
          localStorage.setItem('isProfileUpdated', response.body.data.isProfileUpdated);
        }
        // localStorage.setItem('userDetails', JSON.stringify(response.body.data));
        // localStorage.setItem('isProfileUpdated', response.body.data.isProfileUpdated);
        // this.sharedService.headerContent.emit({ isLogin: true });
        // this.utilityService.stopLoader();
        // this.router.navigate(['/home']);
        if(response.body.data.userType == 'customer'){
          localStorage.setItem('userDetails', JSON.stringify(response.body.data));
          this.sharedService.headerContent.emit({ isLogin: true });
          this.router.navigate(['home']);
          this.utilityService.stopLoader();
        }else{
          if(response.body.data.isProfileUpdated){
            localStorage.setItem('userDetails', JSON.stringify(response.body.data));
            this.router.navigate(['home']);
            this.sharedService.headerContent.emit({ isLogin: true });
            this.utilityService.stopLoader();
            
          }else{
            localStorage.setItem('userDetails', JSON.stringify(response.body.data));
            this.router.navigate(['auth/submit-info']);
            this.utilityService.stopLoader();
          }
        }
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.dialogopen(error.error.message);
        if (error.status === 435) {
          localStorage.setItem(
            'authToken',
            error.headers.get('Authorization') || ''
          );
          localStorage.setItem('userDetails', JSON.stringify(error.error.data));
        }
        localStorage.setItem(
          'userType',
          JSON.stringify(error.error.data.userType)
        );
        const loginError = error.error.message.toLowerCase();
        if (loginError.includes('update your profile')) {
          this.router.navigate(['auth/submit-info']);
        }
        if (error.error.message.includes('Please Choose Recommended !')) {
          this.router.navigate(['/auth/user-account-creation']);
        }
        if (error.error.message.includes('email already exists')) {
          $('#alert-modal').modal('show');
          this.sharedService.modalContent.emit({ content: this.STRINGS.alert.accountAlreadyExists });
        }
        this.utilityService.routingAccordingToError(error);
      });
  }
  getIPAddress(): any {
    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  dialogopen(name: any): void {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: '420px',
      data: {
        name: name,
      },
      panelClass: 'custom_dilog',
    });
  }
}
