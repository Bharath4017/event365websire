import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { localString } from '../../shared/utils/strings';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { TicketChekedInSuccessComponent } from '../ticket-cheked-in-success/ticket-cheked-in-success.component';
import { RsvpService } from 'src/app/pages/rsvp/rsvp.service';
import { ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-ticket-search',
  templateUrl: './ticket-search.component.html',
  styleUrls: ['./ticket-search.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class TicketSearchComponent implements OnInit {
  STRINGS: any = localString;
  TicketSearchForm!: FormGroup;
  getCheckedList = < any > [];
  cloneCheckedInResult = < any > [];
  ticketNotFound : boolean = false;
  geteventId:any;
  GetuserName: any;
  constructor(  @Inject(MAT_DIALOG_DATA) private data: any, private route: ActivatedRoute, public _rspvservice: RsvpService, public dialogRef: MatDialogRef<TicketSearchComponent>, public dialog: MatDialog,  private fb: FormBuilder, public rsvpservice : RsvpService) { 
    this.geteventId = data.id;
  }
  ngOnInit(): void {
    this.createForm()
    this.getALLCheckdList()
  //  console.log( this.getCheckedList, "boobkes")
  }
  createForm(): any {
    this.TicketSearchForm = this.fb.group({
      searchInput: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
  }

  TicketSearchSubmit(){
    this.getCheckedList = this.cloneCheckedInResult
  //  console.log( this.getCheckedList, "boobkes")
    var getValueInput = this.TicketSearchForm.value.searchInput;
    if(getValueInput == null){
      return
    }
    var filterResult : any;
    var filterResultQr : any;
    this.getCheckedList.filter((e:any) => {
      filterResultQr = e.QRkey;
    })

    this.getCheckedList.filter((e:any) => {
      e.ticket_number_booked_rel.filter((ee:any) => {
        if(ee.ticketNumber.toLowerCase() === getValueInput.toLowerCase()) {
          filterResult = e;
         
        }
      })
    })
    this.getCheckedList = filterResult
    if(filterResult === undefined){
          this.ticketNotFound = true;
    }else{
     const body: any = {
      eventId:Number(this.geteventId),
      ticketNumber:getValueInput,
      QRkey: filterResultQr,
      type: getValueInput,
    };
      this.rsvpservice.putCheckdInMOve(body).then(
        (response: any) => {
          if (response.success) {
            this.dialogRef.close(this.TicketSearchForm.value);
          }
          // {"success":false,"code":406,"data":{},"message":"Ticket not available"}
          const dialogRef = this.dialog.open(TicketChekedInSuccessComponent, {
            width: '512px',
            data: {
              username: this.GetuserName,
              error:response.message
            },
            panelClass: 'custom_dilog',
          });
        })
        .catch((error: any) => {
          this.dialogRef.close(this.TicketSearchForm.value);
          const dialogRef = this.dialog.open(TicketChekedInSuccessComponent, {
            width: '512px',
            data: {
              error: error.error.message,
            },
            panelClass: 'custom_dilog',
          });
          localStorage.setItem("error", "Ticket not available")
        })
        
    }
  }

  getALLCheckdList(){  
    var body = {
      search :"",
      eventId:Number(this.geteventId),
      page : 1,
      limit: 10,
      deviceType:'website'
    }
    this._rspvservice.getRspvCheckedLIst(body).then((response : any) => {
    this.getCheckedList = response.data.users
    this.cloneCheckedInResult = [...this.getCheckedList]
    })
}

}

