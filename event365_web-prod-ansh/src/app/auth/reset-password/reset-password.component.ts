import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { localString } from 'src/app/shared/utils/strings';
import { AuthService } from '../auth.service';
import { SharedService } from '../../shared/shared.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  STRINGS: any = localString;
  isSubmitted: any = false;
  resetPasswordForm!: FormGroup;
  fieldTextType!: boolean;
  newPasswordfieldType!:boolean;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private utilityService: UtilityService,
    private sharedService: SharedService
  ) {
    this.sharedService.headerLayout.emit({ headerSize: this.STRINGS.headerSize.medium });
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group(
      {
        passwordNew: [null, [Validators.required, Validators.pattern(/^(?=.*\d).{8,30}$/)]],
        passwordConfirm: [null, [Validators.required]],
      },
      {
        validator: this.MustMatch('passwordNew', 'passwordConfirm'),
      }
    );
  }
  submitResetForm(): any {
    if (this.resetPasswordForm.invalid) {
      this.isSubmitted = true;
      return;
    }
    const body = {
      email: localStorage.getItem('userEmail'),
      newPassword: this.resetPasswordForm.value.passwordNew,
    };
    //console.log('body', body);
    this.authService
      .postResetPasswordForm(body)
      .then((response: any) => {
        if (response.success) {
         // console.log(response.data);
          // localStorage.setItem('userDetails', JSON.stringify(response.data));
          this.router.navigate(['/auth/reset-password-success']);
        }
      })
      .catch((error: any) => {
        console.log(error);
        this.utilityService.routingAccordingToError(error);
      });
  }

  showpassword(): any {
    this.fieldTextType = !this.fieldTextType;
  }
  showpasswordNew():any{
    this.newPasswordfieldType = !this.newPasswordfieldType;
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
}
