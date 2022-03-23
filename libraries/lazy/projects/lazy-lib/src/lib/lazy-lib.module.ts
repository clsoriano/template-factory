import { NgModule } from '@angular/core';
import { DirectiveModule } from './directive/directive.module';
import { PipeModule } from './pipes/pipe.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DirectiveModule,
    PipeModule
  ],
  exports: [
    DirectiveModule,
    PipeModule
  ]
})
export class LazyLibModule { }
