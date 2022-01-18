import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SharedService } from '../shared.service';
import { ErrorHandlerService } from './error-handler.service';
@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  venueDetails = new BehaviorSubject<any>('');
  createEventDetails = new BehaviorSubject<any>('');
  detailedEvent = new BehaviorSubject<any>('');
  eventAmount = new BehaviorSubject<any>('');
  eventId = new BehaviorSubject<any>('');
  bookTicketAmount = new BehaviorSubject<any>('');
  venueSubmitEvent = new BehaviorSubject<any>('');
  pastEventBack = new BehaviorSubject<any>('');
  constructor(private errorHandler: ErrorHandlerService, private sharedService: SharedService) { }

  routingAccordingToError(error: any): any {
    this.errorHandler.routeAccordingToError(error);
  }
  startLoader(): any{
    this.sharedService.loaderData.emit({isLoaderData: true});
  }
  stopLoader(): any{
    this.sharedService.loaderData.emit({isLoaderData: false});
  }


}
