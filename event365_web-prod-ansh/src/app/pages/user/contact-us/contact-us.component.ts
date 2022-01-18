import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
import { ContactUsCallComponent } from 'src/app/dialog/contact-us-call/contact-us-call.component';
import { SendMessageAlertComponent } from 'src/app/dialog/send-message-alert/send-message-alert.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { UserService } from '../user.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContactUsComponent implements OnInit {
  STRINGS: any = localString;
  issueList: any;
  contactUsform:FormGroup
  userProfile:any;
  userType:any;
  constructor(
    private sharedService: SharedService,
    private userService: UserService,
    private utilityService: UtilityService,
    public dialog: MatDialog,
    public fb:FormBuilder
  ) {
    this.userProfile = localStorage.getItem('userDetails') ? JSON.parse(localStorage.getItem('userDetails') || '') : '';
    this.userType = localStorage.getItem('userType') ? JSON.parse(localStorage.getItem('userType') || '') : 'guestUser';
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.contactUs.pageHeadding,
      headerSize: this.STRINGS.headerSize.medium,
      isBack: true,
    });
    this.contactUsform = this.fb.group({
      issueId: ['', [Validators.required]],
      email:  this.userType  == "guestUser" ? ['', [Validators.required, Validators.email,]] : this.userProfile?.email,
      message: ['', [Validators.required]],
    })
  }


  ngOnInit(): void {
    this.getIssueList();
  }

  getIssueList(): any {
    this.userService.getIssueList()
      .then((response: any) => {
        if (response.success) {
          this.utilityService.stopLoader();
          this.issueList = response.data;
        }
      }).catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  submitIssue(body:any) {
    this.utilityService.startLoader();
    this.userService.contactUs(body).then((response: any) => {
      if (response.success) {
        this.utilityService.stopLoader();
        this.dialogopen()
        this.contactUsform.reset();
      }
    })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  dialogopen(): void {
    const dialogRef = this.dialog.open(SendMessageAlertComponent, {
      width: '512px',
      data: {},
      panelClass: 'custom_dilog'
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  dialogopenForCall(): void {
    const dialogRef = this.dialog.open(ContactUsCallComponent, {
      width: '512px',
      data: {},
      panelClass: 'custom_dilog'
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  
}
