import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, Directive, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { MapsAPILoader } from '@agm/core';
import { SuccessDialogComponent } from 'src/app/dialog/success-dialog/success-dialog.component';

declare let google: any;
declare let $: any;
@Component({
  selector: 'app-venue-create',
  templateUrl: './venue-create.component.html',
  styleUrls: ['./venue-create.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class VenueCreateComponent implements OnInit, AfterViewInit {
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
  venueTypes: any;
  setVenueTypeArray: any = [];
  disableData: any = [true, true, true, true, true, true, true];
  timeArray: any = [];
  toTimeArray: any[][] = [];
  venueImages: any = [];
  selectedImages: any = [];
  removableImagesId: any = [];
  addImage = '../../../assets/img/add.png';
  VenueForm!: FormGroup;
  addbtnSubVenue = false;
  imagesError = false;
  images: any = [];
  showInformation = true;
  submit = false;
  locid: any;
  constructor(private fb: FormBuilder,
              private sharedService: SharedService,
              public dialog: MatDialog,
              public utilityService: UtilityService,
              private venueService: VenueService,
              private router: Router,
              private route: ActivatedRoute,
              private mapsAPILoader: MapsAPILoader
  ) {
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.createVenue.VenueCreation,
      headerSize: this.STRINGS.headerSize.medium,
      isBack: true
    });
    const userType = localStorage.getItem('userType')?.toString();
    // const venuer = 'venuer';
    if (userType?.includes('customer')  && userType?.includes('guestUser')) {
      this.router.navigate(['venue/list']);
    }
    this.locid = this.route.snapshot.paramMap.get('locid');
  }
  ngOnInit(): void {
    this.venueTypes = [true, true];
    this.setVenueTypeArray = ['Indoor Venue', 'Outdoor Venue'];
    this.createForm();
    this.arrayData();
    for (let i = 0 ; i < this.weekData.length; i++){
      this.setDaysAvailableDefualt(i);
    }
  }
  ngAfterViewInit(): any {
    this.mapsAPILoader.load().then(() => {
    const input = this.addressVenue?.nativeElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.mapObject.latitude = place.geometry.location.lat();
      this.mapObject.longitude = place.geometry.location.lng();
      this.VenueForm.controls.latitude.setValue(this.mapObject.latitude);
      this.VenueForm.controls.longitude.setValue(this.mapObject.longitude);
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


      console.log(pat, place.formatted_address,'======', addresWithSortState)

    });
  });
  }
  createForm(): void {
    this.VenueForm = this.fb.group({
      name: [null, [Validators.required , Validators.minLength(1), Validators.maxLength(50)]],
      venueAddress: [null, [Validators.required ]],
      websiteURL: [null, [Validators.maxLength(200)]],
      shortDescription: ['', [Validators.maxLength(2500)]],
      venueType: ['both'],
      venueCapacity: [null, [Validators.pattern('^[0-9]*$')]],
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
      isVenueAvailableToOtherHosts: [true],
      subVenues: this.fb.array([]),
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

  setDaysAvailableDefualt(index: number): void{
    let event = {};
    event = {
      value: '09:00'
    };
    this.onFromTimeChange(index, event);
    this.patchDayAvailable(index);
  }
  patchDayAvailable(indexFromarray: number): void{
    this.daysAvailable.at(indexFromarray).patchValue({
      fromTime: '09:00',
      toTime: '21:00'
    });
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
        weekDayName : null
      });
      this.disableData[i] = true;
    }
  }
  setVenueType(i: any , eventCheckbox: any): void {
    if (eventCheckbox){
         if (i === 0){
           this.setVenueTypeArray.push('Indoor Venue');
         }
         if (i === 1){
          this.setVenueTypeArray.push('Outdoor Venue');
         }
    }
    else{
      if (i === 0){
      const removeIndex = this.setVenueTypeArray.findIndex((itm: any) => itm === 'Indoor Venue');

      if (removeIndex !== -1){
        this.setVenueTypeArray.splice(removeIndex, 1);
      }
    }
      if (i === 1){
      const removeIndex = this.setVenueTypeArray.findIndex((itm: any) => itm === 'Outdoor Venue');

      if (removeIndex !== -1){
        this.setVenueTypeArray.splice(removeIndex, 1);
      }
    }
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

  onFromTimeChange(indexHtml: number, event: any): void{
    if (indexHtml === 7){
      indexHtml = 0;
    }
    this.daysAvailable.at(indexHtml).patchValue({
      fromTime: event.value,
    });
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
  onToTimeChange(i: number, event: any): void{
    if ( i === 0){
      this.daysAvailable.at(i).patchValue({
        weekDayName: 7,
        toTime: event.value,
      });
    }else{
      this.daysAvailable.at(i).patchValue({
        weekDayName: i,
        toTime: event.value,
      });
    }
  }

  setDaysAbvailable(): void {
    this.daysAvailable.push(this.newDayAvailable());
  }
  newSubVenue(): FormGroup {
    return this.fb.group({
      subVenueName: ['' , [Validators.required]],
      subVenueCapacity: ['', [ Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(9)]],
    });
  }
  newDayAvailable(): FormGroup {
    return this.fb.group({
      weekDayName: [],
      fromTime: [],
      toTime: [],
    });
  }
  addnewSubVenue(): void {
    this.venue.push(this.newSubVenue());
  }
  removeSubVenue(i: number): void {
    this.venue.removeAt(i);
  }
  cancelVenue(): void {
    this.VenueForm.reset();
    if (this.locid == null){
      this.router.navigate(['venue/list']);
    }else{
      this.router.navigate(['venue/venuelocation']);
    }
  }
  createVenue(): void {
    const totalCapacity = Number(this.VenueForm.value.venueCapacity);
    let subVenueCapacity = 0;
    for (const subCapacity of this.venue.controls){
        subVenueCapacity += Number(subCapacity.value.subVenueCapacity);
    }
    if (this.VenueForm.invalid) {
      this.submit = true;
      this.dialogopen('Please Fill Form Properly');
      return;
    }
    // if (totalCapacity < subVenueCapacity){
    //   this.dialogopen('Sub venue capacity should not be more than main venue capacity');
    //   return;
    // }
    // else {
      this.utilityService.startLoader();
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
   
    const  daysAvailableArray: any = [];
    this.VenueForm.value.daysAvailable.forEach((element: any) => {
                if (element.weekDayName != null){
                  console.log(element);
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
    if (this.VenueForm.value.websiteURL && this.VenueForm.value.websiteURL !== 'null'){
      formData.append('websiteURL', this.VenueForm.value.websiteURL);
      }
    if (this.VenueForm.value.shortDescription){
        formData.append('shortDescription', this.VenueForm.value.shortDescription);
      }
    formData.append('venueType', this.VenueForm.value.venueType);
    formData.append('venueCapacity', this.VenueForm.value.venueCapacity ? this.VenueForm.value.venueCapacity : '0');
    for (const image of this.selectedImages) {
        formData.append('venueImages', image);
      }
    formData.append('isVenueAvailableToOtherHosts', this.VenueForm.value.isVenueAvailableToOtherHosts);
    if (this.VenueForm.value.subVenues.length !== 0){
      formData.append('subVenues', JSON.stringify(this.VenueForm.value.subVenues));
      }
   
    this.venueService.postVenue(formData).then((response: any) => {
        if (response.success){
          this.successDialogopen('Your venue was successfully created!');
          this.utilityService.stopLoader();
          if (this.locid == null){
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
          if (error.error.message.includes('insert') || error.error.message.includes('$$') || error.error.message.includes('(') ){
            this.dialogopen('Something Went Wrong or Please Fill Form Properly');
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
        message: name,
      },
      panelClass: 'custom_dilog',
    });
  }


}
