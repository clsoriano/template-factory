import { ActionsView } from "./actionsView";
import { HttpHandlerErrors } from "./httpHandlerError.entity";
import { HttpHeaders } from "./httpHeader.entity";
import { HttpParameter } from "./httpParameter.entity";
import { InputElement } from "./inputElement.entity";

export class Server {

    id!: string;
    name!: string;
    description!: string;
    uri!: string;
    method!: string;
    httpHeaders!: HttpHeaders[];
    httpParameter!: HttpParameter;
    body!: any; // define payload send to server
    storageName!: string; // Represent name in localStorage
    handlerErrorList!: HttpHandlerErrors[];
    actionView!: ActionsView;
    inputList!: InputElement[];
    response: any;

} 