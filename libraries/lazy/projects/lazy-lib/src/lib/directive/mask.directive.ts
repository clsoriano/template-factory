import { Directive, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { NgControl, NgModel } from "@angular/forms";
import { InputElement } from "store-lib";

@Directive(
    {
        selector: '[maskDirective],.maskDirective',
        providers: [ NgModel ]
    }
)
export class MaskDirective {

    @Input() control !: InputElement;
    @Output('maskDirectiveValueChange')
    public changeEmitter = new EventEmitter<string>();

    mask = '';
    maskRegExp = '';

    constructor(
        public ngControl: NgControl
    ) {
        
    }

    @HostListener('input', ['$event'])
    onInputChange(event: any): any {
        if (!event) return;
        
        let { target } = event;
        
        if (!target) return;

        let { value } = target;
        let newVal = value.replace(/[^A-za-z0-9.@,#/\- ]/g, '');

        if (this.control) {
            let {regex, mask} = this.control;
            
            if (regex || mask) newVal = this.maskTransform(newVal, mask, regex, target);
        }
        
        if (value !== newVal) this.ngControl.control?.setValue(newVal);

    }

    maskTransform(newVal: any, maskControl: string, regex: string, target?: any) {
        if(!maskControl && !regex) return newVal;

        // apply regex transform if mask is not defined
        if (regex && !maskControl) return newVal.replace(new RegExp(regex, 'g'), '');

        let maskSeparator;
        const pos = target?.selectionStart;
        const foundMaskSeparator = maskControl.replace(/[A#]/g,'').replace(/(?:\{)(.*?)(?:\})/g,'');
        maskSeparator = foundMaskSeparator.charAt(0);
        this.mask = '';
        this.maskRegExp = '^';
        let count = 1;
        const regexMaskVal = new RegExp(maskSeparator, 'g');
        let valMask = maskControl.replace(regexMaskVal, '');
        const countMask = valMask.length;
        let dig = maskControl.split(maskSeparator);
        let vm = maskControl.match(new RegExp(/(?=\{)(.*?)(?=\})/g));

        if (vm) {
            let i;
            for (i in vm) {
                let val = vm[i].replace('\{', '');
                let f = val.split(',');

                if (f[0] <= newVal.length && f[1] >= newVal.length){
                    this.maskRegExp += `(\\d{0,${ newVal.length }})`;
                    this.mask += `$${ i + 1 }${ maskSeparator }`;
                } else {
                    this.maskRegExp += `(\\d{0,${ f[1] }})`;
                    this.mask += `$${ i + 1}${ maskSeparator }`;
                }
            }
        } else {
            let i;
            
            for (i in dig) this.maskRegExp += `(\\d{0,${dig[i].length}})`;

            const countVal = newVal.length;

            if (countVal === countMask && newVal.indexOf(maskSeparator) === -1) {
                const val = maskControl.split(maskSeparator);
                
                for (const i of val) {
                    this.mask += `$${count}${maskSeparator}`;
                    count++;
                }
                
                this.mask = this.mask.substring(0, this.mask.length - 1);
            } else {
                count++;
                this.mask = '$1';
                for (let i = 0; i < countVal; i++) {
                    if (maskControl.charAt(i) === maskSeparator) {
                        this.mask += `${maskSeparator}$${count}`;
                        count++;
                    }
                }
            }
            
            newVal = newVal.replace(regexMaskVal, '');
            
            if(maskControl.indexOf('A') === -1) newVal =  newVal.replace(/\D/g, '');

            if (regex) newVal = newVal.replace(new RegExp(regex, 'g'), '');
            
            newVal = newVal.replace(new RegExp(this.maskRegExp, 'g'), this.mask);
        }

        if (maskSeparator && (newVal.lastIndexOf(maskSeparator) + 1) === newVal.length && pos === (newVal.length - 1)) {
            setTimeout(()=> { target?.setSelectionRange(newVal.length - 1,  newVal.length - 1)});
        } else {
            setTimeout(()=> { 
                let c = (pos === (newVal.length - 1) ? (pos + 1):  pos);
                target?.setSelectionRange(c, c);
            });
        }

        return newVal;
    }

}