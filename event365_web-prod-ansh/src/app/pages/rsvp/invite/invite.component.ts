import { Component, OnInit, ViewChild,ElementRef, AfterViewInit, } from '@angular/core';
import { UtilityService } from '../../../shared/services/utility.service';
import { SharedService } from '../../../shared/shared.service';
import { localString } from '../../../shared/utils/strings';
import { RsvpService } from '../rsvp.service';
import { FormGroup, } from '@angular/forms';
import * as moment from 'moment';
declare let google: any;
import { ActivatedRoute } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CustomDatepickerComponent } from '../../../components/customdatepicker/custom-datepicker/custom-datepicker.component';
declare let $: any;
export const MATERIAL_DATEPICKER_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
class CustomDateAdapter extends MomentDateAdapter {
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): any {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }
}
@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MATERIAL_DATEPICKER_FORMATS },
  ],
})
export class InviteComponent implements OnInit {
  customHeader = CustomDatepickerComponent;
  Object = Object;
  STRINGS: any = localString;
  userList: any = [];
  selectedRsvpType: any = 1;
  rsvpList: any = [];
  limit: any = 10;
  page: any = 1;
  eventList: any = [];
  startDate: any = '';
  endDate: any = '';
  payload: any = {
  //  userId: 1362,
    userId: '',
    page: 1,
    contactStatus: 1,
    startDate: '',
    endDate: '',
    searchKey: '',
    searchLocation: ''
  };
  pageIndex: any = 0;
  filterForm!: FormGroup;
  totalCount: any = 0;
  selectedAllContactRsvpUsers: any = [];
  selectedPastAttendeesRsvpUsers: any = {};
  showFilterPastAttendees: any = false;
  isEventPopup: any = false;
  isShowDatepicker: any = false;
  selectedEventFilter: any;
  maxDate: Date = new Date();
  isSelectAllContacts: any = false;
  eventId: any;
  cancelSubscription: any = 0;
  countrySearch = false;
  locationArray: string[] = [];
  datanothere: boolean = false;
  @ViewChild('locationField') Location: ElementRef | undefined;
  constructor(
    private rsvpService: RsvpService,
    private sharedService: SharedService,
    private utilityService: UtilityService,
    private route: ActivatedRoute
  ) {
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.rsvpInvite.invitePageHeading,
      isBack: true,
      headerSize: this.STRINGS.headerSize.small,
    });
    this.eventId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (localStorage.getItem('userDetails')) {
      const userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
      this.payload.userId = userDetails.id;
    }
    this.fetchAllRspvList(true);
    this.fetchPartnerEvents();
  }

  fetchPartnerEvents(): any {
    this.utilityService.startLoader();
    this.rsvpService
      .getAllPartnerEvents()
      .then((response: any) => {
        if (response.success) {
          this.eventList = response.data.pastEvent;
          this.utilityService.stopLoader();
        }
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  fetchEventTicketDetails(): any {
    this.utilityService.startLoader();
    this.rsvpService
      .getEventTicketDetails(this.eventId)
      .then((response: any) => {
        if (response.success) {
          this.utilityService.stopLoader();
        }
      })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      });
  }
  openFilter(): any {
    this.showFilterPastAttendees = !this.showFilterPastAttendees;
    this.isShowDatepicker = false;
    this.isEventPopup = false;
  }
  showFilterSearch(): any {
    this.payload.searchLocation = '';
    this.countrySearch = !this.countrySearch;
  }

  selectRsvpType(type: any): any {
    this.selectedRsvpType = type;
    this.payload.contactStatus = type;
    this.rsvpList = [];
    this.isShowDatepicker = false;
    this.isEventPopup = false;
    this.showFilterPastAttendees = false;
    this.pageIndex = 0;
    this.payload.searchKey = '';
    this.payload.searchLocation = '';
    this.fetchAllRspvList(true);
  }
  searchRsvpList(event: any): any {
    // To do add validation message
    this.payload.searchKey = event.target.value;
    this.fetchAllRspvList(false);
  }

  fetchAllRspvList(showLoader: any): any {
    if (showLoader) {
      this.utilityService.startLoader();
    }
    if (this.cancelSubscription !== 0) {
      this.cancelSubscription.unsubscribe();
      this.cancelSubscription = 0;
    }
    if (this.selectedRsvpType === 1) {
      const body = {
        ...this.payload,
        deviceType: 'website'
      };
      this.cancelSubscription = this.rsvpService.postRsvpInviteListAllContacts(this.payload, body)
        .subscribe((response: any) => {
          if (response.success) {
            this.rsvpList = response.data.userDetail;
            this.totalCount = response.data.allDataCount[0] ? response.data.allDataCount[0].count : 0;
            this.cancelSubscription = 0;
            this.utilityService.stopLoader();
          }
        },
          (error: any) => {
            this.utilityService.stopLoader();
            this.utilityService.routingAccordingToError(error);
          });
    } else {
      this.payload['deviceType'] = 'website';
      this.cancelSubscription = this.rsvpService.postRsvpInviteListPastAttendees(this.payload)
        .subscribe((response: any) => {
          if (response.success) {
            this.rsvpList = response.data.userDetail;

            this.totalCount = response.data.allDataCount[0] ? response.data.allDataCount[0].count : 0;
            this.cancelSubscription = 0;
            this.utilityService.stopLoader();
          }
        },
          (error: any) => {
            this.utilityService.stopLoader();
            this.utilityService.routingAccordingToError(error);
          });
    }
  }
  selectAllContacts(event: any): any {
    if (event.checked) {
      this.isSelectAllContacts = true;
      this.selectedAllContactRsvpUsers = this.rsvpList.map(({ id }: any) => id);
    } else {
      this.isSelectAllContacts = false;
      this.selectedAllContactRsvpUsers = [];
    }
  }
  selectAllContactsRsvpUser(event: any, user: any): any {
    if (this.isSelectAllContacts) {
      this.selectedAllContactRsvpUsers = [];
      this.isSelectAllContacts = false;
      setTimeout(() => {
        this.selectedAllContactRsvpUsers.push(user.id);
      }, 10);
      return;
    }
    if (event.checked) {
      this.selectedAllContactRsvpUsers.push(user.id);
    } else {
      if (this.selectedAllContactRsvpUsers.includes(user.id)) {
        const index = this.selectedAllContactRsvpUsers.findIndex((id: any) => id === user.id);
        this.selectedAllContactRsvpUsers.splice(index, 1);
      }
    }
  }

  selectAllPastAttendees(event: any, data: any): void {
    const userIds = data.ticketBooked.map((user: any) => user.userId);
    if (Object.keys(this.selectedPastAttendeesRsvpUsers).includes(data.id.toString())) {
      if (this.selectedPastAttendeesRsvpUsers[data.id].partialChecked) {
        this.selectedPastAttendeesRsvpUsers = {
          ...this.selectedPastAttendeesRsvpUsers,
          [data.id]: {eventId: data.id, allChecked: true, partialChecked: false, userSelected: userIds}
        };
      } else {
        delete this.selectedPastAttendeesRsvpUsers[data.id];
      }
    } else {
      this.selectedPastAttendeesRsvpUsers = {
          ...this.selectedPastAttendeesRsvpUsers,
          [data.id]: {eventId: data.id, allChecked: true, partialChecked: false, userSelected: userIds}
        };
    }
  }
  selectPastAttendeesRsvpUsers(event: any, userData: any, eventData: any): any {
    // tslint:disable-next-line:max-line-length
    if (this.selectedPastAttendeesRsvpUsers[eventData.id] && this.selectedPastAttendeesRsvpUsers[eventData.id].userSelected.includes(userData.userId)) {
      const index = this.selectedPastAttendeesRsvpUsers[eventData.id].userSelected.findIndex((x: any) => x === userData.userId);
      this.selectedPastAttendeesRsvpUsers[eventData.id].userSelected.splice(index, 1);
      this.selectedPastAttendeesRsvpUsers[eventData.id].allChecked = false;
      this.selectedPastAttendeesRsvpUsers[eventData.id].partialChecked = true;
      if (this.selectedPastAttendeesRsvpUsers[eventData.id].userSelected.length === 0) {
        delete this.selectedPastAttendeesRsvpUsers[eventData.id];
      }
    } else {
      let data = [];
      if (this.selectedPastAttendeesRsvpUsers[eventData.id] && this.selectedPastAttendeesRsvpUsers[eventData.id].userSelected) {
        data = this.selectedPastAttendeesRsvpUsers[eventData.id].userSelected;
      }
      this.selectedPastAttendeesRsvpUsers = {
        ...this.selectedPastAttendeesRsvpUsers,
        // tslint:disable-next-line:max-line-length
        [eventData.id]: {eventId: eventData.id, allChecked: false, partialChecked: true, userSelected: [...data, userData.userId]}
      };
    }
    // tslint:disable-next-line:max-line-length
    if (this.selectedPastAttendeesRsvpUsers[eventData.id] && this.selectedPastAttendeesRsvpUsers[eventData.id].userSelected.length === eventData.ticketBooked.length) {
      this.selectedPastAttendeesRsvpUsers[eventData.id].allChecked = true;
      this.selectedPastAttendeesRsvpUsers[eventData.id].partialChecked = false;
    }
  }

  sendInvite(): any {
    // console.log(Object.keys(this.selectedPastAttendeesRsvpUsers) , 'this.selectedPastAttendeesRsvpUsers', this.selectedAllContactRsvpUsers)
    if(this.selectedAllContactRsvpUsers.length == 0  && Object.keys(this.selectedPastAttendeesRsvpUsers).length == 0){
      return
     }
    if(this.selectedAllContactRsvpUsers.length == undefined){
     return
    }
    if (this.selectedAllContactRsvpUsers.length > 0 || Object.keys(this.selectedPastAttendeesRsvpUsers).length > 0) {
      const selectedInviteUsers: any = new Set([]);
      this.selectedAllContactRsvpUsers.forEach((element: any) => {
        selectedInviteUsers.add(element);
      });
      const selectedPastUsersId: any = [];
      Object.keys(this.selectedPastAttendeesRsvpUsers).forEach(element => {
        this.selectedPastAttendeesRsvpUsers[element].userSelected.forEach((userId: any) => {
          selectedPastUsersId.push(userId);
        });
      });
      selectedPastUsersId.forEach((userId: any) => {
        selectedInviteUsers.add(userId);
      });

      this.rsvpService.postSendInviteUser(this.eventId, { id: Array.from(selectedInviteUsers) })
        .then((response: any) => {
          if (response.success) {
            this.utilityService.stopLoader();
            this.selectedAllContactRsvpUsers = [];
            this.selectedPastAttendeesRsvpUsers = [];
            $('#success-invitend').modal('show');
            this.sharedService.modalContent.emit({ content: this.STRINGS.alert.inviteSuccess });
          }
        })
        .catch((error: any) => {
          this.utilityService.stopLoader();
          this.utilityService.routingAccordingToError(error);
        });
    } else {    
      $('#alert-modal').modal('show');
      this.sharedService.modalContent.emit({ content: 'Please select users' });
    }
  }
  showEventPopup(): any {
    this.isEventPopup = !this.isEventPopup;
    this.isShowDatepicker = false;
  }
  showDatePicker(): any {
    this.isShowDatepicker = !this.isShowDatepicker;
    this.isEventPopup = false;
  }
  resetFilterValues(): any {
    this.isShowDatepicker = false;
    this.showFilterPastAttendees = false;
    this.isEventPopup = false;
    this.payload.startDate = '';
    this.payload.endDate = '';
    this.payload.searchKey = '';
    this.startDate = '';
    this.endDate = '';
    this.selectedEventFilter = '';
    this.payload.searchLocation = '';
    this.fetchAllRspvList(false);
  }
  selectEventFilter(event: any): any {
    this.selectedEventFilter = event.id;
    this.payload.searchKey = event.name;
    this.showFilterPastAttendees = false;
    this.isEventPopup = false;
    this.fetchAllRspvList(false);
  }
  chooseFilterDate(): any {
    if (this.startDate && this.endDate) {
      this.payload.startDate = moment(this.startDate).format('YYYY-MM-DD');
      this.payload.endDate = moment(this.endDate).format('YYYY-MM-DD');
      this.fetchAllRspvList(false);
    }
  }
  handlePageEvent(event: any): any {
    this.pageIndex = event.pageIndex;
    this.payload.page = event.pageIndex + 1;
    this.fetchAllRspvList(false);
  }
  searchLocationFilter(event: any): any {
    if (event.target.value !== '') {
      const locationData: any = new Set([]);
      const displaySuggestions =  (predictions: any[], status: any) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
        return ;
      }
      predictions.forEach(predict => {
        locationData.add(predict.structured_formatting.main_text);
      });
      this.locationArray = Array.from(locationData);
    };
      const service = new google.maps.places.AutocompleteService();
      service.getQueryPredictions({input: event.target.value}, displaySuggestions);
    }
  }
  selectLocation(value: string): void {
    this.payload.searchLocation = value;
    this.fetchAllRspvList(false);
  }
}

