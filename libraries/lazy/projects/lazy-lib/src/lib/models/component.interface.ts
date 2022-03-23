import { EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { Div } from "store-lib";
import { InputAction } from "./input-action";

export interface ComponentInterface {
    
    uniqueKey:string;
    divElement: Div;
    destroy$: Subject<boolean>;
    formGroupParent: FormGroup;
    formGroupChild?: FormGroup;
    execFnEvent: EventEmitter<InputAction>;

}