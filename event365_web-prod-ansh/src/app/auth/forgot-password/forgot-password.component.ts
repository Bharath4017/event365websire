import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { localString } from 'src/app/shared/utils/strings';
import { AuthService } from '../auth.service';
import { SharedService } from '../../shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  STRINGS: any = localString;
  isSubmitted: any = false;
  forgotRoute: any;
  forgetForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private utilityService: UtilityService,
    private sharedService: SharedService,
    public dialog: MatDialog
  ) {
    this.sharedService.headerLayout.emit({ headerSize: this.STRINGS.headerSize.medium });
  }

  ngOnInit(): void {
    this.forgetForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.email, Validators.maxLength(50)],
      ],
    });
  }
  submitForgetForm(): any {
    if (this.forgetForm.invalid) {
      this.isSubmitted = true;
      return;
    }
    const body = {
      email: this.forgetForm.value.email,
    };
   // console.log('body', body);
    this.authService
      .postForgotForm(body)
      .then((response: any) => {
        if (response.success) {
         // console.log(response.data);
          localStorage.setItem('userEmail', this.forgetForm.value.email);
          localStorage.setItem('userDetails', JSON.stringify(response.data));
          this.router.navigate([
            '/auth/email-verification',
            { forgotRoute: true },
          ]);
        }
      })
      .catch((error: any) => {
        this.dialogopen(error.error.message);
        console.log(error);
        this.utilityService.routingAccordingToError(error);
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
