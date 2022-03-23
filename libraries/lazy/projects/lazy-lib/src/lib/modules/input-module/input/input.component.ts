import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { AfterViewInit, Component, forwardRef, Inject, Input, OnDestroy, Optional, Self } from '@angular/core';
import { FormGroup, FormBuilder, NgControl, AbstractControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { initFormGroup, getErrorMessage, isInputElementType } from '../../../utils';
import { CustomErrorStateMatcher } from '../../../validator/customErrorStateMatcher';
import { ComponentControlInterface } from '../../../models/index';
import { InputElement, Div, LoggerService } from 'store-lib';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputComponent)
    }
  ]
})
export class InputComponent implements ComponentControlInterface, OnDestroy, AfterViewInit {


  //Values from parent
  @Input()
  inputElement!: InputElement;
  @Input()
  divParent!: Div;

  // Definitions of ControlValueAccessor
  stateChanges = new Subject<void>();
  matcher = new CustomErrorStateMatcher();
  focused: boolean = false;
  _required: boolean = false;
  onChange: (_: any) => void = () => { };
  onTouched: () => void = () => { };

  fgroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private logger: LoggerService,
    @Inject(NgControl) private ngControl: NgControl
  ) {
    //const ngContorl =
    this.fgroup = this.formBuilder.group({});

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

  }

  set value(inputValue: any | null) {
    if (!isInputElementType(inputValue)) {

      if (!this.inputElement) this.logger.warn(InputComponent.name, 'InputElement is null or undefined');

      const { id } = this.inputElement || {};

      // If element is not defined in formgroup we need to add using initFormGroup function
      if (!this.fgroup?.get(id))
        this.fgroup = initFormGroup(this.inputElement, this.fgroup, inputValue);

      this.onChange(inputValue);

    } else {
      this.logger.log(InputComponent.name, 'Is a inputElement >>>', inputValue);
      this.inputElement = { ...this.inputElement, ...inputValue };

      this.logger.log(InputComponent.name, 'final Element', this.inputElement);
    }

  }

  get value() {

    if (this.fgroup.valid) return this.fgroup.get(this.inputElement.id)?.value;

    return null;
  }

  _handleInput(control: AbstractControl, event?: any) {
    const { value } = control || {};

    this.onChange(value);

    this.stateChanges.next();
  }

  _handleBlur(control: AbstractControl) {
    const { value } = control || {};
    if (value) this.onChange(value);

  }

  writeValue(inputValue: any): void {
    this.value = inputValue;
    this.onChange(this.value);
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this.inputElement.disabled;
  }

  set disabled(value: boolean) {
    this.inputElement.disabled = coerceBooleanProperty(value);
    this.inputElement.disabled ? this.fgroup.disable() : this.fgroup.enable();
    this.stateChanges.next();
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  registerOnChange(fn: any): void { this.onChange = fn; }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  getError(): string {
    return getErrorMessage(this.inputElement, this.fgroup?.get(this.inputElement.id));
  }

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  get errorState(): boolean {
    return this.fgroup.dirty && this.fgroup.invalid;
  }

  get empty(): boolean {
    return !this.fgroup.get(this.inputElement.id)?.value;
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  ngAfterViewInit(): void {
    this.ngControl.control?.statusChanges?.subscribe(
      (status) => {
        if (status == 'INVALID') {
          this.fgroup.markAllAsTouched();
          this.fgroup.markAsDirty();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.stateChanges.unsubscribe();
  }

}
