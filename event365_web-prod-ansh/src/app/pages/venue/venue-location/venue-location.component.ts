import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { VenueService } from '../venue.service';

@Component({
  selector: 'app-venue-location',
  templateUrl: './venue-location.component.html',
  styleUrls: ['./venue-location.component.scss']
})
export class VenueLocationComponent implements OnInit {
  venueList: any = {};
  venueOwner = false;
  STRINGS: any = localString;
  previouslyUsed: any = false;
  constructor(private venueService: VenueService, private sharedService: SharedService,
              private router: Router, public utilityService: UtilityService) {
      this.sharedService.headerLayout.emit({
        headerName:  this.STRINGS.header.location,
        headerSize: this.STRINGS.headerSize.betMedSmall,
        isBack: true,
        isActive: this.STRINGS.header.location
      });
    }

  ngOnInit(): void {
    this.getVenues();
    const userType = localStorage.getItem('userType')?.toString();
    const venuer = 'venuer';
    if (userType?.includes(venuer)) {
      this.venueOwner = true;
    }
  }
  getVenues(): void {
    this.utilityService.startLoader();
    this.venueService.getuserVenueList().then((response: any) => {
      this.venueList = response.data;
      if (this.venueList === undefined){
        this.previouslyUsed = false;
      }else{
        this.previouslyUsed = true;
      }
      this.utilityService.stopLoader();
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      console.log(error);
      this.utilityService.routingAccordingToError(error);
    });
  }
  nevigateSearch(): void {
    this.router.navigate(['venue/list/search']);
  }
}
