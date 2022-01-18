import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ValidatorFn,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { PagesService } from '../../pages.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventService } from '../event.service';
import { ImageuploadComponent } from 'src/app/dialog/image-upload/imageupload.component';
import { PosteventComponent } from 'src/app/dialog/post-event/postevent.component';
import { MatChip, MatChipList } from '@angular/material/chips';
import { TwentyMinPopUpComponent } from 'src/app/dialog/twenty-min-pop-up/twenty-min-pop-up.component';
import { CustomDatepickerComponent } from '../../../components/customdatepicker/custom-datepicker/custom-datepicker.component';
import { DatePipe } from '@angular/common';
import { TitleCasePipe } from '@angular/common';
declare let $: any;
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
import { AlerteventComponent } from 'src/app/dialog/alertevent/alertevent.component';
import { environment } from '../../../../environments/environment.prod';
import { loadStripe } from '@stripe/stripe-js';
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

export interface subCategory {
  name: string;
}




@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    TitleCasePipe
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CreateEventComponent implements OnInit {
  STRINGS: any = localString;
  baseUrlEvent = environment.shareBaseUrl;
  eventForm!: FormGroup;
  @Input() anteMeridiemAbbreviation = 'am';

  radioLabel = [
    { name: this.STRINGS.createEvent.OneTime, value: 'oneTime' },
    { name: this.STRINGS.createEvent.Daily, value: 'daily' },
    { name: this.STRINGS.createEvent.Weekly, value: 'weekly' },
    { name: this.STRINGS.createEvent.SelectedDays, value: 'monthly' },
  ];
  radiotype = [
    { name: this.STRINGS.createEvent.publicEvent, value: 0 },
    { name: this.STRINGS.createEvent.PrivateEvent, value: 1 },
  ];

  weekDays: any = [
    { name: 'Monday', value: 1 },
    { name: 'Tuesday', value: 2 },
    { name: 'Wednesday', value: 3 },
    { name: 'Thursday', value: 4 },
    { name: 'Friday', value: 5 },
    { name: 'Saturday', value: 6 },
    { name: 'Sunday', value: 7 }
  ];

  monthDays: any = [
    { name: '1', value: 1 },
    { name: '2', value: 2 },
    { name: '3', value: 3 },
    { name: '4', value: 4 },
    { name: '5', value: 5 },
    { name: '6', value: 6 },
    { name: '7', value: 7 },
    { name: '8', value: 8 },
    { name: '9', value: 9 },
    { name: '10', value: 10 },
    { name: '11', value: 11 },
    { name: '12', value: 12 },
    { name: '13', value: 13 },
    { name: '14', value: 14 },
    { name: '15', value: 15 },
    { name: '16', value: 16 },
    { name: '17', value: 17 },
    { name: '18', value: 18 },
    { name: '19', value: 19 },
    { name: '20', value: 20 },
    { name: '21', value: 21 },
    { name: '22', value: 22 },
    { name: '23', value: 23 },
    { name: '24', value: 24 },
    { name: '25', value: 25 },
    { name: '26', value: 26 },
    { name: '27', value: 27 },
    { name: '28', value: 28 },
    { name: '29', value: 29 },
    { name: '30', value: 30 },
    { name: '31', value: 31 },
  ];

  @ViewChild('picker', { static: false }) picker!: ElementRef;
  customHeader = CustomDatepickerComponent;
  dateAndTimePicker: boolean = false;
  secondStep: boolean = false;
  firstStep: boolean = true;
  eventOccurrenceTypeStatus: any = 'oneTime';
  eventTypeStatus: number = 0;
  images: any = [];
  telentImages:any = [];
  sponserImages:any = [];
  GetFormValue: any;
  showtext: boolean = true;
  showUrlVarify: boolean = false;
  addImage = '../../../assets/img/add.png';
  deleteImage = '../../../assets/img/delete.svg';
  categoryList!: any;
  selectedCategoryId = '8';
  subCategoryList!: any;
  occuredOn: any = [];
  occuredOnArray: any = [0];
  selectedSubCategory: any = [];
  selectedSubCategoryArray: any = [];
  selectedImages: any = [];
  selectedtelentImages: any = [];
  selectedSponserImages: any = [];
  selectedCategoryArray: any = [];
  minDate = new Date();
  selectSubCategoryError: boolean = false;
  imagesError: boolean = false;
  venueDetails: any = '';
  venueImages: any = [];
  subjectEventDetails: any = '';
  id: any = 0;
  updateEventDetail: any = '';
  afterVenueSelectionImages: any = {};
  categoryName: any = '';
  eventOccurrenceTypeName: any = 'daily';
  startDate: any = new Date();
  starttime: any;
  endDate: any = new Date();
  endtime: any;
  imagesId: any = [];
  talentImageIds: any = [];
  sponserImageIds : any = [];
  removableImagesId: any = [];
  removabletelentImagesId: any = [];
  removableSponserImagesId: any = [];
  subVenueEvent: any = [];
  showErrorMessage: any = false;
  errorMessage: any;
  eventCustomUrl: any;
  // istelentImages:any = false;
  // istelentImages = true;
  quillConfig={
    // toolbar: '.toolbar',
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote'],

    // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    // [{ 'direction': 'rtl' }],                         // text direction

    // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    // [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean'],                                         // remove formatting button

     ['link']                         // link and image, video
      ]
    }
  };
  imagesCheckbox = { istelentImages: false, isSponserImages: false};

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    public dialog: MatDialog,
    private _service: PagesService,
    private eventService: EventService,
    private utilityService: UtilityService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private titlecasePipe:TitleCasePipe
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.sharedService.headerLayout.emit({
      headerName: 'Event creation',
      headerSize: this.STRINGS.headerSize.medium,
      isBack: true,
    });

    // Venue Detail from subject
    this.utilityService.venueDetails.subscribe((res) => {
      if (res) {
        this.venueDetails = res.venueDetail;
        this.venueImages = this.venueDetails.venueImages;
      }
    });
    // Post this venue data in event api
    this.utilityService.venueSubmitEvent.subscribe((res) => {
      if (res){
        this.subVenueEvent = res.subVenues;
      }
    });

    // Event Detail from subject
    this.utilityService.createEventDetails.subscribe((res) => {
      this.subjectEventDetails = res;
    });
  }

  ngOnInit(): void {
    this.InitializeEventForm();
    this.dateAndTimeForm(3);
    this.setChipsValue();

    // this.setOccuredOnChipsValue();
    this.getCatogory();
    this.categoryName = 'Nightlife & Social Events';
    this.FetchSubcatogoryID(8);
    if (this.id) {
      this.getEventDetails();
    }

    if (this.venueDetails != '') {
      this.firstStep = false;
      this.secondStep = true;
      this.eventForm.patchValue({ venueName: this.venueDetails.venueName });
      this.sharedService.headerLayout.emit({
        headerName: 'Event creation',
        headerSize: this.STRINGS.headerSize.medium,
        isBack: false,
      });
    }

    if (this.subjectEventDetails != '') {
      this.firstStep = false;
      this.secondStep = true;
      this.FetchSubcatogoryID(this.subjectEventDetails.categoryId);
      this.selectedSubCategoryArray = this.subjectEventDetails.subCategoryName;
      this.eventForm.patchValue({
        occurredOn: this.subjectEventDetails.occurredOn,
      });
      this.occuredOnArray = this.subjectEventDetails.occurredOn;
      this.eventTypeStatus = this.subjectEventDetails.eventType;
      this.eventForm.patchValue({
        eventType: this.subjectEventDetails.eventType
      });
      this.eventForm.patchValue({
        categoryId: this.subjectEventDetails.categoryId
      });
      this.eventForm.patchValue({
        subCategoryId: this.subjectEventDetails.subCategoryName,
      });
      this.selectedSubCategoryArray = this.subjectEventDetails.subCategoryName;
      this.selectedSubCategory = this.subjectEventDetails.subCategoryId;

      this.eventForm.patchValue({ name: this.subjectEventDetails.name });
      this.eventForm.patchValue({
        description: this.subjectEventDetails.description,
      });
      this.eventForm.patchValue({
        description2: this.subjectEventDetails.description2,
      });

      this.eventForm.patchValue({
        eventOccurrenceType: this.subjectEventDetails.eventOccurrenceType,
      });
      this.eventOccurrenceTypeStatus = this.subjectEventDetails.eventOccurrenceType;

      this.eventForm.patchValue({ start: _moment(this.subjectEventDetails.start).toDate() });
      this.startDate = _moment(this.subjectEventDetails.start).toDate();
      this.eventForm.patchValue({
        startTime: this.subjectEventDetails.startTime,
      });
      this.starttime = _moment(this.subjectEventDetails.startTime).toDate();
      this.endtime = _moment(this.subjectEventDetails.endTime).toDate();
      this.eventForm.patchValue({ endTime: _moment(this.subjectEventDetails.endTime).toDate() });
      this.eventForm.patchValue({ end: _moment(this.subjectEventDetails.end).toDate() });
      this.endDate = _moment(this.subjectEventDetails.end).toDate();

      // let uniqueImages =
      this.images = [...new Set(this.subjectEventDetails.images)];
      this.selectedImages = [...new Set(this.subjectEventDetails.selectedImages)];
      if(this.subjectEventDetails.telentImages) {
        this.imagesCheckbox.istelentImages = true;
        this.telentImages = [...new Set(this.subjectEventDetails.telentImages)];
        this.selectedtelentImages = [...new Set(this.subjectEventDetails.selectedtelentImages)];
      }
      if(this.subjectEventDetails.sponserImages) {
        this.imagesCheckbox.isSponserImages = true;
        this.sponserImages = [...new Set(this.subjectEventDetails.sponserImages)];
        this.selectedSponserImages = [...new Set(this.subjectEventDetails.selectedSponserImages)];
      }

      //
      this.sharedService.headerLayout.emit({
        headerName: 'Event creation',
        headerSize: this.STRINGS.headerSize.medium,
        isBack: false,
      });
    }
    localStorage.removeItem('eventEndDateTime');
    localStorage.removeItem('eventStartDateTime');
  }

  //  Create Event Form
  InitializeEventForm(): any {
    this.eventForm = this.fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(75),
      ]),
      venueName: new FormControl('', Validators.compose([Validators.required])),
      eventOccurrenceType: new FormControl('', Validators.compose([])),
      start: new FormControl(this.datePipe.transform(this.startDate, 'MM-dd-yyyy'), Validators.required),
      end: new FormControl(this.datePipe.transform(this.endDate, 'MM-dd-yyyy'), Validators.required),
      images: new FormControl(''),
      telentImages: new FormControl(''),
      sponserImages: new FormControl(''),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(4000),
      ]),
      description2: new FormControl('', [
        // Validators.required,
        // Validators.minLength(20),
        Validators.maxLength(250),
      ]),
      startTime: new FormControl(this.starttime, Validators.required),
      endTime: new FormControl(this.endtime, Validators.required),
      occurredOn: new FormControl([]),
      eventType: new FormControl('0', Validators.compose([])),
      categoryId: new FormControl('8', Validators.compose([])),
      subCategoryId: new FormControl(''),
      istelentImages: new FormControl(false),
      isSponserImages: new FormControl(false),
      eventUrl: new FormControl('',[Validators.pattern(/^[\w]+$/)]),
    });
  }

  // Event form
  getEventDetails() {
    this.utilityService.startLoader();
    this.utilityService.venueDetails.next('');
    this.eventService
      .getOrganiserEvent(this.id)
      .then((response: any) => {
        if (response.success) {
          this.updateEventDetail = response.data;
        //  console.log("this.updateEventDetail", this.updateEventDetail.start);

          this.firstStep = false;
          this.secondStep = true;
          this.eventForm.patchValue({
            eventOccurrenceType: this.updateEventDetail.eventOccurrenceType,
          });
          this.occuredOn =[];
          this.occuredOnArray =[];
          for (var i = 0; i < this.updateEventDetail.eventOccurrence.length; i++) {
            if(this.updateEventDetail.eventOccurrence[i].occurredOn != 0){
              this.occuredOn.push(this.updateEventDetail.eventOccurrence[i].occurredOn);
              this.occuredOnArray.push(this.updateEventDetail.eventOccurrence[i].occurredOn);
            }
          
          }
          console.log( this.occuredOnArray)
          this.eventForm.patchValue({
            occurredOn: this.occuredOn,
          });
          this.eventForm.patchValue({
            start: _moment(this.updateEventDetail.start).format('MM/DD/YYYY'),
          });
          this.eventForm.patchValue({
            end: _moment(this.updateEventDetail.end).format('MM/DD/YYYY'),
          });
          this.startDate = new Date(this.updateEventDetail.start.replace('Z', ''));
          this.endDate = new Date(this.updateEventDetail.end.replace('Z', ''));
          this.starttime =  new Date(this.updateEventDetail.start.replace('Z', ''));
          this.endtime = new Date(this.updateEventDetail.end.replace('Z', ''));
          this.eventForm.patchValue({
            categoryId: this.updateEventDetail.categoryId,
          });
          for (var i = 0; i < this.updateEventDetail.subCategories.length; i++) {
            this.selectedSubCategory.push(this.updateEventDetail.subCategories[i].id);
          }
          this.eventForm.patchValue({
            subCategoryId: this.selectedSubCategory,
          });

          this.eventForm.patchValue({ name: this.updateEventDetail.name });

          this.eventForm.patchValue({
            description: this.updateEventDetail.description,
          });
          this.eventForm.patchValue({
            description2: this.updateEventDetail.description2,
          });
          this.eventForm.patchValue({
            eventUrl: this.updateEventDetail.eventUrl,
          });
          if (!this.subjectEventDetails.images) {
            for (var i = 0; i < this.updateEventDetail.eventImages.length; i++) {
              this.images.push(this.updateEventDetail.eventImages[i]);
            }
            for (var i = 0; i < this.updateEventDetail.eventImages.length; i++) {
              this.selectedImages.push(this.images[i]);
            }
            for (var i = 0; i < this.updateEventDetail.eventImages.length; i++) {
              this.imagesId.push(this.updateEventDetail.eventImages[i].id);
            }
          }
          if (!this.subjectEventDetails.telentImages) {
            if(this.updateEventDetail.telentImages) {
              this.imagesCheckbox.istelentImages = true;
              for (var i = 0; i < this.updateEventDetail.telentImages.length; i++) {
                this.telentImages.push(this.updateEventDetail.telentImages[i]);
              }
              for (var i = 0; i < this.updateEventDetail.telentImages.length; i++) {
                this.selectedtelentImages.push(this.telentImages[i]);
              }
              for (var i = 0; i < this.updateEventDetail.telentImages.length; i++) {
                this.talentImageIds.push(this.updateEventDetail.telentImages[i].id);
              }
            }
          }
          if (!this.subjectEventDetails.sponserImages) {
            this.imagesCheckbox.isSponserImages = true;
            if(this.updateEventDetail.telentImages) {
              for (var i = 0; i < this.updateEventDetail.sponserImages.length; i++) {
                this.sponserImages.push(this.updateEventDetail.sponserImages[i]);
              }
              for (var i = 0; i < this.updateEventDetail.sponserImages.length; i++) {
                this.selectedSponserImages.push(this.sponserImages[i]);
              }
              for (var i = 0; i < this.updateEventDetail.sponserImages.length; i++) {
                this.sponserImageIds.push(this.updateEventDetail.sponserImages[i].id);
              }
            }
          }
          if(this.venueDetails === '') {
            this.eventForm.patchValue({
              venueName: this.updateEventDetail.venue.venueName,
            });
            this.eventService.getVenueImage(this.updateEventDetail.venue.id).then((response: any) => {
              this.venueImages = response.data;
            });
            this.venueImages = this.updateEventDetail.venueGallery;
          }
          if(this.venueDetails !== '') {
            this.eventForm.patchValue({ venueName: this.venueDetails.venueName });
            this.venueImages = this.venueDetails.venueImages;
          }
          this.sharedService.headerLayout.emit({
            headerName: 'Edit Event',
            headerSize: this.STRINGS.headerSize.medium,
            isBack: true,
          });
          this.utilityService.stopLoader();
        }
      })
      .catch((error: any) => {
        console.log(error);
        this.utilityService.routingAccordingToError(error);
        this.utilityService.stopLoader();
      });
  }

  // Get category list for category dropdown
  getCatogory() {
    this._service.getCatogory().then((result: any) => {
      if (result.success) {
        this.categoryList = result.data.category;
      }
    });
  }

  // get sub-category list as per dropdown category value
  FetchSubcatogoryID(categoryId: number) {
    this.utilityService.startLoader();
    this.eventForm.controls.subCategoryId.patchValue([]);
    this.selectedSubCategory = [];
    this.selectedSubCategoryArray = [];
    this.selectSubCategoryError = false;
    let catId = categoryId;
    const body = {
      categoryId: [catId],
    };
    this._service.postSubCategoryByCategory(body).then(
      (response: any) => {
        if (response.success) {
          this.utilityService.stopLoader();

          this.subCategoryList = response.data;
          this.categoryName = this.subCategoryList[0].category[0].categoryName;
        }
      },
      (error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError;
        console.log(error.message);
      }
    );
  }

  // mat-chip
  chipList!: MatChipList;
  value: string[] = [];
  onChange!: (value: string[]) => void;
  onTouch: any;


  toggleSelection(chip: MatChip) {
   if(this.selectedSubCategory.length < 5 && this.selectedSubCategoryArray.length < 5)  {
    chip.toggleSelected();
    if (chip.selected === true) {
      this.selectedSubCategory.push(chip.value.id);
      this.selectedSubCategoryArray.push(chip.value);
    }
    if (chip.selected === false) {
      const index = this.selectedSubCategory.indexOf(chip.value);
      this.selectedSubCategory.splice(index, 1);
      this.selectedSubCategoryArray.splice(index, 1);;
    }
   }
   else {
    if (chip.selected === true) {
      chip.toggleSelected();
      const index = this.selectedSubCategory.indexOf(chip.value);
      this.selectedSubCategory.splice(index, 1);
      this.selectedSubCategoryArray.splice(index, 1);
      }
    if(this.selectedSubCategory.length == 5 && this.selectedSubCategoryArray.length == 5) {
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          width: '460px',
          data: {
            name: "You can select upto 5 Sub Categories maximum",
          },
          panelClass: 'custom_dilog',
        });
       }
    }
  }

  setChipsValue() {
    this.eventForm.controls.subCategoryId.patchValue(this.selectedSubCategoryArray);
  }



  // occured on
  occuredOnSelectionError: boolean = false;
  eventOccurenceTypeSelection(event: any, value: any) {
    this.eventForm.patchValue({
      occurredOn: []
    });
    this.occuredOnArray = [];
    this.occuredOn = [];
    this.eventOccurrenceTypeStatus = value;
    if (this.eventOccurrenceTypeStatus == 'oneTime') {
      this.occuredOnSelectionError = false;
      this.occuredOnArray = [0];
      this.occuredOn = [0];
    }
  }

  toggleOccuredOnSelection(occuredOnchip: MatChip) {
    occuredOnchip.toggleSelected();
    if (occuredOnchip.selected === true) {
      if (this.eventOccurrenceTypeStatus == 'weekly') {
        this.occuredOnArray = [];
      }
      if(occuredOnchip.value != 0){
        this.occuredOnArray.push(occuredOnchip.value);
      }
    }
    if (occuredOnchip.selected === false) {
      const index = this.occuredOnArray.indexOf(occuredOnchip.value);
      this.occuredOnArray.splice(index, 1);
    }
  }

  setOccuredOnChipsValue() {
    this.eventForm.controls.occuredOn.patchValue(this.occuredOnArray);
  }


  selectVenue() {

    if ((this.eventForm.controls.startTime.value === null || this.eventForm.controls.startTime.value === undefined)
     || (this.eventForm.controls.endTime.value === null || this.eventForm.controls.endTime.value === undefined))
    {
      this.dialog.open(AlertdialogComponent, {
        width: '460px',
        data: {
          name: 'Please Provide Start Time and End Time',
        },
        panelClass: 'custom_dilog',
      });
      return;
    }
    if (this.eventForm.controls.start.value === null || this.eventForm.controls.end.value === null)
    {
      this.dialog.open(AlertdialogComponent, {
        width: '460px',
        data: {
          name: 'Please Provide Start Date and End Date',
        },
        panelClass: 'custom_dilog',
      });
      return;
    }
    if(this.eventForm.controls.start.value && this.eventForm.controls.end.value) {
      localStorage.removeItem('matClockStartDateTime');
      localStorage.removeItem('matClockEndDateTime');
      this.createEventDetails();
      localStorage.setItem('matClockStartDateTime', this.eventForm.value.startTime);
      localStorage.setItem('matClockEndDateTime', this.eventForm.value.endTime);
      let startTime = _moment(this.eventForm.value.startTime, 'HH:mm:ss').format('HH:mm:ss');
      let endTime = _moment(this.eventForm.value.endTime,'HH:mm:ss').format('HH:mm:ss');
      // startTime = _moment(startTime).format('HH:mm:ss');
      // endTime = _moment(endTime).format('HH:mm:ss');
      const time = _moment(startTime, 'hh:mm A').format('HH:mm');
      let startdate = _moment(this.eventForm.value.start).format('YYYY-MM-DD');
      let enddate = _moment(this.eventForm.value.end).format('YYYY-MM-DD');
      localStorage.setItem('eventStartDateTime', startdate + ' ' + startTime);
      localStorage.setItem('eventEndDateTime', enddate + ' ' + endTime);
      localStorage.setItem('createEventRoute', this.router.url);
      this.router.navigate(['venue/list']);
    }
  }

  dateAndTimeForm(event: any) {
    if (event === 3) {
      this.dateAndTimePicker = !this.dateAndTimePicker;
    } else {
      this.dateAndTimePicker = false;
    }
  }
  removeVenue(){

    if(this.venueDetails !== '') {
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        width: '460px',
        data: {
          removeVenue: "removeVenue",
        },
        panelClass: 'custom_dilog',
      });
      dialogRef.afterClosed().subscribe(result => {
        let removeVenue = localStorage.getItem("removeVenue");
        if(removeVenue == "yes") {
          this.utilityService.venueDetails.next(
            {venueDetail : ''}
          );
          this.eventForm.controls.venueName.reset();
          localStorage.removeItem("removeVenue");
        } else {
          localStorage.removeItem("removeVenue");
          const matStarttime: any  = localStorage.getItem('matClockStartDateTime');
          const matClockEndDateTime: any  = localStorage.getItem('matClockEndDateTime');
          this.starttime = new Date(matStarttime);
          this.endtime = new Date(matClockEndDateTime);
        }
      });
    }
  }
  // IMAGE upload, drag and drop, remove imgae
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.images, event.previousIndex, event.currentIndex);
    // moveItemInArray(
    //   this.selectedImages,
    //   event.previousIndex,
    //   event.currentIndex
    // );
  }
  imageupload() {
    const dialogRef = this.dialog.open(ImageuploadComponent, {
      disableClose: true,
      width: '890px',
      data: this.images,
      panelClass: 'image_dilog',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.imagesError = false;
        this.eventForm.controls.images.setValue(data);
        for (var i = 0; i < data.length; i++) {
          this.selectedImages.push(data[i]);
          this.showtext = false;
        }
      }
    });
  }
  removeImage(index: any, eventImage: any) {
    this.images.splice(index, 1);
    this.selectedImages.splice(index, 1);
    if (eventImage.id) {
      this.removableImagesId.push(eventImage?.id);
    }
  }

  categoryname(value: any) {
    this.categoryName = value;
  }

  // Talent images upload, drag and drop, remove functionality
  onTalentChange(){
    console.log(event);
  //  console.log("value changed");
  }

  droptelentImages(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.telentImages, event.previousIndex, event.currentIndex);
    moveItemInArray(
      this.selectedtelentImages,
      event.previousIndex,
      event.currentIndex
    );
  }
  talentImageUpload() {
    const dialogRef = this.dialog.open(ImageuploadComponent , {
      disableClose: true,
      width: '890px',
      data: this.telentImages,
      panelClass: 'image_dilog',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.imagesError = false;
        this.eventForm.controls.telentImages.setValue(data);
        for (var i = 0; i < data.length; i++) {
          this.selectedtelentImages.push(data[i]);
         // console.log("this.selectedtelentImages", this.selectedtelentImages);

          this.showtext = false;
        }
      }
    });
  }
  removeTalentImage(index: any, eventTalentImage: any) {
    this.telentImages.splice(index, 1);
    this.selectedtelentImages.splice(index, 1);
    if (eventTalentImage.id) {
      this.removabletelentImagesId.push(eventTalentImage?.id);
    }
  }

  // Sponser images upload, drag and drop, remove functionality
  dropSponserImages(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sponserImages, event.previousIndex, event.currentIndex);
    moveItemInArray(
      this.selectedSponserImages,
      event.previousIndex,
      event.currentIndex
    );
  }
  sponserImageupload() {
    const dialogRef = this.dialog.open(ImageuploadComponent, {
      disableClose: true,
      width: '890px',
      data: this.sponserImages,
      panelClass: 'image_dilog',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.imagesError = false;
        this.eventForm.controls.sponserImages.setValue(data);
        for (var i = 0; i < data.length; i++) {
          this.selectedSponserImages.push(data[i]);
          this.showtext = false;
        }
      }
    });
  }
  removeSponserImage(index: any, eventSponserImage: any) {
    this.sponserImages.splice(index, 1);
    this.selectedSponserImages.splice(index, 1);
    if (eventSponserImage.id) {
      this.removableSponserImagesId.push(eventSponserImage?.id);
    }
  }

  // nextButton
  nextButton() {
    if (this.selectedSubCategory.length == 0) {
      this.selectSubCategoryError = true;
      return;
    } else {
      this.secondStep = !this.secondStep;
      this.firstStep = !this.firstStep;
      this.sharedService.headerLayout.emit({
        headerName: 'Event creation',
        headerSize: this.STRINGS.headerSize.medium,
        isBack: false,
      });
    }
  }

  checkCustomUrl(value: string){
   this.eventCustomUrl = value.replace(/ /g,'');
      this.utilityService.startLoader();
      let body = {
        eventUrl: this.eventCustomUrl
      };
      this.eventForm.controls.eventUrl.setValue(this.eventCustomUrl);
      this.eventService.getCustomUrl(body)
        .then((response: any) => {
          if (response.success) {
            this.showUrlVarify = true;
            this.utilityService.stopLoader();
          }
        })
        .catch((error: any) => {
          this.utilityService.stopLoader();
          if (error?.error?.message) {
            this.showErrorMessage = true;
            this.errorMessage = error.error.message;
          }
          this.utilityService.routingAccordingToError(error);
        });
  }

  creteEventFormSubmit() {
    if (this.eventOccurrenceTypeStatus != 'oneTime' && this.occuredOnArray.length == 0) {
      this.occuredOnSelectionError = true;
      return;
    }
    if (this.images.length == 0) {
      this.imagesError = true;
      console.log(this.eventForm);
      return;
    }

    if (this.eventForm.invalid) {
      // console.log('invalid');
      return;
    }
    else {
      let formData = new FormData();
      let startTime = _moment(this.eventForm.value.startTime).format('hh:mm A');
      let endTime = _moment(this.eventForm.value.endTime).format('hh:mm A');
      let startdate = _moment(this.eventForm.value.start).format('YYYY-MM-DD');
      let enddate = _moment(this.eventForm.value.end).format('YYYY-MM-DD');
      if(this.eventCustomUrl){
        formData.append('eventUrl',  this.eventCustomUrl);
      }
      formData.append('occurredOn', JSON.stringify(this.occuredOnArray));
      formData.append('eventType', this.eventForm.value.eventType);
      formData.append('categoryId', this.eventForm.value.categoryId);
      formData.append(
        'subCategoryId', JSON.stringify(this.selectedSubCategory)
      );
      formData.append('name', this.titlecasePipe.transform(this.eventForm.value.name));
      formData.append('description', this.eventForm.value.description);
      formData.append('description2', this.eventForm.value.description2);
      formData.append(
        'eventOccurrenceType',
        this.eventOccurrenceTypeStatus
      );
      formData.append('venueName', this.venueDetails.venueName);
      formData.append('venueId', this.venueDetails.id);
      formData.append('venueAddress', this.venueDetails.venueAddress);
      formData.append('venueLatitude', this.venueDetails.latitude);
      formData.append('venueLongitude', this.venueDetails.longitude);
      for (var i = 0; i < this.selectedImages.length; i++) {
        formData.append('images', this.selectedImages[i]);
      }
      for (var i = 0; i < this.selectedtelentImages.length; i++) {
        formData.append('telentImages', this.selectedtelentImages[i]);
      }
      for (var i = 0; i < this.selectedSponserImages.length; i++) {
        formData.append('sponserImages', this.selectedSponserImages[i]);
      }
      formData.append('start', startdate + ' ' + startTime);
      formData.append('end', enddate + ' ' + endTime);
      formData.append('subVenueEvent', JSON.stringify(this.subVenueEvent));
      this.createEventDetails();
      this.dialog.open(PosteventComponent, {
        width: '420px',
        data: {
          create: 'createEvent',
          formData,
        },
        panelClass: 'custom_dilog',
      });
    }
  }

  updateEventFormSubmit() {
    localStorage.setItem('update', 'routing to update');
    if (this.eventOccurrenceTypeStatus != 'oneTime' && this.occuredOnArray.length == 0) {
      this.occuredOnSelectionError = true;
      return;
    }
    if (this.images.length == 0) {
      this.imagesError = true;
      return;
    }
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }
    else {
      let formData = new FormData();
      let startTime = _moment(this.eventForm.value.startTime, 'HH:mm:ss').format('hh:mm a');
      let endTime = _moment(this.eventForm.value.endTime, 'HH:mm:ss').format('hh:mm a');
      let startdate = _moment(this.eventForm.value.start).format('YYYY-MM-DD');
      let enddate = _moment(this.eventForm.value.end).format('YYYY-MM-DD');
      formData.append('eventOccurrenceType', this.eventOccurrenceTypeStatus);
      var occaranceSort = this.occuredOnArray.sort((a:any, b:any)=> {
        return a - b;
      });
       formData.append('occurredOn', JSON.stringify(occaranceSort));
      //console.log('data',this.occuredOnArray.sort(), this.eventForm)
      // formData.append('occurredOn', JSON.stringify(this.eventForm.value.occurredOn));
      formData.append('name', this.titlecasePipe.transform(this.eventForm.value.name));
      formData.append('description', this.eventForm.value.description);
      formData.append('description2', this.eventForm.value.description2);
      if(this.eventForm.value.eventUrl){
        formData.append('eventUrl', this.eventForm.value.eventUrl);
      }
      formData.append('categoryId', this.eventForm.value.categoryId);
      formData.append('id', this.updateEventDetail.id);
      if (this.venueDetails) {
        formData.append('venueName', this.venueDetails.venueName);
        formData.append('venueId', this.venueDetails.id);
        formData.append('venueAddress', this.venueDetails.venueAddress);
        formData.append('venueLatitude', this.venueDetails.latitude);
        formData.append('venueLongitude', this.venueDetails.longitude);
      }
      else {
        formData.append('venueName', this.updateEventDetail.venue.venueName);
        formData.append('venueId', this.updateEventDetail.venue.id);
        formData.append(
          'venueAddress',
          this.updateEventDetail.venue.venueAddress
        );
        formData.append('venueLatitude', this.updateEventDetail.venue.latitude);
        formData.append(
          'venueLongitude',
          this.updateEventDetail.venue.longitude
        );
      }
      var selectedImagesArray = this.selectedImages;
      selectedImagesArray = selectedImagesArray.filter(function (obj: any) {
        return !obj.id;
      });
      for (var i = 0; i < selectedImagesArray.length; i++) {
        formData.append('images', selectedImagesArray[i]);
      }
      var selectedtelentImagesArray = this.selectedtelentImages;
      selectedtelentImagesArray = selectedtelentImagesArray.filter(function (obj: any) {
        return !obj.id;
      });
      for (var i = 0; i < selectedtelentImagesArray.length; i++) {
        formData.append('telentImages', selectedtelentImagesArray[i]);
      }
      var selectedSponserImagesArray = this.selectedSponserImages;
      selectedSponserImagesArray = selectedSponserImagesArray.filter(function (obj: any) {
        return !obj.id;
      });
      for (var i = 0; i < selectedSponserImagesArray.length; i++) {
        formData.append('sponserImages', selectedSponserImagesArray[i]);
      }
      formData.append('start', startdate + ' ' + startTime);
      formData.append('end', enddate + ' ' + endTime);
    //  console.log('subVenueEvent', this.subVenueEvent)

      formData.append('subVenueEvent', JSON.stringify(this.subVenueEvent));
      formData.append('imageIds', this.removableImagesId);
      formData.append('talentImageIds', this.removabletelentImagesId);
      formData.append('sponserImageIds', this.removableSponserImagesId);
      formData.append('sellingStart ', this.updateEventDetail.sellingStart);
      formData.append('sellingEnd', this.updateEventDetail.sellingStart);
      formData.append('hostMobile', this.updateEventDetail.hostMobile);
      formData.append('countryCode', this.updateEventDetail.countryCode);
      formData.append('hostAddress', this.updateEventDetail.hostAddress);
      formData.append('websiteUrl', this.updateEventDetail.websiteUrl);
      formData.append('otherWebsiteUrl', this.updateEventDetail.otherWebsiteUrl);
      if(this.updateEventDetail.hostMobile || this.updateEventDetail.hostAddress || this.updateEventDetail.websiteUrl || this.updateEventDetail.otherWebsiteUrl){
        this.dialog.open(AlerteventComponent, {
          width: '520px',
          data: {
            formData: formData,
            updateEvent: true
          },
          panelClass: 'custom_dilog',
        });
      }else{
      this.dialog.open(TwentyMinPopUpComponent, {
        data: {
          update: 'updateEvent',
          formData,
        }
       });
      }
    }
  }

  deleteEvent() {
    this.dialog.open(TwentyMinPopUpComponent, {
      data: {
        deleteEvent: this.id,
      }
    });
  }

  backToFirstStep() {
    this.sharedService.headerLayout.emit({
      headerName: 'Event creation',
      headerSize: this.STRINGS.headerSize.medium,
      isBack: true,
    });
    this.firstStep = !this.firstStep;
    this.secondStep = !this.secondStep;
  }

  createEventDetails() {
    var occaranceSort = this.occuredOnArray.sort((a:any, b:any)=> {
      return a - b;
    });
    this.utilityService.createEventDetails.next({
      eventType: this.eventForm.value.eventType,
      categoryId: this.eventForm.value.categoryId,
      categoryName: this.categoryName,
      occurredOn: occaranceSort,
      subCategoryId: this.selectedSubCategory,
      subCategoryName: this.selectedSubCategoryArray,
      name: this.titlecasePipe.transform(this.eventForm.value.name),
      description: this.eventForm.value.description,
      description2: this.eventForm.value.description2,
      eventUrl: this.eventCustomUrl || '',
      eventOccurrenceType: this.eventOccurrenceTypeStatus,
      eventOccurrenceTypeName: this.eventOccurrenceTypeName,
      startTime: this.eventForm.value.startTime,
      endTime: this.eventForm.value.endTime,
      start: this.eventForm.value.start,
      end: this.eventForm.value.end,
      images: this.images,
      //
      telentImages: this.telentImages,
      selectedtelentImages: this.selectedtelentImages,
      sponserImages: this.sponserImages,
      selectedSponserImages: this.selectedSponserImages,
      //
      selectedImages: this.selectedImages,
      venueDetails: this.venueDetails,
      subVenueEvent: this.subVenueEvent
    });
  }

  createTicket() {
    if (this.eventOccurrenceTypeStatus != 'oneTime' && this.occuredOnArray.length == 0) {
      this.occuredOnSelectionError = true;
    }
    if (this.eventForm.invalid) {
      if (this.images.length == 0) {
        this.imagesError = true;
      }
      this.eventForm.markAllAsTouched();
      return;
    }
    this.createEventDetails();
    this.router.navigate(['event/create-ticket']);
  }

  KeyUpTimeMask(value : any){
    this.value,this,'3,6','-';
  }

  emptyEndDate(){
    let startTime = _moment(this.eventForm.value.startTime, 'HH:mm:ss').format('hh:mm a');
    let endTime = _moment(this.eventForm.value.endTime, 'HH:mm:ss').format('hh:mm a');
    let startdate = _moment(this.eventForm.value.start).format('YYYY-MM-DD');
    let enddate = _moment(this.eventForm.value.end).format('YYYY-MM-DD');
    if(startTime != "Invalid date" && endTime != "Invalid date" && startTime == endTime && startdate == enddate) {
      this.endtime = undefined;
      this.eventForm.patchValue({ endTime: undefined });
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        width: '460px',
        data: {
          name: "Start time & End time should not be same",
        },
        panelClass: 'custom_dilog',
      });
    } else {
     // console.log(false);
    }
  }


}

function TalentImageUplodeComponent(TalentImageUplodeComponent: any, arg1: { disableClose: true; width: string; data: any; panelClass: string; }) {
  throw new Error('Function not implemented.');
}

