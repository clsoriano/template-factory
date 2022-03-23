import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { AfterViewInit, Component, Inject, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, NgControl, AbstractControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AsyncSubject, Subject } from 'rxjs';
import { CustomErrorStateMatcher } from '../../../validator/customErrorStateMatcher';
import { ComponentControlInterface } from '../../../models/index';
import { InputElement, Div } from 'store-lib';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment_ from 'moment';
import { initFormGroup, getErrorMessage, isInputElementType } from '../../../utils';

const moment = moment_;

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'DD MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'DD MMMM YYYY',
  },
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS // validate use a service as promise to assign this format
    },
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CalendarComponent
    }
  ]
})
export class CalendarComponent implements ComponentControlInterface, OnDestroy, AfterViewInit {


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
  startDate!: AsyncSubject<Date>;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(NgControl) private ngControl: NgControl
  ) {

    this.fgroup = this.formBuilder.group({});

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.startDate = new AsyncSubject<Date>();
    this.startDate.next(new Date());
    this.startDate.complete();

  }

  set value(inputValue: any | null) {

    if (!isInputElementType(inputValue)) {

      if (!this.inputElement) console.warn('InputElement is null | undefined');

      const { id } = this.inputElement || {};

      // If element is not defined in formgroup we need to add using initFormGroup function
      inputValue = this.getValueFromDate(inputValue);

      if (!this.fgroup?.get(id)) this.fgroup = initFormGroup(this.inputElement, this.fgroup, inputValue);

      this.onChange(inputValue);

    } else {
      this.inputElement = { ...this.inputElement, ...inputValue };
    }

  }

  get value() {

    if (this.fgroup.valid) return this.fgroup.get(this.inputElement.id)?.value;

    return null;
  }

  _handleInput(control: AbstractControl, event?: any) {
    const { value } = control || {};

    this.onChange(
      this.getValueFromDate(value)
    );

    this.stateChanges.next();
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

  get errorState(): boolean {
    return this.fgroup.dirty && this.fgroup.invalid;
  }

  get empty(): boolean {
    return !this.fgroup.get(this.inputElement.id)?.value;
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  getValueFromDate(inputValue: any): string | moment_.Moment | undefined {
    const { extendedAttributes } = this.inputElement || {};
    const { format = 'DD/MM/YYYY', startDate } = extendedAttributes || {}; // Default value in format 'DD/MM/YYYY'
    let newValue;
    this.startDate = new AsyncSubject<Date>();

    if (inputValue) {

      if (moment_.isMoment(inputValue)) {
        newValue = inputValue.format(format);
        this.startDate.next(new Date(inputValue.year(), inputValue.month(), inputValue.day()));

      } else {
        newValue = moment(inputValue, format);
        this.startDate.next(new Date(newValue.year(), newValue.month(), newValue.day()));

      }

    } else if (startDate) {
      this.startDate.next(new Date(Date.parse(startDate)));

    }

    this.startDate.complete();

    return newValue;
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
