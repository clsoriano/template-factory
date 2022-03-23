import { AfterContentInit, Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ComponentConfiguration } from 'lazy-lib';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ComponentBuild } from 'src/app/global/models/component.build';
import { HttpClientServiceImpl } from 'src/app/global/service/http-client.service.impl';
import { clearStorage, LoggerService } from 'store-lib';

@Component({
  selector: 'app-engine-builder',
  templateUrl: './engine-builder.component.html',
  styleUrls: ['./engine-builder.component.sass']
})
export class EngineBuilderComponent extends ComponentBuild implements AfterContentInit, OnDestroy {

  constructor(
    store: Store,
    formBuilder: FormBuilder,
    httpClientService: HttpClientServiceImpl,
    logger: LoggerService
  ) {
    // Need a redirecction?....
    super(store, formBuilder, httpClientService, logger);
  }

  ngAfterContentInit(): void {
    this.loadAllConfig()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(
      ( { nestedFlow, formGroupParent } )=> {
        // returns formGroup element.....
        // create interface for this element returned
        (this.componentConfiguration$  as BehaviorSubject<ComponentConfiguration>).next({nestedFlow, formGroupParent});
        this.formGroup = formGroupParent;
      }
    );
  }

  ngOnDestroy(): void {
    clearStorage(); // Clean all storage onDestroy
    this.destroy$.unsubscribe();
  }

}
