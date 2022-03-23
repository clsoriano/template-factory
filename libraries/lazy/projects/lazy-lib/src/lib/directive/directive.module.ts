import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EngineComponentDirective } from "./engine-component.directive";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PreventDoubleClickDirective } from "./prevent-double-click.directive";
import { DynamicFormControlDirective } from "./dynamic-form-control.directive";
import { MaskDirective } from "./mask.directive";
import { TrimDirective } from "./trim.directive";

@NgModule({
    declarations: [
      DynamicFormControlDirective,
      MaskDirective,
      PreventDoubleClickDirective,
      EngineComponentDirective,
      TrimDirective
    ],
    imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule
    ],
    exports: [
      DynamicFormControlDirective,
      ReactiveFormsModule,
      FormsModule,
      MaskDirective,
      PreventDoubleClickDirective,
      EngineComponentDirective,
      TrimDirective
    ]
  })
  export class DirectiveModule { }