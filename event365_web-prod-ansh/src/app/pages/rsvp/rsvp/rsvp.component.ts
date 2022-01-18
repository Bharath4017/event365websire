import {localString} from 'src/app/shared/utils/strings';
import {SharedService} from 'src/app/shared/shared.service';
import {Component,OnInit,ViewEncapsulation} from '@angular/core';
import {RspvDialogComponent} from 'src/app/dialog/rspv-dialog/rspv-dialog.component';
import { MatDialog} from '@angular/material/dialog';
import {RsvpService} from '../rsvp.service';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RsvpComponent implements OnInit {
  STRINGS: any = localString;
  ticketImage = '../../../assets/img/ticket.svg';
  searchImage = '../../../assets/img/search.svg';
  defoultAvtar = '../../../assets/img/host@2x.png';
  allChecked: boolean = true;
  searchText = '';
  getRspvList = < any > [];
  rspvType: any = ["all"];
  datanothere: boolean = false;
  filterInputvalue: any;
  cloneRspvResult = < any > [];
  checkBoxItemArray = < any > [];
  page: any = 1;
  pageIndex: any = 0;
  totalCount: any = 0;
  id: any;
  checkboxLabel = {
    name: this.STRINGS.RspvCheckbox.selectAll,
    value: 'all',
    isChecked: true,
    Label: [{
        name: this.STRINGS.RspvCheckbox.paid,
        value: 'regularPaid',
        isChecked: true
      },
      {
        name: this.STRINGS.RspvCheckbox.free,
        value: 'freeNormal',
        isChecked: true
      },
      {
        name: this.STRINGS.RspvCheckbox.rspv,
        value: 'regularNormal',
        isChecked: true
      },
      {
        name: this.STRINGS.RspvCheckbox.vip,
        value: 'vipNormal',
        isChecked: true
      },
      {
        name: this.STRINGS.RspvCheckbox.setting,
        value: 'regularTableSeating',
        isChecked: true
      },
    ]
  }
  constructor(private sharedService: SharedService, public dialog: MatDialog, public _rspvservice: RsvpService, private route: ActivatedRoute, private utilityService: UtilityService,) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.sharedService.headerLayout.emit({
      headerSize: this.STRINGS.headerSize.small,
      headerName: this.STRINGS.header.rsvp,
      isBack: true,
      isActive: this.STRINGS.header.rsvp
    });
  }
  ngOnInit(): void {
    this.FetchALLrspvList();
  }

  applyFilter() {
    this.checkBoxItemArray = this.checkboxLabel.Label.filter((value) => {
      return value.isChecked
    }); 
    var rsvptypeArray = < any > [];
    if (this.checkBoxItemArray) {
 
      this.checkBoxItemArray.forEach((selectValue: any) => {
        return rsvptypeArray.push(selectValue.value)
      });
      this.rspvType = rsvptypeArray.toString();
    }
    this.FetchALLrspvList()
    this.allChecked = this.checkboxLabel.Label != null && this.checkboxLabel.Label.every(t => t.isChecked);
   
  }

  applyinputFilter(e: any) {
    this.getRspvList = this.cloneRspvResult
    var filterResult = this.getRspvList.filter((item: any) =>
      Object.keys(item.users).some(k => item.users[k] != null &&
        item.users[k].toString().toLowerCase()
        .includes(e.target.value))
    );
    this.getRspvList = filterResult;
  }

  checkedAll(isChecked: boolean) {
    this.allChecked = isChecked;
    if (this.allChecked) {
      this.rspvType = "all"
      this.FetchALLrspvList();
      this.datanothere = false;
    } else {
      this.getRspvList = null;
      this.datanothere = true;
    }
    if (this.checkboxLabel.Label == null) {
      return;
    }
    this.checkboxLabel.Label.forEach(t => t.isChecked = isChecked);
  }

  GetAllCheckboxValue() {
    if (this.checkboxLabel.Label == null) {
      return false;
    }
    return this.checkboxLabel.Label.filter(t => t.isChecked).length > 0 && !this.allChecked;
  }

  rspvDialog(data :any) {
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
        CheckedIn: false
      },
      panelClass: 'custom_rsvp_dilog'
    });
  }

 FetchALLrspvList(){
  this.utilityService.startLoader();
    var body;
    if (this.rspvType == "all") {
      body = {
        eventId: this.id,
        rspvType: this.rspvType,
        deviceType:'website',
        page: this.page,
      }
    } else {
      body = {
        eventId: this.id,
        "rspvType[]":this.rspvType,
        deviceType:'website',
        page: this.page,
      }
    }
    this._rspvservice.getRspvLIst(body).
     then((response: any) => {
      if (response.success) {
        this.getRspvList = response.data.rspvType;
        this.totalCount = response.data.rspvCount;
        this.cloneRspvResult = [...this.getRspvList]
        this.utilityService.stopLoader();
      } else(error: any) => {
        this.utilityService.stopLoader();
        this.utilityService.routingAccordingToError(error);
      } 
    })
      .catch((error: any) => {
        this.utilityService.stopLoader();
        })
    }

  handlePageEvent(event: any): any {
    this.pageIndex = event.pageIndex + 1;
    this.FetchALLrspvList();

  }
}
