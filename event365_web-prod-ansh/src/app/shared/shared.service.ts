import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public headerLayout = new EventEmitter();
  public filterData = new EventEmitter();
  public filterDataOnHeader = new EventEmitter();
  public modalContent = new EventEmitter();
  public headerContent = new EventEmitter();
  public loaderData = new EventEmitter();
  public refreshPage = new EventEmitter();
  constructor() {
    this.headerLayout.emit();
    this.filterData.emit();
    this.filterDataOnHeader.emit();
    this.modalContent.emit();
    this.headerContent.emit();
    this.loaderData.emit();
    this.refreshPage.emit();
   }
}

