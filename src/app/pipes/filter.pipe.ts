import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchTerm: string, labelKey?: string): any {
    if (!items || !searchTerm) {
      return items;
    }
    if (labelKey) {
      if (labelKey.includes('.')) {
        const keys = labelKey.split('.');
        return items.filter(
          item => {
            let val;
            keys.forEach((each, i) => {
              if (i == 0) {
                val = item[each];
              } else {
                val = val[each];
              }
            });
            return val
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          }
        );
      } else {
        return items.filter(
          item =>
            item[labelKey || 'name']
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) === true
        );
      }
    } else {
      return items.filter(
        item =>
          item
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) === true
      );
    }
  }
}
