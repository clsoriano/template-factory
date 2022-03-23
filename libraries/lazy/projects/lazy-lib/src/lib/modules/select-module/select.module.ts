import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ComponentControlInterface, ModuleControlInterface } from '../../models/index';
import { SelectComponent } from './select/select.component';
import { DirectiveModule } from '../../directive/directive.module';



@NgModule({
  declarations: [
    SelectComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatSelectModule,
    DirectiveModule
  ],
  exports: [
    SelectComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SelectModule implements ModuleControlInterface { 

  get rootComponent(): Type<ComponentControlInterface> {
    return SelectComponent;
  }
  
  set rootComponent(component: Type<ComponentControlInterface>) {}
  
}
