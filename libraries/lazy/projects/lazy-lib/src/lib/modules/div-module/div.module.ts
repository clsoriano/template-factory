import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DivComponent } from './div/div.component';
import { ModuleInterface, ComponentInterface } from '../../models/index';
import { CdkStepComponent } from './cdk-step/cdk-step.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { DirectiveModule } from '../../directive/directive.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';

@NgModule({
  declarations: [
    DivComponent,
    CdkStepComponent
  ],
  imports: [
    CommonModule,
    DirectiveModule,
    CdkStepperModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DivModule implements ModuleInterface {

  get rootComponent(): Type<ComponentInterface> {
    return DivComponent;
  }

  set rootComponent(component: Type<ComponentInterface>) { }

}
