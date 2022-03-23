import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioGroupComponent } from './radio-group/radio-group.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { ComponentControlInterface, ModuleControlInterface } from '../../models/index';
import { DirectiveModule } from '../../directive/directive.module';



@NgModule({
  declarations: [
    RadioGroupComponent
  ],
  imports: [
    CommonModule,
    DirectiveModule,
    MatRadioModule,
    MatInputModule
  ]
})
export class RadioGroupModule implements ModuleControlInterface { 

  get rootComponent(): Type<ComponentControlInterface> {
    return RadioGroupComponent;
  }
  
  set rootComponent(component: Type<ComponentControlInterface>) {}

}
