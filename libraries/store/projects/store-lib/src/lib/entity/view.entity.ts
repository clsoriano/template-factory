import { EnvironmentView } from "./enviroments-view.entity";
import { HttpHandlerErrors } from "./httpHandlerError.entity";
import { NestedFlow } from "./nestedFlow.entity";
import { Resources } from "./resources.entity";

export class View {
    
    id?: string;
    name?: string;
    description?: string;
    rootPath?: string;
    enviroments?: EnvironmentView;
    resources?: Resources;
    nestedFlow?: NestedFlow;
    httpHandlerErrors?: HttpHandlerErrors[];
    header?: any;
    footer?: any;
    
}