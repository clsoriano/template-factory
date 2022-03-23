import { createNgModuleRef, Inject, Injectable, Injector, NgModuleRef } from '@angular/core';
import { LoggerService } from 'store-lib';
import { LAZY_MODULES_MAP } from '../lib/modules/lazy-module-map';
import { LazyModules, ComponentRefInterface } from './models/index';


@Injectable({
  providedIn: 'root'
})
export class LazyLibService {

  componentReferenceList: ComponentRefInterface;

  constructor(
    private injector: Injector,
    @Inject(LAZY_MODULES_MAP) private modulesMap: LazyModules | null,
    private logger: LoggerService
  ) {
    this.componentReferenceList = {};
  }

  public async loadModuleComponents(
    type: any
  ): Promise<NgModuleRef<any> | undefined> {
    
    if (!this.modulesMap) {
      this.logger.log(LazyLibService.name, 'Problem initializing modules map', this.modulesMap);
      return;
    }

    const keys = Object.keys(this.modulesMap);
    let module;

    for (let k of keys) {
      if (k.indexOf(type) !== -1) {
        module = this.modulesMap[k];
        break;
      }
    }

    let moduleOrFactory = await module?.loadChildren();

    if (!moduleOrFactory) {
      console.warn(`Module ${type} is not found, see your configurations in the metadata.`);
      return;
    }

    return createNgModuleRef(moduleOrFactory, this.injector);

  }

}
