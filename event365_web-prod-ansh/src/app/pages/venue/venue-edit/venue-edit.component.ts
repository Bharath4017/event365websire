import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ImageuploadComponent } from 'src/app/dialog/image-upload/imageupload.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { VenueService } from '../venue.service';
import * as _moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
import { SuccessDialogComponent } from 'src/app/dialog/success-dialog/success-dialog.component';
declare let google: any;
declare let $: any;

@Component({
  selector: 'app-venue-edit',
  templateUrl: './venue-edit.component.html',
  styleUrls: ['./venue-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VenueEditComponent implements OnInit, AfterViewInit {
  @ViewChild('addressTextField') addressVenue: ElementRef | undefined;

  mapObject: any = {
    country: '',
    state: '',
    city: '',
    street: '',
    zipcode: '',
    latitude: 0,
    longitude: 0
  };
  STRINGS: any = localString;
  weekData: any;
  timeArray: any = [];
  toTimeArray: any[][] = [];
  venueImages: any = [];
  selectedImages: any = [];
  removableImagesId: any = [];
  venueDetail: any;
  subVenueList: any;
  subVenueAvailable = false;
  disableData: any = [true, true, true, true, true, true, true];
  addImage = '../../../assets/img/add.png';
  VenueForm!: FormGroup;
  addbtnSubVenue = false;
  imagesError = false;
  images: any = [];
  updateImages: any = [];
  daysAvailableCheckBox: any = [];
  fromTimeUpdate: any = [];
  toTimeUpdate: any = [];
  venueTypes: any = [];
  showInformation = true;
  submit = false;
  id: any;
  locid: any;
  setVenueTypeArray: any = [];
  constructor(private fb: FormBuilder,
              private sharedService: SharedService,
              public dialog: MatDialog,
              public utilityService: UtilityService,
              private venueService: VenueService,
              private router: Router,
              private route: ActivatedRoute
  ) {
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.createVenue.editVenueHeading,
      headerSize: this.STRINGS.headerSize.medium,
      isBack: true
    });
    this.id = this.route.snapshot.paramMap.get('id');
    this.locid = this.route.snapshot.paramMap.get('locid');
    const userType = localStorage.getItem('userType')?.toString();
    if (userType?.includes('customer')  && userType?.includes('guestUser')) {
      this.router.navigate(['venue/list']);
    }
  }

  ngOnInit(): void {
    this.editForm();
    this.arrayData();
    for (let i = 0 ; i < this.weekData.length; i++){
      this.setDaysAvailableDefualt(i);
    }
    this.getVenueDetail();
  }
  ngAfterViewInit(): any {
    const input = this.addressVenue?.nativeElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.mapObject.latitude = place.geometry.location.lat();
      this.mapObject.longitude = place.geometry.location.lng();
      this.VenueForm.controls.latitude.setValue(this.mapObject.latitude);
      this.VenueForm.controls.longitude.setValue(this.mapObject.longitude);
      this.VenueForm.controls.city.setValue(place.name);
      // this.VenueForm.controls.venueAddress.setValue(place.formatted_address);
      this.mapObject.country = '';
      this.mapObject.state = '';
      this.mapObject.fullState = '';
      this.mapObject.city = '';
      this.mapObject.street = '';
      this.mapObject.zipcode = '';
      let shortState = '';
      let longState = '';

      for (let i = 0; i < place.address_components.length; i++) {
        switch (place.address_components[i].types[0]) {
          case 'country':
            this.mapObject.country = place.address_components[i].long_name;
            this.VenueForm.controls.countryName.setValue(this.mapObject.country);
            break;
            case 'administrative_area_level_1':
              this.mapObject.state = place.address_components[i].short_name;
              this.mapObject.fullState = place.address_components[i].long_name;
              this.VenueForm.controls.state.setValue(this.mapObject.state);
              this.VenueForm.controls.fullState.setValue(this.mapObject.fullState);
              longState = place.address_components[i].long_name;
              shortState = place.address_components[i].short_name;
              break;
            case 'locality':
              this.mapObject.city = place.address_components[i].long_name;
              this.VenueForm.controls.city.setValue(this.mapObject.city);
              break;
            case 'route':
              this.mapObject.street = place.address_components[i].long_name;
              break;
            case 'postal_code':
              this.mapObject.zipcode = place.address_components[i].long_name;
              break;
        }
      }
      var pat = new RegExp('(\\b' + longState + '\\b)(?!.*\\b\\1\\b)', 'i');
      let addresWithSortState = place.formatted_address.replace(pat, shortState);
      this.VenueForm.controls.venueAddress.setValue(addresWithSortState);
    });
  }

  editForm(): void {
    this.VenueForm = this.fb.group({
      name: [null, [Validators.required , Validators.minLength(1), Validators.maxLength(50)]],
      venueAddress: [null, [Validators.required ]],
      websiteURL: ['', [Validators.maxLength(200)]],
      shortDescription: ["", [Validators.maxLength(2500)]],
      venueType: [],
      venueCapacity: [null, [ Validators.pattern('^[0-9]*$')]],
      from: [null],
      to: [null],
      venueImages: [null],
      daysAvailable: this.fb.array([]),
      latitude: [null],
      longitude: [null],
      city: [null],
      state: [null],
      fullState: [null],
      countryName: [null],
      isVenueAvailableToOtherHosts: [],
      subVenues: this.fb.array([]),
    });
  }
  setDaysAvailableDefualt(index: number): void{
    let event = {};
    event = {
      value: '09:00'
    };
    this.onFromTimeChange(index, event);
    this.patchDayAvailableFirstTime(index);
  }
  patchDayAvailableFirstTime(indexFromarray: number): void{
    this.daysAvailable.at(indexFromarray).patchValue({
      fromTime: '09:00',
      toTime: '21:00'
    });
  }
  getVenueDetail(): void {
    this.utilityService.startLoader();
    let id  = this.id;
    if (this.id == null){
      id = this.locid;
    }
    
    this.venueService.getVenuebyid(id)
      .then((response: any) => {
        this.venueDetail = response.data;
        console.log(this.venueDetail);
        this.subVenueList = this.venueDetail.subVenues;
        if (this.venueDetail.venueType === 'both'){
          this.venueTypes = [true, true];
          this.setVenueTypeArray = ['Indoor Venue', 'Outdoor Venue'];
        }else{
          if (this.venueDetail.venueType === 'Indoor Venue'){
            this.venueTypes = [true, false];
            this.setVenueTypeArray.push('Indoor Venue');
          }else{
            this.venueTypes = [false, true];
            this.setVenueTypeArray.push('Outdoor Venue');
          }

        }
        this.VenueForm.patchValue({
          name: this.venueDetail.venueName,
          venueAddress: this.venueDetail.venueAddress,
          websiteURL: this.venueDetail.websiteURL?this.venueDetail.websiteURL:'',
          shortDescription: this.venueDetail.shortDescription,
          venueType: this.venueDetail.venueType,
          venueCapacity: this.venueDetail.venueCapacity,
          venueImages: this.venueDetail.venueImages,
          latitude: this.venueDetail.latitude,
          longitude: this.venueDetail.longitude,
          isVenueAvailableToOtherHosts: this.venueDetail.isVenueAvailableToOtherHosts,
          state: this.venueDetail.state,
          fullState: this.venueDetail.fullState,
          countryName: this.venueDetail.country,
          city: this.venueDetail.city
        });
        var array = this.venueDetail.venueType.split(',');
        console.log(array)
        /// sub venue
        if (this.venueDetail.subVenues.length > 0){
          this.subVenueAvailable = true;
          this.addbtnSubVenue = true;
        }
        for (const data of this.venueDetail.subVenues){
          this.venue.push(this.updateSubVenue(data));
        }
        /// hour opertaion
        for (const day of  this.venueDetail.daysAvailable){
          if (day.weekDayName !== null){
             this.daysAvailableCheckBox[day.weekDayName - 1] = true;
          }
          let event = {};
          switch (day.weekDayName) {
            case 1:
              event = {
                value: day.fromTime.slice(0, 5)
              };
              this.disableData[0] = false;
              this.onFromTimeChange(0, event);
              this.patchDayAvailable(day, 0);
              break;
            case 2:
              event = {
                value: day.fromTime.slice(0, 5)
              };
              this.disableData[1] = false;
              this.onFromTimeChange(1, event);
              this.patchDayAvailable(day, 1);
              break;
            case 3:
              event = {
                value: day.fromTime.slice(0, 5)
              };
              this.disableData[2] = false;
              this.onFromTimeChange(2, event);
              this.patchDayAvailable(day, 2);
              break;
            case 4:
              event = {
                value: day.fromTime.slice(0, 5)
              };
              this.disableData[3] = false;
              this.onFromTimeChange(3, event);
              this.patchDayAvailable(day, 3);
              break;
            case 5:
              event = {
                value: day.fromTime.slice(0, 5)
              };
              this.disableData[4] = false;
              this.onFromTimeChange(4, event);
              this.patchDayAvailable(day, 4);
              break;
            case 6:
              event = {
                value: day.fromTime.slice(0, 5)
              };
              this.disableData[5] = false;
              this.onFromTimeChange(5, event);
              this.patchDayAvailable(day, 5);
              break;
            case 7:
              event = {
                value: day.fromTime.slice(0, 5)
              };
              this.disableData[6] = false;
              this.onFromTimeChange(6, event);
              this.patchDayAvailable(day, 6);
              break;
            default:
              break;
          }
        }
        for (const image of  this.VenueForm.value.venueImages) {
          this.selectedImages.push(image);
          this.images.push(image);
        }
        this.utilityService.stopLoader();
      }).catch((error: any) => {
        this.utilityService.stopLoader();
        console.log(error);
        this.utilityService.routingAccordingToError(error);
      });
  }
  arrayData(): void {
    this.weekData = [
      { name: 'Monday', value: 1 },
      { name: 'Tuesday', value: 2 },
      { name: 'Wednesday', value: 3 },
      { name: 'Thursday', value: 4 },
      { name: 'Friday', value: 5 },
      { name: 'Saturday', value: 6 },
      { name: 'Sunday', value: 7 }
    ];


    const x = 30; // minutes interval
    let tt = 0; // start time


// loop to increment the time and push results in array
    for (let i  = 0; tt < 24 * 60; i++) {
        const hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
        const mm = (tt % 60); // getting minutes of the hour in 0-55 format
        this.timeArray[i] = ('0' + (hh)).slice(-2) + ':' + ('0' + mm).slice(-2); // pushing data in array in [00:00 - 23:00 format]
        tt = tt + x;
      }
    this.weekData.forEach((element: any) => {
      this.setDaysAbvailable();
    });
    this.toTimeArray = [[], [], [], [], [], [], [], []];
  }
  get venue(): FormArray {
    return this.VenueForm.get('subVenues') as FormArray;
  }
  get daysAvailable(): FormArray {
    return this.VenueForm.get('daysAvailable') as FormArray;
  }
  setWeekDay(i: number, eventCheckbox: any): void{
    this.disableData[i] = false;
    if (eventCheckbox){
        if (i === 0){
          this.daysAvailable.at(0).patchValue({
            weekDayName: 1,
          });
        }else{
          this.daysAvailable.at(i).patchValue({
            weekDayName: i + 1,
          });
        }
    }
    else{
      this.daysAvailable.at(i).patchValue({
        weekDayName: null,
      });
      this.disableData[i] = true;
    }
  }
  setVenueType(i: any , eventCheckbox: any): void {
    if (eventCheckbox){
         if (i === 0){
           this.setVenueTypeArray.push('Indoor Venue');
           console.log( this.setVenueTypeArray)
         }
         if (i === 1){
          this.setVenueTypeArray.push('Outdoor Venue');
          console.log( this.setVenueTypeArray)
         }
    }
    else{
      let  removeIndex;
      if (i === 0){
      removeIndex = this.setVenueTypeArray.findIndex((itm: any) => itm === 'Indoor Venue');

      if (removeIndex !== -1){
        this.setVenueTypeArray.splice(removeIndex, 1);
      }
    }
      if (i === 1){
      removeIndex = this.setVenueTypeArray.findIndex((itm: any) => itm === 'Outdoor Venue');

      if (removeIndex !== -1){
        this.setVenueTypeArray.splice(removeIndex, 1);
      }
    }
  }
    console.log( this.setVenueTypeArray)
  }
  onFromTimeChange(indexHtml: number, event: any): void{
    if (indexHtml === 7){
      indexHtml = 0;
    }
    this.daysAvailable.at(indexHtml).patchValue({
      fromTime: event.value,
    });
    this.daysAvailable.controls[indexHtml].value.fromTime = event.value ;
    const monFromTime = Number((event.value).slice(0, 2));
    const x = 30; // minutes interval
    let tt = monFromTime * 60 + 30 ; // start time
    this.toTimeArray[indexHtml] = [];
    for (let i  = 0; tt < 24 * 60; i++) {
      const hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
      const mm = (tt % 60); // getting minutes of the hour in 0-55 format
      this.toTimeArray[indexHtml][i] = ('0' + (hh)).slice(-2) + ':' +
                                        ('0' + mm).slice(-2); // pushing data in array in [00:00 - 23:00 format]
      tt = tt + x;
    }

  }
  integerOnly(event: any): void {
    const e = event as KeyboardEvent;
    if (e.key === 'Tab' || e.key === 'TAB') {
        return;
    }
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(e.key) === -1) {
        e.preventDefault();
    }
}
  onToTimeChange(i: number, event: any): void{
    if ( i === 0){
      this.daysAvailable.at(i).patchValue({
        weekDayName: 1,
        toTime: event.value,
      });
    }else{
      this.daysAvailable.at(i).patchValue({
        weekDayName: i,
        toTime: event.value,
      });
    }
   // this.daysAvailable.controls[i].value.toTime = event.value;
  }

  setDaysAbvailable(): void {
    this.daysAvailable.push(this.newDayAvailable());
  }
  updateSubVenue(data: any): FormGroup {
    if (this.id == null){
      return this.fb.group({
        id: data.id,
        subVenueName: [data.subVenueName, [Validators.required ]],
        subVenueCapacity: [data.subVenueCapacity, [ Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(9)]],
        venueId:  this.locid
      });
    }else{
      return this.fb.group({
        id: data.id,
        subVenueName: [data.subVenueName, [Validators.required]],
        subVenueCapacity: [data.subVenueCapacity, [ Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(9)]],
        venueId: this.id
      });
    }
  }
  patchDayAvailable(day: any , indexFromarray: number): void{
    this.daysAvailable.at(indexFromarray).patchValue({
      weekDayName: day.weekDayName,
      fromTime: day.fromTime.slice(0, 5),
      toTime: day.toTime.slice(0, 5)
    });
  }
  newSubVenue(): FormGroup {
    return this.fb.group({
      subVenueName: ['' , [Validators.required]],
      subVenueCapacity: [null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(9)]],
    });
  }
  newDayAvailable(): FormGroup {
    return this.fb.group({
      weekDayName: [],
      fromTime: [''],
      toTime: [''],
    });
  }
  addnewSubVenue(): void {
    this.venue.push(this.newSubVenue());
  }
  getSubVenueValidition(i: any): boolean {
    return (this.venue).controls[i].invalid;
  }
  removeSubVenue(i: number): void {
    this.venue.removeAt(i);
  }
  cancelVenue(): void {
    this.VenueForm.reset();
    this.router.navigate(['venue/list']);
  }
  updateVenue(): void {
    const totalCapacity = Number(this.VenueForm.value.venueCapacity);
    let subVenueCapacity = 0;
    for (const subCapacity of this.venue.controls){
        subVenueCapacity += Number(subCapacity.value.subVenueCapacity);
    }
    if (this.VenueForm.invalid) {
      this.submit = true;
      return;
    }
    // if (totalCapacity < subVenueCapacity){
    //   this.dialogopen('Sub venue capacity should not be more than main venue capacity');
    //   return;
    // }
    // else {
    this.utilityService.startLoader();
    const  daysAvailableArray: any = [];
    if (this.setVenueTypeArray.length > 1){
        this.VenueForm.controls.venueType.setValue('both');
      }else{
        this.setVenueTypeArray.forEach((element: any) => {
          if (element === 'Indoor Venue'){
            this.VenueForm.controls.venueType.setValue('Indoor Venue');
          }else{
            this.VenueForm.controls.venueType.setValue('Outdoor Venue');
          }
        });
      }
    this.VenueForm.value.daysAvailable.forEach((element: any) => {
                if (element.weekDayName != null){
                  daysAvailableArray.push(element);
                }
      });
    const formData = new FormData();
    formData.append('venueName', this.VenueForm.value.name);
    formData.append('venueAddress', this.VenueForm.value.venueAddress);
    if (this.VenueForm.value.longitude !== 0 && this.VenueForm.value.longitude !== null){
        formData.append('longitude', this.VenueForm.value.longitude);
      }
    if (this.VenueForm.value.latitude !== 0 && this.VenueForm.value.latitude !== null ){
        formData.append('latitude', this.VenueForm.value.latitude);
      }
    if (this.VenueForm.value.city){
        formData.append('city', this.VenueForm.value.city);
      }
    formData.append('state', this.VenueForm.value.state);
    formData.append('fullState', this.VenueForm.value.fullState);
    formData.append('country', this.VenueForm.value.countryName);
    formData.append('daysAvailable',  JSON.stringify(daysAvailableArray));
    if (this.VenueForm.value.websiteURL && this.VenueForm.value.websiteURL!='null'){
        formData.append('websiteURL', this.VenueForm.value.websiteURL);
        }
    if (this.VenueForm.value.shortDescription){
        formData.append('shortDescription', this.VenueForm.value.shortDescription);
      }
    formData.append('venueType', this.VenueForm.value.venueType);
    formData.append('venueCapacity', this.VenueForm.value.venueCapacity ? this.VenueForm.value.venueCapacity : '0');
    formData.append('isVenueAvailableToOtherHosts', this.VenueForm.value.isVenueAvailableToOtherHosts);
    formData.append('subVenues', JSON.stringify(this.VenueForm.value.subVenues));
      // for (const image of this.selectedImages) {
      //   formData.append('venueImages', image);
      // }

    let selectedImagesArray = this.selectedImages;
    selectedImagesArray = selectedImagesArray.filter((obj: any) => {
        return !obj.id;
      });
    for (const image of  selectedImagesArray) {
        formData.append('venueImages', image);
      }
    if (this.removableImagesId.length !== 0){
      formData.append('imageIds', this.removableImagesId);
      }
    let id = this.id;
    if (this.id == null){
        id = this.locid;
      }
    this.venueService.updateVenue(id, formData).then((response: any) => {
        if (response.success){
          // this.dialogopen(response.message);
          this.successDialogopen("Your venue was successfully updated!");
          if (this.id != null){
          this.router.navigate(['venue/list']);
          }else{
            this.router.navigate(['venue/venuelocation']);
          }
        }
        this.utilityService.stopLoader();
      }).catch((error: any) => {
        this.utilityService.stopLoader();
        console.log(error);
        if (error){
          if (error.error.message.includes('update') || error.error.message.includes('$$') || error.error.message.includes('(') ){
            this.dialogopen('something went wrong please try');
          }
          else{
            this.dialogopen(error.error.message);
          }
        }
        else{
          this.dialogopen(error.error.message);
        }
        this.utilityService.routingAccordingToError(error);
      });
  //  }


  }
showAddButton(): void {
    this.addbtnSubVenue = !this.addbtnSubVenue;
  }
imageupload(): void {
    const dialogRef = this.dialog.open(ImageuploadComponent, {
      disableClose: true,
      width: '890px',
      data: this.images,
      panelClass: 'custom_dilog',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.imagesError = false;
        this.VenueForm.controls.venueImages.setValue(data);
        for (const image of  data) {
          this.selectedImages.push(image);
          // this.showtext = false;
        }
      }
    });
  }
drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.images, event.previousIndex, event.currentIndex);
moveItemInArray(
      this.selectedImages,
      event.previousIndex,
      event.currentIndex
    );
  }
removeImage(index: any, eventImage: any): void {
    this.images.splice(index, 1);
    this.selectedImages.splice(index, 1);
    if (this.selectedImages.length === 0){
      this.VenueForm.controls.venueImages.reset();
    }
if (eventImage.id) {
      this.removableImagesId.push(eventImage?.id);
    }
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
successDialogopen(name: any): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: '460px',
      data: {
        message:name,
      },
      panelClass: 'custom_dilog',
    });
  }

}
