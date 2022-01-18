import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { VenueService } from 'src/app/pages/venue/venue.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { localString } from 'src/app/shared/utils/strings';

@Component({
  selector: 'app-sub-venue-avaliable-alert',
  templateUrl: './sub-venue-avaliable-alert.component.html',
  styleUrls: ['./sub-venue-avaliable-alert.component.scss']
})
export class SubVenueAvaliableAlertComponent implements OnInit {

  subVenuesData: any;
  venueid: any;
  subVenueLockform!: FormGroup;
  matSpinner = false;
  STRINGS: any = localString;
  errorMessage = '';
  constructor(public dialogRef: MatDialogRef<SubVenueAvaliableAlertComponent>,
              private router: Router,
              private route: ActivatedRoute, private venueService: VenueService,
              private utilityService: UtilityService,
              private formBuilder: FormBuilder
  ) {
    this.venueService.currentvenueID.subscribe(venue => this.venueid = venue);
  }

  ngOnInit(): void {
    this.matSpinner = true;
    this.subVenueLockform = this.formBuilder.group({
      type: [1],
      venueId: [this.venueid],
      eventEndDateTime: [localStorage.getItem('eventEndDateTime')],
      eventStartDateTime: [localStorage.getItem('eventStartDateTime')],
      subVenues: this.formBuilder.array([]),
    });
   // console.log(this.subVenuesData)
    this.getSubVenueList();
  }
  closePopup(): void  {
    this.dialogRef.close();
  }
  get subvenuelock(): FormArray {
    return this.subVenueLockform.get('subVenues') as FormArray;
  }
  getSubVenueList(): void {
     this.venueService.getSubvenueList(this.venueid).then((response: any) => {
      this.subVenuesData = response.data;
      this.matSpinner = false;
     }).catch((error: any) => {
       console.log(error);
     });
  }
  onCheckboxChange(e: any): void  {
    if (e.target.checked) {
      this.subvenuelock.push(this.formBuilder.group({
        venueId: [this.venueid],
        status: ['reserve'],
        subVenueId: [e.target.value, [ Validators.required]]
      }));
    //  console.log(this.subvenuelock.value)
    } else {
       const index = this.subvenuelock.controls.findIndex((x: any) => x.value === e.target.value);
       this.subvenuelock.removeAt(index);
     //  console.log(this.subvenuelock.value)
    }
  }
  selctionSubVenue(): void  {
      if (this.subVenueLockform?.status === 'INVALID' || this.subvenuelock.controls.length === 0)
      {
        return;
      }
      this.utilityService.venueSubmitEvent.next(
      {
        venueId: this.venueid,
        subVenues: this.subvenuelock.value
      }
    );
      this.closePopup();
      this.router.navigate([localStorage.getItem('createEventRoute')]);
      localStorage.removeItem('createEventRoute');
       // all commented becuase of disable 20 min lock functionality
    // if (this.subVenueLockform?.status === 'INVALID' || this.subvenuelock.controls.length === 0)
    // {
    //   return;
    // }
    // this.matSpinner = true;
    // this.venueService.lockVenue(this.subVenueLockform?.value).then((response: any) => {
    //  this.closePopup();
    //  this.matSpinner = false;
    //  this.utilityService.venueSubmitEvent.next(
    //   {
    //     venueId: this.venueid,
    //     subVenues: this.subvenuelock.value
    //   }
    // )
    //  this.router.navigate([localStorage.getItem('createEventRoute')]);
    //  localStorage.removeItem('createEventRoute');
    // }).catch((error: any) => {
    //   console.log(error);
    //   this.matSpinner = false;
    //   if (error.error.message === 'Subvenue is Available'){
    //     this.closePopup();
    //     this.matSpinner = false;
    //     this.utilityService.venueSubmitEvent.next(
    //      {
    //        venueId: this.venueid,
    //        subVenues: this.subvenuelock.value
    //      }
    //    )
    //     this.router.navigate([localStorage.getItem('createEventRoute')]);
    //     localStorage.removeItem('createEventRoute');
    //   }else{
    //     this.errorMessage = 'Sub-Venue is not available currently. Please select another venue';
    //   }
    //   this.utilityService.routingAccordingToError(error);
    // });
  }

}
