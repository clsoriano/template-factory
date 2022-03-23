import { FormGroup } from '@angular/forms';
import { Div, NestedFlow } from 'store-lib';

export interface ComponentConfiguration {

    nestedFlow?: NestedFlow;
    formGroupParent?: FormGroup;
    formGroupChild?: FormGroup;
    div?: Div;

}