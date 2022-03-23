import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComponent } from './image/image.component';
import { ComponentControlInterface, ModuleControlInterface } from '../../models/index';
import { DirectiveModule } from '../../directive/directive.module';
import { PipeModule } from '../../pipes/pipe.module';

@NgModule({
  declarations: [
    ImageComponent
  ],
  imports: [
    CommonModule,
    DirectiveModule,
    PipeModule
  ]
})
export class ImageModule implements ModuleControlInterface { 

  get rootComponent(): Type<ComponentControlInterface> {
    return ImageComponent;
  }
  
  set rootComponent(component: Type<ComponentControlInterface>) {}
  
}
