import { Component, OnInit } from '@angular/core';
import { localString } from '../../../shared/utils/strings';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-accont-creation',
  templateUrl: './accont-creation.component.html',
  styleUrls: ['./accont-creation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AccontCreationComponent implements OnInit {
  STRINGS: any = localString;

  constructor(private router: Router, private sharedService: SharedService) {
    this.sharedService.headerLayout.emit({ headerSize: this.STRINGS.headerSize.medium });
  }

  ngOnInit(): void { }
  continue(): any {
    this.sharedService.headerContent.emit({ isLogin: true });
    this.router.navigate(['/home']);
  }
}
