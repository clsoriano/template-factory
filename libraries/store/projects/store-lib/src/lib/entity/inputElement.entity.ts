import { FloatLabelType, MatFormFieldAppearance } from "@angular/material/form-field";
import { Div } from "./div.entity";
import { Execute } from "./execute.entity";
import { ValidatorElement } from "./validator.entity";

export class InputElement {
    
    id!: string;
    name!: string;
    label!: string;
    class!: string[];
    style!: any; // Type {key: value} -> { 'font-family': 'Arial' } 
    type!: string;
    placeholder!: string;
    appareance!: MatFormFieldAppearance;
    autocomplete!: string;
    validators!: ValidatorElement[];
    pattern!: string;
    maxlength!: number;
    disabled!: boolean;
    readonly!: boolean;
    hint!: string;
    icon!: string;
    iconPosition!: string;
    value: any;
    viewValue!: string;
    order!: number;
    autofocus!: boolean;
    alt!: string;
    src!: string;
    optionList!: any[];
    td!: Div[];
    th!: Div[];
    extendedAttributes: any;
    floatLabel: FloatLabelType = "always";
    execute!: Execute;
    formParentName!: string;
    hidden!: boolean;
    mask!: string;
    regex!: string;

}