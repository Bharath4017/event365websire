import { Component, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { localString } from '../../shared/utils/strings';
import { SharedService } from 'src/app/shared/shared.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../../shared/services/utility.service';
import { HttpClient } from '@angular/common/http';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { AuthService } from 'src/app/auth/auth.service';
declare let $: any;
@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit, OnDestroy {
  STRINGS: any = localString;
  contentSubscription: Subscription;
  content: any = '';
  denied: any;
  confirmationButtons: any = false;
  doneButton: boolean = false;
  buttonFunction: boolean = false;
  contactNumber: any;
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
  isMobileVerified: boolean = false;
  modelClose: any;
  responseMessage: any;
  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private utilityService: UtilityService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private deviceDetectorService: DeviceDetectorService,
  ) {
    this.contentSubscription = this.sharedService.modalContent.subscribe((data) => {
      this.denied = data.denied;
      if (data.content || data.confirmationButtons || data.contactNum ) {
        this.content = data.content ?? '';
        this.confirmationButtons = data.confirmationButtons ?? false;
        this.doneButton = data.done ?? false;
        this.buttonFunction = data.afterClick ?? false;
        this.contactNumber = data.contactNum;
        this.modelClose = data.modelClose ?? false;
      }
      if (data.Timer) {
        this.showResendCode = false;
        this.verifyForm.reset();
        this.timer = data.Timer;
        this.responseMessage = 'Otp resend successfully';
        setTimeout(() => {
          this.responseMessage = '';
        }, 5000);
      }
      if (data.modelClose) {
        $('#mobile-verification').modal('hide');
      }
      if (data.message){
        this.responseMessage = data.message;
      }
    });
  }
  ngOnInit(): void {
    this.showResendCode = false;
    this.initializeVerifyForm();
    this.getIPAddress();
    this.interval = setInterval(() => {
      this.decrementCounter();
    }, 1000);
    $('#mobile-verification').on('hidden.bs.modal',  () => {
     this.verifyForm.reset();
     this.responseMessage = '';
     this.timer = 30;
  });
  }
  selectConfirmation(value: any): any {
    // if(this.denied){
    //     window.location.reload()
    //  }
    this.sharedService.modalContent.emit({
      confirmSelection: value
    });
  }
  // reload(){
  //   window.location.reload()
  // }
  goBack(): any {
    console.log('event detils go back')
    if(this.content === this.STRINGS.bookTicket.bookTicketSuccess){
      localStorage.setItem("bookedTicket", "bookedTicket");
      this.router.navigate(['rsvp/group-ticket']);
       localStorage.getItem("bookedTicket") ;
      } else {
      this.location.back();
    }
  }
  afterClick(): any {
    console.log('event detils afterClick')
    if (this.buttonFunction) {
      this.sharedService.modalContent.emit({
        doneBackFunction: true
      });
    }
    else {
      this.goBack();
      console.log('else condition')
    }
  }
  afterClickSameUrl(){
    //this.router.navigate(['invite/' + this.currenteventId]);
  }
  ngOnDestroy(): any {
    this.contentSubscription.unsubscribe();
    clearInterval(this.interval);
​
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
      return;
    }
    this.isSubmitted = false;
    this.showErrorMessage = false;
    const body = {
      otp:
        this.verifyForm.value.input1 +
        this.verifyForm.value.input2 +
        this.verifyForm.value.input3 +
        this.verifyForm.value.input4,
    };
   // console.log(body);
    this.sharedService.modalContent.emit(body);
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
    this.sharedService.modalContent.emit({ resendOtp: true });
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
​
}