import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fab, faFacebookSquare, faPinterest, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FirebaseShortLinkService } from 'src/app/shared/services/firebase-short-link.service';
import { environment } from 'src/environments/environment';
export class EventDetail {}
@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ShareDialogComponent implements OnInit, OnDestroy {
  fbIcon = faFacebookSquare;
  pinIcon = faPinterest;
  tweetIcon = faTwitterSquare;
  matSpinner: any;
  shareUrl = '';
  baseUrl = environment.shareBaseUrl;
   eventJson = localStorage.getItem('evendetail');
   eventdDetail = this.eventJson !== null ? JSON.parse(this.eventJson) : new  EventDetail();
  constructor(public dialogRef: MatDialogRef<ShareDialogComponent>,
              public library: FaIconLibrary,
              private firebaseService: FirebaseShortLinkService

  ) {
    library.addIconPacks(fas);
    library.addIconPacks(fab);
  }

  ngOnInit(): void {
    this.getShortLinkShare();
  }
  onCloseModal(): void {
    this.dialogRef.close();
  }
  getShortLinkShare(): void {
    try {
      const body = JSON.stringify(
        {
          dynamicLinkInfo:
          {
            domainUriPrefix: 'https://365live.page.link',
            link: this.baseUrl + 'event/detail/' + this.eventdDetail.id,
            socialMetaTagInfo: {
              socialTitle: this.eventdDetail.name,
              socialDescription: 'FIND SOMETHING FUN TO DO Discover Fun Events Near You',
              socialImageLink: this.eventdDetail.eventImages[0]?.eventImage
            },
            androidInfo: {androidPackageName: 'com.ebabu.event365live.host'},
          }
        });

      this.firebaseService.postDynamicLink(body).then((response: any) => {
        this.shareUrl = response.shortLink;
        this.matSpinner = false;
      }).catch((error: any) => {
        console.log(error,'error');

      });

    } catch (error) {
      console.log(error);

    }

  }
  ngOnDestroy(): void {
    localStorage.removeItem('evendetail');
  }
}
