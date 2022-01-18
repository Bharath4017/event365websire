import { Component, OnInit } from '@angular/core';
import { localString } from 'src/app/shared/utils/strings';

@Component({
  selector: 'app-payment-submit',
  templateUrl: './payment-submit.component.html',
  styleUrls: ['./payment-submit.component.scss']
})
export class PaymentSubmitComponent implements OnInit {
  STRINGS: any = localString;
  constructor() { }

  ngOnInit(): void {
  }

}
