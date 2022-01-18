import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { PagesService } from '../../pages.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  privacyPolicy: any;
  STRINGS: any = localString
  constructor(private profileService: ProfileService,
    public sharedService: SharedService,
    public utilityService: UtilityService
  ) { }
  ngOnInit(): void {
    this.getTermsCondition();
  }
  getTermsCondition() {
    this.utilityService.startLoader();
    this.profileService.getPrivacyPolicy().then((response: any) => {
      this.privacyPolicy = response.data;
      var head;
      this.privacyPolicy.forEach((element: { id: number, heading: string, description: string }) => {
        head = element.heading
      });
      this.sharedService.headerLayout.emit({
        headerName: head,
        headerSize: this.STRINGS.headerSize.medium,
        isBack: true
      });
      this.utilityService.stopLoader();

    }).catch((error: any) => {
      this.utilityService.stopLoader();
      console.log(error);
      this.utilityService.routingAccordingToError(error);
    });
  }

}
