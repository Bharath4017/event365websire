import { localString } from 'src/app/shared/utils/strings';
import { SharedService } from 'src/app/shared/shared.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaymentService } from '../payment.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
import { MatDialog } from '@angular/material/dialog';
declare let $: any;

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})

export class PaymentsComponent implements OnInit, OnDestroy {
  STRINGS: any = localString;
  ticketImage = '../../../assets/img/ticket.svg';
  searchImage = '../../../assets/img/search.svg';
  defoultAvtar = '../../../assets/img/host@2x.png';
  allChecked = true;
  searchText = '';
  Type: any;
  getRspvList: any = [];
  confirmCancel: any;
  contentSubscription: Subscription;
  payments: any = [];
  // rspvType: any = ['regularPaid', 'vipNormal', 'regularTableSeating', 'cancelled'];
  rspvType: any = ['regularPaid', 'vipNormal', 'regularTableSeating'];
  clonePayments: any = [];
  datanotFound = false;
  filterInputvalue: any;
  eventId: any;
  checkBoxItemArray: any = [];
  userDetails: any;
  ticketBookedId: any;
  selectedPaymentType: any = 1;
  query = {
    search: '',
    eventId: '',
    rspvType: [],
    limit: 10,
    page: 1
  };
  checkboxLabel = {
    name: this.STRINGS.RspvCheckbox.selectAll, value: 'regularPaid,vipNormal,regularTableSeating', isChecked: true,
    Label: [
      { name: this.STRINGS.RspvCheckbox.paid, value: 'regularPaid', isChecked: true },
      { name: this.STRINGS.RspvCheckbox.vip, value: 'vipNormal', isChecked: true },
      { name: this.STRINGS.RspvCheckbox.setting, value: 'regularTableSeating', isChecked: true },
      //  { name: this.STRINGS.RspvCheckbox.cancelled, value: 'cancelled', isChecked: true },
    ]
  };

  constructor(private sharedService: SharedService,
              private paymentservice: PaymentService,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private utilityService: UtilityService) {
    this.sharedService.headerLayout.emit({
      headerSize: this.STRINGS.headerSize.small,
      headerName: this.STRINGS.header.payments,
      isBack: true,
      isActive: this.STRINGS.header.payments
    });
    this.eventId = this.route.snapshot.paramMap.get('id');

    this.contentSubscription = this.sharedService.modalContent.subscribe((data: any) => {
      if (data.confirmSelection) {
        this.confirmCancel = data.confirmSelection ?? false;
        if (this.confirmCancel) {
          this.utilityService.startLoader();
          const body = {
            QRkey: this.userDetails.QRkey,
            userId: this.userDetails.users.id,
            ticketBookedId: this.ticketBookedId
          };
          this.paymentservice.cancelTicket(body).then((response: any) => {
            if (response.success) {
              this.utilityService.stopLoader();
              $('#success-modal').modal('show');
              this.sharedService.modalContent.emit({ content: 'Ticket has been cancelled successfully', done: true });
              return;
            }
          }).catch((error: any) => {
            this.dialog.open(AlertdialogComponent, {
              width: '460px',
              data: {
                name: error.error.message,
              },
              panelClass: 'custom_dilog',
            });
            this.utilityService.stopLoader();
            this.utilityService.routingAccordingToError(error);
          });
        }
      }
    });
  }

  ngOnInit(): void {
    this.userAllPayments(this.selectedPaymentType);
    // this.rspvType.push('all');
    // this.userAllPayments();
    // console.log(this.rspvType);
  }
  // applyFilter(event: any): any {
  //   console.log(event.source.value);
  //   if (event.checked) {
  //     if (event.source.value === 'Tables & Seatings') {
  //       this.rspvType.push('tableSeatingBoth');
  //       this.userAllPayments();
  //     }
  //     if (event.source.value === 'paid') {
  //       this.rspvType.push('regular');
  //       this.userAllPayments();
  //     }
  //     if (event.source.value === 'all') {
  //       this.rspvType.push('all');
  //       this.userAllPayments();
  //     }
  //     if (event.source.value === 'cancelled') {
  //       this.rspvType.push('cancelled');
  //       this.userAllPayments();
  //     }
  //     if (event.source.value === 'vip') {
  //       this.rspvType.push('vip');
  //       this.userAllPayments();
  //     }
  //   }
  //   if (!event.checked) {
  //     console.log(event);
  //     this.rspvType.splice(event.source.value, 1);
  //     this.userAllPayments();
  //     console.log(this.rspvType);
  //   }
  // }

  // userAllPayments(): any {
  //   this.utilityService.startLoader();
  //   this.query.rspvType = this.rspvType;
  //   this.query.eventId = '1487';
  //   this.paymentservice.getAllUserPayments(this.query).then((response: any) => {
  //     this.payments = response.data.rspvType;
  //     this.utilityService.stopLoader();
  //     console.log(this.payments);
  //   }).catch((error: any) => {
  //     this.utilityService.stopLoader();
  //     this.utilityService.routingAccordingToError(error);
  //   });
  // }
  cancelTicket(): any {
    $('#alert-modal').modal('show');
    this.sharedService.modalContent.emit({
      content: this.STRINGS.alert.cancelTicket,
      confirmationButtons: true
    });
  }

  paid(event: any): any {
      this.ticketBookedId = event.ticketBookedId;
      this.paymentservice.getAllPaymentsDetails({ ticketId: event.ticketId, QRkey: event.QRkey }).then((data: any) => {
        let totalTicketPrice = 0;
        const value = data.data.paymentUser.events.ticketBooked.map((a: any) => {
          totalTicketPrice += parseInt(a.pricePerTicket);
          return;
        });
        console.log(totalTicketPrice, "find id");
        this.userDetails = data.data.paymentUser;
        console.log(this.userDetails.events);
        console.log(this.userDetails.users);
      });
      $('#paid-modal').modal('show');
  }

  searchpayments(event: any): any {
    // if (event.target.value.length > 5 && event.target.value.length < 50) {

    // }
    this.query.search = event.target.value;
    this.userAllPayments(this.selectedPaymentType);
  }

  applyFilter(): any {
    // this.getRspvList = this.clonePayments;
    this.checkBoxItemArray = this.checkboxLabel.Label.filter((value) => {
      return value.isChecked;
    });
    const rsvptypeArray: any = [];
    if (this.checkBoxItemArray) {
      console.log(this.getRspvList, 'this,checkboxaaray');
      this.checkBoxItemArray.forEach((selectValue: any) => {
        return rsvptypeArray.push(selectValue.value);
      });
      this.rspvType = rsvptypeArray.toString();
      console.log(this.rspvType, 'this.rsvp');
    }
    this.userAllPayments(this.selectedPaymentType);
    this.datanotFound = false;
    this.allChecked = this.checkboxLabel.Label != null && this.checkboxLabel.Label.every(t => t.isChecked);
    if (this.rspvType.length <= 0) {
      this.datanotFound = true;
    }
  }

  applyinputFilter(e: any): any {
    this.getRspvList = this.clonePayments;
    const filterResult = this.getRspvList.filter((item: any) =>
      Object.keys(item.users).some(k => item.users[k] != null &&
        item.users[k].toString().toLowerCase()
          .includes(e.target.value))
    );
    this.getRspvList = filterResult;
    if (this.getRspvList.length === 0) {
      this.datanotFound = true;
    } else {
      this.datanotFound = false;
    }
  }

  checkedAll(isChecked: boolean): any {
    this.allChecked = isChecked;
    if (this.allChecked) {
      this.rspvType = 'regularPaid,vipNormal,regularTableSeating';
      this.userAllPayments(this.selectedPaymentType);
      this.datanotFound = false;
    } else {
      this.getRspvList = null;
      this.datanotFound = true;
      this.payments = null;
    }
    if (this.checkboxLabel.Label == null) {
      return;
    }
    this.checkboxLabel.Label.forEach(t => t.isChecked = isChecked);
  }

  GetAllCheckboxValue(): any {
    if (this.checkboxLabel.Label == null) {
      return false;
    }
    return this.checkboxLabel.Label.filter(t => t.isChecked).length > 0 && !this.allChecked;
  }

  userAllPayments(PaymentType: any): any {
    this.utilityService.startLoader();
    this.payments = null;
    let body: any;
    if (PaymentType === 1){
      body = {
        search: this.query.search,
        eventId: this.eventId,
        rspvType: this.rspvType.indexOf('cancelled') < 0 ? this.rspvType : this.rspvType.slice(0, this.rspvType.indexOf('cancelled')),
        // rspvType: (this.rspvType),
        limit: 10,
        page: 1,
        // cancelled: this.rspvType.indexOf('cancelled') !== -1 ? true : false
        cancelled: false
      };
    }else{
      body = {
        search: this.query.search,
        eventId: this.eventId,
        rspvType: '',
        // rspvType: (this.rspvType),
        limit: 10,
        page: 1,
        // cancelled: this.rspvType.indexOf('cancelled') !== -1 ? true : false
        cancelled: true
      };
    }
    this.paymentservice.getAllUserPayments(body).then((response: any) => {
      console.log(response, "find id")
      this.payments = response.data.rspvType;
      // this.clonePayments = [...this.payments];
      // console.log(this.payments);
      this.utilityService.stopLoader();
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      this.utilityService.routingAccordingToError(error);
    });
  }
  selectTicketType(type: any): any{
  console.log(type);
  this.selectedPaymentType =  type;
  this.userAllPayments(this.selectedPaymentType);
  }

  ngOnDestroy(): any {
    this.contentSubscription.unsubscribe();
  }
}
