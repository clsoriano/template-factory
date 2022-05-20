import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { PlatformLocation } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Input, NgZone, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AsyncSubject, Subject } from 'rxjs';
import { Div, InputElement, LoggerService } from 'store-lib';
import { ComponentControlInterface, InputValue } from '../../../models';
import { getErrorMessage, initFormGroup, isInputElementType, isInputValueType } from '../../../utils';
import { CustomErrorStateMatcher } from '../../../validator/customErrorStateMatcher';
import { RadioGroupComponent } from '../../radio-group-module/radio-group/radio-group.component';

@Component({
  selector: 'lib-read-more-fade',
  templateUrl: './read-more-fade.component.html',
  styleUrls: ['./read-more-fade.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ReadMoreFadeComponent
    }
  ]
})
export class ReadMoreFadeComponent implements ComponentControlInterface, OnDestroy, AfterViewInit {

  //Values from parent
  @Input()
  inputElement!: InputElement;
  @Input()
  divParent!: Div;

  readMoreFadeJS: string;

  // Definitions of ControlValueAccessor
  stateChanges = new Subject<void>();
  matcher = new CustomErrorStateMatcher();
  focused: boolean = false;
  onChange: (_: any) => void = () => { };
  onTouched: () => void = () => { };

  observer: ResizeObserver;
  fgroup!: FormGroup;
  matOptions!: AsyncSubject<any[]>;

  flagHide: Boolean;
  flagFinish: Boolean;

  valueReadMore: string;
  valueLink: String;

  bottonOffset: Number = 20

  maxHeight:String = "";
  defaultHeight:String = "100px";

  constructor(
    private formBuilder: FormBuilder,
    private logger: LoggerService,
    private platformLocation: PlatformLocation,
    private elementRef: ElementRef<HTMLElement>,
    @Inject(NgControl) private ngControl: NgControl,
    private zone: NgZone
  ) {

    let baseUrl = this.platformLocation.getBaseHrefFromDOM();

    this.fgroup = this.formBuilder.group({});
    this.readMoreFadeJS = `${baseUrl}/assets/readMoreFace.js`;

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.flagHide = false;
    this.flagFinish = false;

    this.valueReadMore = "";
    this.valueLink = "";

    this.observer = new ResizeObserver(entries => {

      const article: any = this.elementRef.nativeElement.querySelector(`#article`) as HTMLElement;
      const contentArticle: any = this.elementRef.nativeElement.querySelector(`#article span`) as HTMLElement;
      const hArticle = article.clientHeight
      const hContentArticle = contentArticle.offsetHeight

      if(!this.flagFinish && this.valueReadMore !== "") {
        if(hContentArticle < hArticle)
          this.showReadMoreFade(false,false)
        else
          this.showReadMoreFade(true,false)
      }else {
        article.style.height = (hContentArticle+this.bottonOffset)+"px"
        article.style.maxHeight = (hContentArticle+this.bottonOffset)+"px"
        article.style.minHeight = (hContentArticle+this.bottonOffset)+"px"
      }
    });

  }

  set value(inputValue: any | null | InputValue | InputElement) {
    this.logger.log(ReadMoreFadeComponent.name, this.inputElement.name, inputValue);
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
      this.logger.log(RadioGroupComponent.name, 'Is a inputElement >>>', inputValue);
      this.inputElement = { ...this.inputElement, ...inputValue };

      this.logger.log(RadioGroupComponent.name, 'final Element', this.inputElement);
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

  showReadMoreFade(status:Boolean, finish:Boolean):void {
    this.zone.run(() => {

      this.flagHide = status;
      const article: any = this.elementRef.nativeElement.querySelector(`#article`) as HTMLElement;
      const contentArticle: any = this.elementRef.nativeElement;

      if(status){
        article.classList.add("gradient-mask")
        article.style.maxHeight = ""
      }else{
        article.classList.remove("gradient-mask")
        article.style.maxHeight = this.maxHeight
      }

      if(finish)
        this.flagFinish = true;

    });
  }

  statusReadMoreFade():void {
    this.showReadMoreFade(false,true)
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
      (status: string) => {
        if (status == 'INVALID') {
          this.fgroup.markAllAsTouched();
          this.fgroup.markAsDirty();
        }
      }
    );

    // Init attrs like height and adding the observer to component
    const contentArticle: any = this.elementRef.nativeElement;
    this.observer.observe(contentArticle);
    const article: any = this.elementRef.nativeElement.querySelector(`#article`) as HTMLElement;
    const heightTmp = this.inputElement.extendedAttributes.minHeight;
    const heightCond = heightTmp !== undefined && heightTmp != ""
    article.style.height = heightCond ? heightTmp : this.defaultHeight
    article.style.minHeight = heightCond ? heightTmp : this.defaultHeight
    article.style.maxHeight = heightCond ? heightTmp : this.defaultHeight

    const valueReadMoreTmp = this.inputElement.extendedAttributes.valueReadMore
    this.valueReadMore = valueReadMoreTmp !== undefined || valueReadMoreTmp != "" ? 
    valueReadMoreTmp:this.fgroup.get(this.inputElement.id)?.value;

    this.logger.log("valueReadMore: "+this.valueReadMore);

    this.valueLink = this.inputElement.extendedAttributes.linkLabel;

  }

  ngOnDestroy(): void {
    this.matOptions.unsubscribe();
    this.stateChanges.unsubscribe();
  }

}
