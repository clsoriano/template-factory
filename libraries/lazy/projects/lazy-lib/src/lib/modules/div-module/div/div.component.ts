import { CdkStepper } from '@angular/cdk/stepper';
import { Component, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { Div } from 'store-lib';
import { ComponentInterface, InputAction } from '../../../models/index';


@Component({
  selector: 'app-div',
  templateUrl: './div.component.html',
  styleUrls: ['./div.component.sass']
})
export class DivComponent implements ComponentInterface, OnDestroy {

  @Output()
  execFnEvent = new EventEmitter<InputAction>();

  @ViewChild("cdkStepper")
  private cdkStepper!: CdkStepper;

  destroy$: Subject<boolean>;
  divElement!: Div;
  uniqueKey!: string;
  formGroupParent: FormGroup;

  constructor() {
    this.destroy$ = new Subject<boolean>();
    this.formGroupParent = new FormGroup({});
  }

  invokeParent(event: any) {
    // Add new parameters to extendend objects for share with parent
    const eventExtended = { ...event, extended: { cdkStepper: this.cdkStepper } };
    this.execFnEvent.emit(eventExtended);
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

}
