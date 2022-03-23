import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import {MatButtonModule} from '@angular/material/button';
import { DirectiveModule } from '../../directive/directive.module';
import { ComponentControlInterface, ModuleControlInterface } from '../../models/index';



@NgModule({
  declarations: [
    ButtonComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    DirectiveModule
  ],
  exports: [
    ButtonComponent
  ]
})
export class ButtonModule implements ModuleControlInterface { 

  get rootComponent(): Type<ComponentControlInterface> {
    return ButtonComponent;
  }
  
  set rootComponent(component: Type<ComponentControlInterface>) {}

}
