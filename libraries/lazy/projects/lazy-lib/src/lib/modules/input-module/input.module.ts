import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ComponentControlInterface, ModuleControlInterface } from '../../models/index';
import { InputComponent } from './input/input.component';
import { DirectiveModule } from '../../directive/directive.module';



@NgModule({
  declarations: [
    InputComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    DirectiveModule
  ],
  exports: [
    InputComponent
  ]
})
export class InputModule implements ModuleControlInterface { 

  get rootComponent(): Type<ComponentControlInterface> {
    return InputComponent;
  }
  
  set rootComponent(component: Type<ComponentControlInterface>) {}
  
}
