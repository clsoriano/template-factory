import { ActionsView } from "./actionsView";
import { Expression } from "./expression";
import { InputElement } from "./inputElement.entity";

export class Client {

    id!: number;
    name!: string;
    description!: string;
    actionView!: ActionsView;
    inputList?: InputElement[];
    expression?: Expression;
    nestedFlowName?: string;
    formParentName?: string;

}


