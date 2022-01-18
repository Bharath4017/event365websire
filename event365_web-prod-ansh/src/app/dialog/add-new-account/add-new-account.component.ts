import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GetpaidServiceService } from 'src/app/pages/getpaid/getpaid-service.service';
import { localString } from 'src/app/shared/utils/strings';
import { YoureventalertComponent } from '../your-event-alert/youreventalert.component';

@Component({
  selector: 'app-add-new-account',
  templateUrl: './add-new-account.component.html',
  styleUrls: ['./add-new-account.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddNewAccountComponent implements OnInit {
  bankDetailForm!: FormGroup;
  STRINGS: any = localString;
  submit = false;
  errorMessage = '';
  matSpinner = false;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddNewAccountComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: AddNewAccountComponent,
    public getPaidService: GetpaidServiceService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }
  createForm(): void {
    this.bankDetailForm = this.fb.group({
      routingNo: [null, [Validators.required]],
      bankName: [null, [Validators.required]],
      AccountNo: [null, [Validators.required]],
    });
  }
  addBankDetail(): void {
    if (this.bankDetailForm.invalid) {
      this.submit = true;
      return;
    }
    else {
      this.matSpinner = true;
      this.getPaidService.postbankDetail(this.bankDetailForm.value).then((response: any) => {
        if (response.success) {
          this.matSpinner = false;
          this.dialogRef.close();
          this.dialogopen(response.message);
        }
      }).catch((error: any) => {
        console.log(error);
        this.matSpinner = false;
        if (error) {
          if (error.error.message.includes('insert') || error.error.message.includes('$$') || error.error.message.includes('(')) {
            this.errorMessage = 'something went wrong please try';
          }
          else {
            this.errorMessage = error.error.message;
          }
        }
        else {
          this.errorMessage = error.error.message;
        }
      });
    }
  }
  dialogopen(name: any): void {
    const dialogRef = this.dialog.open(YoureventalertComponent, {
      width: '460px',
      data: {
        name,
      },
      panelClass: 'custom_dilog',
    });
  }
}
