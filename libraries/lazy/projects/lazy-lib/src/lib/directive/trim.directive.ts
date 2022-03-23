import { Directive, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({ selector: '[trim],.trim-class' })
export class TrimDirective {

    constructor(
        public ngControl: NgControl
    ) { }


    @HostListener('blur', ['$event'])
    onBlur(event: any): any {
        if (!event) return;

        let { target } = event;
        if (!target) return;

        let { value } = target;

        let newVal = value.trim();

        if (value !== newVal) {
            this.ngControl.valueAccessor?.writeValue(newVal);
            this.ngControl.control?.setValue(newVal);
            this.ngControl.viewToModelUpdate(newVal);
        }
    }
}