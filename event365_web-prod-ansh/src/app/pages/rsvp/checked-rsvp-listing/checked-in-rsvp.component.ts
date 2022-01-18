import { TicketSearchComponent } from '../../../dialog/ticket-search/ticket-search.component';
import { localString } from 'src/app/shared/utils/strings';
import { SharedService } from 'src/app/shared/shared.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RspvDialogComponent } from 'src/app/dialog/rspv-dialog/rspv-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RsvpService } from '../rsvp.service';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-checked-in-rsvp',
  templateUrl: './checked-in-rsvp.component.html',
  styleUrls: ['./checked-in-rsvp.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CheckedInRsvpComponent implements OnInit {
  STRINGS: any = localString;
  selectedRsvpType: any = 1;
  ticketImage = '../../../assets/img/ticket.svg';
  searchImage = '../../../assets/img/search.svg';
  defoultAvtar = '../../../assets/img/host@2x.png';
  allChecked: boolean = true;
  getCheckedList = < any > [];
  ticketnumber = < any > [];
  cloneCheckedInResult = < any > [];
  datanotFound: boolean = false;
  datanothere: boolean = false;
  checkedInFilterParam: any = "all";
  filter_value: any;
  id: any;
  pageSize: any;
  page: any = 1;
  pageIndex: any = 0;
  totalCount: any = 0;
  checkBoxItemArray = < any > [];
  originalCheckedListArray = < any > [];
  Array: string[] = [];
  checkboxLabel = {
        name: this.STRINGS.RspvCheckbox.selectAll, value: 'all', isChecked: true,
          Label : [
            { name: this.STRINGS.RspvCheckbox.CheckedIn, value: 'CheckedIn', isChecked: true },
            { name: this.STRINGS.RspvCheckbox.CheckedNotIn,value: 'notCheckedIn',  isChecked: true }
          ]
      }   


  constructor(private sharedService: SharedService,  public dialog: MatDialog, public _rspvservice: RsvpService,  private route: ActivatedRoute,private utilityService: UtilityService) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.sharedService.headerLayout.emit({headerSize: this.STRINGS.headerSize.small, headerName: this.STRINGS.header.rsvpChecked, isBack: true, isActive: this.STRINGS.header.rsvpChecked});
  }

  ngOnInit(): void {
    this.getALLCheckdList();
  }

  applyFilter(){
   this.getCheckedList = this.cloneCheckedInResult;
    this.checkBoxItemArray = this.checkboxLabel.Label.filter((value : any) => {
            return value.isChecked
      });
      if(this.checkBoxItemArray.length==1){ 
        this.checkBoxItemArray.forEach((element: any) => {
          if(element.value.includes("notCheckedIn")){
            var filterResult1 = this.getCheckedList.filter((value : any) => {
                      return value.status.includes("notCheckedIn")
                });
                this.getCheckedList = filterResult1
                this.checkedInFilterParam = false
                this.getALLCheckdList();
                this.datanothere = false;
          }else{
            var filterResult2 = this.getCheckedList.filter((value : any) => {
                      return value.status.includes("checkedIn")  
                    });
                    this.getCheckedList = filterResult2;
                    this.checkedInFilterParam = true
                    this.getALLCheckdList();
                    this.datanothere = false;
          }
        });
      }else{
       
        if(this.checkBoxItemArray.length === 2){
          this.checkedInFilterParam = "all"
          this.getALLCheckdList();
          this.datanothere = false;
        }else{
          this.datanothere = true;
        }
      }
  this.allChecked =this.checkboxLabel.Label != null && this.checkboxLabel.Label.every(t => t.isChecked);
  if(this.checkBoxItemArray.length <= 0){
    this.getCheckedList =null;
    this.datanotFound = true;
  }
  }

  applyinputFilter(e: any) {
    this.getCheckedList = this.cloneCheckedInResult
    var filterResult = this.getCheckedList.filter((item: any) =>
      Object.keys(item.users).some(k => item.users[k] != null &&
        item.users[k].toString().toLowerCase()
        .includes(e.target.value))
    );
    this.getCheckedList = filterResult;
    if (this.getCheckedList.length == 0) {
 
      this.datanotFound = true;
    } else {
      this.datanotFound = false;
     
    }
 
  }

  checkedAll(isChecked: boolean) {
    this.allChecked = isChecked;
    if (this.allChecked) {
    this.checkedInFilterParam = "all"
      this.getALLCheckdList()
      this.datanothere = false;
    } else {
      this.getCheckedList = null;
      this.datanothere = true;
      
    }
    if (this.checkboxLabel.Label == null) {
      return;
    }
    this.checkboxLabel.Label.forEach(t => t.isChecked = isChecked);
  }

  rspvDialog(data :any, UserInfo : any) {
    console.log(UserInfo)
    var TicketId:any;
    data.forEach((element : any) => {
      TicketId = element.ticketBookedId
    });
    const dialogRef = this.dialog.open(RspvDialogComponent, {
      width: '840px',
      maxHeight: '90vh',
      data: {
        TicketId: TicketId,
        eventId: this.id,
        UserInfo: UserInfo,
        checkedIn: true
      },
      panelClass: 'custom_rsvp_dilog'
    
    });
  }

  serachTicket(){
    const dialogRef = this.dialog.open(TicketSearchComponent, {
      width: '421px',
      data: {
        id : this.id
      },
      panelClass: 'custom_dilog'
    });
  }

  handlePageEvent(event: any): any {
    this.pageIndex = event.pageIndex +1;
   this.checkBoxItemArray.page = event.pageIndex + 1;
    this.getALLCheckdList();

  }

 getALLCheckdList(){  
    this.utilityService.startLoader();
         var body = {
            search :"",
            eventId : Number(this.id),
            page : this.page,
            limit: 10,
            deviceType:'website',
            checkedIn :this.checkedInFilterParam
        }
        this._rspvservice.getRspvCheckedLIst(body).then((response : any) => {
          console.log(response, "qr")
          if (response.success) {
            this.getCheckedList = response.data.users;
            this.totalCount = response.data.allDataCount;
            this.cloneCheckedInResult = [...this.getCheckedList]
            this.utilityService.stopLoader();
          }else(error: any) => {
            this.utilityService.stopLoader();
            this.utilityService.routingAccordingToError(error);
          } 
        })
        .catch((error: any) => {
          this.utilityService.stopLoader();
          })
 }
 
}
