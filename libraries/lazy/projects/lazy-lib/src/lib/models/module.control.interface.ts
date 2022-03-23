import { Type } from '@angular/core';
import { ComponentControlInterface } from './component-control.interface';

export interface ModuleControlInterface {
    
    get rootComponent(): Type<ComponentControlInterface>;

    set rootComponent(component: Type<ComponentControlInterface>);

}