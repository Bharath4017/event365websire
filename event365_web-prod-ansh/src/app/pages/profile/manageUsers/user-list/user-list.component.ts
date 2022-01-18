import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TwentyMinPopUpComponent } from 'src/app/dialog/twenty-min-pop-up/twenty-min-pop-up.component';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedService } from 'src/app/shared/shared.service';
import { localString } from 'src/app/shared/utils/strings';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  STRINGS:  any = localString
  allUserList: any;
  superUser:any;
  rolesManageUser:any;
  constructor(
    private sharedService: SharedService,
    private profileService:ProfileService,
    public dialog:MatDialog,
    private utilityService: UtilityService
    ) {
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.manageUser.userListTitle,
      headerSize: this.STRINGS.headerSize.small,
      isBack: true
    })
   }

  ngOnInit(): void {
  this.getUserList()
  }

getUserList(){
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
        if(element.includes('user_management')){
          if(element.includes('user_management') && this.superUser.createdBy){
                  this.rolesManageUser = element;
              }
          console.log( this.rolesManageUser, ' this.rolesManageUser')
        }
    });
    }
  } catch (error) {
    console.log(error)
  }
    this.utilityService.startLoader();
    let body; 
    if(this.rolesManageUser == 'user_management' && this.superUser.createdBy){
      body = {
        userRole : this.rolesManageUser,
        createdBy: this.superUser.createdBy
      }
    }else{ 
      body = {
    }
    }
    this.profileService.getUserwithbody(body).then((Response:any)=>{
      if(Response.success){
        this.allUserList = Response.data
        console.log(this.allUserList, "fgf")
        this.utilityService.stopLoader();
      }
    }, (error:any) => {
      this.utilityService.routingAccordingToError;
      console.log(error);
      this.utilityService.stopLoader();
      })
  }

  deleteUser(userId:any) {
    console.log('TwentyMinPopUpComponent', userId)
    this.dialog.open(TwentyMinPopUpComponent, {
      data: {
        deleteUser: userId,
      }
    });
  }
  
}
