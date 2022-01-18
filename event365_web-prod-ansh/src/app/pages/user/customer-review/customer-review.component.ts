import { UserService } from './../user.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { localString } from '../../../shared/utils/strings';
import { SharedService } from '../../../shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import * as moment from 'moment';
interface starRatings {
  value: any;
  viewValue: any;
}

declare let $: any;

@Component({
  selector: 'app-customer-review',
  templateUrl: './customer-review.component.html',
  styleUrls: ['./customer-review.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CustomerReviewComponent implements OnInit {
  STRINGS: any = localString;
  writeReviewArea = false;
  ratingArr: any = [];
  userId: any;
  reviews: any = '';
  userStarRating: any = '2';
  allUserReviews: any = [];
  borderColor: any = false;
  currentUserProFilePic: any = '';
  public rating: number = 2;
  public starCount: number = 5;
  public color: string = 'accent';
  public abc: string = 'accent';

  postedAt: any;
  selectedRatings: any;
  ratings: starRatings[] = [
    { value: 'desc', viewValue: 'Most Recent' },
    { value: '1', viewValue: '1 Star Rating' },
    { value: '2', viewValue: '2 Star Rating' },
    { value: '3', viewValue: '3 Star Rating' },
    { value: '4', viewValue: '4 Star Rating' },
    { value: '5', viewValue: '5 Star Rating' },
    { value: 'asc', viewValue: 'Oldest' }
  ];
  isSubmitted: any = false;
  eventDetails: any = {};
  constructor(private sharedService: SharedService, private userService: UserService, private route: ActivatedRoute,
    private utilityService: UtilityService, private router: Router, private cd: ChangeDetectorRef) {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.customerReview.reviewPageHeading,
      isBack: true,
      headerSize: this.STRINGS.headerSize.small,
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('userDetails')) {
      this.currentUserProFilePic = JSON.parse(localStorage.getItem('userDetails') || '');
    }
    if ((localStorage.getItem('userType') === '"guestUser"') || (localStorage.getItem('userType') === null)) {
      this.router.navigate(['/auth/login']);
    }
    else if ((localStorage.getItem('userType') === '"customer"')  ) {
      this.getEventDetails(this.userId);
      this.getUserReviews(this.userId);
      for (let index = 0; index < this.starCount; index++) {
        this.ratingArr.push(index);
      }
    }
      else{
        this.getEventDetails(this.userId);
        this.getOrganiserReviews(this.userId);
        for (let index = 0; index < this.starCount; index++) {
          this.ratingArr.push(index);
        }
    }
  }
  onClick(rating: number): any {
    this.userStarRating = rating;
    this.rating = rating;
    return false;
  }
  getEventDetails(id: any): any {
    this.userService.getUserEventdetail(id)
      .then((response: any) => {
        if (response.success) {
          this.utilityService.stopLoader();
          this.eventDetails = response.data;
        }
      }).catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  showStarIcon(index: any, value: any, type: string): any {
    if ('topReview') {
      if (value >= index + 1) {
        this.borderColor = false;
        return ;
      }
      else {
        this.borderColor = true;
        return ;
      }
    }

    if ('customerReview') {
      if (parseInt(value) >= index + 1) {
        this.borderColor = false;
        return ;
      }
      else {
        this.borderColor = true;
        return ;
      }
    }

  }
  showIcon(index: any): any {
    if (this.rating >= index + 1) {
      this.borderColor = false;
      return ;
    } else {
      this.borderColor = true;
      return ;
    }
  }
 


  getUserReviews(id: any): void {
    this.utilityService.startLoader();
    this.userService.getAllUserReviews(id).then((response: any) => {
      if (response.success) {
        this.utilityService.stopLoader();
        this.allUserReviews = response.data;
      }
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      this.utilityService.routingAccordingToError(error);
    });
  }
  getOrganiserReviews(id: any): void {
    this.utilityService.startLoader();
    this.userService.organiserUserReviews(id).then((response: any) => {
      if (response.success) {
        this.utilityService.stopLoader();
        this.allUserReviews = response.data;
      }
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      this.utilityService.routingAccordingToError(error);
    });
  }

 
  sortByRating(rating: any): any {
    this.utilityService.startLoader();
    this.userService.getAllUserReviewsByRating(this.userId, rating)
      .then((response: any) => {
        if (response.success) {
          this.utilityService.stopLoader();
          this.allUserReviews = response.data;
        }
      }).catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  
}

export enum StarRatingColor {
  primary = 'primary',
  accent = 'accent',
  warn = 'warn'
}
