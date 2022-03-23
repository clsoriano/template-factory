import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar/calendar.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ComponentControlInterface, ModuleControlInterface } from '../../models/index';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DirectiveModule } from '../../directive/directive.module';



@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    DirectiveModule,
    MatIconModule,
    MatInputModule
  ],
  exports: [
    CalendarComponent
  ]
})
export class CalendarModule implements ModuleControlInterface { 

  get rootComponent(): Type<ComponentControlInterface> {
    return CalendarComponent;
  }
  
  set rootComponent(component: Type<ComponentControlInterface>) {}
  
}
