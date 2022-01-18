import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service'
import { localString } from '../../../shared/utils/strings';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event.service';
declare let $: any;
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CustomDatepickerComponent } from '../../../components/customdatepicker/custom-datepicker/custom-datepicker.component';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';

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
  selector: 'app-edit-event-ticket',
  templateUrl: './edit-event-ticket.component.html',
  styleUrls: ['./edit-event-ticket.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EditEventTicketComponent implements OnInit, OnDestroy {
  STRINGS: any = localString;
  eventId: any = '';
  ticketData: any = [];
  editForm: any = false;
  isSubmitted: any = false;
  customHeader = CustomDatepickerComponent;
  isEditable: any = false;
  ticketInfo: any = '';
  editTicketForm: any = '';
  eventStartDate: any;
  eventEndDate: any;
  ticketForm!: FormGroup;
  radioId: any;
  body: any;
  ticketType: any;
  deleteTicketIndex: any;
  confirmDelete: any = false;
  contentSubscription: Subscription;
  todayDate: Date = new Date();
  backButton: any = false;
  ShowDiscount: any = true;
  HideDiscount: any = false;
  validation_error = {
    'discount': [
      { type: 'required', message: 'Enter value between 0-100' },
      { type: 'pattern', message: 'Value must be less than or equal to 100' },
      {
        type: 'maxlength',
        message: 'Max value between 100'
      },
    ]
  }

  constructor(
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private router: Router,
    private utilityService: UtilityService) {

    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.editEventTicket.editTicketPageHeading,
      isBack: true,
      headerSize: this.STRINGS.headerSize.small,
    });
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.contentSubscription = this.sharedService.modalContent.subscribe((data) => {
      if (data.confirmSelection) {
        this.confirmDelete = data.confirmSelection ?? false;
        if (this.confirmDelete) {
          this.utilityService.startLoader();
          this.body = {
            ticketCreate: [],
            ticketDisabled: [this.deleteTicketIndex]
          };
          this.eventService.postEditedTickets(this.body, this.eventId).then((response: any) => {
            if (response.success) {
              this.utilityService.stopLoader();
              $('#success-modal').modal('show');
              this.sharedService.modalContent.emit({ content: 'Deleted successfully', done: true, afterClick: true });
              this.editEventTicket();
              return;
            }
          }).catch((error: any) => {
            this.utilityService.stopLoader();
            this.utilityService.routingAccordingToError(error);
          });
        }
      }
      if (data.doneBackFunction) {
        this.backClick();
      }
    });

  }

  ngOnInit(): void {
    this.editEventTicket();
    this.initializeTicketForm();
  }
  initializeTicketForm(): any {
    this.ticketForm = <FormGroup>this.formBuilder.group({
      id: [''],
      ticketType: [null],
      ticketName: [null, [Validators.required, Validators.maxLength(25)]],
      categoryName: [null, [Validators.required]],
      ticketPrice: [null, [Validators.required]],
      pricePerTable: [null, [Validators.required]],
      ticketQuantity: [null, [Validators.required]],
      tables: [0, [Validators.required]],
      persons: [0, [Validators.required]],
      ticketDescription: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      cancellationCharge: [10, [Validators.required, Validators.min(10), Validators.max(100), Validators.pattern('^[0-9]*$'),
      Validators.maxLength(3)]],
      // [10, [Validators.pattern('^[0-9]*$')], Validators.required, Validators.min(10), Validators.max(100)],
      discount: new FormControl('', Validators.compose([ Validators.maxLength(3), Validators.pattern('^[1-9][0-9]?$|^100$')])),
      ticketStartDate: [null, [Validators.required]],
      ticketEndDate: [null, [Validators.required]],
      ticketStartTime: [null, [Validators.required]],
      ticketEndTime: [null, [Validators.required]],
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
  inputIncrment(type: string, maxValue: any): any {
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

  ticketValidator(): any {
    if (this.editTicketForm[0].ticketType.toString().toUpperCase() === 'PAID') {
      this.radioId = 0;
    }
    if (this.editTicketForm[0].ticketType.toString().toUpperCase() === 'FREE') {
      this.radioId = 1;
    }
    if (this.editTicketForm[0].ticketType.toString().toUpperCase() === 'RSVP') {
      this.radioId = 2;
    }
    if (this.editTicketForm[0].ticketType.toString().toUpperCase() === 'VIP') {
      this.radioId = 3;
    }
    if (this.editTicketForm[0].ticketType.toString().toUpperCase() === 'TABLES & SEATINGS') {
      this.radioId = 4;
    }
    this.isSubmitted = true;
    if (this.ticketForm.controls.ticketDescription.invalid) {
      this.isSubmitted = false;
      return;
    }
    if (this.radioId === 0 || this.radioId === 3) {
      if (this.ticketForm.controls.ticketName.invalid
        || this.ticketForm.controls.ticketPrice.invalid
        || this.ticketForm.controls.ticketQuantity.invalid
        || this.ticketForm.controls.cancellationCharge.invalid
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
      if (this.ticketForm.controls.ticketName.invalid ||
        this.ticketForm.controls.ticketPrice.invalid
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
     // console.log(this.isSubmitted);
    }
  }
  editEventTicket(): any {
    this.utilityService.startLoader();
    this.eventService.getEditEventTicket(this.eventId).then((response: any) => {
      this.ticketInfo = response.data;
      this.eventEndDate = moment(this.ticketInfo?.event.end).toDate();
      this.eventStartDate = moment(this.ticketInfo?.event.start).toDate();
    //  console.log(this.eventEndDate, this.eventStartDate);
    //  console.log(this.ticketInfo);
      if (response.data.freeNormal) {
        response.data.freeNormal.forEach((element: any) => {
          this.ticketData.push({
            ...element,
            ticketType: 'Free',
            startTime: moment(element.sellingStartTime, 'HH:mm:ss').format('HH:mm a'),
            endTime: moment(element.sellingEndTime, 'HH:mm:ss').format('HH:mm a'),
          });
        });
      }
      if (response.data.normalTicket) {
        response.data.normalTicket.regularNormal.forEach((element: any) => {
          this.ticketData.push(
            {
              ...element,
              ticketType: 'Rsvp',
              startTime: moment(element.sellingStartTime, 'HH:mm:ss').format('HH:mm a'),
              endTime: moment(element.sellingEndTime, 'HH:mm:ss').format('HH:mm a'),
            }
          );
        });
      }
      if (response.data.normalTicket) {
        response.data.normalTicket.vipNormal.forEach((element: any) => {
          this.ticketData.push(
            {
              ...element,
              ticketType: 'Vip',
              startTime: moment(element.sellingStartTime, 'HH:mm:ss').format('HH:mm a'),
              endTime: moment(element.sellingEndTime, 'HH:mm:ss').format('HH:mm a'),
            }
          );
        });
      }
      if (response.data.regularPaid) {
        response.data.regularPaid.forEach((element: any) => {
          this.ticketData.push(
            {
              ...element,
              ticketType: 'Paid',
              startTime: moment(element.sellingStartTime, 'HH:mm:ss').format('HH:mm a'),
              endTime: moment(element.sellingEndTime, 'HH:mm:ss').format('HH:mm a'),
            }
          );
        });
      }
      if (response.data.tableSeating) {
        response.data.tableSeating.regularTableSeating.forEach((element: any) => {
          this.ticketData.push(
            {
              ...element,
              ticketType: 'Tables & Seatings',
              startTime: moment(element.sellingStartTime, 'HH:mm:ss').format('HH:mm a'),
              endTime: moment(element.sellingEndTime, 'HH:mm:ss').format('HH:mm a'),
            }
          );
        });
      }
      if (response.data.tableSeating) {
        response.data.tableSeating.vipTableSeating.forEach((element: any) => {
          this.ticketData.push(
            {
              ...element,
              ticketType: 'Vip',
              startTime: moment(element.sellingStartTime, 'HH:mm:ss').format('HH:mm a'),
              endTime: moment(element.sellingEndTime, 'HH:mm:ss').format('HH:mm a'),
            }
          );
        });
      }
    });
   // console.log(this.ticketData);
    this.utilityService.stopLoader();
  }
  editTicketdata(editId: any): void {
    this.editTicketForm = this.ticketData.filter(
      (data: any) => data.id === editId,
    );
    if (!this.editTicketForm[0].isSoldOut && !this.editTicketForm[0].isTicketBooked) {
      this.utilityService.startLoader();  
      this.ticketValidator();
      this.editForm = true;
      this.sharedService.headerLayout.emit({
        headerName: this.STRINGS.editEventTicket.editTicketPageHeading,
        isback: false
      });
      this.backButton = true;
      const editTicketInfo = {
        id: this.editTicketForm[0].id,
        ticketType: this.editTicketForm[0].ticketType,
        ticketName: this.editTicketForm[0].ticketName,
        ticketPrice: this.editTicketForm[0].pricePerTicket,
        pricePerTable: this.editTicketForm[0].pricePerTicket,
        tables: this.editTicketForm[0].noOfTables,
        persons: this.editTicketForm[0].parsonPerTable,
        ticketDescription: this.editTicketForm[0].description,
        cancellationCharge: this.editTicketForm[0].cancellationChargeInPer,
        discount: this.editTicketForm[0].discount,
        ticketStartDate: this.editTicketForm[0].sellingStartDate,
        ticketEndDate: this.editTicketForm[0].sellingEndDate,
        ticketStartTime: moment(this.editTicketForm[0].sellingStartTime, 'HH:mm:ss').toDate(),
        ticketEndTime: moment(this.editTicketForm[0].sellingEndTime, 'HH:mm:ss').toDate(),
        ticketQuantity: this.editTicketForm[0].totalQuantity,
        categoryName: this.editTicketForm[0].ticketName,
      };

      if (this.editTicketForm[0].discount > 0) {
        this.ShowDiscountBelow();
      } else {
        this.showAddDiscount()
      }
      this.ticketForm.patchValue(editTicketInfo);
    }
    this.utilityService.stopLoader();
  }
  deleteTicket(index: any): any {
    this.deleteTicketIndex = index;
    $('#alert-modal').modal('show');
    this.sharedService.modalContent.emit({
      content: this.STRINGS.alert.alertDelete,
      confirmationButtons: true
    });
  }
  updateTicket(): any {
    this.ticketValidator();
    if (!this.isSubmitted) {
      this.isSubmitted = true;
      return;
    }
    this.utilityService.startLoader();
    this.ticketBodyFilter();
    this.eventService.postEditedTickets(this.body, this.eventId).then((response: any) => {
      this.utilityService.stopLoader();
      if (response.success) {
        $('#success-modal').modal('show');
        this.sharedService.modalContent.emit({ content: response.message, done: true, afterClick: true });
        this.editEventTicket();
        return;
      }
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      this.utilityService.routingAccordingToError(error);
    });

  }
  ticketBodyFilter(): any {
    if (this.ticketForm.controls.ticketType.value === 'Free') {
      this.ticketType = 'freeNormal';
    }
    if (this.ticketForm.controls.ticketType.value === 'Paid') {
      this.ticketType = 'regularPaid';
    }
    if (this.ticketForm.controls.ticketType.value === 'Vip') {
      this.ticketType = 'vipNormal';
    }
    if (this.ticketForm.controls.ticketType.value === 'Rsvp') {
      this.ticketType = 'regularNormal';
    }
    if (this.ticketForm.controls.ticketType.value === 'Tables & Seatings') {
      this.ticketType = 'regularTableSeating';
    }
    if (this.ticketForm.controls.ticketType.value === 'Rsvp') {
      this.body = {
        ticketCreate: [
          {
            ticketType: this.ticketType,
            id: this.ticketForm.controls.id.value,
            ticketName: this.ticketForm.controls.ticketName.value,
            noOfTables: this.ticketForm.controls.tables.value,
            pricePerTable: this.ticketForm.controls.ticketPrice.value,
            description: this.ticketForm.controls.ticketDescription.value,
            parsonPerTable: this.ticketForm.controls.persons.value,
            totalQuantity: this.ticketForm.controls.ticketQuantity.value,
            cancellationChargeInPer: this.ticketForm.controls.cancellationCharge.value,
            pricePerTicket: this.ticketForm.controls.ticketPrice.value
          }
        ],
        ticketDisabled: []
      };
    }
    else {
      this.body = {
        ticketCreate: [
          {
            ticketType: this.ticketType,
            id: this.ticketForm.controls.id.value,
            ticketName: this.ticketForm.controls.ticketName.value,
            noOfTables: this.ticketForm.controls.tables.value,
            pricePerTable: this.ticketForm.controls.ticketPrice.value,
            description: this.ticketForm.controls.ticketDescription.value,
            parsonPerTable: this.ticketForm.controls.persons.value,
            totalQuantity: this.ticketForm.controls.ticketQuantity.value,
            discount:this.ticketForm.controls.discount.value,
            cancellationChargeInPer: this.ticketForm.controls.cancellationCharge.value,
            pricePerTicket: this.ticketForm.controls.ticketPrice.value,
            sellingStartDate: moment(this.ticketForm.controls.ticketStartDate.value).format('YYYY-MM-DD'),
            sellingStartTime: moment(this.ticketForm.controls.ticketStartTime.value).format('HH:mm:ss'),
            sellingEndDate: moment(this.ticketForm.controls.ticketEndDate.value).format('YYYY-MM-DD'),
            sellingEndTime: moment(this.ticketForm.controls.ticketEndTime.value).format('HH:mm:ss')
          }
        ],
        ticketDisabled: []
      };
    }
  }
  backClick(): any {
    this.ticketData.length = 0;
    this.editEventTicket();
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.editEventTicket.editTicketPageHeading,
      isBack: true,
      headerSize: this.STRINGS.headerSize.small,
    });
    this.editForm = false;
  }
  createTicket(): any {
    this.router.navigate(['event/create-ticket/' + this.eventId]);
  }
  ngOnDestroy(): void {
    this.contentSubscription.unsubscribe();
  }

  ShowDiscountBelow() {
    this.ShowDiscount = false;
    this.HideDiscount = true;
  }
  showAddDiscount() {
    this.ticketForm.controls.discount.setValue(null);
    this.ShowDiscount = true;
    this.HideDiscount = false;
  }
}