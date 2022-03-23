import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Input, OnDestroy, Optional, Self } from '@angular/core';
import { FormGroup, FormBuilder, NgControl, AbstractControl } from '@angular/forms';
import { Subject, AsyncSubject } from 'rxjs';
import { Div, InputElement, LoggerService } from 'store-lib';
import { ComponentControlInterface, InputValue } from '../../../models';
import { isInputValueType, isInputElementType, initFormGroup, getErrorMessage } from '../../../utils';
import { CustomErrorStateMatcher } from '../../../validator/customErrorStateMatcher';
import { RadioGroupComponent } from '../../radio-group-module/radio-group/radio-group.component';

@Component({
  selector: 'lib-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements ComponentControlInterface, OnDestroy {


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
    @Optional() @Self() public ngControl: NgControl
  ) {
    
    this.fgroup = this.formBuilder.group({});

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

  }

  set value(inputValue: any | null | InputValue | InputElement) {
    this.logger.log(RadioGroupComponent.name, this.inputElement.name, inputValue);
    let isInputValueTypeFlag = isInputValueType(inputValue);
    let isInputElement = isInputElementType(inputValue);

    if (!isInputValueTypeFlag && !isInputElement) {
      
      if (!this.inputElement) this.logger.warn('InputElement is null | undefined');
    
      const { id } = this.inputElement || {};
      
      // If element is not defined in formgroup we need to add using initFormGroup function
      if(!this.fgroup?.get(id)) this.fgroup = initFormGroup(this.inputElement, this.fgroup, inputValue);

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
      this.logger.log(RadioGroupComponent.name, 'Is a inputElement >>>', inputValue);
      this.inputElement = {...this.inputElement, ...inputValue};

      this.logger.log(RadioGroupComponent.name, 'final Element', this.inputElement);
    }
    
    this.stateChanges.next();

  }

  get value() {
    
    if (this.fgroup.valid) return this.fgroup.get(this.inputElement.id)?.value;    

    return null;
  }

  _handleInput(control: AbstractControl, event?: any){
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
    return  this.fgroup.dirty && this.fgroup.invalid;
  }

  get empty(): boolean {
    return !this.fgroup.get(this.inputElement.id)?.value;
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  ngOnDestroy(): void {
    this.matOptions.unsubscribe();
    this.stateChanges.unsubscribe();
  }

}
