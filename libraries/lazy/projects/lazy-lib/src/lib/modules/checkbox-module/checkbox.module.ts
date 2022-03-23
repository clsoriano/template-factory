import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentControlInterface, ModuleControlInterface } from '../../models/index';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { MatInputModule } from '@angular/material/input';
import { DirectiveModule } from '../../directive/directive.module';

@NgModule({
  declarations: [
    CheckboxComponent
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatInputModule,
    DirectiveModule
  ]
})
export class CheckboxModule implements ModuleControlInterface { 

  get rootComponent(): Type<ComponentControlInterface> {
    return CheckboxComponent;
  }
  
  set rootComponent(component: Type<ComponentControlInterface>) {}

}
