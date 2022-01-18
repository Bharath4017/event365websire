import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  faq: any;
  STRINGS: any = localString
  constructor(
    public sharedService: SharedService,
    public utilityService: UtilityService
  ) {
    this.sharedService.headerLayout.emit({
      headerName: 'FAQs',
      headerSize: this.STRINGS.headerSize.medium,
      isBack: true
    });
   }

  ngOnInit(): void {
  }

}
