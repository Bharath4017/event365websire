import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';

@Component({
  selector: 'app-become-partner',
  templateUrl: './become-partner.component.html',
  styleUrls: ['./become-partner.component.scss']
})
export class BecomePartnerComponent implements OnInit {
  STRINGS: any = localString;
  constructor(  public dialogRef: MatDialogRef<BecomePartnerComponent>, private sharedService: SharedService,
                private authService: AuthService,
                private router: Router,
                private utilityService: UtilityService) { }

  ngOnInit(): void {
  }
  closePopup(): void {
    this.dialogRef.close();
  }
  logout(): void {
    this.utilityService.startLoader();
    const body: any = {};
    this.authService.logOut(body).then((response: any) => {
      this.utilityService.createEventDetails.next('');
      this.utilityService.venueDetails.next('')
      localStorage.clear();
      localStorage.setItem(
        'userType',
        JSON.stringify(this.STRINGS.userType.guestUser)
      );
      this.router.navigate(['auth/register/2']);
      this.sharedService.headerContent.emit({ isLogin: true });
      this.utilityService.stopLoader();
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      this.utilityService.routingAccordingToError(error);
    });
    this.dialogRef.close();
  }
}
