import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
// import {ConfigurationOptions,CustomCountryModel,SortOrderEnum} from 'intl-input-phone';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { ProfileService } from '../../profile.service';
import { YoureventalertComponent } from 'src/app/dialog/your-event-alert/youreventalert.component';
import { LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-add-update-user',
  templateUrl: './add-update-user.component.html',
  styleUrls: ['./add-update-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LowerCasePipe],
})
export class AddUpdateUserComponent implements OnInit {
  verifyemail = '../../../assets/img/checked.svg';
  STRINGS:  any = localString
  routeId:any = false;
  adnewUserform:FormGroup;
  userTypeStatus:any ='host';
  userRoleStatus:any ='event_management';
  editUser: any;
  readOnlyFlag:boolean = false;
  // configOption1: ConfigurationOptions;
  userType = [
    { name: this.STRINGS.manageUser.userType1, value: 'host' },
    { name: this.STRINGS.manageUser.userType2, value: 'promoter' },
    { name: this.STRINGS.manageUser.userType3, value: 'member' },
  ];
  userRole = [
    { name: this.STRINGS.manageUser.role1, value: ['event_management'] },
    { name: this.STRINGS.manageUser.role2, value: ['user_management'] },
    { name: this.STRINGS.manageUser.role3, value: ['event_management', 'user_management']},
  ];
 

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private profileService:ProfileService,
    public dialog:MatDialog,
    private activatedRoute: ActivatedRoute,
    private utilityService: UtilityService,
    private router: Router,
    private lowerCasePipe: LowerCasePipe
    ) {
      this.activatedRoute.params.subscribe(params => {
       this.routeId = params['id'];
        });
      this.sharedService.headerLayout.emit({
      headerName: this.routeId ? this.STRINGS.manageUser.updateUserTitle : this.STRINGS.manageUser.addNewUserTitle,
      headerSize: this.STRINGS.headerSize.medium,
      isBack: true,
      })
      this.adnewUserform = this.fb.group({
        firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        lastName:  ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        phoneNo:   ['', [Validators.required, Validators.pattern("^[0-9]*$")]], //, Validators.pattern("^[0-9]*$")
        email:     ['', [Validators.required, Validators.email,  Validators.maxLength(50)]],
        password:  ['', [Validators.required]],
        userType:  ['', [Validators.required]],
        roles:     [''],
      })
    // this.configOption1 = new ConfigurationOptions();
    // this.configOption1.SelectorClass = 'WithBasic';
   //  this.configOption1.SelectorClass = 'India';
    // this.configOption1.SortBy = SortOrderEnum.CountryName;
   }

  ngOnInit(): void {
    if(this.routeId){
      this.getUserForEdit(this.routeId)
    }
  }
  ngAfterViewChecked(): void {
  }
  addRemoveValidation(userType:any){
    this.adnewUserform.patchValue({roles: ''});
      if(userType == 'member'){
        this.adnewUserform.controls["roles"].clearValidators();
        this.adnewUserform.controls["roles"].updateValueAndValidity();
      }else{
        this.adnewUserform.controls["roles"].setValidators([Validators.required]);
        this.adnewUserform.controls["roles"].updateValueAndValidity();
      }
    }

  postUser(bodyData:any){
    console.log(bodyData.phoneNo.Number)
    let body ={
      email     : this.lowerCasePipe.transform(bodyData.email),
      firstName : bodyData.firstName,
      lastName  : bodyData.lastName,
      password  : bodyData.password,
      phoneNo   : bodyData.phoneNo, //bodyData.phoneNo.Number,
      userType  : bodyData.userType,
      roles     : this.userTypeStatus == 'member' ? ["checkin"] : bodyData.roles.split(',')
    }
    this.utilityService.startLoader();
    if(bodyData){
      this.profileService.postOrganiserUser(body).then((response : any) => {
        if (response.body.success) {
          this.utilityService.stopLoader();
          this.router.navigate(['/profile/user-list'])
          this.successDialog("User has been created successfully");
        }
    }, (error:any) => {
      if(error.error.message == 'Email already exists'){
        this.dialogopen(error.error.message);
      }
      this.utilityService.routingAccordingToError;
      console.log(error.error.message);
      this.utilityService.stopLoader();
    })}
  }

  getUserForEdit(id: any) {
    this.utilityService.startLoader();
    this.profileService.getOrganiserForEditUser(id).then((response: any) => {
      this.editUser = response
      if (response.success) {
        this.userTypeStatus = response.data.userType,

          this.userRoleStatus = response.data.roles.toString()
        let body = {
          email: response.data.email,
          firstName: response.data.name.substr(0, response.data.name.indexOf(' ')),
          lastName: response.data.name.substr(response.data.name.indexOf(' ') + 1),
          password: '********',
          phoneNo: response.data.phoneNo,
          roles: response.data.roles.toString(),
          userType: response.data.userType
        }
        this.adnewUserform.patchValue(body);
        this.readOnlyFlag = true
        this.utilityService.stopLoader();
      }
    }, (error: any) => {
      this.utilityService.routingAccordingToError;
      console.log(error);
      this.utilityService.stopLoader();
    })
  }
  
  updateUser(updateBody:any) {
    let body = {
      userType  : updateBody.userType,
      roles     : this.userTypeStatus == 'member' ? ["checkin"] : updateBody.roles.split(',')
    }
    this.utilityService.startLoader();
    this.profileService.updateOrganiserUser(this.routeId, body).then((response: any) => {
      if (response.body.success) {
        this.utilityService.stopLoader();
        this.router.navigate(['/profile/user-list'])
        this.successDialog("User has been updated successfully");
        this.sharedService.headerLayout.emit({
          isLogin:true
          });
      }
    }, (error: any) => {
      this.utilityService.routingAccordingToError;
      console.log(error);
      this.utilityService.stopLoader();
    })

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
  successDialog(msg:any){
    this.dialog.open(YoureventalertComponent, {
      data: {
        response: {
          message: msg,
        }
      }
    });
  }
 
}
