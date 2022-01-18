import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from '../../../shared/utils/strings';
import { EventService } from '../event.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isNgTemplate } from '@angular/compiler';
// import { faPinterest } from '@fortawesome/free-brands-svg-icons';
declare let $: any;

@Component({
  selector: 'app-book-ticket',
  templateUrl: './book-ticket.component.html',
  styleUrls: ['./book-ticket.component.scss']
})
export class BookTicketComponent implements OnInit {
  STRINGS: any = localString;
  mail = "../../assets/img/mail.svg";
  tablesitting = "../../assets/img/tablesitting.png";
  clock = "../../assets/img/clock.svg";
  getTicketData = <any>[];
  getvipTicket = <any>[];
  getTableAndSeating = <any>[];
  id: any;
  freeAvailableTicket = <any>[];
  regularPaidAvailableTicket = <any>[];
  vipAvailableTicket = <any>[];
  tableAndSeatingAvailableTicket = <any>[];
  eventDetail: any;
  freeTicketCount: any = 0;
  vipTicketCount: any = 0;
  regularPaidTicketCount: any = 0;
  tableAndSeatingTicketCount: any = 0;
  regularPaidTicketAmount: any = 0;
  freeTicketAmount: any = 0;
  vipTicketAmount: any = 0;
  tableAndSeatingTicketAmount: any = 0;
  totalPrice: any = 0;
  ticketPriceAfterDiscount: any = 0;
  fees: any = 0;
  price: any = 0;
  bookTicketAmount: any = 0;

  //objects
  freeTicketDetails = <any>{};
  regularPaidTicketDetails = <any>{};
  vipTicketDetails = <any>{};
  tableAndSeatingTicketDetails = <any>{};
  ticketDetail = <any>[];
  freeBookTicketDetails = <any>{};
  regularPaidBookTicketDetails = <any>{};
  vipBookTicketDetails = <any>{};
  tableAndSeatingBookTicketDetails = <any>{};
  bookTicketDetails = <any>[];
  freeBookTicketArray = <any>[];
  regularPaidBookTicketArray = <any>[];
  vipBookTicketArray = <any>[];
  tableAndSeatingBookTicketArray = <any>[];
  datanothere: boolean = false;
  couponCode!: string;
  totalDiscount = 0;
  isCodeVeified = false;
  constructor(private sharedService: SharedService, public eventservice: EventService, private route: ActivatedRoute, private utilityService: UtilityService, private router: Router) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.bookTicket.YourTicket,
      headerSize: this.STRINGS.headerSize.small,
      isBack: true
    });
  }

  ngOnInit(): void {
    this.fetchTicketInformation()
  }

  //function to return list of numbers from 0 to n-1
  numSequence(n: number): Array<number> {
    return Array(n + 1);
  }

  fetchTicketInformation() {
    this.utilityService.startLoader();
    var eventID = Number(this.id);
    this.eventservice.getUserEventdetailbyid(eventID, '').then((eventDetail: any) => {
      this.eventDetail = eventDetail.data

      if (eventDetail.success) {
        this.eventDetail.start = this.eventDetail.start.replace('Z', '');
        this.eventDetail.end = this.eventDetail.end.replace('Z', '');

        this.eventservice.getTicketInfo(eventID).then((response: any) => {
          if (response.success) {
            this.getTicketData = response.data;
          //  console.log(this.getTicketData, 'this.getTicketData')
            this.getvipTicket = this.getTicketData.vipTicket;
            this.getTableAndSeating = this.getTicketData.regularTicket.regularSeating;
            if (this.getTicketData.freeTicket[0]) {
              for (let i = 0; i < this.getTicketData.freeTicket[0].totalQuantity + 1; i++) {
                this.freeAvailableTicket.push({ "value": i });
              }
            }
            if (this.getTicketData.regularPaid[0]) {
              for (let i = 0; i < this.getTicketData.regularPaid[0].totalQuantity + 1; i++) {
                this.regularPaidAvailableTicket.push({ "value": i });
              }
            }
            if (this.getvipTicket.vipTicketInfo[0]) {
              for (let i = 0; i < this.getvipTicket.vipTicketInfo[0].totalQuantity + 1; i++) {
                this.vipAvailableTicket.push({ "value": i });
              }
            }
            if (this.getTableAndSeating[0]) {
              for (let i = 0; i < this.getTableAndSeating[0].totalQuantity + 1; i++) {
                this.tableAndSeatingAvailableTicket.push({ "value": i });
              }
            }
            this.utilityService.stopLoader();
          } else (error: any) => {
            this.utilityService.stopLoader();
            this.utilityService.routingAccordingToError(error);
          }
        })
          .catch((error: any) => {
            if (error) {
              this.datanothere = true
            } else {
              this.datanothere = false
            }
            this.utilityService.stopLoader();
          })
      } else (error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      }
    }).catch((error: any) => {
      this.utilityService.stopLoader();
    })
  }

  freeTicketCountChange(count: any, ticketAmount: any, ticketId?: any, createdBy?: any) {
    this.freeTicketDetails = {
      "totalQuantity": count, "pricePerTicket": 0, "id": ticketId, "ticketType": "freeNormal", "discount": 0
    }
    this.ticketDetail = this.ticketDetail.filter((obj: any) => {
      return obj.id !== ticketId
    });
    this.ticketDetail.push(this.freeTicketDetails);
    for (var i = 0; i < this.ticketDetail.length; i++) {
      if (this.ticketDetail[i].totalQuantity == 0) {
        this.ticketDetail.splice(i, 1);
      }
    }
    this.freeBookTicketDetails = {
      "ticketId": ticketId,
      "ticketType": "freeNormal",
      "totalQuantity": count,
      "parsonPerTable": 0,
      "pricePerTicket": 0,
      "createdBy": createdBy,
    }
    this.freeBookTicketArray = this.freeBookTicketArray.filter((obj: any) => {
      return obj.ticketId !== ticketId;
    });
    this.freeBookTicketArray.push(this.freeBookTicketDetails)

    for (var i = 0; i < this.freeBookTicketArray.length; i++) {
      if (this.freeBookTicketArray[i].totalQuantity == 0) {
        this.freeBookTicketArray.splice(i, 1);
      }
    }

    this.bookTicketDetails = this.bookTicketDetails.filter((obj: any) => {
      return obj.ticketId !== ticketId;
    });
    this.bookTicketDetails.push(this.freeBookTicketDetails);

    for (var i = 0; i < this.bookTicketDetails.length; i++) {
      if (this.bookTicketDetails[i].totalQuantity == 0) {
        this.bookTicketDetails.splice(i, 1);
      }
    }

    this.freeTicketAmount = 0;
    this.freeTicketCount = this.freeBookTicketArray.reduce(function (sum: any, current: any) {
      return sum + current.totalQuantity;
    }, 0)

    this.verifyCouponCode();
  }

  vipTicketCountChange(count: any, ticketAmount: any, ticketId?: any, ticketDiscount?: any, createdBy?: any) {
    this.vipTicketDetails = {
      "totalQuantity": count, "pricePerTicket": ticketAmount, "id": ticketId, "ticketType": "vipNormal", "discount": ticketDiscount
    }
    this.ticketDetail = this.ticketDetail.filter((obj: any) => {
      return obj.id !== ticketId
    });
    this.ticketDetail.push(this.vipTicketDetails);
    for (var i = 0; i < this.ticketDetail.length; i++) {
      if (this.ticketDetail[i].totalQuantity == 0) {
        this.ticketDetail.splice(i, 1);
      }
    }


    this.vipBookTicketDetails = {
      "ticketId": ticketId,
      "ticketType": "vipNormal",
      "totalQuantity": count,
      "parsonPerTable": 0,
      "discount": ticketDiscount,
      "pricePerTicket": ticketAmount,
      "createdBy": createdBy,
      "amount": count * ticketAmount
    }
    this.vipBookTicketArray = this.vipBookTicketArray.filter((obj: any) => {
      return obj.ticketId !== ticketId;
    });
    this.vipBookTicketArray.push(this.vipBookTicketDetails)

    for (var i = 0; i < this.vipBookTicketArray.length; i++) {
      if (this.vipBookTicketArray[i].totalQuantity == 0) {
        this.vipBookTicketArray.splice(i, 1);
      }
    }

    this.bookTicketDetails = this.bookTicketDetails.filter((obj: any) => {
      return obj.ticketId !== ticketId;
    });

    this.bookTicketDetails.push(this.vipBookTicketDetails);
    for (var i = 0; i < this.bookTicketDetails.length; i++) {
      if (this.bookTicketDetails[i].totalQuantity == 0) {
        this.bookTicketDetails.splice(i, 1);
      }
    }

    this.vipTicketAmount = this.vipBookTicketArray.reduce(function (sum: any, current: any) {
      return sum + current.amount;
    }, 0)
    this.vipTicketCount = this.vipBookTicketArray.reduce(function (sum: any, current: any) {
      return sum + current.totalQuantity;
    }, 0)

    this.verifyCouponCode();
  }

  regularPaidTicketCountChange(count: any, ticketAmount: any, ticketId?: any, ticketDiscount?: any, createdBy?: any) {
    this.regularPaidTicketCount = count
    // this.ticketCaluculation();
    this.regularPaidTicketDetails = {
      "totalQuantity": count, "pricePerTicket": ticketAmount, "id": ticketId, "ticketType": "regularPaid", "discount": ticketDiscount
    }
    this.ticketDetail = this.ticketDetail.filter((obj: any) => {
      return obj.id !== ticketId
    });
    this.ticketDetail.push(this.regularPaidTicketDetails)
    for (var i = 0; i < this.ticketDetail.length; i++) {
      if (this.ticketDetail[i].totalQuantity == 0) {
        this.ticketDetail.splice(i, 1);
      }
    }

    this.regularPaidBookTicketDetails = {
      "ticketId": ticketId,
      "ticketType": "regularPaid",
      "totalQuantity": count,
      "parsonPerTable": 0,
      "discount": ticketDiscount,
      "pricePerTicket": ticketAmount,
      "createdBy": createdBy,
      "amount": count * ticketAmount
    }
    this.regularPaidBookTicketArray = this.regularPaidBookTicketArray.filter((obj: any) => {
      return obj.ticketId !== ticketId;
    });
    this.regularPaidBookTicketArray.push(this.regularPaidBookTicketDetails)

    for (var i = 0; i < this.regularPaidBookTicketArray.length; i++) {
      if (this.regularPaidBookTicketArray[i].totalQuantity == 0) {
        this.regularPaidBookTicketArray.splice(i, 1);
      }
    }


    this.bookTicketDetails = this.bookTicketDetails.filter((obj: any) => {
      return obj.ticketId !== ticketId
    });
    this.bookTicketDetails.push(this.regularPaidBookTicketDetails);
    for (var i = 0; i < this.bookTicketDetails.length; i++) {
      if (this.bookTicketDetails[i].totalQuantity == 0) {
        this.bookTicketDetails.splice(i, 1);
      }
    }

    this.regularPaidTicketAmount = this.regularPaidBookTicketArray.reduce(function (sum: any, current: any) {
      return sum + current.amount;
    }, 0)
    this.regularPaidTicketCount = this.regularPaidBookTicketArray.reduce(function (sum: any, current: any) {
      return sum + current.totalQuantity;
    }, 0)

    this.verifyCouponCode();
  }

  tableAndSeatingTicketCountChange(count: any, ticketAmount: any, ticketId?: any, ticketDiscount?: any, createdBy?: any, parsonPerTable?: any) {
    this.tableAndSeatingTicketCount = count
    this.tableAndSeatingTicketDetails = {
      "totalQuantity": count, "pricePerTicket": ticketAmount, "id": ticketId, "ticketType": "regularTableSeating", "discount": ticketDiscount
    }
    this.ticketDetail = this.ticketDetail.filter((obj: any) => {
      return obj.id !== ticketId
    });
    this.ticketDetail.push(this.tableAndSeatingTicketDetails)
    for (var i = 0; i < this.ticketDetail.length; i++) {
      if (this.ticketDetail[i].totalQuantity == 0) {
        this.ticketDetail.splice(i, 1);
      }
    }


    this.tableAndSeatingBookTicketDetails = {
      "ticketId": ticketId,
      "ticketType": "regularTableSeating",
      "totalQuantity": count,
      "parsonPerTable": parsonPerTable,
      "discount": ticketDiscount,
      "pricePerTicket": ticketAmount,
      "createdBy": createdBy,
      "amount": count * ticketAmount
    }
    this.tableAndSeatingBookTicketArray = this.tableAndSeatingBookTicketArray.filter((obj: any) => {
      return obj.ticketId !== ticketId;
    });
    this.tableAndSeatingBookTicketArray.push(this.tableAndSeatingBookTicketDetails)
    for (var i = 0; i < this.tableAndSeatingBookTicketArray.length; i++) {
      if (this.tableAndSeatingBookTicketArray[i].totalQuantity == 0) {
        this.tableAndSeatingBookTicketArray.splice(i, 1);
      }
    }

    this.bookTicketDetails = this.bookTicketDetails.filter((obj: any) => {
      return obj.ticketId !== ticketId
    });
    this.bookTicketDetails.push(this.tableAndSeatingBookTicketDetails);
    for (var i = 0; i < this.bookTicketDetails.length; i++) {
      if (this.bookTicketDetails[i].totalQuantity == 0) {
        this.bookTicketDetails.splice(i, 1);
      }
    }

    this.tableAndSeatingTicketAmount = this.tableAndSeatingBookTicketArray.reduce(function (sum: any, current: any) {
      return sum + current.amount;
    }, 0)
    this.tableAndSeatingTicketCount = this.tableAndSeatingBookTicketArray.reduce(function (sum: any, current: any) {
      return sum + current.totalQuantity;
    }, 0)

    this.verifyCouponCode();
  }

  calculateCheckoutAmount(): void {
    this.price = this.freeTicketAmount + this.regularPaidTicketAmount + this.vipTicketAmount + this.tableAndSeatingTicketAmount;
    this.fees = (this.price / 100) * 5;

    if (this.isCodeVeified) {
      this.totalDiscount = this.price - this.ticketPriceAfterDiscount;
    } else {
      this.totalDiscount = 0;
    }

    this.totalPrice = this.price + this.fees - this.totalDiscount;
  }

  verifyCouponCode(): void {
    if (this.getTicketData.event.coupan !== null && this.getTicketData.event.coupan.coupanCode === this.couponCode) {
      if (!this.freeTicketCount && !this.regularPaidTicketCount && !this.vipTicketCount && !this.tableAndSeatingTicketCount) {
        $('#alert-modal').modal('show');
        this.sharedService.modalContent.emit({ content: this.STRINGS.bookTicket.emptyTicketCount });
        return
      }
      this.utilityService.startLoader();

      const body = {
        "ticketDetail": this.ticketDetail,
        "totalTicketPrice": this.price,
        "totalPrice": this.price + this.fees,
        "coupanCode": this.getTicketData.event.coupan.coupanCode
      }


      this.eventservice.postVerifyCoupanCode(body).then((response: any) => {
        if (response.success) {
          this.ticketPriceAfterDiscount = response.data;
          this.isCodeVeified = true;
          this.calculateCheckoutAmount();
        } else {
          this.isCodeVeified = false;
          this.calculateCheckoutAmount();
        }
        this.utilityService.stopLoader();
      }).catch((error: any) => {
        this.isCodeVeified = false;
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
    } else {
      this.isCodeVeified = false;
      this.calculateCheckoutAmount();
    }
  }

  removeDiscount(): void {
    this.isCodeVeified = false;
    this.couponCode = '';
    this.calculateCheckoutAmount();
  }

  checkout(): void {
    if (!this.freeTicketCount && !this.regularPaidTicketCount && !this.vipTicketCount && !this.tableAndSeatingTicketCount) {
      $('#alert-modal').modal('show');
      this.sharedService.modalContent.emit({ content: this.STRINGS.bookTicket.emptyTicketCount });
      return
    }
    this.utilityService.startLoader();


    const body = {
      "ticketDetail": this.ticketDetail,
      "totalTicketPrice": this.price - this.totalDiscount,
      "fees": this.fees,
      "totalPrice": this.price + this.fees - this.totalDiscount
    }

    if (this.getTicketData.event.coupan !== null && this.getTicketData.event.coupan.coupanCode !== this.couponCode) {
      for (let i in body['ticketDetail']) {
        let obj = body['ticketDetail'][i];
        delete obj['discount'];
      }
    }

    this.eventservice.postBookTicketVerify(body).then((response: any) => {
      if (response.success) {
        if (!this.totalPrice) {
          this.eventservice.postBookUserTicket(this.id, this.bookTicketDetails).then((response: any) => {
            if (response.success) {
              $('#success-modal').modal('show');
              this.sharedService.modalContent.emit({ content: this.STRINGS.bookTicket.bookTicketSuccess });
            }
          })
          // this.utilityService.stopLoader();
        } else {

          if (this.couponCode && this.isCodeVeified) {
            this.utilityService.bookTicketAmount.next({
              bookingAmount: this.totalPrice,
              bookTicketDetail: this.bookTicketDetails,
              eventId: this.eventDetail.id,
              fees: this.fees,
              coupanCode: this.couponCode
            });
          } else {
            this.utilityService.bookTicketAmount.next({
              bookingAmount: this.totalPrice,
              bookTicketDetail: this.bookTicketDetails,
              eventId: this.eventDetail.id,
              fees: this.fees
            });
          }

          this.router.navigate(['/payment/ticket-payment/' + this.id]);
          // this.utilityService.stopLoader();
        }
      }
      this.utilityService.stopLoader();
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      this.utilityService.routingAccordingToError(error);
    });
  }
}
