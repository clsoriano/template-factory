import { ActionsView } from "store-lib";

export class InputValue {

    actionView: ActionsView; // array, string, object ...
    value: any;

    constructor(
        actionView: ActionsView,
        value: any
    ){
        this.actionView = actionView;
        this.value = value;
    }

}