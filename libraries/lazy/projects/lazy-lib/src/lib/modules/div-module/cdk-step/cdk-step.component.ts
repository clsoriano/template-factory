import { CdkStepper } from '@angular/cdk/stepper';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActionsView } from 'store-lib';
import { InputAction } from '../../../models';

@Component({
  selector: 'app-cdk-step,.app-cdk-step',
  templateUrl: './cdk-step.component.html',
  styleUrls: ['./cdk-step.component.sass'],
  providers: [{ provide: CdkStepper, useExisting: CdkStepComponent }]
})
export class CdkStepComponent extends CdkStepper implements OnInit {

  @Output()
  execFnEvent = new EventEmitter<InputAction>();

  mode: ProgressBarMode = 'determinate';

  ngOnInit(): void {
  }

  selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }

  _handleBackClick() {
    const inputAction: any = {
      client: {
        actionView: ActionsView.onBackStep
      }
    };

    this.execFnEvent.emit(inputAction);
  }

  _handleAssistanceClick() {
    const inputAction: any = {
      client: {
        actionView: ActionsView.onAssistance
      }
    };

    this.execFnEvent.emit(inputAction);
  }

}
