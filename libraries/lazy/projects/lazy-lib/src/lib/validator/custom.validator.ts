import { AbstractControl, ValidatorFn } from "@angular/forms";
import { getValueFromStorage, getValueWithJSONPath, ValidatorElement } from 'store-lib';
import * as jsonLogic from 'json-logic-js';

export function CustomValidator(validator: ValidatorElement, values?: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control) {
            const { value } = control;
            const val: any = {};
            const { expression } = validator || {};
            const { rules, data } = expression || {};

            // replace value name for real value
            let result = jsonLogic.apply(rules, foundValue(data, value));
            
            val[validator.type] = result;

            return (value && result) || result ? val : null;
        }
        return null;
    };
}

function foundValue(data: any, value: any): any {
    let dataTemp = { ...data };
    for (let k in data) {
        let valTemp = getValueWithJSONPath(dataTemp[k], value) || getValueFromStorage(dataTemp[k]);

        if (dataTemp[k] === valTemp) dataTemp[k] = value;
        else dataTemp[k] = valTemp;

    }

    return dataTemp;
}