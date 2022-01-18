import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { localString } from 'src/app/shared/utils/strings';
import { SharedService } from 'src/app/shared/shared.service';
import { UserService } from '../../user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SuccessDialogComponent } from 'src/app/dialog/success-dialog/success-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-preferences-list',
  templateUrl: './preferences-list.component.html',
  styleUrls: ['./preferences-list.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class PreferencesListComponent implements OnInit {
  STRINGS: any = localString;
  categoryList: any = [];
  selectedCategoryListId: any = [];
  subCategoryList: any = [];
  getcatlistpreference: any = [];
  constructor(private sharedService: SharedService, private dialog:MatDialog, private userService: UserService, private utilityService: UtilityService) {
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.header.preferences,
      headerSize: this.STRINGS.headerSize.small,
      isBack: true,
    });
  }

  ngOnInit(): void {
    this.selectCategorylist();
    // this.selectSubCategorylist();
    // this.deletePreference
  }

  selectCategorylist() {
    this.utilityService.startLoader();
    this.userService.getcatlistpreference().then((response: any) => {
      this.utilityService.stopLoader();
      console.log(response)
      if (response.success) {      
        for (var i = 0; i < response.data.category.length; i++) {
          if (response.data.category[i].isActive == true) {
            this.categoryList.push(response.data.category[i]);
            this.selectedCategoryListId.push(response.data.category[i].id)
          }
        }
        this.userService.postSubCategoryPreference({ "categoryId": this.selectedCategoryListId }).then((response: any) => {
          console.log("43", response.data);
          if (response.success) {
            for (var i = 0; i < response.data.length; i++) {
              if (response.data[i].isActive == true)
                this.subCategoryList.push(response.data[i]);
            }
          }
        })
        console.log("51", this.subCategoryList);
        // this.categoryList = response.data.category;
      }
    })
  }
  // selectSubCategorylist() {
  //   this.userService.postSubCategoryPreference(this.selectedCategoryListId).then((response: any) => {
  //     console.log(response.data);
  //       if (response.success) {
  //         for (var i = 0; i < response.data.category.length; i++) {
  //         if(response.data.category[i].isActive == true)
  //           this.subCategoryList.push(response.data.category[i]);
  //         }

  //         this.categoryList = response.data.category;
  //      }
  //   })
  // }
  // deletePreference(id: any): any {
  //   this.userService.deletepreference(id).then((response: any) => {
  //     if (response.success) {
  //       console.log(response)
  //     }
  //   })
  // }
  deleteCategoryPreference(categoryId: any) {
    const httpOptions = {
      body: ({
        "categoryId": categoryId
      })
    };
    this.userService.deleteSubCategoryPreference(httpOptions).then((response: any) => {
      if (response.success) {
        console.log(response)
        this.categoryList = [];
        this.subCategoryList = [];
        this.selectCategorylist();
        this.successDialogopen('Category deleted successfully');
        // this.selectSubCategorylist();  
      }
    })
  }
  deleteSubCategoryPreference(categoryId: any, subCategoryId: any) {
    const httpOptions = {
      body: ({
        "categoryId": categoryId,
        "subCategoryId": subCategoryId
      })
    };
    this.userService.deleteSubCategoryPreference(httpOptions).then((response: any) => {
      if (response.success) {
        console.log(response)
        this.categoryList = [];
        this.subCategoryList = [];
        this.selectCategorylist();
        this.successDialogopen('Sub Category deleted successfully');
        // this.selectSubCategorylist();  
      }
    })
  }

  deletAllPreferense() {
    this.userService.deleteAllpreference().then((response: any) => {
      if (response.success) {
        console.log(response);
        this.categoryList = [];
        this.subCategoryList = [];
      }
    })
  }

  resetdiv(value: any) {
    if (value) {
      console.log('rest value')
    }
  }
  successDialogopen(name: any): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: '460px',
      data: {
        message:name,
      },
      panelClass: 'custom_dilog',
    });
  }
}
