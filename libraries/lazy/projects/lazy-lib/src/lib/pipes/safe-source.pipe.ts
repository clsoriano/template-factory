import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Pipe({
    name: 'safeResource'
})
export class SafeResourcePipe implements PipeTransform {

    constructor(
        private sanitizer: DomSanitizer
    ) {}

    transform(value: any, ...args: any[]): SafeResourceUrl {
        
        const isString = (typeof (value) === 'string');

        if (isString && value.startsWith('http')) return this.sanitizer.bypassSecurityTrustUrl(value);

        return value;

    }
}