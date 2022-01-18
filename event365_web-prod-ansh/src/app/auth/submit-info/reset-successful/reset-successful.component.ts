import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { localString } from 'src/app/shared/utils/strings';
import { SharedService } from '../../../shared/shared.service';
@Component({
  selector: 'app-reset-successful',
  templateUrl: './reset-successful.component.html',
  styleUrls: ['./reset-successful.component.scss']
})
export class ResetSuccessfulComponent implements OnInit {
  STRINGS: any = localString;

  constructor(private router: Router, private sharedService: SharedService) {
    this.sharedService.headerLayout.emit({ headerSize: this.STRINGS.headerSize.medium });
  }

  ngOnInit(): void {
  }

  nevigateLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
