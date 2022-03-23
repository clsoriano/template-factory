import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextareaComponent } from './textarea/textarea.component';
import { ComponentControlInterface, ModuleControlInterface } from '../../models/index';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DirectiveModule } from '../../directive/directive.module';



@NgModule({
  declarations: [
    TextareaComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    DirectiveModule
  ]
})
export class TextareaModule implements ModuleControlInterface { 

  get rootComponent(): Type<ComponentControlInterface> {
    return TextareaComponent;
  }
  
  set rootComponent(component: Type<ComponentControlInterface>) {}

}
