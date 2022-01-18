import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from '../../../shared/utils/strings';
import { FormBuilder, FormControl, Validators, FormGroup, ValidatorFn } from '@angular/forms';
declare let $: any;
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CustomDatepickerComponent } from '../../../components/customdatepicker/custom-datepicker/custom-datepicker.component';

import { MatDialog } from '@angular/material/dialog';
import { EventService } from '../event.service';
import { SuccessDialogComponent } from 'src/app/dialog/success-dialog/success-dialog.component';
import { DatePipe } from '@angular/common';
class CustomDateAdapter extends MomentDateAdapter {
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): any {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }
}
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};



@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateTicketComponent implements OnInit, OnDestroy {
  STRINGS: any = localString;
  customHeader = CustomDatepickerComponent;
  contentSubscription: Subscription;
  ticketForm!: FormGroup;
  radioLabels = ['Paid', 'Free', 'RSVP', 'VIP', 'Tables & Seatings'];
  radioId: any;
  isSubmitted: any = true;
  ticketInfo: any = [];
  isEditable: any = false;
  confirmDelete: any = false;
  ShowDiscount: any = true;
  HideDiscount: any = false;
  deleteTicketIndex: any;
  [key: string]: any;
  dateValidator: any;
  createEventDetails: any = '';
  eventStartDate: any;
  eventEndDate: any;
  starttime: any;
  endtime: any;
  todayDate: Date = new Date();
  edit: any;
  freeEvent = [];
  paidEvent = []
  rsvpEvent = []
  tableSeating = []
  vipEvent = []
  constructor(
    private eventservice: EventService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private utilityService: UtilityService) {
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.header.createTicket,
      isBack: false,
    });
    this.contentSubscription = this.sharedService.modalContent.subscribe((data) => {
      if (data.confirmSelection) {
        this.confirmDelete = data.confirmSelection ?? false;
        if (this.confirmDelete) {
          this.ticketInfo.splice(this.deleteTicketIndex, 1);
        }
      }
    });
  }

  validation_error = {
    'discount': [
      { type: 'pattern', message: 'Value must be less than or equal to 100' },
      {
        type: 'maxlength',
        message: 'Max value between 100'
      },
    ]
  }


  ngOnInit(): void {
    this.initializeTicketForm();
    this.utilityService.createEventDetails.subscribe(res => {
      this.createEventDetails = res;
      // console.log("eventDetails", this.createEventDetails );
      this.starttime = moment(this.createEventDetails?.startTime).toDate()
      this.endtime = moment(this.createEventDetails?.endTime).toDate()
      this.eventEndDate = moment(this.createEventDetails?.end).toDate();
      this.eventStartDate = moment(this.createEventDetails?.start).toDate();
    });
    // console.log(this.createEventDetails);
    
    this.edit = this.route.snapshot.paramMap.get('edit');
    if (this.edit != null) {
      this.eventDetail();
     
      return;
    } else {
      if (this.createEventDetails === '') {
        this.router.navigate(['/event/create-event']);
      }
      else {
        this.utilityService.detailedEvent.subscribe(res => {
          // console.log(res, "ticketDetails")
          this.ticketInfo = res.body.ticketDetails;
          // this.ticketInfo = res.body?.ticketDetails;
          // this.ticketInfo = res.body?.ticketDetails;
        });
      }
    }
    this.setTicketType(1);
    this.setTicketStartEndDate();
  }
  eventDetail():any{
    this.utilityService.startLoader();
    this.eventservice.getUserEventdetailbyid(this.edit, '')
    .then((response: any) => {
      this.utilityService.stopLoader();
      if (response.success) {
        this.utilityService.stopLoader();
        this.createEventDetails = response.data;
        this.setTicketType(1);
        this.setTicketStartEndDate();
      }})
    .catch((error: any) => {
      this.utilityService.stopLoader();
      this.utilityService.routingAccordingToError(error);
    });
  }
  backToEventCreate(): any {
    if (this.edit !== null) {
      this.router.navigate(['event/edit-event-ticket/' + this.edit]);
      return;
    }
    const body = {
      createEvent: this.createEventDetails,
      ticketDetails: this.ticketInfo,
    };
    this.utilityService.detailedEvent.next({
      body
    });
    this.router.navigate(['/event/create-event']);
  }
  initializeTicketForm(): any {
    this.ticketForm = this.formBuilder.group({
      ticketType: [null, [Validators.required]],
      ticketName: [null, [Validators.required, Validators.maxLength(50)]],
      categoryName: [null, [Validators.required, Validators.maxLength(25)]],
      ticketPrice: [null, [Validators.required]],
      ticketQuantity: [null, [Validators.required]],
      tables: [0, [Validators.required]],
      persons: [0, [Validators.required]],
      ticketDescription: [null, [Validators.minLength(0), Validators.maxLength(250)]],
      cancellationCharge: [10, [Validators.required, Validators.min(10), Validators.max(100), Validators.pattern('^[0-9]*$')]],
      discount: new FormControl('', Validators.compose([
        Validators.maxLength(3), Validators.pattern('^[1-9][0-9]?$|^100$')])),
      ticketStartDate: [null, [Validators.required]],
      ticketEndDate: [null, [Validators.required]],
      ticketStartTime: ['', [Validators.required]],
      ticketEndTime: ['', [Validators.required]],
    });

    this.ticketForm.get('cancellationCharge')!.valueChanges.subscribe(value => {
      if (value > 100) {
        this.ticketForm.controls['cancellationCharge'].setValue(100);
      }
    });
  }

  onCancellationChargeChange(type: string, event: any): void {
    if (Number(event.target.value) < 10) {
      this.ticketForm.controls['cancellationCharge'].setValue(10);
    }
  }

  onCancellationChargeKeypress(type: string, event: any): void {
    if (Number(event.target.value) > 10) {
      event.preventDefault();
    }
  }

  counterIncrement(type: string, maxValue: any): any {
    if (this.ticketForm.controls[type].value >= maxValue) {
      return;
    } else {
      this.ticketForm.controls[type].setValue(Number(this.ticketForm.controls[type].value) + 1);
    }
  }
  counterDecrement(type: string, maxValue: any): any {
    if (this.ticketForm.controls[type].value <= maxValue) {
      return;
    } else {
      this.ticketForm.controls[type].setValue(this.ticketForm.controls[type].value - 1);
    }
  }
  updateTicket(): any {
    this.ticketValidator();
    if (!this.isSubmitted) {
      this.isSubmitted = true;
      window.scroll(0, 0);
      return;
    }
    this.ticketInfo.push(this.ticketForm.value);
    this.isEditable = false;
    this.setTicketType(1);
    window.scroll(0, 0);
  }
  setTicketType(id: any): any {
    if (!this.isEditable) {
      this.radioId = id;
      this.ticketForm.reset();
      this.isSubmitted = false;
      this.ticketForm.controls.ticketType.setValue('Free');
      this.ticketForm.controls.cancellationCharge.setValue(10);
      this.ticketForm.controls.tables.setValue(0);
      this.ticketForm.controls.persons.setValue(0);
      if (id !== 2) {
        this.setTicketStartEndDate();
      }
    }
  }
  editTicket(index: any): any {
    this.isEditable = true;
    if (this.ticketInfo[index].ticketType === 'Paid') {
      this.radioId = 0;
    }
    if (this.ticketInfo[index].ticketType === 'Free') {
      this.radioId = 1;
    }
    if (this.ticketInfo[index].ticketType === 'RSVP') {
      this.radioId = 2;
    }
    if (this.ticketInfo[index].ticketType === 'VIP') {
      this.radioId = 3;
    }
    if (this.ticketInfo[index].ticketType === 'Tables & Seatings') {
      this.radioId = 4;
    }
    const editTicketInfo = {
      ticketType: this.ticketInfo[index].ticketType,
      ticketName: this.ticketInfo[index].ticketName,
      ticketPrice: this.ticketInfo[index].ticketPrice,
      tables: this.ticketInfo[index].tables,
      persons: this.ticketInfo[index].persons,
      ticketDescription: this.ticketInfo[index].ticketDescription,
      cancellationCharge: this.ticketInfo[index].cancellationCharge,
      discount: this.ticketInfo[index].discount,
      ticketStartDate: this.ticketInfo[index].ticketStartDate,
      ticketEndDate: this.ticketInfo[index].ticketEndDate,
      ticketStartTime: this.ticketInfo[index].ticketStartTime,
      ticketEndTime: this.ticketInfo[index].ticketEndTime,
      ticketQuantity: this.ticketInfo[index].ticketQuantity,
      categoryName: this.ticketInfo[index].categoryName
    };

    if (this.ticketInfo[index].discount > 0) {
      this.ShowDiscountBelow();
    } else {
      this.showAddDiscount()
    }

    this.ticketForm.patchValue(editTicketInfo);
    this.ticketInfo.splice(index, 1);
  }
  deleteCard(index: any): any {
    this.deleteTicketIndex = index;
    $('#alert-modal').modal('show');
    this.sharedService.modalContent.emit({
      content: this.STRINGS.alert.alertDelete,
      confirmationButtons: true
    });
  }
  ticketValidator(): any {
    this.isSubmitted = true;
    if (this.ticketForm.controls.ticketDescription.invalid
      || this.ticketForm.controls.ticketType.invalid) {
      this.isSubmitted = false;
      return;
    }
    if (this.radioId === 0 || this.radioId === 3) {
      if (this.ticketForm.controls.ticketName.invalid
        || this.ticketForm.controls.ticketPrice.invalid
        || this.ticketForm.controls.ticketQuantity.invalid
        || this.ticketForm.controls.cancellationCharge.invalid
        || this.ticketForm.controls.discount.invalid
        || this.ticketForm.controls.ticketStartDate.invalid
        || this.ticketForm.controls.ticketEndDate.invalid
        || this.ticketForm.controls.ticketStartTime.invalid
        || this.ticketForm.controls.ticketEndTime.invalid) {
        this.isSubmitted = false;
        return;
      }
    }
    if (this.radioId === 1) {
      if (this.ticketForm.controls.ticketName.invalid
        || this.ticketForm.controls.ticketQuantity.invalid
        || this.ticketForm.controls.ticketStartDate.invalid
        || this.ticketForm.controls.ticketEndDate.invalid
        || this.ticketForm.controls.ticketStartTime.invalid
        || this.ticketForm.controls.ticketEndTime.invalid) {
        this.isSubmitted = false;
        return;
      }
    }
    if (this.radioId === 2) {
      if (this.ticketForm.controls.ticketName.invalid
        || this.ticketForm.controls.ticketQuantity.invalid
      ) {
        this.isSubmitted = false;
        return;
      }
    }
    if (this.radioId === 4) {
      if (this.ticketForm.controls.categoryName.invalid
        || this.ticketForm.controls.ticketPrice.invalid
        || this.ticketForm.controls.tables.invalid
        || this.ticketForm.controls.persons.invalid
        || this.ticketForm.controls.cancellationCharge.invalid
        || this.ticketForm.controls.ticketStartDate.invalid
        || this.ticketForm.controls.ticketEndDate.invalid
        || this.ticketForm.controls.ticketStartTime.invalid
        || this.ticketForm.controls.ticketEndTime.invalid) {
        this.isSubmitted = false;
        return;
      }
    }
  }
  saveTicketDetails(): any {

    // if (this.edit !== null) {
    //   this.router.navigate(['event/edit-event-ticket/' + this.edit]);
    // } else {
    const ticketTypes = this.ticketInfo.map(({ ticketType }: any) => ticketType);
    if (this.ticketInfo.length === 0) {
      $('#alert-modal').modal('show');
      this.sharedService.modalContent.emit({ content: 'Atleast one Ticket Compulsary' });
      return;
    }
    // if (!ticketTypes.includes('Free')) {
    //   $('#alert-modal').modal('show');
    //   this.sharedService.modalContent.emit({ content: 'Regular Ticket is compulsary' });
    //   return;
    // }
    const body = {
      createEvent: this.createEventDetails,
      ticketDetails: this.ticketInfo,
    };
    this.utilityService.detailedEvent.next({
      body
    });
    this.router.navigate(['/event/review-event']);
    // }
  }
  setTicketStartEndDate(): any {
    let body ={}
    if (this.edit !== null){
      body = {
        ticketStartDate: new Date(),
        ticketEndDate: moment(this.createEventDetails?.end).toDate(),
        ticketStartTime: new Date(),
        ticketEndTime: moment(this.createEventDetails?.end, 'HH:mm:ss').toDate()
      };
    }else{
     body = {
        ticketStartDate: new Date(),
        ticketEndDate: moment(this.createEventDetails?.end).toDate(),
        ticketStartTime: new Date(),
        ticketEndTime: moment(this.createEventDetails?.endTime, 'HH:mm:ss').toDate()
      };
    }
    this.ticketForm.patchValue(body);
    }
  editTicketCard(index: any): any {
    if (!this.isEditable) {
      this.editTicket(index);
    }
  }
  deleteTicketCard(index: any): any {
    if (!this.isEditable) {
      this.deleteCard(index);
    }
  }
  ngOnDestroy(): any {
    this.contentSubscription.unsubscribe();
  }

  // emptyEndDate(){

  //   this.startTime = moment.utc(this.ticketForm.value.ticketStartTime, 'HH:mm:ss').format('hh:mm a');
  //   this.endTime = moment.utc(this.ticketForm.value.ticketEndTime, 'HH:mm:ss').format('hh:mm a');
  //   this.eventStartDate = moment(this.ticketForm.value.eventStartDate).format('YYYY-MM-DD');
  //   this.eventEndDate = moment(this.ticketForm.value.eventEndDate).format('YYYY-MM-DD');
  //   if(this.startTime != "Invalid date" && this.endTime != "Invalid date" && this.startTime == this.endTime && this.eventStartDate == this.eventEndDate) {
  //     this.endtime = undefined;
  //     this.ticketForm.patchValue({ endTime: undefined });
  //     const dialogRef = this.dialog.open(AlertdialogComponent, {
  //       width: '460px',
  //       data: {
  //         name: "Start time & End time should not be same",
  //       },
  //       panelClass: 'custom_dilog',
  //     }); 
  //   } else {
  //     console.log(false);
  //   }
  // }
  ShowDiscountBelow() {
    this.ShowDiscount = false;
    this.HideDiscount = true;
  }
  showAddDiscount() {
    this.ShowDiscount = true;
    this.HideDiscount = false;
    this.ticketForm.controls['discount'].setValue(undefined);

  }
  submitTicket() {
    this.utilityService.startLoader();
    const ticketTypes = this.ticketInfo.map(({ ticketType }: any) => ticketType);
    if (this.ticketInfo.length === 0) {
      this.utilityService.stopLoader()
      $('#alert-modal').modal('show');
      this.sharedService.modalContent.emit({ content: 'Atleast one Ticket Compulsary' });
      return;
    }
    const body = {
      createEvent: this.createEventDetails,
      ticketDetails: this.ticketInfo,
    };
    // this.utilityService.detailedEvent.next({
    //   body
    // });


    this.reviewEventDetails = body;
    console.log('63', this.reviewEventDetails);
    // localStorage.setItem('reviewDetails', JSON.stringify(this.reviewEventDetails));
    // this.filterTicket();

    const freeEventdetails = this.reviewEventDetails?.ticketDetails.filter(
      (data: any) => data.ticketType === 'Free',
    );
    freeEventdetails.forEach((element: any[]) => {
      this.freeEvent = freeEventdetails.map((data: any) => ({
        description: data.ticketDescription,
        ticketName: data.ticketName,
        totalQuantity: data.ticketQuantity,
        discount: data.discount,
        sellingStartDate: moment(data.ticketStartDate).format('YYYY-MM-DD'),
        sellingStartTime: moment(data.ticketStartTime).format('HH:mm:ss'),
        sellingEndDate: moment(data.ticketEndDate).format('YYYY-MM-DD'),
        sellingEndTime: moment(data.ticketEndTime).format('HH:mm:ss')
      }));
    });
    const paidEventdetails = this.reviewEventDetails?.ticketDetails.filter((data: any) => {
      return data.ticketType === 'Paid';
    });
    paidEventdetails.forEach((element: any[]) => {
      this.paidEvent = paidEventdetails.map((data: any) => ({
        description: data.ticketDescription,
        ticketName: data.ticketName,
        totalQuantity: data.ticketQuantity,
        discount: data.discount,
        pricePerTicket: data.ticketPrice,
        cancellationChargeInPer: data.cancellationCharge,
        sellingStartDate: moment(data.ticketStartDate).format('YYYY-MM-DD'),
        sellingStartTime: moment(data.ticketStartTime).format('HH:mm:ss'),
        sellingEndDate: moment(data.ticketEndDate).format('YYYY-MM-DD'),
        sellingEndTime: moment(data.ticketEndTime).format('HH:mm:ss')
      }));
    });

    const rsvpEventdetails = this.reviewEventDetails?.ticketDetails.filter((data: any) => {
      return data.ticketType === 'RSVP';
    });
    rsvpEventdetails.forEach((element: any[]) => {
      this.rsvpEvent = rsvpEventdetails.map((data: any) => ({
        description: data.ticketDescription,
        ticketName: data.ticketName,
        totalQuantity: data.ticketQuantity
      }));
    });
    const vipEventdetails = this.reviewEventDetails?.ticketDetails.filter((data: any) => {
      return data.ticketType === 'VIP';
    });
    vipEventdetails.forEach((element: any[]) => {
      this.vipEvent = vipEventdetails.map((data: any) => ({
        description: data.ticketDescription,
        ticketName: data.ticketName,
        totalQuantity: data.ticketQuantity,
        discount: data.discount,
        pricePerTicket: data.ticketPrice,
        cancellationChargeInPer: data.cancellationCharge,
        sellingStartDate: moment(data.ticketStartDate).format('YYYY-MM-DD'),
        sellingStartTime: moment(data.ticketStartTime).format('HH:mm:ss'),
        sellingEndDate: moment(data.ticketEndDate).format('YYYY-MM-DD'),
        sellingEndTime: moment(data.ticketEndTime).format('HH:mm:ss')
      }));
    });
    const tableseatingdetails = this.reviewEventDetails?.ticketDetails.filter((data: any) => {
      return data.ticketType === 'Tables & Seatings';
    });
    tableseatingdetails.forEach((element: any[]) => {
      this.tableSeating = tableseatingdetails.map((data: any) => ({
        cancellationChargeInPer: data.cancellationCharge,
        description: data.ticketDescription,
        ticketName: data.categoryName,
        pricePerTicket: data.ticketPrice,
        discount: data.discount,
        personPerTable: data.persons,
        noOfTables: data.tables,
        sellingStartDate: moment(data.ticketStartDate).format('YYYY-MM-DD'),
        sellingStartTime: moment(data.ticketStartTime).format('HH:mm:ss'),
        sellingEndDate: moment(data.ticketEndDate).format('YYYY-MM-DD'),
        sellingEndTime: moment(data.ticketEndTime).format('HH:mm:ss')
      }));
    });

    //body for posting 
    let ticketDetails: any;
    ticketDetails = {
      id: this.edit,
      vipSeatings: [],
      tableSeatings: [],
      regularSeatings: [],
      regularPaid: [],
      free: [],
    };
    console.log("ticketDetails 582", ticketDetails);
    if (this.freeEvent) {
      if (this.freeEvent.length > 0) {
        this.freeEvent.forEach((freeEventelement: any) => {
          ticketDetails.free.push(freeEventelement)
        });
        // ticketDetails.free.push(this.freeEvent);
        // body['free'] = JSON.stringify(this.freeEvent);
      }
    }

    if (this.paidEvent.length > 0) {
      this.paidEvent.forEach((paidEventelement: any) => {
        ticketDetails.regularPaid.push(paidEventelement);
      });
      // (JSON.stringify(this.paidEvent));
    }
    if (this.rsvpEvent.length > 0) {
      this.rsvpEvent.forEach((rsvpEventelement: any) => {
        ticketDetails.regularSeatings.push(rsvpEventelement);
      });
      // ticketDetails.regularSeatings.push(this.rsvpEvent);
    }
    if (this.tableSeating.length > 0) {
      this.tableSeating.forEach((tableSeatingelement: any) => {
        ticketDetails.tableSeatings.push(tableSeatingelement);
      });
      // ticketDetails.tableSeatings.push(JSON.stringify(this.tableSeating));
    }
    if (this.vipEvent.length > 0) {
      this.vipEvent.forEach((vipEventelement: any) => {
        ticketDetails.vipSeatings.push(vipEventelement);
      });
      // ticketDetails.vipSeatings.push(JSON.stringify(this.vipEvent));
    }
    console.log("ticketDetails 599", ticketDetails);

    // this.filterTicket();
    this.utilityService.createEventDetails.subscribe(res => {
      this.createEventDetails = res;
      console.log("eventDetails", this.createEventDetails);
      this.starttime = moment(this.createEventDetails?.startTime).toDate()
      this.endtime = moment(this.createEventDetails?.endTime).toDate()
      this.eventEndDate = moment(this.createEventDetails?.end).toDate();
      this.eventStartDate = moment(this.createEventDetails?.start).toDate();
    });
    //post Api
   
    this.eventservice.createTicketByEdit(ticketDetails).then((response: any) => {
      console.log(response);
      const res = response;
      if (res.success) {
        this.utilityService.stopLoader();
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          width: '460px',
          data: {
            message: 'Ticket Successfully Created',
          },
          panelClass: 'custom_dilog',
        });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['event/edit-event-ticket/' + this.edit]);
        });
      }
      this.utilityService.stopLoader();
      // const dialogRef = this.dialog.open(YoureventalertComponent, {
      //   width: '420px',
      //   data: {
      //     response
      //   },
      //   panelClass: 'custom_dilog'
      // });
      // dialogRef.afterClosed().subscribe(() => {
      //   localStorage.removeItem('eventData');
      //   localStorage.removeItem('matClockStartDateTime');
      //   localStorage.removeItem('matClockEndDateTime');
      //   // localStorage.removeItem('reviewDetails');
      //   this.utilityService.createEventDetails.next('');
      //   this.utilityService.venueDetails.next('');
      //   this.utilityService.detailedEvent.next('');
      //   this.utilityService.stopLoader();
      //   this.router.navigate(['/home']);
      // });
    })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        // this.utilityService.routingAccordingToError(error);
      });

  }
}
