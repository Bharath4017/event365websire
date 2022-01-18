import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { RsvpService } from '../rsvp.service';
import domtoimage from 'dom-to-image';
import { ProfileService } from '../../profile/profile.service';

import { YoureventalertComponent } from 'src/app/dialog/your-event-alert/youreventalert.component';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
import { analytics } from 'firebase';
export interface PendingTicket {
  name: string;
  address: string;
}
var ticketCanceled = 0;
interface TicketList {
  id: number;
  tickerId:any;
  ticketType: any;
  pricePerTicket: any;
  TicketBookedStatus:any;
  QRCode: any;
  cancelledBy: any;
  status: any;
  ticketNumber: any;
  description:any
}

interface eventList {
  id: number;
  tickerId:any;
  ticketType: any;
  pricePerTicket: any;
  QRCode: any;
  cancelledBy: any;
  status: any;
  ticketNumber: any;
  events:any;
  QRkey:any;
}

@Component({
  selector: 'app-group-rspv-ticket',
  templateUrl: './group-rspv-ticket.component.html',
  styleUrls: ['./group-rspv-ticket.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GroupRspvTicketComponent implements OnInit {
  STRINGS: any = localString;
  mail = '../../assets/img/mail.svg';
  locationon = '../../assets/img/location-on.svg';
  phonecall = '../../assets/img/phone-call.svg';
  ticketsvg = '../../assets/img/ticket.svg';
  clock = '../../assets/img/clock.svg';
  share_ticket = '../../assets/img/downloadsvg.svg';
  qr_code = '../../assets/img/qr-code.png';
  RsvpDetilsArray = [];
  voidArrayStatusMain= [];
  PendingTicketDetails = []as any;
  AcceptedTicketDetails = []as any;
  datetime: any;
  [key: string]: any;
  datanotAvilabel = false;
  prevdata = false;
  nextdata = false;
  pageSize: any;
  maxTickets: any = 6;
  maxTicketsticket: any = 6;
  pageAccepted: any = 1;
  pagePending: any = 1;
  pageTicket: any = 1;
  pageIndexPending: any = 0;
  pageIndexAccepted: any = 0;
  pageIndexTicket: any = 0;
  totalCountPending: any;
  totalCountAccept: any = 0;
  totalCountTicket: any = 0;
  ticketInfo  : eventList[] =[];
  SignleTicket = true;
  datanothere = false;
  MultipleTicketinfo = [] as  any;
  groupArray:any;
  VoidStatus = false;
  imageLink = null;
  selectedIndex:any = 0;
  updateEventid:any;
  withoutVoid = false;
  AllCancelledStatus:any;
  selectedFavType: any = true;
  TicketBookedClone: TicketList[] = [];
  ticketRelClone:any;
  updateTicketClone:any;
  voidStatusCancelled:boolean =false;
  GroupTicketIndex:any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataSource: MatTableDataSource<PendingTicket> = new MatTableDataSource<PendingTicket>(this.PendingTicketDetails);
  constructor(private sharedService: SharedService,
              public rsvp_service: RsvpService,
              public profileService: ProfileService,
              private _snackBar: MatSnackBar, public dialog: MatDialog, private utilityService: UtilityService) {
    this.config = new MatSnackBarConfig();
    this.config.duration = 2000;
    this.sharedService.headerLayout.emit({
      headerSize: this.STRINGS.headerSize.small,
      headerName: this.STRINGS.RspvCheckbox.rspv,
      isBack: true,
      isActive: this.STRINGS.header.rsvp
    });
  }
  ngOnInit(): void {
    this.fetchUserPendingRsvpDetils();
    this.fetchUserTicketDetails();
    this.fetchUserAcceptedRsvpDetils();
     var bookedTicketRedirection = localStorage.getItem("bookedTicket");
    if(bookedTicketRedirection){
      this.selectedIndex = 2;
      localStorage.removeItem('bookedTicket')
    }
    this.voidStatusCancelled;
  }

  fetchUserTicketDetails(): any {
    this.utilityService.startLoader();
    const body = {
      page: this.pageTicket,
    };
    this.rsvp_service.getUserRsvpTicketBookedPage(body)
      .then((response: any) => {
        if (response.success) {

           
          this.ticketInfo = response.data.paymentUser;
            console.log(this.ticketInfo, "ticketInfo")
        this.ticketInfo.forEach((res : any) => {
          res.events.start = res.events.start.replace('Z', '');    
          res.events.end = res.events.end.replace('Z', '');
        });
          this.utilityService.stopLoader();
        }
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  seemore(): void {
    this.pageTicket++;
    this.fetchUserTicketDetails();
    this.prevdata = true;
  }
  prevData(): void {
    this.pageTicket--;
    if (this.pageTicket === 1) {
      this.prevdata = false;
    } else {
      this.prevdata = true;
    }
    this.fetchUserTicketDetails();
  }
  fetchUserPendingRsvpDetils(): void {
    this.utilityService.startLoader();
    const body = {
      page: this.pagePending,
      limit: 10,
      status: 'pending'
    };
    this.rsvp_service.getUserRsvpDetails(body).then((response: any) => {
      if (response.success) {
        this.PendingTicketDetails = response.data.RSPVList;
        this.PendingTicketDetails.forEach((element: any) => {
          element.sender.forEach((name: any) => {
            this.userNamePending = name.name;
          });
        });
        this.totalCountPending = response.data.RSPVPendingCount[0] ? response.data.RSPVPendingCount[0].count : 0;
        this.profileService.RsvpPendingStatusUpdate$.next(this.totalCountPending);

        this.utilityService.stopLoader();
      }
    })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  fetchUserAcceptedRsvpDetils(): void {
    this.utilityService.startLoader();
    const body = {
      page: this.pageAccepted,
      limit: 10,
      status: 'accepted'
    };
    this.rsvp_service.getUserRsvpDetails(body).then((response: any) => {
      if (response.success) {
        this.AcceptedTicketDetails = response.data.RSPVList;
        this.totalCountAccept = response.data.RSPVAcceptedCount[0] ? response.data.RSPVAcceptedCount[0].count : 0;
        this.profileService.RsvpPendingStatusUpdate$.next(this.totalCountPending);

        this.utilityService.stopLoader();
      }
    })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  handlePageEvent(event: any): any {
    this.pageIndexPending = event.pageIndex;
    this.PendingTicketDetails.page = event.pageIndex + 1;
    this.pagePending = this.PendingTicketDetails.page;
    this.fetchUserPendingRsvpDetils();
  }
  handlePageEventAccepted(event: any): any {
    this.pageIndexAccepted = event.pageIndex;
    this.PendingTicketDetails.pageAccepted = event.pageIndex + 1;
    this.pageAccepted = this.PendingTicketDetails.pageAccepted;
    this.fetchUserAcceptedRsvpDetils();
  }
  moveAcceptTab(id: any): void {
    this.utilityService.startLoader();
    const userId = id;
    const body = {
      id: Number(userId),
      status: 'accepted'
    };
    this.rsvp_service.putRsvpStatus(body).then((response: any) => {
      if (response.success) {
        this.fetchUserPendingRsvpDetils();
        this.fetchUserAcceptedRsvpDetils();
        this._snackBar.open(this.userNamePending + ' ' + this.STRINGS.groupTicket.notification, '', {
          duration: 1000,
          panelClass: 'snake-custom'
        });
        this.utilityService.stopLoader();
      }
    })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  groupTicketTabs(data: any): void {
    this.updateEventid = data.events.id ;
    this.sharedService.headerLayout.emit({
      headerSize: this.STRINGS.headerSize.small,
      headerName: this.STRINGS.RspvCheckbox.rspv,
      isBack: false,
      isActive: this.STRINGS.header.rsvp
    });
    this.MultipleTicketinfo = data;
    console.log(this.MultipleTicketinfo, 'this.MultipleTicketinfo')

    this.MultipleTicketinfo.events.start = this.MultipleTicketinfo.events.start.replace("Z", '')
    this.MultipleTicketinfo.events.end = this.MultipleTicketinfo.events.end.replace("Z", '')

    this.groupArrayTop = this.MultipleTicketinfo.events;
    this.TicketBookedClone = [];
    this.MultipleTicketinfo.events.ticketBooked.forEach((element:any) => {
      element.ticket_number_booked_rel.forEach((bookedRef:any) => {
        this.TicketBookedClone.push({
          description: element.ticket_info[0].description, 
          ticketType: element.ticketType,
          pricePerTicket: element.pricePerTicket,
          tickerId : element.id,
          TicketBookedStatus: element.status,
          QRCode: bookedRef.QRCode,
          cancelledBy: bookedRef.cancelledBy,
          id: bookedRef.id,
          status: bookedRef.status,
          ticketNumber: bookedRef.ticketNumber,
        })
      });
     // console.log(this.TicketBookedClone, 'status void')
  });
    this.SignleTicket = !this.SignleTicket;
  }
  getUpdateArray(){
    this.updateTicketClone = {
      ticketType: this.updateTicketClone.ticketType,
      pricePerTicket: this.updateTicketClone.pricePerTicket,
      tickerId : this.updateTicketClone.id,
      QRCode: this.updateTicketClone.QRCode,
      cancelledBy: this.updateTicketClone.cancelledBy,
      id: this.updateTicketClone.id,
      status: "cancelled",
      ticketNumber: this.updateTicketClone.ticketNumber,
    };
    this.TicketBookedClone[this.GroupTicketIndex] = this.updateTicketClone;
   }


  backToFirstStep(): void {
    this.sharedService.headerLayout.emit({
      headerSize: this.STRINGS.headerSize.small,
      headerName: this.STRINGS.RspvCheckbox.rspv,
      isBack: true,
      isActive: this.STRINGS.header.rsvp
    });
    this.SignleTicket = !this.SignleTicket;
  }
  CancleStatus(id: any): void {
    this.utilityService.startLoader();
    const userId = id;
    const body = {
      id: Number(userId),
      status: 'rejected'
    };
    this.rsvp_service.putRsvpStatus(body).then((response: any) => {
      if (response.success) {
        this.fetchUserPendingRsvpDetils();
        this.fetchUserAcceptedRsvpDetils();
        this._snackBar.open('cancel status', '', {
          duration: 1000,
          panelClass: 'snake-custom'
        });
        this.utilityService.stopLoader();
      }
    });

  }
  cancelTicket(ticketNumberId: any, ticketBookId: any, qrKey: any, indexclone: any): void {
    this.GroupTicketIndex = indexclone
    this.updateTicketClone = this.TicketBookedClone[indexclone]
    const dialogRef = this.dialog.open(Alertdialog, {
      width: '512px',
      data: {
        ticketNumberId,
        ticketBookId,
        qrKey
      },
      panelClass: 'custom_dilog',
    });
    dialogRef.afterClosed().subscribe((data) => {
      console.log(ticketCanceled)
      if(ticketCanceled === 1){
        ticketCanceled = 0;
        this.getUpdateArray()
        this.fetchUserTicketDetails()
      }
    });
  }
 
  TicketDownload(index: any, EventName: any, ): void {
    // if(status == 'cancelled'){
    //   return
    // }
    window.scroll(0, 0);
    alert('Image download start please wait');
    const options = { cacheBust: true };
    domtoimage.toJpeg(document.querySelector('#mainContainer' + index) as HTMLElement, options)
      .then((dataUrl): any => {
        const link = document.createElement('a');
        const img = new Image();
        img.src = dataUrl;
        link.download = EventName + '.jpeg';
        link.href = dataUrl;
        link.click();
      });
  }
  viewAll(type: any, arrayName: any): any {
    this[type] = this[arrayName].length;
  }
  viewAllTo(type: any, arrayName: any): any {
    this[type] = this[arrayName].length;
  }
}
@Component({
  selector: 'ticket-alert-dialog',
  templateUrl: 'ticket-alert-dialog.html',
  encapsulation: ViewEncapsulation.None,
})
export class Alertdialog {
  qrKey: any;
  ticketBookId: any;
  ticketNumberId: any;
  constructor(public dialogRef: MatDialogRef<Alertdialog>,
              @Inject(MAT_DIALOG_DATA) public data: Alertdialog,
              public dialog: MatDialog,
              public rsvp_service: RsvpService, private route: ActivatedRoute,
              public utilityService: UtilityService) {
    this.qrKey = data.qrKey;
    this.ticketBookId = data.ticketBookId;
    this.ticketNumberId = data.ticketNumberId;
  }
  ngOnInit(): void {
  }
  ticketCancel(): void {
    const body = {
      QRkey: this.qrKey,
      ticketBookId: this.ticketBookId,
      ticketNumberId: this.ticketNumberId
    };
    this.rsvp_service.putRsvpTicketCancel(body).then((response: any) => {
      if (response.success) {
        this.rsvp_service.getUserRsvpTicketBooked()
          .then((response: any) => {
            this.dialogRef.close();
            if (response.success) {
              this.dialogopen("Ticket is cancelled");
              ticketCanceled = 1; 
            }
          }).catch((error: any) => {
            this.dialoerrorgopen(error.error.message);
            this.utilityService.routingAccordingToError(error);
          });
      }
    }).catch((error: any) => {
      this.dialogRef.close();
      this.dialoerrorgopen(error.error.message + ' or Refresh Page');
      this.utilityService.routingAccordingToError(error);
    });
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
  dialoerrorgopen(name: any): void {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: '460px',
      data: {
        name,
      },
      panelClass: 'custom_dilog',
    });
  }

 
}
