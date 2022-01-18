import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
    name: 'upcomingDuration'
})
export class UpcomingEventDuration implements PipeTransform {

    transform(value: any, ...args: unknown[]): any {
        const todayDate = moment();
        const startDate = moment(value);
        const dateDiff = startDate.diff(todayDate, 'days')  ;
        if(dateDiff>0){
            return dateDiff;
        }
       else{
          return 0;
       }
    }
}
