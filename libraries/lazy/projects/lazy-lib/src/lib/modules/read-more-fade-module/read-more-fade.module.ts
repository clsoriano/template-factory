import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadMoreFadeComponent } from './read-more-fade/read-more-fade.component';
import { DirectiveModule } from '../../directive';
import { ComponentControlInterface, ModuleControlInterface } from '../../models';
import { PipeModule } from '../../pipes/pipe.module';


@NgModule({
  declarations: [
    ReadMoreFadeComponent
  ],
  imports: [
    CommonModule,
    DirectiveModule,
    PipeModule
  ],
  exports: [
    ReadMoreFadeComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReadMoreFadeModule implements ModuleControlInterface { 

  get rootComponent(): Type<ComponentControlInterface> {
    return ReadMoreFadeComponent;
  }
  
  set rootComponent(component: Type<ComponentControlInterface>) {}
  
}
