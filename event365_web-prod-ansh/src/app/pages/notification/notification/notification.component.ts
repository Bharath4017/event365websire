import { Component, EventEmitter, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { NotificationService } from '../notification.service';
import * as moment from 'moment';
import { MatChip, MatChipList } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { Output } from '@angular/core';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  STRINGS: any = localString;
  refreshheader: string = "Hola Mundo!"

  notification: any;
  notificationList:any;
  selected:boolean = true;
  dataNotAvailable: boolean = false;
  chipcounthide= [true, true, true, true];
  status = false;
  userTypeCustomer: any;
  constructor(
    private sharedService: SharedService,
    private utilityService: UtilityService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    ) {
    this.sharedService.headerLayout.emit({ 
      headerSize: this.STRINGS.headerSize.small, 
      headerName: this.STRINGS.header.notification,
      isBack: true 
    });
   }
   notificationType:any;



  ngOnInit(): void {
    this.userTypeCustomer = JSON.parse(localStorage.getItem('userType') || '');
    
    this.getNotificationCount()
    this.getNotification(`1,2`, `1`) // user empty string to get latest 4 notification
  }
  toggleOccuredOnSelection(occuredOnchip: MatChip) {
    //occuredOnchip.toggleSelected();
  }
  hideChipCount(index : any){
    this.chipcounthide[index] = false
  }
  getNotificationCount(){
    this.utilityService.startLoader();
    this.notificationService.getNotificationCount().then((Response:any)=>{
      if(Response.success){
        this.notification = Response.data
       
        this.utilityService.stopLoader();
        this.notification = [
          { name: "Events", value: Response.data.eventCount.count, notificationType: `1,2`, notificationTab: 1  },
          { name: "RSVP", value: Response.data.rsvpCount.count, notificationType: `2,5`,  notificationTab:2 },
          { name: "Transations", value: Response.data.transactionCount.count, notificationType:   `4,2,1`,  notificationTab:3 },
          { name: "Organisation/Profile", value: Response.data.organizationCount.count, notificationType: ``,  notificationTab:4 },
         ]  
       var TotalNotiCount =  0;
         this.notification.forEach((count:any) => {
              TotalNotiCount += +(count.value)
         });
          this.notificationService.notificationStatusUpdate$.next(TotalNotiCount);
      }
    }, (error:any) => {
      this.utilityService.routingAccordingToError;
      this.utilityService.stopLoader();
      })
  }

  getNotificatioCounter(){
  this.notificationService.getNotificationCount().then((Response:any)=>{
   // console.log(Response, "Response")
  }) 
}

  readAllNotification(notificationType:any, notificationTab:any ){
    let body = {
      notificationType:notificationType,
      notificationTab:notificationTab 
    }
    this.notificationService.readAllNotification(body).then((Response:any)=>{
        this.notificationService.notificationStatusUpdate$.next(0);
    }, (error:any) => {
      this.utilityService.routingAccordingToError;
      console.log(error);
      })
  }




  getNotification(notificationType:any, notificationTab:any){
    this.utilityService.startLoader();
    if(this.userTypeCustomer == 'customer'){
      this.utilityService.startLoader();
      this.notificationService.getUserNotification(10, 1, notificationType, notificationTab).then((Response:any)=>{
        if(Response.success){
          if(Response.data.NotificationList == ''){
            this.dataNotAvailable = true
        }else{
          this.dataNotAvailable = false
        }
              const groups = Response.data.NotificationList.reduce((groups:any, data:any) => {
                const date = data.dateTime.split('T')[0];
                if (!groups[date]) {
                  groups[date] = [];
                }
                groups[date].push(data);
                return groups;
              }, {});
              this.notificationList = Object.keys(groups).map((date) => {
                return {
                  date,
                  list: groups[date]
                };
              });
          this.utilityService.stopLoader();
        }
      }, (error:any) => {
        this.utilityService.routingAccordingToError;
        console.log(error);
        this.utilityService.stopLoader();
        })
        let date = new Date()
    } else{
      this.notificationService.getNotification(10, 1, notificationType, notificationTab).then((Response:any)=>{
        //(Response, 'Response')
        if(Response.success){
          if(Response.data.NotificationList == ''){
            this.dataNotAvailable = true
        }else{
          this.dataNotAvailable = false
        }
              const groups = Response.data.NotificationList.reduce((groups:any, data:any) => {
                const date = data.dateTime.split('T')[0];
                if (!groups[date]) {
                  groups[date] = [];
                }
                groups[date].push(data);
                return groups;
              }, {});
              this.notificationList = Object.keys(groups).map((date) => {
                return {
                  date,
                  list: groups[date]
                };
              });
          this.utilityService.stopLoader();
        }
      }, (error:any) => {
        this.utilityService.routingAccordingToError;
        console.log(error);
        this.utilityService.stopLoader();
        })
        let date = new Date()
    }

  }

  todayAndYesterday(date:any){
    if(moment(date).isSame(moment(), "day")){
      return moment(date).isSame(moment(), "day") ? "Today" : false;
    }else{
      return moment(date).isSame(moment().subtract(1, 'day'), "day") ? "Yesterday" : false;
    }
  }
  getIimeDiff(DateTime:any){
    let dateTime1 = moment(DateTime).format("YYYY-MM-DD HH:mm:ss");
    var now = moment(new Date()); //todays date
    var end = moment(dateTime1); // another date
    var duration = moment.duration(now.diff(end));
    if( Math.floor(duration.years())> 0){
      if(Math.floor(duration.years()) == 1){
        return  Math.floor(duration.years()) + ' year'
      }else{
        return  Math.floor(duration.years()) + ' years'
      }
    }else if(Math.floor(duration.months())> 0){
      if(Math.floor(duration.months()) == 1){
        return  Math.floor(duration.months()) + ' month'
      }else{
        return  Math.floor(duration.months()) + ' months'
      }
    }else if(Math.floor(duration.weeks())> 0){
      if(Math.floor(duration.weeks()) == 1){
        return  Math.floor(duration.weeks()) + ' week'
      }else{
        return  Math.floor(duration.weeks()) + ' weeks'
      }
    }else if(Math.floor(duration.asDays())> 0){
      if(Math.floor(duration.asDays()) == 1){
        return  Math.floor(duration.asDays()) + ' day'
      }else{
        return  Math.floor(duration.asDays()) + ' days'
      }
    }else if(Math.floor(duration.hours())> 0){
      if(Math.floor(duration.hours()) == 1){
        return  Math.floor(duration.hours()) + ' hour'
      }else{
        return  Math.floor(duration.hours()) + ' hours'
      }
    }else if(Math.floor(duration.minutes())> 0){
      return  Math.floor(duration.minutes()) + ' min'
    }else{
      return  Math.floor(duration.minutes()) + ' min'
    }
  }
  toggleSelection(chip: MatChip, notificationType:any, notificationTab:any) {
    if(!chip?.selected){
      chip.toggleSelected();
      this.readAllNotification(notificationType, notificationTab);
    }

   
 }

}