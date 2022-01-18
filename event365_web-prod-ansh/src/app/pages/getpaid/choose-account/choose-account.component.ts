import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddNewAccountComponent } from 'src/app/dialog/add-new-account/add-new-account.component';
import { DeleteVenueAlertComponent } from 'src/app/dialog/delete-venue-alert/delete-venue-alert.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { GetpaidServiceService } from '../getpaid-service.service';


@Component({
  selector: 'app-choose-account',
  templateUrl: './choose-account.component.html',
  styleUrls: ['./choose-account.component.scss']
})
export class ChooseAccountComponent implements OnInit {
  STRINGS: any = localString;
  bankList: any = {};
  constructor(
    private sharedService: SharedService,
    public dialog: MatDialog,
    public utilityService: UtilityService,
    public getPaidService: GetpaidServiceService
  ) {
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.getpaid.chooseAccountHeading,
      headerSize: this.STRINGS.headerSize.betMedSmall,
      isBack: true
    });
  }

  ngOnInit(): void {
    this.getBankList();
    this.createAccountID();
  }
  addNewAccount(): void {
    const dialogRef = this.dialog.open(AddNewAccountComponent, {
      width: '650px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getBankList();
    });
  }
  getBankList(): void {
    this.utilityService.startLoader();
    const bankParm = {
      limit: 5,
      page: 1
    };
    this.getPaidService.getBankDetailList(bankParm).then((response: any) => {
      this.bankList = response.data;
      this.utilityService.stopLoader();
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      console.log(error);
      this.utilityService.routingAccordingToError(error);
    });
  }
  deleteBank(bankIdKey: any): void{
    const dialogRef = this.dialog.open(DeleteVenueAlertComponent, {
      width: '500px',
      panelClass: 'custom_dilog',
      data: {
        bankid: bankIdKey
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getBankList();
     });
  }
  createAccountID(): void{
    // update currency and country code of partner users and craete account id for stripe add bank
    const creatPost = {
      country_code: 'us',
      currencyCode: 'usd'
    };
    this.getPaidService.postAccountId(creatPost).then((response: any) => {
      this.utilityService.stopLoader();
    }).catch((error: any) => {
      this.utilityService.stopLoader();
    });
  }
  verifyAccount(): void {
    this.getPaidService.verifyStripeAccount().then((response: any) => {
    //  console.log(response);
      const data = response.data;
     // console.log( data.url," data.url");
      window.open(   data.url , '_blank' ); // <- This is  open in a stripe window.
      this.utilityService.stopLoader();
    }).catch((error: any) => {
      this.utilityService.stopLoader();
    });
  }
}

