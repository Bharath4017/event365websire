import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagingService } from '../shared/messaging.service';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit, OnDestroy {
  private loaderSubscription: Subscription;
  isLoaderData: any = false;
  message:any;

  constructor(private sharedService: SharedService,  private messagingService: MessagingService, ) {
    this.loaderSubscription = this.sharedService.loaderData.subscribe((data) => {
      setTimeout(() => {
        this.isLoaderData = data.isLoaderData ?? false;
      }, 0);
    });
  }

  ngOnInit(): void {
   this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage

  }
  ngOnDestroy(): any {
    this.loaderSubscription.unsubscribe();
  }
}
