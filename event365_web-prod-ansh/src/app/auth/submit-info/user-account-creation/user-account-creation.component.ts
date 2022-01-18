import { Component, OnInit } from '@angular/core';
import { localString } from '../../../shared/utils/strings';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
@Component({
  selector: 'app-user-account-creation',
  templateUrl: './user-account-creation.component.html',
  styleUrls: ['./user-account-creation.component.scss']
})
export class UserAccountCreationComponent implements OnInit {
  STRINGS: any = localString;

  constructor(private router: Router, private sharedService: SharedService) {
    this.sharedService.headerLayout.emit({ headerSize: this.STRINGS.headerSize.medium });
   }

  ngOnInit(): void {
  }
  skipPreference(): any {
    this.sharedService.headerContent.emit({ isLogin: true });
    this.router.navigate(['/home']);
  }
}
