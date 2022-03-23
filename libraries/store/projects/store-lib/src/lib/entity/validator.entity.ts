import { Expression } from "./expression";

export class ValidatorElement {
    type!: never;
    message!: string;
    expression!: Expression;
    execute!: any;
    // add execute for asyncValidators
}