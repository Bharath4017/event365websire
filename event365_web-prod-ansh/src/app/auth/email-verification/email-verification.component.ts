import { Component, OnInit, ViewChildren, OnDestroy } from '@angular/core';
import { localString } from '../../shared/utils/strings';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UtilityService } from '../../shared/services/utility.service';
import { HttpResponse } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';
import { FunctionsService } from '../../shared/utils/functions.service';
import { HttpClient } from '@angular/common/http';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent implements OnInit, OnDestroy {
  STRINGS: any = localString;
  verifyForm!: FormGroup;
  isSubmitted: any = false;
  timer: any = 30;
  interval: any;
  @ViewChildren('formRow') rows: any;
  showResendCode: any = false;
  userDetails: any;
  errorMessage: any;
  showErrorMessage: any = false;
  forgotRoute: any;
  ipAddress = '';
  deviceInfo!: DeviceInfo;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private utilityService: UtilityService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private deviceDetectorService: DeviceDetectorService,
    private functionService: FunctionsService,
  ) {
    this.sharedService.headerLayout.emit({ headerSize: this.STRINGS.headerSize.betMedSmall });
    if (localStorage.getItem('userDetails')) {
      this.userDetails = JSON.parse(
        localStorage.getItem('userDetails') || '{}'
      );
    }
    this.forgotRoute = this.route.snapshot.paramMap.get('forgotRoute');
  }
  ngOnInit(): void {
    this.initializeVerifyForm();
    this.getIPAddress();
    this.interval = setInterval(() => {
      this.decrementCounter();
    }, 1000);
  }
  initializeVerifyForm(): any {
    this.verifyForm = this.formBuilder.group({
      input1: [
        '',
        [Validators.required, Validators.pattern(/^-?([0-9]\d*)?$/)],
      ],
      input2: [
        '',
        [Validators.required, Validators.pattern(/^-?([0-9]\d*)?$/)],
      ],
      input3: [
        '',
        [Validators.required, Validators.pattern(/^-?([0-9]\d*)?$/)],
      ],
      input4: [
        '',
        [Validators.required, Validators.pattern(/^-?([0-9]\d*)?$/)],
      ],
    });
  }
  keyUpEvent(event: any, index: any): any {
    this.showErrorMessage = false;
    let pos = index;
    if (event.keyCode === 8 && event.which === 8) {
      pos = index - 1;
    } else {
      pos = index + 1;
    }
    if (pos > -1 && pos < 4) {
      this.rows._results[pos].nativeElement.focus();
    }
  }
  verfiyOtp(): any {
    if (this.verifyForm.invalid) {
      this.isSubmitted = true;
      this.verifyForm.reset();
      return;
    }
    this.utilityService.startLoader();
    this.isSubmitted = false;
    this.showErrorMessage = false;
    const body = {
      id: this.userDetails.id,
      otp:
        this.verifyForm.value.input1 +
        this.verifyForm.value.input2 +
        this.verifyForm.value.input3 +
        this.verifyForm.value.input4,
      deviceToken: '7fb1de907129a45ac318abefca8e7440b0d266f98f38d41d797d29871102a208',
      deviceType: this.deviceInfo.deviceType,
      platform: this.deviceInfo.browser,
      OS: this.deviceInfo.os_version,
      deviceId: this.functionService.getDeviceId(),
      // deviceId: window.navigator.userAgent.replace(/\D+/g, ''),
      // deviceId: this.deviceInfo.browser_version,
      sourceIp: this.ipAddress,
    };
    if (this.userDetails.userType !== "customer") {
      this.authService
        .postOrganiserVerifyEmail(body)
        .then((response: HttpResponse<any>) => {
          localStorage.setItem(
            'authToken',
            response.headers.get('Authorization') || ''
          );
          localStorage.setItem(
            'userDetails',
            JSON.stringify(response.body.data)
          );
          localStorage.setItem('userType', JSON.stringify(response.body.data.user.userType));
          if (this.forgotRoute === 'true') {
            localStorage.setItem('isPassReset', JSON.stringify('true'));
            this.router.navigate(['/auth/reset-password']);
          } else {
            this.router.navigate(['/auth/submit-info']);
          }
          this.utilityService.stopLoader();
        })
        .catch((error: any) => {
          this.utilityService.stopLoader();
          if (error?.error?.message) {
            this.showErrorMessage = true;
            this.verifyForm.reset();
          }
          if (error.status === 435) {
            localStorage.setItem(
              'authToken',
              error.headers.get('Authorization') || ''
            );
            localStorage.setItem('userType', JSON.stringify(error.body.data.user.userType));
            if (this.forgotRoute === 'true') {
              this.router.navigate(['/auth/reset-password']);
              localStorage.setItem('isPassReset', JSON.stringify('true'));
            } else {
              this.router.navigate(['/auth/submit-info']);
            }
          }
          this.utilityService.routingAccordingToError(error);
        });
    } else if (this.userDetails.userType == "customer") {
      this.authService
        .postUserVerifyEmail(body)
        .then((response: HttpResponse<any>) => {
          localStorage.setItem(
            'authToken',
            response.headers.get('Authorization') || ''
          );
          localStorage.setItem(
            'userDetails',
            JSON.stringify(response.body.data)
          );
          localStorage.setItem('userType', JSON.stringify('customer'));
          this.utilityService.stopLoader();
        })
        .catch((error: HttpResponse<any>) => {
          this.utilityService.stopLoader();
          if (error.status == undefined) {
            if (this.forgotRoute === 'true') {
              localStorage.setItem('isPassReset',  JSON.stringify('true'));
              this.router.navigate(['/auth/reset-password']);
            } else {
              this.router.navigate(['/auth/submit-info']);
            }
          }
          if (error.status === 435) {
            localStorage.setItem(
              'authToken',
              error.headers.get('Authorization') || ''
            );
            localStorage.setItem('userType', JSON.stringify('customer'));
            if (this.forgotRoute === 'true') {
              localStorage.setItem('isPassReset',  JSON.stringify('true'));
              this.router.navigate(['/auth/reset-password']);
            } else {
              this.router.navigate(['/auth/submit-info']);
            }
          }
          if (error.status === 406) {
            this.showErrorMessage = true;
            this.verifyForm.reset();
          }
          this.utilityService.routingAccordingToError(error);
        });
    }
  }
  decrementCounter(): any {
    if (!this.showResendCode) {
      this.timer = this.timer - 1;
      if (this.timer === 0) {
        this.timer = 30;
        this.showResendCode = true;
      }
    }
  }
  resendOtp(): any {
    this.verifyForm.reset();
    this.utilityService.startLoader();
    let emailId;
    if(localStorage.getItem('userEmail')){
      emailId = localStorage.getItem('userEmail');
    }else{
      emailId = this.userDetails.userEmail
    }
    const body = {
      id: this.userDetails.id,
      email: emailId,
    };
    if (this.userDetails.userType) {
      this.authService
        .postOrganiserResendOtp(body)
        .then((response: any) => {
          if (response.success) {
            this.timer = 30;
            this.showResendCode = false;
            this.utilityService.stopLoader();
          }
        })
        .catch((error: any) => {
          this.utilityService.stopLoader();
          this.utilityService.routingAccordingToError(error);
        });
    } else if (!this.userDetails.userType) {
      this.authService
        .postUserResendOtp(body)
        .then((response: any) => {
          if (response.success) {
            this.timer = 30;
            this.showResendCode = false;
            this.utilityService.stopLoader();
          }
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
  handleChange(event: any): void {
    const value = event.target.value.split('');
    if (event.target.value.length === 4) {
      this.verifyForm.reset();
      this.verifyForm.controls.input1.setValue(value[0]);
      this.verifyForm.controls.input2.setValue(value[1]);
      this.verifyForm.controls.input3.setValue(value[2]);
      this.verifyForm.controls.input4.setValue(value[3]);
      this.rows._results[3].nativeElement.focus();
    } else {
      this.verifyForm.controls.input1.setValue(value[0]);
    }
  }
  ngOnDestroy(): any {
    clearInterval(this.interval);
  }
}
