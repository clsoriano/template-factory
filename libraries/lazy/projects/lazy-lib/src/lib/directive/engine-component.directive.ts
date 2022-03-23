import { Directive, EventEmitter, Input, OnChanges, Output, ViewContainerRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { LoggerService, NestedFlow } from "store-lib";
import { BehaviorSubject, Subject, takeUntil } from "rxjs";
import { LazyLibService } from "../lazy-lib.service";
import { ComponentConfiguration, InputAction, ComponentInterface, ModuleInterface } from '../models/index';

@Directive({
    selector: '[engineComponentDirective]'
})
export class EngineComponentDirective implements OnChanges {

    @Input()
    public configuration?: BehaviorSubject<ComponentConfiguration> | ComponentConfiguration;    

    @Output()
    execFnEvent = new EventEmitter<InputAction>();

    destroy$: Subject<boolean>;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private logger: LoggerService,
        private lazyLibService: LazyLibService
    ) {
        this.destroy$ = new Subject<boolean>();
    }

    ngOnChanges(): void {
        // Add subscription to look all change in view and nestedFlow to compile components
        if(this.configuration instanceof BehaviorSubject) {
            this.configuration.pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(
                (componentConfig: ComponentConfiguration) => {
                    if (componentConfig) {
                        const { nestedFlow, formGroupParent } = componentConfig;

                        this.loadComponents(nestedFlow, formGroupParent);
                    }
                }
            );
        } else if (this.configuration) {
            const { div, formGroupParent, formGroupChild } = this.configuration;
            this.loadComponents(div, formGroupParent, formGroupChild);
        }
            
    }

    async loadComponents(nestedFlow: NestedFlow | undefined, formGroupParent: FormGroup | undefined, formGroupChild?: FormGroup | undefined) {
        const { body, name } = nestedFlow || {};
        this.logger.log(EngineComponentDirective.name, 'detalle', this.lazyLibService);
        
        this.logger.log(EngineComponentDirective.name, 'Store lib>>>', nestedFlow, this.lazyLibService.componentReferenceList);
        if (body && name && formGroupParent) {
            // Find an other solution to create component because i think this it is not better
            let componentRef;

            if (this.viewContainerRef.length > 0) {
                // validate if nestedFlow exist in memory...
                componentRef = this.lazyLibService.componentReferenceList[name];
                
                this.viewContainerRef.detach(0); // Get last component in view for save
                this.viewContainerRef.get(0);

                if (componentRef) this.viewContainerRef.insert(componentRef.hostView);

            }

            if(!componentRef) {
                this.viewContainerRef.clear();
                this.logger.log(EngineComponentDirective.name, 'ViewContainerRef', this.viewContainerRef);
                let module = await this.lazyLibService.loadModuleComponents('body');
                

                if (!module) {
                    console.warn('Module was not loaded.');
                    return;
                }

                const componentType = (module.instance as ModuleInterface).rootComponent;
                const componentRef = this.viewContainerRef.createComponent<ComponentInterface>(componentType, module);

                // Instance Element to component
                componentRef.instance.formGroupParent = formGroupParent;
                componentRef.instance.formGroupChild = formGroupChild;
                componentRef.instance.divElement = body;
                componentRef.instance.execFnEvent = this.execFnEvent;

                this.lazyLibService.componentReferenceList[name] = componentRef; // Save new componentReference

                this.viewContainerRef.insert(componentRef.hostView);
                
            }
            
        }
    }

}
