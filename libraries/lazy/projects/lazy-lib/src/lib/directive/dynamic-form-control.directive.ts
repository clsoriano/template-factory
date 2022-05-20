import { AfterContentInit, ComponentRef, Directive, EventEmitter, Host, Injector, Input, Optional, Output, SkipSelf, ViewContainerRef } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, ControlContainer, FormControl, NgControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { MatFormFieldControl } from '@angular/material/form-field';
import { ComponentControlInterface, ModuleControlInterface, InputAction } from '../models/index';
import { LazyLibService } from "../lazy-lib.service";
import { Div, InputElement } from "store-lib";

@Directive({
  selector: '[dynamicFormControl]',
  providers: [{ provide: MatFormFieldControl, useExisting: DynamicFormControlDirective }]
})
export class DynamicFormControlDirective extends NgControl implements AfterContentInit {

  static nextId = 0;
  _control!: FormControl;
  component!: ComponentRef<any>;

  @Input()
  inputElement!: InputElement;
  @Input()
  divParent!: Div;
  @Input()
  isNgControl!: boolean | undefined;
  @Output('ngModelChange')
  update = new EventEmitter();
  @Input()
  rowNumber!: any;
  @Input()
  isFromTable!: any;
  @Output()
  execFnEvent = new EventEmitter<InputAction>();

  constructor(
    @Optional() @Host() @SkipSelf() private parent: ControlContainer,
    private viewContainerRef: ViewContainerRef,
    private lazyLibService: LazyLibService,
    private injector: Injector
  ) {
    super();
    this.isNgControl = true;
  }


  ngAfterContentInit(): void {
    this.lazyLoadComponent();
  }

  async lazyLoadComponent(): Promise<void> {
    let { value, id, type } = this.inputElement || {};

    if (!type) {
      console.error('In inputElement property Type is not defined');
      return;
    }

    let module = await this.lazyLibService.loadModuleComponents(type);

    if (!module) {
      console.warn(`Error loading component: ${id}`);
      return;
    }

    // Find an other solution to create component because i think this it is not better
    const componentType = (module.instance as ModuleControlInterface).rootComponent;

    this.viewContainerRef.clear();
    const injector = Injector.create({
      providers: [
        {
          provide: NgControl,
          useValue: this
        }
      ]
    });
    this.component = this.viewContainerRef.createComponent<ComponentControlInterface>(componentType, { injector, ngModuleRef: module });

    this.name = id;
    this.component.instance.inputElement = this.inputElement;
    this.component.instance.divParent = this.divParent;
    this.component.instance.value = value;
    this.component.instance.execFnEvent = this.execFnEvent;

    /*this.component.instance.parentUniqueKey = this.parentUniqueKey;
    this.component.instance.parentUniqueModalKey = this.parentUniqueModalKey;
    this.component.instance.rowNumber = this.rowNumber;
    this.component.instance.isFromTable = this.isFromTable;*/

    // Validate when is not a control by default is control....
    if (this.isNgControl && this.valueAccessor && this.formDirective) {
      this._control = this.formDirective.addControl(this);
    }

  }

  override get path(): any[] {
    const list = [];
    this.parent.path?.forEach((val) => {
      list.push(val);
    });
    list.push(this.name);
    return list;
  }

  get formDirective(): any { return this.parent ? this.parent.formDirective : null; }

  get control(): FormControl { return this._control; }

  override get validator(): ValidatorFn | null { return null; }

  override get asyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> | Promise<ValidationErrors | null> => {
      return new Promise((resolve, reject) => {
        resolve(null);
      });
    }
  }

  viewToModelUpdate(newValue: any): void {
    this.update.emit(newValue);
  }

  ngOnDestroy(): void {
    if (this.formDirective) {
      this.formDirective.removeControl(this);
    }
    if (this.component) {
      this.component.destroy();
    }
  }

}