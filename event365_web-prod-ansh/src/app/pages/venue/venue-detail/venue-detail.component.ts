import { Component, Injectable, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
import { DeleteVenueAlertComponent } from 'src/app/dialog/delete-venue-alert/delete-venue-alert.component';
import { SubVenueAvaliableAlertComponent } from 'src/app/dialog/sub-venue-avaliable-alert/sub-venue-avaliable-alert.component';
import { TwentyMinPopUpComponent } from 'src/app/dialog/twenty-min-pop-up/twenty-min-pop-up.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { SwiperOptions } from 'swiper';
import { VenueService } from '../venue.service';
@Component({
  selector: 'app-venue-detail',
  templateUrl: './venue-detail.component.html',
  styleUrls: ['./venue-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VenueDetailComponent implements OnInit {
  theme: 'light' | 'dark' = 'dark';
  id: any;
  venueDetail: any = {};
  locid: any;
  venueOwner = false;
  subVenueList: any;
  STRINGS: any = localString;
  isBooked = '';
  venueType: any;
  localUserId: any;
  public config: SwiperOptions = {
    a11y: { enabled: true },
    direction: 'horizontal',
    spaceBetween: 10,
    keyboard: true,
    mousewheel: false,
    scrollbar: false,
    navigation: true,
    pagination: false,
    breakpoints: {
      600: {
        slidesPerView: 1.5,
      },
      700: {
        slidesPerView: 2.5,
      },
      800: {
        slidesPerView: 2.5,
      },
      900: {
        slidesPerView: 2.5,
      },
      1000: {
        slidesPerView: 3.5
      },
      1200: {
        slidesPerView: 3.5
      },
      1300: {
        slidesPerView: 3.5,
      },
      1600: {
        slidesPerView: 5.5,
      }
    }
  };
  public disabled = false;
  constructor(public dialog: MatDialog,
              private route: ActivatedRoute,
              private venueService: VenueService,
              private formBuilder: FormBuilder,
              public utilityService: UtilityService,
              public router: Router,
              public sharedService: SharedService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.locid = this.route.snapshot.paramMap.get('locid');
  }

  ngOnInit(): void {
    this.getVenueDetail();
    // const venuer = 'venuer';
    const userType = localStorage.getItem('userType')?.toString();
    if (!userType?.includes('customer')  && !userType?.includes('guestUser')) {
      this.venueOwner = true;
    }
  }


  subVenuePopup(): void {
    if (this.subVenueList.length !== 0) {
        this.venueService.shareComponentSubvenueList(this.id);
        this.setVenueLocalStorage();
        this.dialog.open(SubVenueAvaliableAlertComponent, {
          width: '460px'
        });
      }
      else {
        this.venueService.shareComponentSubvenueList(0);
        this.setVenueLocalStorage();
        this.router.navigate([localStorage.getItem('createEventRoute')]);
        localStorage.removeItem('createEventRoute');
     }
    // all commented becuase of disable 20 min lock functionality
    // if (this.subVenueList.length !== 0) {
    //   this.venueService.shareComponentSubvenueList(this.id);
    //   this.setVenueLocalStorage();
    //   this.dialog.open(TwentyMinPopUpComponent, {
    //     width: '460px'
    //   });
    // } else {
    //   this.venueService.shareComponentSubvenueList(0);
    //   this.selctionVenue();
    // }

  }
  getVenueDetail(): void {
    this.utilityService.startLoader();
    const user = JSON.parse(localStorage.getItem('userDetails') || '');
    let id = this.id;
    if (this.id == null){
      id = this.locid;
    }
    this.venueService.getVenuebyid(id)
      .then((response: any) => {
        this.venueDetail = response.data;
        this.subVenueList = this.venueDetail.subVenues;
        if (this.venueDetail.venueType === 'both'){
          this.venueType = 'Outdoor Venue/Indoor Venue';
        }else{
          if (this.venueDetail.venueType === 'Indoor Venue'){
            this.venueType = 'Indoor Venue';
          }else{
            this.venueType = 'Outdoor Venue';
          }

        }
        
        this.sharedService.headerLayout.emit({
          headerName: this.venueDetail.venueName,
          headerSize: this.STRINGS.headerSize.medium,
          isBack: true
        });
        this.utilityService.stopLoader();
      }).catch((error: any) => {
        this.utilityService.stopLoader();
        console.log(error);
        this.utilityService.routingAccordingToError(error);
      });
    if (localStorage.getItem('eventEndDateTime') !== null && localStorage.getItem('eventStartDateTime') !== null){
      const body = {
        eventEndDateTime: localStorage.getItem('eventEndDateTime')?.toString(),
        eventStartDateTime: localStorage.getItem('eventStartDateTime')?.toString(),
        };
      this.venueService.getBookedVenuebyid(id, body) .then((response: any) => {
          console.log(response)
          this.isBooked = response.data.isBooked;
          this.utilityService.stopLoader();
        }).catch((error: any) => {
          this.utilityService.stopLoader();
          console.log(error);
          this.utilityService.routingAccordingToError(error);
        });
    }
   
  }
  selctionVenue(): void {
    // all commented becuase of disable 20 min lock functionality
    // const form = this.formBuilder.group({
    //       type: [1],
    //       venueId: this.id,
    //       eventEndDateTime: [localStorage.getItem('eventEndDateTime')],
    //       eventStartDateTime: [localStorage.getItem('eventStartDateTime')],
    //       subVenues: [],
    // });
    // this.utilityService.startLoader();
    // this.setVenueLocalStorage();
    // this.venueService.lockVenue(form.value).then((response: any) => {
    //   this.utilityService.stopLoader();
    //   this.dialog.open(TwentyMinPopUpComponent, {
    //     width: '460px'
    //   });
    // }).catch((error: any) => {
    //   this.dialog.open(AlertdialogComponent, {
    //     width: '460px',
    //     data: {
    //       name:'This venue is reserve choose another venue or wait for 20 min',
    //     },
    //     panelClass: 'custom_dilog',
    //   });
    //   console.log(error);
    //   this.utilityService.stopLoader();
    //   this.utilityService.routingAccordingToError(error);
    // });
  }
  setVenueLocalStorage(): void{
    this.utilityService.venueDetails.next(
      {venueDetail : this.venueDetail}
    );
    this.utilityService.venueSubmitEvent.next(
      {
        venueId: this.id,
        subVenues: []
      }
    )
  }
  deleteVenueAlertOpen(): void{
    let id = this.id;
    if (this.id == null ){
      id = this.locid;
      this.dialog.open(DeleteVenueAlertComponent, {
        width: '500px',
        panelClass: 'custom_dilog',
        data: {
          venuelocid: id
        }
      });
    }
    else{
      this.dialog.open(DeleteVenueAlertComponent, {
        width: '500px',
        panelClass: 'custom_dilog',
        data: {
          venueid: id
        }
      });
    }
  }
  

}
