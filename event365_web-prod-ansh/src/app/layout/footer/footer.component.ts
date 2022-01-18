import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertdialogComponent } from 'src/app/dialog/alertdialog/alertdialog.component';
import { BecomePartnerComponent } from 'src/app/dialog/become-partner/become-partner.component';
import { ProfileService } from 'src/app/pages/profile/profile.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from '../../shared/utils/strings';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  STRINGS: any = localString;
  year: any = new Date().getFullYear();
  userType: any;
  partnerSideLogo: any = false;
  constructor(private route: Router,
              public dialog: MatDialog,
              public profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.profileService.footerlogoChange$.subscribe((response:any) => {
      setTimeout(() => {
        if (localStorage.getItem('userType')) {
          this.userType = JSON.parse(localStorage.getItem('userType') || '');
          if(this.userType == 'host' ||  this.userType == 'venuer' || this.userType == 'promoter' || this.userType == 'member'){
            this.partnerSideLogo = true
          }else{
            this.partnerSideLogo = false
          }
        }
      }, 100);
    });
  }
  downloadStore(url: any): any {
    window.open(url, '_blank');
  }
  browseEventClick(): void {
    try {
      this.userType = JSON.parse(localStorage.getItem('userType') || '');
      if (this.userType === this.STRINGS.userType.lowerCaseHost || this.userType === this.STRINGS.userType.lowerCaseVenuer || this.userType == 'member') {
        this.route.navigate(['/event/list']);
      }
      if (this.userType === this.STRINGS.userType.guestUser || this.userType === this.STRINGS.userType.lowercaseUser) {
        this.route.navigate(['/home']);
        window.scroll(0, 0);
      }
    } catch (error) {
      this.route.navigate(['/home']);
      window.scroll(0, 0);
    }
  }
  becomePartnerClick(): void {
    try {
      this.userType = JSON.parse(localStorage.getItem('userType') || '');
      if (this.userType === this.STRINGS.userType.lowerCaseHost ||  this.userType == 'member' || this.userType === this.STRINGS.userType.lowerCaseVenuer || 
        this.userType === this.STRINGS.userType.lowerCaseVenuer ) {
        this.dialogopen(this.STRINGS.footer.alredyPartner);
      }
      if (this.userType === this.STRINGS.userType.lowercaseUser) {
        this.dialogopenPartner();
      }
      if (this.userType === this.STRINGS.userType.guestUser) {
        this.route.navigate(['auth/register']);
      }
    } catch (error) {
      this.route.navigate(['auth/register']);
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
  dialogopenPartner(): void {
    const dialogRef = this.dialog.open(BecomePartnerComponent, {
      width: '500px',
      height: '220px',
      panelClass: 'custom_dilog',
    });
  }
}
