import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leftPad'
})
export class LeftPadPipe implements PipeTransform {

  transform(value: any, character: string, size: number): any {
    return value.toString().padStart(size, character);
  }

}
