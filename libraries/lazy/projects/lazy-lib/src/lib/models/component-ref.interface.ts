import { ComponentRef } from "@angular/core";
import { ComponentInterface } from "./component.interface";

export interface ComponentRefInterface {

    [name: string]: ComponentRef<ComponentInterface>;
    
}