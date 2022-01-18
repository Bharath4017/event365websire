import { Component, OnInit } from '@angular/core';
import { localString } from '../../../shared/utils/strings';
import { SharedService } from '../../../shared/shared.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UserService } from './../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {
  selectedFavType: any = 1;
  STRINGS: any = localString;
  pastFavouriteEvents: any = [];
  comingSoonFavouriteEvents: any = [];
  isComing: any = false;
  userType: any = '';
  isMarkFav: any = true;
  // tslint:disable-next-line:max-line-length
  constructor(private sharedService: SharedService, private route: Router, private userService: UserService, private utilityService: UtilityService, private _snackBar: MatSnackBar) {
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.favorite.favoritePageHeading,
      isBack: true,
      headerSize: this.STRINGS.headerSize.small,
    });

  }

  ngOnInit(): void {
    this.userFavoriteEvents();
  }

  userFavoriteEvents(): any {
    this.utilityService.startLoader();
    this.userService.getFavouriteEvents().then((events: any) => {
      this.pastFavouriteEvents = events.data.past;

      this.pastFavouriteEvents.forEach((event: any) => {
        event.start = event.start.replace('Z', '');
        event.end = event.end.replace('Z', '');
      });

      this.comingSoonFavouriteEvents = events.data.comingSoon;

      this.comingSoonFavouriteEvents.forEach((event: any) => {
        event.start = event.start.replace('Z', '');
        event.end = event.end.replace('Z', '');
      });

      this.isMarkFav = true;
      this.utilityService.stopLoader();
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      this.utilityService.routingAccordingToError(error);
    });
  }
  pastFavourite(): any {
    this.isComing = false;
    this.selectedFavType = 1;
  }
  comingFavourite(): any {
    this.isComing = true;
    this.selectedFavType = 2;
  }
  markFavorites(eventid: number): void {
    this.isMarkFav = false;
    const body = {
      eventId: eventid,
      isFavorite: false
    };
    this.utilityService.startLoader();
    this.userService.putMarkFavorite(body)
    .then((response: any) => {
      this._snackBar.open('Event name is unmarked as favorite', 'Success', {
        duration: 2000,
      });
      this.userFavoriteEvents();
      this.utilityService.stopLoader();
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      this.utilityService.routingAccordingToError(error);
    });
  }

  navigateEventDetail(id: any): any {
    if (this.isMarkFav) {
        this.route.navigate(['event/detail/' + id]);
    }
  }
}


