import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { GetpaidServiceService } from '../getpaid-service.service';

@Component({
  selector: 'app-getpaid',
  templateUrl: './getpaid.component.html',
  styleUrls: ['./getpaid.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GetpaidComponent implements OnInit {

  STRINGS: any = localString;
  pending: any = true;
  Completed: any = false;
  getPaidDetail: any = {};
  transactionList: any = [];
  constructor(
    private sharedService: SharedService,
    private utilityService: UtilityService,
    private getpaidService: GetpaidServiceService
  ) {
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.getpaid.getpaidHeading,
      headerSize: this.STRINGS.headerSize.betMedSmall,
      isBack: true
    });
   }

  ngOnInit(): void {
    this.getAvailableBalance();
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
  getTransactionHistory(status: any): void{
    this.utilityService.startLoader();
    const param =  {
      limit: 10,
      page: 1,
      transStatus: status
    };
    this.getpaidService.getTransactionHistoryDetail(param)
      .then((response: any) => {
        this.transactionList = response.data;
        this.utilityService.stopLoader();
      }).catch((error: any) => {
        this.utilityService.stopLoader();
        console.log(error);
        this.utilityService.routingAccordingToError(error);
      });
  }
  onClickPending(): void {
    this.pending = true;
    this.Completed = false;
    this.getTransactionHistory('pending');
  }
  onClickComplete(): void{
    this.Completed = true;
    this.pending = false;
    this.getTransactionHistory('completed');
  }

}
