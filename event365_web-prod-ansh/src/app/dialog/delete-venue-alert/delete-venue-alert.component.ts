import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GetpaidServiceService } from 'src/app/pages/getpaid/getpaid-service.service';
import { VenueService } from 'src/app/pages/venue/venue.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-delete-venue-alert',
  templateUrl: './delete-venue-alert.component.html',
  styleUrls: ['./delete-venue-alert.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DeleteVenueAlertComponent implements OnInit {
  alertimg = '../../../assets/img/right-tick.png';
  venueid: any;
  venuelocid: any;
  bankid: any;
  errorText: any;
  venuePart: any;
  bankpart: any;
  utilityService: any;
  venueRemovedDateAndTime: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DeleteVenueAlertComponent,
    private venueService: VenueService,
    public getPaidService: GetpaidServiceService,
    public dialogRef: MatDialogRef<DeleteVenueAlertComponent>,
    private router: Router
  ) { 
  }

  ngOnInit(): void {
    if (this.data.venueid != null){
          this.venuePart = true;
    }
    if (this.data.venuelocid != null){
      this.venuePart = true;
    }
    if (this.data.bankid != null){
         this.bankpart = true;
    }
    if (this.data.removeVenue != null){
         this.venueRemovedDateAndTime = true;
    }

  }
  deleteVenue(): void{
    let id = Number(this.data.venueid);
    if (this.data.venueid == null){
      id = Number(this.data.venuelocid);
    }
    this.venueService.deleteVenue(id).then((response: any) => {
      if (response.success){
        if (this.data.venueid != null){
          this.router.navigate(['venue/list']);
        }else{
          this.router.navigate(['venue/venuelocation']);
        }
        this.dialogRef.close();
      }
     }).catch((error: any) => {
       console.log(error);
       this.errorText = error.error.message;
     });
  }
  deleteBank(): void{
    const id = Number(this.data.bankid);
    this.getPaidService.deleteBank(id).then((response: any) => {
      if (response.success){
        this.router.navigate(['/getpaid/choose/account']);
        this.dialogRef.close();
      }
     }).catch((error: any) => {
       console.log(error);
       this.errorText = error.error.message;
     });
  }

  removeVenue() {
    localStorage.setItem("removeVenue", "yes");
    this.dialogRef.close();
  }
}
