import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';

import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';

import { localString } from '../../shared/utils/strings';
import { AuthService } from '../../auth/auth.service';
import { UtilityService } from '../../shared/services/utility.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
import { FunctionsService } from '../../shared/utils/functions.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginDialogComponent implements OnInit {
  loginForm!: FormGroup;
  STRINGS: any = localString;
  validations: any;
  isSubmitted: any = false;
  fieldTextType!: boolean;
  user!: SocialUser;
  socialgoogle = '../../../assets/img/google@2x.png';
  socialfb = '../../../assets/img/facebook@2x.png';
  socialiphone = '../../../assets/img/AppleId.png';
  matSpinner = false;
  // ipAddress
  ipAddress = '';
  // deviceinfo
  deviceInfo!: DeviceInfo;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private socialAuthService: SocialAuthService,
    private sharedService: SharedService,
    private authService: AuthService,
    private utilityService: UtilityService,
    private deviceDetectorService: DeviceDetectorService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private functionService: FunctionsService,
    private location: Location
  ) {
  }
  ngOnInit(): void {
    this.getIPAddress();
    this.loginForm = this.fb.group({
      email: [
        null,
        [Validators.required, Validators.email, Validators.maxLength(50)],
      ],
      password: [null, [Validators.required]],
    });
    this.socialAuthService.authState.subscribe((user: any) => {
      this.user = user;
    });
    localStorage.clear();
    this.createForm();
  }

  // tslint:disable-next-line:max-line-length

  signInWithFB(): any {
    this.socialAuthService
      .signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((token) => {
        if (token) {
          this.socialLoginApi(token);
        }
      });
  }
  signInWithGoogle(): any {
    this.socialAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((token) => {
        if (token) {
          this.socialLoginApi(token);
        }
      });
  }

  showpassword(): any {
    this.fieldTextType = !this.fieldTextType;
  }
  closeDialog() {
    this.dialogRef.close();
  }
  // socialLoginApi(token: any): any {
  //   const body = {
  //     name: token.name,
  //     email: token.email,
  //     socailUserId: token.id,
  //     loginType: token.provider,
  //     deviceToken: '7fb1de907129a45ac318abefca8e7440b0d266f98f38d41d797d29871102a208',
  //     deviceType: this.deviceInfo.deviceType ? this.deviceInfo.deviceType : '',
  //     platform: this.deviceInfo.browser ? this.deviceInfo.browser : '',
  //     OS: this.deviceInfo.os_version ? this.deviceInfo.os_version : '',
  //   //  deviceId: window.navigator.userAgent.replace(/\D+/g, ''),
  //     deviceId: this.functionService.getDeviceId(),
  //     // deviceId: this.deviceInfo.browser_version ? this.deviceInfo.browser_version : '',
  //     sourceIp: this.ipAddress ? this.ipAddress : '',
  //   };
  //   this.authService
  //     .postSocialLogin(body)
  //     .then((response: any) => {
  //       localStorage.setItem(
  //         'authToken',
  //         response.headers.get('Authorization' || '')
  //       );
  //       if (response.body.data.userType) {
  //         localStorage.setItem(
  //           'userType',
  //           JSON.stringify(response.body.data.userType)
  //         );
  //       } else {
  //         localStorage.setItem('userType', JSON.stringify('host'));
  //       }
  //       localStorage.setItem('userDetails', JSON.stringify(response.body.data));
  //       this.matSpinner = false;
  //       this.dialogRef.close();
  //       //window.location.reload();
  //     })
  //     .catch((error: any) => {
  //       this.matSpinner = false;
  //       this.dialogopen(error.error.message);
  //       if (error.headers.get('Authorization')) {
  //         localStorage.setItem(
  //           'authToken',
  //           error.headers.get('Authorization' || '')
  //         );
  //         localStorage.setItem('userDetails', JSON.stringify(error.error.data));
  //         localStorage.setItem(
  //           'userType',
  //           JSON.stringify(error.error.data.userType)
  //         );
  //       } else {
  //         localStorage.clear();
  //       }
  //       localStorage.setItem('message', error.error.message);
  //       const loginError = error.error.message.toLowerCase();
  //       if (error.error.message && error.error.message.includes('OTP has been sent please check your email')) {
  //         this.dialogRef.close();
  //         this.router.navigate(['/auth/email-verification']);
  //       }
  //       if (loginError.includes('update your profile')) {
  //         this.dialogRef.close();
  //         this.router.navigate(['auth/submit-info']);
  //       }
  //       if (error.error.message.includes('Please Choose Recommended !')) {
  //         this.dialogRef.close();
  //         this.router.navigate(['/auth/user-account-creation']);
  //       }
  //       if (
  //         loginError.includes(
  //           'Your profile has been blocked, contact to administrator'
  //         )
  //       ) {
  //         this.dialogRef.close();
  //         this.dialog;
  //       }
  //       if (loginError.includes('incorrect password')) {
  //         this.dialog;
  //       }
  //       this.utilityService.routingAccordingToError(error);
  //     });
  // }
  socialLoginApi(token: any): any {
    const body = {
      name: token.name,
      email: token.email,
      socailUserId: token.id,
      loginType: token.provider,
      deviceToken: '7fb1de907129a45ac318abefca8e7440b0d266f98f38d41d797d29871102a208',
      deviceType: this.deviceInfo.deviceType ? this.deviceInfo.deviceType : '',
      platform: this.deviceInfo.browser ? this.deviceInfo.browser : '',
      OS: this.deviceInfo.os_version ? this.deviceInfo.os_version : '',
      //  deviceId: window.navigator.userAgent.replace(/\D+/g, ''),
      deviceId: this.functionService.getDeviceId(),
      // deviceId: this.deviceInfo.browser_version ? this.deviceInfo.browser_version : '',
      sourceIp: this.ipAddress ? this.ipAddress : '',
    };
    this.authService
      .postSocialLogin(body)
      .then((response: any) => {
        localStorage.setItem(
          'authToken',
          response.headers.get('Authorization' || '')
        );
        if (response.body.data.userType) {
          localStorage.setItem('userType', JSON.stringify(response.body.data.userType));
          localStorage.setItem('isProfileUpdated', response.body.data.isProfileUpdated);
        } else {
          localStorage.setItem('userType', JSON.stringify(response.body.data.user.userType));
          localStorage.setItem('isProfileUpdated', response.body.data.isProfileUpdated);
        }
        // localStorage.setItem('userDetails', JSON.stringify(response.body.data));
        // this.sharedService.headerContent.emit({ isLogin: true });
        // this.utilityService.stopLoader();
        // console.log(response.body.data)
        // this.router.navigate(['home']);
       // console.log('socialLoginApi', response)
        if (response.body.data.userType == 'customer') {
          localStorage.setItem('userDetails', JSON.stringify(response.body.data));
          this.sharedService.headerContent.emit({ isLogin: true });
          this.refreshPreviousPage();
          this.utilityService.stopLoader();
          this.closeDialog();
        } else {
          if (response.body.data.isProfileUpdated) {
            localStorage.setItem('userDetails', JSON.stringify(response.body.data));
            this.refreshPreviousPage();
            this.sharedService.headerContent.emit({ isLogin: true });
            this.utilityService.stopLoader();
            this.closeDialog();
          } else {
            localStorage.setItem('userDetails', JSON.stringify(response.body.data));
            this.router.navigate(['auth/submit-info']);
            this.utilityService.stopLoader();
            this.closeDialog();
          }
        }
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.dialogopen(error.error.message);
        if (error.headers.get('Authorization')) {
          localStorage.setItem(
            'authToken',
            error.headers.get('Authorization' || '')
          );
          localStorage.setItem('userDetails', JSON.stringify(error.error.data));
          localStorage.setItem(
            'userType',
            JSON.stringify(error.error.data.userType)
          );
        } else {
          localStorage.clear();
        }
        localStorage.setItem('message', error.error.message);
        const loginError = error.error.message.toLowerCase();
        if (error.error.message && error.error.message.includes('OTP has been sent please check your email')) {
          this.router.navigate(['/auth/email-verification']);
        }
        if (loginError.includes('update your profile')) {
          this.router.navigate(['/auth/submit-info']);
        }
        if (error.error.message.includes('Please Choose Recommended !')) {
          this.router.navigate(['/auth/user-account-creation']);
        }
        if (
          loginError.includes(
            'Your profile has been blocked, contact to administrator'
          )
        ) {
          this.closeDialog();
          this.dialog;
        }
        if (loginError.includes('incorrect password')) {
          this.dialog;
        }
        this.utilityService.routingAccordingToError(error);
      });
  }


  createForm(): any {
    this.loginForm = this.fb.group({
      email: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.email])
      ),
      password: new FormControl('', Validators.compose([Validators.required])),
      deviceToken: new FormControl(
        '7fb1de907129a45ac318abefca8e7440b0d266f98f38d41d797d29871102a208'
      ),
      deviceType: new FormControl(this.deviceInfo.deviceType),
      platform: new FormControl(this.deviceInfo.browser),
      OS: new FormControl(this.deviceInfo.os_version),
      deviceId: new FormControl(this.deviceInfo.browser_version),
      sourceIp: new FormControl(this.ipAddress),
    });
  }

  // submitForm(): any {
  //   this.utilityService.startLoader();
  //   let loginError = '';
  //   const body = {
  //     email: this.loginForm.value.email,
  //     password: this.loginForm.value.password,
  //     deviceToken:
  //       '7fb1de907129a45ac318abefca8e7440b0d266f98f38d41d797d29871102a208',
  //     deviceType: this.deviceInfo.deviceType,
  //     platform: this.deviceInfo.browser,
  //     OS: this.deviceInfo.os_version,
  //     deviceId: this.functionService.getDeviceId(),
  //     // deviceId: window.navigator.userAgent.replace(/\D+/g, ''),
  //     sourceIp: this.ipAddress,
  //   };
  //   this.authService
  //     .postCommonLogin(body)
  //     .then((response: any) => {
  //       localStorage.setItem(
  //         'authToken',
  //         response.headers.get('Authorization' || '')
  //       );
  //       if (response.body.data.userType) {
  //         localStorage.setItem(
  //           'userType',
  //           JSON.stringify(response.body.data.userType));
  //           localStorage.setItem('isProfileUpdated', response.body.data.isProfileUpdated);

  //       } else {
  //         localStorage.setItem('userType', JSON.stringify('host'));
  //         localStorage.setItem('isProfileUpdated', response.body.data.isProfileUpdated);
  //       }
  //       if(response.body.data.userType == 'customer'){
  //         localStorage.setItem('userDetails', JSON.stringify(response.body.data));
  //         this.sharedService.headerContent.emit({ isLogin: true });
  //         this.router.navigate(['home']);
  //         this.utilityService.stopLoader();
  //       }else{
  //         if(response.body.data.isProfileUpdated){
  //           localStorage.setItem('userDetails', JSON.stringify(response.body.data));
  //           this.sharedService.headerContent.emit({ isLogin: true });
  //           this.router.navigate(['home']);
  //           this.utilityService.stopLoader();
  //         }else{
  //           localStorage.setItem('userDetails', JSON.stringify(response.body.data));
  //           this.router.navigate(['/auth/submit-info']);
  //           this.utilityService.stopLoader();
  //         }
  //       }
  //       // localStorage.setItem('userDetails', JSON.stringify(response.body.data));
  //       // this.sharedService.headerContent.emit({ isLogin: true });
  //       // this.utilityService.stopLoader();
  //       // console.log(response.body.data)
  //       // this.router.navigate(['home']);
  //     })
  //     .catch((error: any) => {
  //       this.utilityService.stopLoader();
  //       this.dialogopen(error.error.message);
  //       if (error.headers.get('Authorization')) {
  //         localStorage.setItem(
  //           'authToken',
  //           error.headers.get('Authorization' || '')
  //         );
  //         localStorage.setItem('userDetails', JSON.stringify(error.error.data));
  //         localStorage.setItem(
  //           'userType',
  //           JSON.stringify(error.error.data.userType)
  //         );
  //       } else if (error.error.data) {
  //         localStorage.setItem('userDetails', JSON.stringify(error.error.data));
  //         localStorage.setItem(
  //           'userType',
  //           JSON.stringify(error.error.data.userType)
  //         );
  //       } else {
  //         localStorage.clear();
  //       }
  //       localStorage.setItem('message', error.error.message);
  //       loginError = error.error.message.toLowerCase();
  //       if (error.error.message && error.error.message.includes('OTP has been sent please check your email')) {
  //         this.router.navigate(['/auth/email-verification']);
  //       }
  //       if (loginError.includes('update your profile')) {
  //         this.router.navigate(['auth/submit-info']);
  //       }
  //       if (error.error.message.includes('Please Choose Recommended !')) {
  //         this.router.navigate(['/auth/user-account-creation']);
  //       }
  //       if (
  //         loginError.includes(
  //           'Your profile has been blocked, contact to administrator'
  //         )
  //       ) {
  //         this.dialog;
  //       }
  //       if (
  //         loginError.includes(
  //           'Your profile has been blocked cause of you attemped 5 time wrong password.'
  //         )
  //       ) {
  //          this.dialog;
  //       }
  //       if (loginError.includes('incorrect password')) {
  //         this.dialog;
  //       }
  //     });
  // }

  submitForm(): any {
    this.utilityService.startLoader();
    const device = localStorage.getItem('tokenserviceworker')
   // console.log(device, "device");

    let loginError = '';
    const body = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      deviceToken: device,
      deviceType: this.deviceInfo.deviceType,
      platform: this.deviceInfo.browser,
      OS: this.deviceInfo.os_version,
      deviceId: this.functionService.getDeviceId(),
      // deviceId: window.navigator.userAgent.replace(/\D+/g, ''),
      sourceIp: this.ipAddress,
    };
    this.authService
      .postCommonLogin(body)
      .then((response: any) => {
        localStorage.setItem(
          'authToken',
          response.headers.get('Authorization' || '')
        );
        if (response.body.data.userType) {
          localStorage.setItem('userType', JSON.stringify(response.body.data.userType));
          localStorage.setItem('isProfileUpdated', response.body.data.isProfileUpdated);

        } else {
          localStorage.setItem('userType', JSON.stringify('host'));
          localStorage.setItem('isProfileUpdated', response.body.data.isProfileUpdated);
        }
        if (response.body.data.userType == 'customer') {
          localStorage.setItem('userDetails', JSON.stringify(response.body.data));
          this.sharedService.headerContent.emit({ isLogin: true });
          this.refreshPreviousPage();
          this.utilityService.stopLoader();
        } else {
          if (response.body.data.isProfileUpdated) {
            localStorage.setItem('userDetails', JSON.stringify(response.body.data));
            this.sharedService.headerContent.emit({ isLogin: true });
            this.refreshPreviousPage();
            this.utilityService.stopLoader();
          } else {
            localStorage.setItem('userDetails', JSON.stringify(response.body.data));
            localStorage.setItem('isProfileUpdated', response.body.data.isProfileUpdated);
            this.router.navigate(['/auth/submit-info']);
            this.utilityService.stopLoader();
          }
        }
        // localStorage.setItem('userDetails', JSON.stringify(response.body.data));
        // this.sharedService.headerContent.emit({ isLogin: true });
        // this.utilityService.stopLoader();
        // console.log(response.body.data)
        // this.router.navigate(['home']);
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.dialogopen(error.error.message);
        if (error.headers.get('Authorization')) {
          localStorage.setItem(
            'authToken',
            error.headers.get('Authorization' || '')
          );
          localStorage.setItem('userDetails', JSON.stringify(error.error.data));
          localStorage.setItem(
            'userType',
            JSON.stringify(error.error.data.userType)
          );
        } else if (error.error.data) {
          localStorage.setItem('userDetails', JSON.stringify(error.error.data));
          localStorage.setItem(
            'userType',
            JSON.stringify(error.error.data.userType)
          );
        } else {

          const myItem = localStorage.getItem('tokenserviceworker');
          localStorage.clear();
          localStorage.setItem('tokenserviceworker', JSON.stringify(error.error.data));

        }
        localStorage.setItem('message', error.error.message);
        loginError = error.error.message.toLowerCase();
        if (error.error.message && error.error.message.includes('OTP has been sent please check your email')) {
          this.closeDialog();
          this.router.navigate(['/auth/email-verification']);
        }
        if (loginError.includes('update your profile')) {
          this.closeDialog();
          this.router.navigate(['auth/submit-info']);
        }
        if (error.error.message.includes('Please Choose Recommended !')) {
          this.closeDialog();
          this.router.navigate(['/auth/user-account-creation']);
        }
        if (
          loginError.includes(
            'Your profile has been blocked, contact to administrator'
          )
        ) {
          this.closeDialog();
          this.dialog;
        }
        if (
          loginError.includes(
            'Your profile has been blocked cause of you attemped 5 time wrong password.'
          )
        ) {
          this.closeDialog();
          this.dialog;
        }
        if (loginError.includes('incorrect password')) {
          this.closeDialog();
          this.dialog;
        }
      });
  }

  getIPAddress(): any {
    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
    //console.log('this.deviceInfo', this.deviceInfo);
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  dialogopen(name: any): void {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: '420px',
      data: {
        name,
      },
      panelClass: 'custom_dilog',
    });
  }

  refreshPreviousPage(): void {
    this.sharedService.refreshPage.emit();
  }
}
