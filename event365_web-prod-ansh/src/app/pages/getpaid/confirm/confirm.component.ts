import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
import { PaymentSubmitComponent } from 'src/app/dialog/payment-submit/payment-submit.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { GetpaidServiceService } from '../getpaid-service.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmComponent implements OnInit {
  STRINGS: any = localString;
  getPaidDetail: any = {};
  withDrawnForm!: FormGroup;
  submit = false;
  id: any;
  constructor(
    public sharedService: SharedService,
    public utilityService: UtilityService,
    public getpaidService: GetpaidServiceService,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public fb: FormBuilder
  ) { this.sharedService.headerLayout.emit({
    headerName: this.STRINGS.getpaid.confirmHeading,
    headerSize: this.STRINGS.headerSize.betMedSmall,
    isBack: true
  });
      this.id = this.route.snapshot.paramMap.get('id');
}

ngOnInit(): void {
  this.getAvailableBalance();
  this.createForm();
}
createForm(): void {
  this.withDrawnForm = this.fb.group({
    bankId: [this.id],
    withdrawnAmount: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
  });
}
getAvailableBalance(): void{
  this.utilityService.startLoader();
  this.getpaidService.getAvailableBalance()
    .then((response: any) => {
      this.getPaidDetail = response.data;
      this.utilityService.stopLoader();
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      console.log(error);
      this.utilityService.routingAccordingToError(error);
    });
}
  withdrawAmmount(): void{
    if (this.withDrawnForm.invalid) {
      this.submit = true;
      return;
    }
    this.utilityService.startLoader();
    this.getpaidService.postwithdrawnReq(this.withDrawnForm.value)
      .then((response: any) => {
        this.getPaidDetail = response.data;
        this.utilityService.stopLoader();
        this.dialog.open(PaymentSubmitComponent, {
          width: '400px'
        });
      }).catch((error: any) => {
        this.utilityService.stopLoader();
        console.log(error);
        if (error){
          if (error.error.message.includes('insert') || error.error.message.includes('$$') || error.error.message.includes('(') ){
            this.dialogopen('something went wrong please try Again');
          }
          else{
            this.dialogopen(error.error.message);
          }
        }
        else{
          this.dialogopen('something went wrong please try Again');
        }
        this.utilityService.routingAccordingToError(error);
      });
  }
  dialogopen(name: any): void {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: '460px',
      data: {
        name,
      },
      panelClass: 'custom_dilog',
    });
  }

}
