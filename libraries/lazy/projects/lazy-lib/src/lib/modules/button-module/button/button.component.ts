import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { AfterContentInit, Component, EventEmitter, forwardRef, Inject, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { FormGroup, FormBuilder, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { initFormGroup, getErrorMessage } from '../../../utils';
import { CustomErrorStateMatcher } from '../../../validator/customErrorStateMatcher';
import { ComponentControlInterface, InputAction } from '../../../models';
import { InputElement, Div, Execute, LoggerService } from 'store-lib';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ButtonComponent)
    }
  ]
})
export class ButtonComponent implements ComponentControlInterface, OnInit, AfterContentInit {


  //Values from parent
  @Input()
  inputElement!: InputElement;
  @Input()
  divParent!: Div;

  @Output()
  execFnEvent!: EventEmitter<InputAction>;

  // Definitions of ControlValueAccessor
  stateChanges = new Subject<void>();
  matcher = new CustomErrorStateMatcher();
  focused: boolean = false;
  _disabled: boolean = false;
  onChange: (_: any) => void = () => { };
  onTouched: () => void = () => { };

  fgroup!: FormGroup;

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

  ngOnInit(): void { }

  set value(inputValue: any | null) {

    if (!this.inputElement) console.warn('InputElement is null | undefined');

    const { id } = this.inputElement || {};

    // If element is not defined in formgroup we need to add using initFormGroup function
    if (!this.fgroup?.get(id))
      this.fgroup = initFormGroup(this.inputElement, this.fgroup, inputValue);

    this.onChange(inputValue);
  }

  get value() {

    if (this.fgroup.valid) return this.fgroup.get(this.inputElement.id)?.value;

    return null;
  }

  _handleClick(execute: Execute) {
    if (!execute) return;

    const { clientList, serverList } = execute;
    this.logger.log(ButtonComponent.name, 'Button', execute, this.execFnEvent);

    for (let client of clientList) this.execFnEvent.emit({ client, serverList });

    this.stateChanges.next();
  }

  writeValue(inputValue: any): void {
    this.value = inputValue;
    this.onChange(this.value);
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
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


  ngAfterContentInit(): void {
    this._disabled = this.inputElement.disabled;
    // Change disabled input by statusChange parent
    if (this.inputElement.disabled!!) {
      this.ngControl?.control?.parent?.statusChanges?.subscribe(
        (status) => {
          if (status == 'INVALID') {
            this._disabled = true;
          } else if (status == 'VALID') {
            this._disabled = false;
          }
        }
      );
    }

  }

}
