import { Type } from '@angular/core';
import { ComponentInterface } from './component.interface';

export interface ModuleInterface {
    
    get rootComponent(): Type<ComponentInterface>;

    set rootComponent(component: Type<ComponentInterface>);

}