import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
import { ShareDialogComponent } from 'src/app/dialog/share-dialog/share-dialog.component';
import { SuccessDialogComponent } from 'src/app/dialog/success-dialog/success-dialog.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { HomeService } from '../../home/home.service';
import { ProfileService } from '../profile.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {
  userDetails:any;
  userNotify:any;
  userRemind:any;
  partnerNotify:any;
  constructor(private sharedService: SharedService, private homeService:HomeService, private profileService: ProfileService, public dialog: MatDialog, public utilityService: UtilityService) {
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.header.settings,
      headerSize: this.STRINGS.headerSize.small,
      isBack: true
    });

  }
  STRINGS: any = localString;
  user: any = false;

  userSettingOptions: any = {
    [this.STRINGS.userType.partner]: [
    { title: this.STRINGS.header.manageUsers, path: '' },
    { title: this.STRINGS.header.getPaid, path: '' },
    { title: this.STRINGS.header.notification, path: '' },
    { title: this.STRINGS.header.help, path: '' },
    { title: this.STRINGS.header.share, path: '' },
    { title: this.STRINGS.header.profile, path: '/profile/update-profile' },
    { title: this.STRINGS.header.faqs, path: '' },
    { title: this.STRINGS.header.termsConditions, path: '' },
    { title: this.STRINGS.header.privacyPolicy, path: '' },
    ]
  };

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
    if(this.userDetails.userType == 'customer'){
      this.userNotify = this.userDetails.isNotify;
      this.userRemind = this.userDetails.isRemind;
    }else{
      this.partnerNotify = this.userDetails.isNotify;
    }
    this.getUserTypeLocalStorage();
    for (let i = 3000; i >= 1; i--) {
      this.utilityService.startLoader();
    }
    this.utilityService.stopLoader();
    this.fetchUserProfile();
  }

  openSharePopUp(): void {
    this.dialog.open(ShareDialogComponent, {
      width: '420px',
    });
  }
  getUserTypeLocalStorage(): void {
    const getUserType = localStorage.getItem('userType');
    if (getUserType?.includes('customer')) {
      this.user = true;
    }
    else {
      this.user = false;
    }
  }

  submitNotication(type:any, value:any) {
    let body = {
      "type":type,
      "value":value
    }
    this.utilityService.startLoader()
    this.profileService.remindOrNotify(body)
      .then((response: any) => {
        if (response.success) {
          this.utilityService.stopLoader()
          this.fetchUserProfile();
          this.successDialogopen(response.message);

        }
      })
      .catch((error: any) => {
        console.log(error);
        this.dialogopen(error.error.message);
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }

  submitNoticationForPartner() {
    let body = {
      "status":this.partnerNotify
    }
    this.utilityService.startLoader()
    this.profileService.remindOrNotifyForPartner(body)
      .then((response: any) => {
        if (response.success) {
          this.utilityService.stopLoader()
          this.fetchUserProfile();
          this.successDialogopen(response.message);
        }
      })
      .catch((error: any) => {
        console.log(error);
        this.dialogopen(error.error.message);
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }

  fetchUserProfile(): any {
   let userType = JSON.parse(localStorage.getItem('userType') || '{}');
   if(userType == 'customer'){
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
    let getUserId = JSON.parse(localStorage.getItem('userDetails') || '{}');
    let userId = this.userDetails.id ? this.userDetails.id : getUserId.user.id;
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

  dialogopen(name: any): void {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: '700px',
      data: {
        name: name,
      },
      panelClass: 'custom_dilog',
    });
  }

  successDialogopen(name: any): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: '460px',
      data: {
        message:name,
      },
      panelClass: 'custom_dilog',
    });
  }
}
