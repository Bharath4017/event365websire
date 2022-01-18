import { UserService } from '../../user.service';
import { Component, OnInit } from '@angular/core';
import { localString } from '../../../../shared/utils/strings';
import { SharedService } from 'src/app/shared/shared.service';
import { UtilityService } from '../../../../shared/services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessDialogComponent } from 'src/app/dialog/success-dialog/success-dialog.component';
import { MatDialog } from '@angular/material/dialog';
declare let $: any;
@Component({
  selector: 'app-add-preferences',
  templateUrl: './add-preferences.component.html',
  styleUrls: ['./add-preferences.component.scss'],
})
export class AddPreferencesComponent implements OnInit {
  STRINGS: any = localString;
  categoryList: any = [];
  selectedCategory: any = [];
  selectedsubCategory: any = [];
  subCategory: any = [];
  selectedCategoryID: any = [];
  selectedsubCategoryID: any = [];
  showSubCategory: boolean = false;
  routeId:any;

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private sharedService: SharedService,
    private utilityService: UtilityService,
    private router : Router,
    private route: ActivatedRoute
  ) {
    this.sharedService.headerLayout.emit({
      headerName: this.STRINGS.header.preferences,
      isBack: true,
      headerSize: this.STRINGS.headerSize.small,
    });
  }

  ngOnInit(): void {
    this.fetchCategoryList();
    this.routeId = this.route.snapshot.paramMap.get('id');
  }
  fetchCategoryList(): any {
    this.utilityService.startLoader();
    this.userService.getpreference().then((response: any) => {
      if (response.success) {
        this.categoryList = response.data.category
        for (var i = 0; i < response.data.category.length; i++) {
          if(response.data.category[i].isActive == true)
          this.selectedCategory.push(response.data.category[i]);
        }

        for (var i = 0; i < response.data.category.length; i++) {
          if(response.data.category[i].isActive == true)
          this.selectedCategoryID.push(response.data.category[i].id);
        }
        
        if (window.innerWidth >= 500) {
          setTimeout(() => {
            let j = 0;
            let x = 0;
            let count = 30;
            for (let i = 0; i < this.categoryList.length; i++) {
              if (j < 4) {
                const bottomCss: any = x;
                const leftCss: any = count;
                $('#dynamic_' + i).css('top', bottomCss + 'rem');
                $('#dynamic_' + i).css('left', leftCss + 'rem');
                count += 20;
                j += 1;
                x += 3;
              }
              else {
                j = 0;
                count = 2;
                $('#dynamic_' + i).css('top', x + 'rem');
                $('#dynamic_' + i).css('left', count + 'rem');
                count = 20;
                x += 6;
              }
            }
          }, 10);
        }
        else {
          setTimeout(() => {
            let j = 0;
            let x = 0;
            let count = 30;
            for (let i = 0; i < this.categoryList.length; i++) {
              if (j < 1) {
                const bottomCss: any = x;
                const leftCss: any = count;
                $('#dynamic_' + i).css('top', bottomCss + 'rem');
                $('#dynamic_' + i).css('left', leftCss + 'rem');
                count += 20;
                j += 1;
                x += 3;
              }
              else {
                j = 0;
                count = 2;
                $('#dynamic_' + i).css('top', x + 'rem');
                $('#dynamic_' + i).css('left', count + 'rem');
                count = 20;
                x += 6;
              }
            }
          }, 10);
        }
      }
      this.utilityService.stopLoader();
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      this.utilityService.routingAccordingToError(error);
    });
  }
  selectCategory(item: any): any {
    console.log(this.selectedCategory, this.selectedCategory.length);
    if (this.selectedCategory.includes(item)) {
      const index = this.selectedCategory.findIndex((x: any) => x === item);
      this.selectedCategory.splice(index, 1);
      this.selectedCategoryID.splice(index, 1);
    } else {
      this.selectedCategory.push(item);
      this.selectedCategoryID.push(item.id);
    }
  }
  deletePreference(index: any): any {
    this.selectedCategory.splice(index, 1);
    this.selectedCategoryID.splice(index, 1);
    console.log(this.selectedCategoryID);
  }
  fetchsubCategory() {
    this.userService.postSubCategoryPreference({
      'categoryId': this.selectedCategoryID
    }).then((response: any) => {
      this.showSubCategory = true
      if (response.success) {
        this.subCategory = response.data;
        for (var i = 0; i < response.data.length; i++) {
          if(response.data[i].isActive == true) {
            this.selectedsubCategory.push(response.data[i]);
          this.selectedsubCategoryID.push({'categoryId': + response.data[i].categoryId, 'subCategoryId': + response.data[i].id});
          }
        }

        console.log(this.subCategory);
        if (window.innerWidth >= 500) {
          setTimeout(() => {
            let j = 0;
            let x = 0;
            let count = 30;
            for (let i = 0; i < this.subCategory.length; i++) {
              if (j < 4) {
                const bottomCss: any = x;
                const leftCss: any = count;
                $('#dynamic_' + i).css('top', bottomCss + 'rem');
                $('#dynamic_' + i).css('left', leftCss + 'rem');
                count += 20;
                j += 1;
                x += 3;
              }
              else {
                j = 0;
                count = 6;
                $('#dynamic_' + i).css('top', x + 'rem');
                $('#dynamic_' + i).css('left', count + 'rem');
                count = 20;
                x += 6;
              }
            }
          }, 2);
        }
        else {
          setTimeout(() => {
            let j = 0;
            let x = 0;
            let count = 30;
            for (let i = 0; i < this.subCategory.length; i++) {
              if (j < 1) {
                const bottomCss: any = x;
                const leftCss: any = count;
                $('#dynamic_' + i).css('top', bottomCss + 'rem');
                $('#dynamic_' + i).css('left', leftCss + 'rem');
                count += 20;
                j += 1;
                x += 3;
              }
              else {
                j = 0;
                count = 6;
                $('#dynamic_' + i).css('top', x + 'rem');
                $('#dynamic_' + i).css('left', count + 'rem');
                count = 20;
                x += 6;
              }
            }
          }, 2);
        }
      }
      this.utilityService.stopLoader();
    }).catch((error: any) => {
      this.utilityService.stopLoader();
      this.utilityService.routingAccordingToError(error);
    });
  }
  selectsubCategory(item: any): any {
    if (this.selectedsubCategory.includes(item)) {
      const index = this.selectedsubCategory.findIndex((x: any) => x === item);
      this.selectedsubCategory.splice(index, 1);
      this.selectedsubCategoryID.splice(index, 1);
      console.log("200", this.selectedsubCategoryID);
    } else {
      this.selectedsubCategory.push(item);
      this.selectedsubCategoryID.push({'categoryId': + item.categoryId, 'subCategoryId': + item.id});
      console.log("200", this.selectedsubCategoryID);
    }
  }
  deletesubCategory(index: any): any {
    this.selectedsubCategory.splice(index, 1);
    this.selectedsubCategoryID.splice(index, 1);
    console.log(this.selectedCategoryID);
  }

  // submitPreference(): any {
  //   this.utilityService.startLoader();
  //   if (this.showSubCategory && this.selectedsubCategory.length > 0) {
  //     this.userService
  //     .postSubmitPreference(this.selectedsubCategory)
  //     .then((response: any) => {
  //       if (response.success) {
  //         this.router.navigate(['/user/preference-list']);
  //         this.utilityService.stopLoader();
  //       }
  //     })
  //     .catch((error: any) => {
  //       this.utilityService.stopLoader();
  //       this.utilityService.routingAccordingToError(error);
  //     });
  //   } else if (!this.showSubCategory && this.selectedCategory.length > 0) {
  //     const body = {
  //       categoryId: this.selectedCategory
  //     };
  //     this.userService
  //       .postSubCategoryPreference(body)
  //       .then((response: any) => {
  //         if (response.success) {
  //           this.showSubCategory = true;
  //           // this.subCategoryList = response.data;
  //           // this.showList(this.subCategoryList);
  //           this.utilityService.stopLoader();
  //         }
  //       })
  //       .catch((error: any) => {
  //         this.utilityService.stopLoader();
  //         this.utilityService.routingAccordingToError(error);
  //       });
  //   } else {
  //     this.utilityService.stopLoader();
  //     $('#alert-modal').modal('show');
  //     this.sharedService.modalContent.emit({ content: this.STRINGS.alert.selectPreference });
  //   }
  // }

  submitPreference(){
    this.utilityService.startLoader();
    if (this.showSubCategory && this.selectedsubCategoryID.length > 0) {
          this.userService
          .postSelectedSubCategoryPreference(this.selectedsubCategoryID)
          .then((response: any) => {
            if (response.success) {
              if(this.routeId == 'new-user'){
                this.router.navigate(['/home']);
              }else{
                this.router.navigate(['/user/preferences-list']);
              }
              this.utilityService.stopLoader();
              this.successDialogopen('Preferences added successfully');

            }
          })
          .catch((error: any) => {
            this.utilityService.stopLoader();
            this.utilityService.routingAccordingToError(error);
          });
        } else if (!this.showSubCategory && this.selectedCategory.length > 0) {
          const body = {
            categoryId: this.selectedCategory
          };
          this.userService
            .postSubCategoryPreference(body)
            .then((response: any) => {
              if (response.success) {
                this.showSubCategory = true;
                // this.subCategoryList = response.data;
                // this.showList(this.subCategoryList);
                this.utilityService.stopLoader();
              }
            })
            .catch((error: any) => {
              this.utilityService.stopLoader();
              this.utilityService.routingAccordingToError(error);
            });
        } else {
          this.utilityService.stopLoader();
          $('#alert-modal').modal('show');
          this.sharedService.modalContent.emit({ content: this.STRINGS.alert.selectPreference });
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
