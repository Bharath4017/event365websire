import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { HomeService } from '../../home/home.service';
import { EventService } from '../event.service';

@Component({
  selector: 'app-eventview',
  templateUrl: './eventview.component.html',
  styleUrls: ['./eventview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventviewComponent implements OnInit {
  STRINGS: any = localString;
  isChecked!: boolean;
  eventdetail: any = {};
  eventCountdetail: any = {};
  id: any = 0;
  img_avatar = '';
  ratingArr: any = [];
  is_availability!: boolean;
  isPastEvent:any;
  img_star = '../../../assets/img/star.jpg';
  AllList:any;
  couponCode!: string;
  superUser:any;
  rolesManageUser:any;
  constructor(  private sharedService: SharedService,
                private eventService: EventService,
                private homeService: HomeService,
                private router: Router,
                private route: ActivatedRoute,
                public dialog: MatDialog,
                private utilityService: UtilityService,

   ) {
    this.sharedService.headerLayout.emit({
      headerName:  this.STRINGS.viewEvent.PageHeading,
      headerSize: this.STRINGS.headerSize.medium,
      isBack: true
    });
    this.isPastEvent =  this.route.snapshot.paramMap.get('ispastevent');
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.isPastEvent){
     this.homeService.pastbackButton(true);
    }else{
      this.homeService.pastbackButton(false);
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem('userDetails')){
      try {
        this.superUser =  JSON.parse(localStorage.getItem('userDetails') || '');
        let majorRoles = this.superUser.roles? this.superUser.roles : this.superUser.user.roles || '';
        let majorRolesarray =[]
        if(majorRoles.includes('event_management')) {
          majorRolesarray.push('event_management')
        }
        if(majorRoles.includes('user_management')) {
          majorRolesarray.push('user_management')
        }
        if(majorRoles!= null){
          majorRolesarray.forEach((element:any) => {
            if(element.includes('event_management')){
              this.rolesManageUser = element;
            }
        });
        }
      } catch (error) {
        console.log(error)
      }
    }
     this.getUserEventDetail();
  }
  NavigatoChekdIn(){
    this.router.navigate(['../../rsvp/checked-listing/' + this.id]);
  }

  NavigatoRspv(){
    this.router.navigate(['../../rsvp/rspv-listing/' + this.id]);
  }
 
  checkEventOption(){
   // console.log(this.isPastEvent, 'isPastEvent')
    if(this.isPastEvent){
      if(this.rolesManageUser){
        this.AllList =[{
          imgSrc: '../../../assets/img/credit-card.png',
          heading: this.STRINGS.viewEvent.AllPayment,
          route: '/payment/all-payment',
          matIcon: 'payment'
      }, {
          imgSrc: '../../../assets/img/rsvp.png',
          heading: this.STRINGS.viewEvent.RSVPInvites,
          route: '/rsvp/invite',
          matIcon: 'receipt'
      }, {
          imgSrc: '../../../assets/img/wedding-planning.png',
          heading: this.STRINGS.viewEvent.EventDetail,
          route: '/event/detail',
          matIcon: 'receipt'
      }, {
          imgSrc: '../../../assets/img/wedding-planning.png',
          heading: this.STRINGS.viewEvent.EditEvent,
          route: '/event/update-event',
          matIcon: 'edit'
      }, {
          imgSrc: '../../../assets/img/wedding-planning.png',
          heading: this.STRINGS.viewEvent.EditTicket,
          route: '/event/edit-event-ticket',
          matIcon: 'receipt'
      },
    ];
      }else{
        this.AllList =[{
          imgSrc: '../../../assets/img/credit-card.png',
          heading: this.STRINGS.viewEvent.AllPayment,
          route: '/payment/all-payment',
          matIcon: 'payment'
      }, {
          imgSrc: '../../../assets/img/rsvp.png',
          heading: this.STRINGS.viewEvent.RSVPInvites,
          route: '/rsvp/invite',
          matIcon: 'receipt'
      }, {
          imgSrc: '../../../assets/img/wedding-planning.png',
          heading: this.STRINGS.viewEvent.EventDetail,
          route: '/event/detail',
          matIcon: 'receipt'
      }
    ];
      }
    }else{
    //  console.log(this.rolesManageUser, 'rolesManageUser')
      if(this.rolesManageUser){
          this.AllList =[{
            imgSrc: '../../../assets/img/credit-card.png',
            heading: this.STRINGS.viewEvent.AllPayment,
            route: '/payment/all-payment',
            matIcon: 'payment'
        }, {
            imgSrc: '../../../assets/img/rsvp.png',
            heading: this.STRINGS.viewEvent.RSVPInvites,
            route: '/rsvp/invite',
            matIcon: 'receipt'
        }, {
            imgSrc: '../../../assets/img/wedding-planning.png',
            heading: this.STRINGS.viewEvent.EventDetail,
            route: '/event/detail',
            matIcon: 'receipt'
        }, {
            imgSrc: '../../../assets/img/wedding-planning.png',
            heading: this.STRINGS.viewEvent.EditEvent,
            route: '/event/update-event',
            matIcon: 'edit'
        }, {
            imgSrc: '../../../assets/img/wedding-planning.png',
            heading: this.STRINGS.viewEvent.EditTicket,
            route: '/event/edit-event-ticket',
            matIcon: 'receipt'
        },
      ];
        }else{
          this.AllList =[{
            imgSrc: '../../../assets/img/credit-card.png',
            heading: this.STRINGS.viewEvent.AllPayment,
            route: '/payment/all-payment',
            matIcon: 'payment'
        }, {
            imgSrc: '../../../assets/img/rsvp.png',
            heading: this.STRINGS.viewEvent.RSVPInvites,
            route: '/rsvp/invite',
            matIcon: 'receipt'
        }, {
            imgSrc: '../../../assets/img/wedding-planning.png',
            heading: this.STRINGS.viewEvent.EventDetail,
            route: '/event/detail',
            matIcon: 'receipt'
        }
      ];
        }
    }
  }


  getUserEventDetail() {
    this.utilityService.startLoader();
    this.eventService.getPartnerEventdetailbyid(this.id)
     .then((response: any) => {
       if (response.success) {
         this.eventdetail = response.data;
         this.isChecked = response.data.isEventAvailable;
         this.couponCode = response.data?.coupan?.coupanCode;
         this.checkEventOption();
         this.eventdetail.eventImages.every((img: { eventImage: any; }) => {
            this.thumbnailimageOnClick(img.eventImage);
          });
         this.ratingArr = [];
         for (let star = 0; star < this.eventdetail.rating; star++) {
            this.ratingArr.push(star);
          }
         this.utilityService.stopLoader();
       }
       else{
        setTimeout(() => {
          this.utilityService.stopLoader();
        }, 1000);
       }
     }).catch((error: any) => {
       console.log(error)
       this.utilityService.stopLoader();
       this.router.navigate(['/home']);
       this.utilityService.routingAccordingToError(error);
     });
 }

 thumbnailimageOnClick(src: string) {
   this.img_avatar = src;
 }
 onChangeToggle(isChecked: boolean){
   if (isChecked){
    this.isChecked = true;

   }else{
    this.isChecked = false;
   }
   this.EventAvilability();
 }

 EventAvilability(){
   var body = {
    id: this.id,
    is_availability: this.isChecked
   };
   this.eventService.puteventAvailability(body)
  .then((response: any) => {
     // console.log(response);
  });

 }
 back(){
  this.utilityService.eventId.next({
   // eventId: response.data.eventId
  });
 }

}

