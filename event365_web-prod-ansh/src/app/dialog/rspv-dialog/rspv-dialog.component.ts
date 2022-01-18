import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RsvpService } from 'src/app/pages/rsvp/rsvp.service';
import { localString } from 'src/app/shared/utils/strings';
import Swiper, { SwiperOptions } from 'swiper';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PaymentService } from 'src/app/pages/payment/payment.service';
import { SharedService } from 'src/app/shared/shared.service';
import { AlertdialogComponent } from '../alertdialog/alertdialog.component';

@Component({
  selector: 'app-rspv-dialog',
  templateUrl: './rspv-dialog.component.html',
  styleUrls: ['./rspv-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RspvDialogComponent implements OnInit {
  STRINGS: any = localString;
  loading = false;
  defolutprofiles = '../../assets/img/rspvdefoult.png';
  mail = '../../assets/img/mail.svg';
  locationon = '../../assets/img/location-on.svg';
  phonecall = '../../assets/img/phone-call.svg';
  ticketsvg = '../../assets/img/ticket.svg';
  TicketId: any;
  clock = '../../assets/img/clock.svg';
  DefoultImageSrc = '../../assets/img/host@2x.png';
  eventId: any;
  userID: any;
  UserInfo: any;
  UserDetails  = [] as any;
  checkedIn: boolean;
  public config: SwiperOptions = {
    a11y: { enabled: true },
    slidesPerView: 1,
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    direction: 'horizontal',
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '#button-next-swiper',
      prevEl: '#button-prev-swiper ',
    },
  };
  constructor(@Inject(MAT_DIALOG_DATA) public data: RspvDialogComponent,
              public dialog: MatDialog, public dialogRef: MatDialogRef<RspvDialogComponent>,
              public rsvpservice: RsvpService, private utilityService: UtilityService,
              private paymentservice: PaymentService, private sharedService: SharedService) {
    this.eventId = data.eventId;
    this.TicketId = data.TicketId;
    this.checkedIn = data.checkedIn;
    this.UserInfo = data.UserInfo;
    // this.UserInfo.events.start = this.UserInfo.events.start.replace('Z', '');
    // this.UserInfo.events.end = this.UserInfo.events.end.replace('Z', '');
  }
  ngOnInit(): void {
    this.utilityService.startLoader();
    this.getTicketDetails();
  }
  getTicketDetails() {
    this.utilityService.startLoader();
    const body = {
        eventId: this.eventId,
        id : this.TicketId
      };
    this.loading = !this.loading;
    this.rsvpservice.getTicketDetails(body).then((response: any) => {
        if (response.success){
          this.UserDetails = response.data;

          this.UserDetails.forEach((res: any) => {
            res.events.start = res.events.start.replace('Z', '');
            res.events.end = res.events.end.replace('Z', '');
          });

          this.loading = !this.loading;
          this.utilityService.stopLoader();
        }

    });
  }
  cancelTicket( ticketBookedId: any, ticketNumberId: any, QRkey: any){
           // console.log(ticketBookedId, ticketNumberId ,QRkey, 'ticketBookedId, ticketnumberId')
           // console.log(this.UserDetails)
            const body = {
              QRkey,
              userId: this.UserDetails[0].userId,
              ticketBookedId,
              ticketNumberId
            };
            this.paymentservice.cancelTicket(body).then((response: any) => {
              if (response.success) {
                this.dialog.open(AlertdialogComponent, {
                  width: '460px',
                  data: {
                    name: 'Ticket has been cancelled successfully',
                  },
                  panelClass: 'custom_dilog',
                });
                this.getTicketDetails();
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
