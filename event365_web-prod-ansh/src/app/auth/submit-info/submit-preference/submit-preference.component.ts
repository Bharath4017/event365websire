import { AuthService } from './../../auth.service';
import { Component, OnInit } from '@angular/core';
import { localString } from '../../../shared/utils/strings';
import { Router } from '@angular/router';
import { UtilityService } from '../../../shared/services/utility.service';
import { SharedService } from '../../../shared/shared.service';
declare let $: any;
@Component({
  selector: 'app-submit-preference',
  templateUrl: './submit-preference.component.html',
  styleUrls: ['./submit-preference.component.scss'],
})
export class SubmitPreferenceComponent implements OnInit {
  STRINGS: any = localString;
  categoryList: any = [];
  subCategoryList: any = [];
  selectedCategory: any = [];
  selectedSubCategoryList: any = [];
  showSubCategory: any = false;
  selectedCategorySubCategoryList: any = [];
  constructor(
    private router: Router,
    private authservice: AuthService,
    private utilityService: UtilityService,
    private sharedService: SharedService
  ) {
    this.sharedService.headerLayout.emit({ headerSize: this.STRINGS.headerSize.medium });
  }

  ngOnInit(): void {
    // this.fetchCategory();
  }
  // fetchCategory(): any {
  //   this.utilityService.startLoader();
  //   this.authservice
  //     .getpreference()
  //     .then((response: any) => {
  //       if (response.success) {
  //         this.categoryList = response.data.category;
  //         this.showList(this.categoryList);
  //         this.utilityService.stopLoader();
  //       }
  //     })
  //     .catch((error: any) => {
  //       this.utilityService.stopLoader();
  //       this.utilityService.routingAccordingToError(error);
  //     });
  // }
  // showList(list: any): any {
  //   setTimeout(() => {
  //     let j = 0;
  //     let x = 0;
  //     let count = 20;
  //     for (let i = 0; i < list.length; i++) {
  //       if (j < 4) {
  //         const bottomCss: any = x;
  //         const leftCss: any = count;
  //         $('#dynamic_' + i).css('top', bottomCss + 'rem');
  //         $('#dynamic_' + i).css('left', leftCss + 'rem');
  //         count += 12;
  //         j += 1;
  //         x += 3;
  //       }
  //       else {
  //         j = 0;
  //         count = 4;
  //         $('#dynamic_' + i).css('top', x + 'rem');
  //         $('#dynamic_' + i).css('left', count + 'rem');
  //         count = 15;
  //         x += 6;
  //       }
  //     }
  //   }, 10);
  // }
  // selectCategory(item: any): any {
  //   if (this.selectedCategory.includes(item.id)) {
  //     const index = this.selectedCategory.findIndex((x: any) => x.id === item.id);
  //     this.selectedCategory.splice(index, 1);
  //   } else {
  //     this.selectedCategory.push(item.id);
  //   }
  // }
  // selectSubCategory(item: any): any {
  //   if (this.selectedSubCategoryList.includes(item.id)) {
  //     const index = this.selectedSubCategoryList.findIndex((x: any) => x.id === item.id);
  //     this.selectedSubCategoryList.splice(index, 1);
  //     this.selectedCategorySubCategoryList.splice(index, 1);
  //   } else {
  //     this.selectedSubCategoryList.push(item.id);
  //     this.selectedCategorySubCategoryList.push({
  //       categoryId: item.categoryId,
  //       subCategoryId: item.id
  //     });
  //   }
  // }
  // submitPreference(): any {
  //   this.utilityService.startLoader();
  //   if (this.showSubCategory && this.selectedCategorySubCategoryList.length > 0) {
  //     this.authservice
  //     .postSubmitPreference(this.selectedCategorySubCategoryList)
  //     .then((response: any) => {
  //       if (response.success) {
  //         this.router.navigate(['/auth/account-creation']);
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
  //     this.authservice
  //       .postSubCategoryPreference(body)
  //       .then((response: any) => {
  //         if (response.success) {
  //           this.showSubCategory = true;
  //           this.subCategoryList = response.data;
  //           this.showList(this.subCategoryList);
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
}
