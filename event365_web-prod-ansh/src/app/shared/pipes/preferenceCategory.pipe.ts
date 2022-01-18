import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'preferenceCategory'
})
export class PreferenceCategory implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    if (value.length > 25) {
      return value.substr(0 , 25) + ' ...';
    }
    return value;
  }
  }


