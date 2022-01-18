import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { EventService } from 'src/app/pages/event/event.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { TwentyMinPopUpComponent } from '../twenty-min-pop-up/twenty-min-pop-up.component';
import { YoureventalertComponent } from '../your-event-alert/youreventalert.component';
declare let $: any;

@Component({
  selector: 'app-alertevent',
  templateUrl: './alertevent.component.html',
  styleUrls: ['./alertevent.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AlerteventComponent implements OnInit {
  STRINGS: any = localString;
  otherWebsiteUrl:any;
  createform!: FormGroup;
  selection: number = 1;
  formData:any;
  create: any;
  update: any;
  succesfullRes: string = "";
  hostMobile: any;
  hostAddress: any;
  websiteUrl: any;
  websiteUrl2: any;
  hostDetailsForm:any;
  selectiontwo:any;
  isDisbaled:any = false;
  contactHostChecked:any = true;
  webSiteUrlChecked:any = false;
  updateEvent:any;
  showErrorMessage:any = false;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  selectedCountry!: CountryISO ;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AlerteventComponent,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private eventService : EventService,
    private utilityService: UtilityService,
    private router: Router,
    public dialog: MatDialog,public dialogRef: MatDialogRef<AlerteventComponent>
  ) {
    
   }

  ngOnInit(): void {
    this.hostDetailsForm = this.fb.group({
      hostMobile: [null],
      hostAddress: [null, [Validators.required, Validators.email]],
      websiteUrl: [null, [Validators.pattern('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$')]],
      otherWebsiteUrl:[null, [Validators.pattern('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$')]],
      websiteUrl2: [{value: '', disabled: true}],
      contactType: ['contactDetails'],
    });
   this.hostDetailsForm.controls['otherWebsiteUrl'].disable(); 
   this.handleUpdateEvent()
  }

  handleUpdateEvent(){
    if(this.data.updateEvent){
      this.contactHostChecked = false;
      this.webSiteUrlChecked = false;
      if( this.data.formData.get("hostMobile") || this.data.formData.get("hostAddress") || this.data.formData.get("websiteUrl")){
        this.contactHostChecked = true;
        this.hostDetailsForm.patchValue({hostMobile: this.data.formData.get("countryCode")+this.data.formData.get("hostMobile")});
        this.hostDetailsForm.patchValue({ hostAddress: this.data.formData.get("hostAddress") });
        this.hostDetailsForm.patchValue({ websiteUrl: this.data.formData.get("websiteUrl") });
      }else{
        this.hostDetailsForm.controls['hostMobile'].disable(); 
        this.hostDetailsForm.controls['hostAddress'].disable();
        this.hostDetailsForm.controls['websiteUrl'].disable();
        this.hostDetailsForm.controls['hostMobile'].patchValue(''); 
        this.hostDetailsForm.controls['hostAddress'].patchValue('');
        this.hostDetailsForm.controls['websiteUrl'].patchValue('');
        // this.hostDetailsForm.controls['hostMobile'].setValidators();
        this.hostDetailsForm.get('hostMobile').updateValueAndValidity();
        this.hostDetailsForm.controls['hostAddress'].setValidators();
        this.hostDetailsForm.get('hostAddress').updateValueAndValidity();
        this.hostDetailsForm.controls['websiteUrl'].setValidators();
        this.hostDetailsForm.get('websiteUrl').updateValueAndValidity();
      }
      if(this.data.formData.get("otherWebsiteUrl")){
        this.webSiteUrlChecked = true;
        this.hostDetailsForm.patchValue({ otherWebsiteUrl: this.data.formData.get("otherWebsiteUrl") });
        this.hostDetailsForm.controls['otherWebsiteUrl'].enable(); 

      }else{
        this.hostDetailsForm.controls['otherWebsiteUrl'].disable(); 
        this.hostDetailsForm.controls['otherWebsiteUrl'].patchValue(''); 
        this.hostDetailsForm.controls['otherWebsiteUrl'].setValidators();
        this.hostDetailsForm.get('otherWebsiteUrl').updateValueAndValidity();
      }
    }else{

    }
  }
  
  
  contactDetailsCheck(event: any){
   // console.log('checkbox-', this.contactHostChecked)
    this.contactHostChecked = event.checked;
    if(event.checked) {
      this.hostDetailsForm.controls['hostMobile'].enable(); 
      this.hostDetailsForm.controls['hostAddress'].enable();
      this.hostDetailsForm.controls['websiteUrl'].enable();
      // this.hostDetailsForm.controls['hostMobile'].setValidators([Validators.required]);
      // this.hostDetailsForm.get('hostMobile').updateValueAndValidity();
      this.hostDetailsForm.controls['hostAddress'].setValidators([Validators.required, Validators.email]);
      this.hostDetailsForm.get('hostAddress').updateValueAndValidity();
      this.hostDetailsForm.controls['websiteUrl'].setValidators([Validators.pattern('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$')]);
      this.hostDetailsForm.get('websiteUrl').updateValueAndValidity();
    }else{
      this.hostDetailsForm.controls['hostMobile'].patchValue(''); 
      this.hostDetailsForm.controls['hostAddress'].patchValue('');
      this.hostDetailsForm.controls['websiteUrl'].patchValue('');
      this.hostDetailsForm.controls['hostMobile'].disable(); 
      this.hostDetailsForm.controls['hostAddress'].disable();
      this.hostDetailsForm.controls['websiteUrl'].disable();
      // this.hostDetailsForm.controls['hostMobile'].setValidators();
      // this.hostDetailsForm.get('hostMobile').updateValueAndValidity();
      this.hostDetailsForm.controls['hostAddress'].setValidators();
      this.hostDetailsForm.get('hostAddress').updateValueAndValidity();
      this.hostDetailsForm.controls['websiteUrl'].setValidators();
      this.hostDetailsForm.get('websiteUrl').updateValueAndValidity();
    }
  }

  websiteUrlCheck(event: any){
    this.webSiteUrlChecked = event.checked;
  //  console.log('checkbox----', this.webSiteUrlChecked)
    if(event.checked) {
      this.hostDetailsForm.controls['otherWebsiteUrl'].enable(); 
      this.hostDetailsForm.controls['otherWebsiteUrl'].setValidators([Validators.required, Validators.pattern('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$')]);
      this.hostDetailsForm.get('otherWebsiteUrl').updateValueAndValidity();
    }else{
      this.hostDetailsForm.controls['otherWebsiteUrl'].patchValue(''); 
      this.hostDetailsForm.controls['otherWebsiteUrl'].disable(); 
      this.hostDetailsForm.controls['otherWebsiteUrl'].setValidators();
      this.hostDetailsForm.get('otherWebsiteUrl').updateValueAndValidity();
    }
  }

  changeValidation(){
    if(this.hostDetailsForm.controls.hostMobile.value?.number || this.hostDetailsForm.controls.hostAddress.value || this.hostDetailsForm.controls.websiteUrl.value){
      // this.hostDetailsForm.controls['hostMobile'].setValidators();
      // this.hostDetailsForm.get('hostMobile').updateValueAndValidity();
      this.hostDetailsForm.controls['hostAddress'].setValidators([Validators.email]);
      this.hostDetailsForm.get('hostAddress').updateValueAndValidity();
      this.hostDetailsForm.controls['websiteUrl'].setValidators([Validators.pattern('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$')]);
      this.hostDetailsForm.get('websiteUrl').updateValueAndValidity();
    }
  }
 
  proceed() {
   // console.log(this.hostDetailsForm)
    if(this.webSiteUrlChecked == false &&  this.contactHostChecked == false){
      return;
    }
   
    
    if(this.hostDetailsForm.controls.hostMobile.value?.number || this.hostDetailsForm.controls.hostAddress.value || this.hostDetailsForm.controls.websiteUrl.value){
      // this.hostDetailsForm.controls['hostMobile'].setValidators();
      // this.hostDetailsForm.get('hostMobile').updateValueAndValidity();
      this.hostDetailsForm.controls['hostAddress'].setValidators([Validators.email]);
      this.hostDetailsForm.get('hostAddress').updateValueAndValidity();
      this.hostDetailsForm.controls['websiteUrl'].setValidators([Validators.pattern('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$')]);
      this.hostDetailsForm.get('websiteUrl').updateValueAndValidity();
    }else{
      if(this.contactHostChecked){
      // this.hostDetailsForm.controls['hostMobile'].setValidators();
      // this.hostDetailsForm.get('hostMobile').updateValueAndValidity();
      this.hostDetailsForm.controls['hostAddress'].setValidators([Validators.required ,Validators.email]);
      this.hostDetailsForm.get('hostAddress').updateValueAndValidity();
      this.hostDetailsForm.controls['websiteUrl'].setValidators([Validators.pattern('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$')]);
      this.hostDetailsForm.get('websiteUrl').updateValueAndValidity();
      }
    }
    

    if (this.hostDetailsForm.invalid) {
      this.hostDetailsForm.markAllAsTouched();
      return;
    }
    let number
    if(this.hostDetailsForm.controls.hostMobile.value?.number){
      number = this.hostDetailsForm.controls.hostMobile.value?.number.replace(this.hostDetailsForm.controls.hostMobile.value?.dialCode,'');
    }
    
    if(this.data.updateEvent){
      const formData = this.data.formData
      formData.delete('hostMobile')
      formData.delete('countryCode')
      formData.delete('hostAddress')
      formData.delete('websiteUrl')
      formData.delete('otherWebsiteUrl')

      formData.append('hostMobile', this.contactHostChecked? number? number : '' : '');
      formData.append('countryCode', this.contactHostChecked ? this.hostDetailsForm.controls.hostMobile.value?.dialCode? this.hostDetailsForm.controls.hostMobile.value?.dialCode: '' : '');
      formData.append('hostAddress', this.contactHostChecked ? this.hostDetailsForm.controls.hostAddress.value : '');
      formData.append('websiteUrl', this.contactHostChecked ? this.hostDetailsForm.controls.websiteUrl.value : '');
      formData.append('otherWebsiteUrl', this.webSiteUrlChecked ? this.hostDetailsForm.controls.otherWebsiteUrl.value : '');
      this.dialog.open(TwentyMinPopUpComponent, {
        data: {
          update: 'updateEvent',
          formData,
        }
       });
       this.dialogRef.close();
      }else{
    
        if (this.hostDetailsForm.invalid) {
          this.hostDetailsForm.markAllAsTouched();
        }
        let isThisFreeEvent = localStorage.getItem('isThisFreeEvent');
        if(isThisFreeEvent == 'true'){
          if(this.hostDetailsForm.valid) {
            const formData = this.data.formData
            formData.append('hostMobile', this.contactHostChecked? number? number : '' : '');
            formData.append('countryCode', this.contactHostChecked ? this.hostDetailsForm.controls.hostMobile.value?.dialCode? this.hostDetailsForm.controls.hostMobile.value?.dialCode: '' : '');
            formData.append('hostAddress', this.contactHostChecked ? this.hostDetailsForm.controls.hostAddress.value : '');
            formData.append('websiteUrl', this.contactHostChecked ? this.hostDetailsForm.controls.websiteUrl.value : '');
            formData.append('otherWebsiteUrl', this.webSiteUrlChecked ? this.hostDetailsForm.controls.otherWebsiteUrl.value : '');
            formData.append( 'paidType', 'free');
              this.eventService.postEvent(formData).then((response: any) => {
                if (response.success) {
                    this.succesfullRes = response;
                    this.utilityService.startLoader();
                    this.router.navigate(['/home'])
                    this.dialogRef.close();
                    this.yourevent();
                 localStorage.removeItem('isThisFreeEvent');
                }
              }, (error) => {
                this.utilityService.routingAccordingToError;
                console.log(error);
                this.utilityService.stopLoader();
              })
          }
        }else{
          if(this.hostDetailsForm.valid) {
              let data = ({
                  hostMobile: this.contactHostChecked? number? number : '' : '',
                  countryCode: this.contactHostChecked ? this.hostDetailsForm.controls.hostMobile.value?.dialCode? this.hostDetailsForm.controls.hostMobile.value?.dialCode: '' : '',
                  hostAddress: this.contactHostChecked ? this.hostDetailsForm.controls.hostAddress.value : '',
                  websiteUrl: this.contactHostChecked ? this.hostDetailsForm.controls.websiteUrl.value : '',
                  otherWebsiteUrl : this.webSiteUrlChecked ? this.hostDetailsForm.controls.otherWebsiteUrl.value : ''
                })
              sessionStorage.setItem('contactHostData', JSON.stringify(data))
              this.router.navigate(['/event/your-event'])
              localStorage.removeItem('isThisFreeEvent');
              this.dialogRef.close();
          }
        }
      }
      this.utilityService.startLoader();
      this.dialogRef.close();
  }

  getHostDetails(event: any){
    if(event.checked) {
      this.utilityService.startLoader();
      this.eventService.getHostDetails().then((response: any) => {
        if (response.success) {
          this.contactHostChecked = false;
          this.webSiteUrlChecked = false;
          if(response.data.hostMobile || response.data.hostAddress || response.data.websiteUrl){
            this.contactHostChecked = true;
            let country_code = response.data.countryCode? response.data.countryCode:'';
            this.hostDetailsForm.patchValue({ hostMobile: country_code+response.data.hostMobile });
            this.hostDetailsForm.patchValue({ hostAddress: response.data.hostAddress });
            this.hostDetailsForm.patchValue({ websiteUrl: response.data.websiteUrl });
            this.hostDetailsForm.controls['hostMobile'].enable(); 
            this.hostDetailsForm.controls['hostAddress'].enable();
            this.hostDetailsForm.controls['websiteUrl'].enable();
          }else{
            this.hostDetailsForm.controls['hostMobile'].patchValue(''); 
            this.hostDetailsForm.controls['hostAddress'].patchValue('');
            this.hostDetailsForm.controls['websiteUrl'].patchValue('');
            this.hostDetailsForm.controls['hostMobile'].setValidators();
            this.hostDetailsForm.get('hostMobile').updateValueAndValidity();
            this.hostDetailsForm.controls['hostAddress'].setValidators();
            this.hostDetailsForm.get('hostAddress').updateValueAndValidity();
            this.hostDetailsForm.controls['websiteUrl'].setValidators();
            this.hostDetailsForm.get('websiteUrl').updateValueAndValidity();
          }
          if(response.data.otherWebsiteUrl){
            this.webSiteUrlChecked = true;
            this.hostDetailsForm.patchValue({ otherWebsiteUrl: response.data.otherWebsiteUrl });
            this.hostDetailsForm.controls['otherWebsiteUrl'].enable(); 
          }else{
            this.hostDetailsForm.controls['otherWebsiteUrl'].patchValue(''); 
            this.hostDetailsForm.controls['otherWebsiteUrl'].setValidators();
            this.hostDetailsForm.get('otherWebsiteUrl').updateValueAndValidity();
          }
          this.utilityService.stopLoader();
          if(response.data.hostMobile === null && response.data.hostAddress === null && response.data.websiteUrl === null ) {
            $('#alert-modal').modal('show');
            this.sharedService.modalContent.emit({ content: this.STRINGS.hostDetails.unableToFetchDetails });
            this.utilityService.stopLoader();
          }   
        }
      }, (error: any) => {
        console.log(error);
        this.utilityService.stopLoader();
      })
    }else{
      this.contactHostChecked = false;
      this.webSiteUrlChecked = false;
      this.hostDetailsForm.reset();
      this.hostDetailsForm.disable();
    } 
  }

  yourevent(){
    const dialogRef = this.dialog.open(YoureventalertComponent, {
      width: '420px',
      data: {
        response : this.succesfullRes
      },
      panelClass: 'custom_dilog'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['home']);
      this.utilityService.createEventDetails.next("");
      this.utilityService.venueDetails.next("")
    });
  }

  
}
