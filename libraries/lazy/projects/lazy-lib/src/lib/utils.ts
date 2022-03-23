import { Validators, FormControl, FormGroup, AbstractControl, ValidationErrors } from "@angular/forms";
import { getValueFromStorage, getValueWithJSONPath, InputElement, ValidatorElement, ActionsView } from "store-lib";
import { customAsyncValidator } from "./validator/custom.async.validator";
import { CustomValidator } from "./validator/custom.validator";
import { InputValue } from './models/index';
import * as jsonLogic from 'json-logic-js';

export function initFormGroup(inputElement: InputElement, fgroup: any, value: any) {
    const { id, validators, disabled } = inputElement || {};

    //if (id && !fgroup.get(id)) {
    const control: any = [];
    const validatorsArray: any = [];
    const asyncValidatorsArray: any = [];

    if (validators!) {
        for (const valid of validators) {
            if (valid.expression) {
                validatorsArray.push(CustomValidator(valid));
            } else if (valid.execute) {
                //Descomentar para agregar validaciones asincronas
                asyncValidatorsArray.push(customAsyncValidator(valid, inputElement));
            } else {
                validatorsArray.push(Validators[valid.type]);
            }
        }
    }

    control[id] = new FormControl({ value, disabled }, validatorsArray, asyncValidatorsArray);

    return new FormGroup(control);

}

export function getErrorMessage(control: InputElement, controller: AbstractControl | null): string {
    if (control.validators && controller && (controller.touched || controller.dirty)) {
        const error = control.validators.find((v: any) => !!getErrorObject(v.type, controller));
        const errorObject = error ? getErrorObject(error.type, controller) : null;
        return constructErrorMessage(error, errorObject);
    }
    return '';
}

function getErrorObject(errorType: string, controller: AbstractControl): ValidationErrors {
    const errors = controller.errors;
    return errors ? errors[errorType] : null;
}

function constructErrorMessage(error: ValidatorElement | undefined, errorObject: any): string {
    if (error && errorObject) {
        if (typeof errorObject === 'object') {
            // replace "{errorKey}" with data from error object
            return error.message.replace(/\{[\s\S]*?\}/g, (part: any) => {
                const removed = part.replace(/[\{\}]/g, '').trim();
                return errorObject[removed];
            });
        }
        return error.message;
    }
    return '';
}

export function setValueToInputElement(inputList: InputElement[], group: any, actionView: ActionsView, result: any) {
    for (let input of inputList) {

        const { name, value, formParentName } = input;

        let val: InputValue | InputElement;

        if (value) { // change value in formControl
            let newValue = getValueWithJSONPath(value, result) || getValueFromStorage(value);

            val = {
                actionView,
                value: newValue
            }

        } else { // Change elements in inputElement
            val = input;
        }

        if (group instanceof FormGroup) {
            let subGroup = (group.get(formParentName) as FormGroup)
            subGroup.get(name)?.patchValue(val);

        } else if (group[name] instanceof FormControl) {
            group[name]?.patchValue(val);

        }

    }
}

export function isInputValue(inputValue: any): boolean {
    return !(isInputElementType(inputValue) || isInputValueType(inputValue)) && ((typeof inputValue === 'boolean') || !!inputValue);
}

export function isInputValueType(inputValue: any): boolean {
    return !!(inputValue as InputValue)?.actionView;
}

export function isInputElementType(inputValue: any): boolean {
    return !!(inputValue as InputElement)?.formParentName;
}

export function jsonLogicApply(rules: jsonLogic.RulesLogic, data: any): any {
    return jsonLogic.apply(rules, data);
}