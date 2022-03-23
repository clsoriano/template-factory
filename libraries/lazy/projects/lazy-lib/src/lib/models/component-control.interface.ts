import { EventEmitter } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import { InputElement, Div } from 'store-lib';
import { InputAction } from "./input-action";

export interface ComponentControlInterface extends ControlValueAccessor {
    
    inputElement: InputElement;
    divParent: Div;
    execFnEvent?: EventEmitter<InputAction>;
    
}