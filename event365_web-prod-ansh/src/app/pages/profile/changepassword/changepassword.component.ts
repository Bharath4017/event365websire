import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { ProfileService } from '../profile.service';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
import { Router } from '@angular/router';
import { SuccessDialogComponent } from 'src/app/dialog/success-dialog/success-dialog.component';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ChangepasswordComponent implements OnInit {
  STRINGS: any = localString;
  changePasswordForm!: FormGroup;
  constructor(private sharedService: SharedService,
    private fb: FormBuilder,
    private profileService: ProfileService,
    public dialog: MatDialog,
    public route: Router,
    private utilityService: UtilityService
  ) {
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.changepassword.heading,
      headerSize: this.STRINGS.headerSize.betMedSmall,
      isBack: true
    });

  }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      newPassword: [null, [Validators.required, Validators.pattern(/^(?=.*\d).{8,30}$/)]],
      oldPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]

    },
      {
        validator: this.MustMatch('newPassword', 'confirmPassword'),
      }
    );
  }

  MustMatch(controlName: string, matchingControlName: string): any {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  submitForm() {
    if (this.changePasswordForm.status == "INVALID") {
      return;
    }
    this.utilityService.startLoader()
    this.profileService.postChangePassword(this.changePasswordForm.value)
      .then((response: any) => {
        if (response.success) {
          console.log(response.data);
          var user = localStorage.getItem("userType");
          this.utilityService.stopLoader()
          this.changePasswordForm.reset();
          // this.dialogopen(response.message);
          this.successDialogopen(response.message);
          this.route.navigate(['/profile/settings'])

        }
      })
      .catch((error: any) => {
        console.log(error);
        this.dialogopen(error.error.message);
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
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
