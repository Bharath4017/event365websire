import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  STRINGS: any = localString;
  
  constructor(public sharedService: SharedService,) { }

  ngOnInit(): void {
    this.sharedService.headerLayout.emit({
      headerName: 'About Us',
      headerSize: this.STRINGS.headerSize.medium,
      isBack: true
    });
  }

}
