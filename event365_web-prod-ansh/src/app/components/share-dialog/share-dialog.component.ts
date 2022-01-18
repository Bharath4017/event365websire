import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fab, faFacebookSquare, faPinterest, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import { FirebaseShortLinkService } from 'src/app/shared/services/firebase-short-link.service';

@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss']
})
export class ShareDialogComponent implements OnInit {
  fbIcon = faFacebookSquare;
  pinIcon = faPinterest;
  tweetIcon = faTwitterSquare;
  matSpinner:any;
  shareUrl!:string;
  constructor( public dialogRef: MatDialogRef<ShareDialogComponent>,
    public library: FaIconLibrary,
    private firebaseService:FirebaseShortLinkService
    
    ) { 
    library.addIconPacks(fas);
    library.addIconPacks(fab);
  }

  ngOnInit(): void {
    this.getShortLinkShare();
  }
  onCloseModal(){
    this.dialogRef.close();
  }
  getShortLinkShare(){
          var body=JSON.stringify(
            { 
              "dynamicLinkInfo":
               { "domainUriPrefix": "", 
               "link": window.location.href, 
               "androidInfo": { "androidPackageName": "" } } });
          
           this.firebaseService.postDynamicLink(body).then((response: any) => {
            this.shareUrl = response.shortLinks;
            this.matSpinner =false
           }).catch((error: any) => {
             console.log(error);
            
           });
  }
}
