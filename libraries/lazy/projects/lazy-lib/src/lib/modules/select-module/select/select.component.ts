import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { AfterViewInit, Component, Inject, Input, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AsyncSubject, Subject } from 'rxjs';
import { Div, InputElement, LoggerService } from 'store-lib';
import { ComponentControlInterface, InputValue } from '../../../models/index';
import { CustomErrorStateMatcher } from '../../../validator/customErrorStateMatcher';
import { getErrorMessage, initFormGroup, isInputElementType, isInputValueType } from '../../../utils';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SelectComponent
    }
  ]
})
export class SelectComponent implements ComponentControlInterface, OnDestroy, AfterViewInit {


  //Values from parent
  @Input()
  inputElement!: InputElement;
  @Input()
  divParent!: Div;

  // Definitions of ControlValueAccessor
  stateChanges = new Subject<void>();
  matcher = new CustomErrorStateMatcher();
  focused: boolean = false;
  onChange: (_: any) => void = () => { };
  onTouched: () => void = () => { };

  fgroup!: FormGroup;
  matOptions!: AsyncSubject<any[]>;

  constructor(
    private formBuilder: FormBuilder,
    private logger: LoggerService,
    @Inject(NgControl) private ngControl: NgControl
  ) {

    this.fgroup = this.formBuilder.group({});

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

  }

  set value(inputValue: any | null | InputValue | InputElement) {

    let isInputValueTypeFlag = isInputValueType(inputValue);
    let isInputElement = isInputElementType(inputValue);

    if (!isInputValueTypeFlag && !isInputElement) {

      if (!this.inputElement) this.logger.warn('InputElement is null | undefined');

      const { id } = this.inputElement || {};

      // If element is not defined in formgroup we need to add using initFormGroup function
      if (!this.fgroup?.get(id)) this.fgroup = initFormGroup(this.inputElement, this.fgroup, inputValue);

      this.matOptions = new AsyncSubject<any[]>();
      this.matOptions.next(this.inputElement.optionList);
      this.matOptions.complete();

      // add values to localStorage...
      this.onChange(inputValue);

    } else if (isInputValueTypeFlag) {
      this.matOptions = new AsyncSubject<any[]>();
      const list = [...this.inputElement.optionList, ...inputValue.value];
      this.matOptions.next(list);
      this.matOptions.complete();

    } else if (isInputElement) {
      this.inputElement = { ...this.inputElement, ...inputValue };
    }

    this.stateChanges.next();

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

  writeValue(inputValue: any): void {
    this.value = inputValue;

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
    this.matOptions.unsubscribe();
    this.stateChanges.unsubscribe();
  }

}
