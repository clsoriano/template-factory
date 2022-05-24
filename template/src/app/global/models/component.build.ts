import { BehaviorSubject, filter, Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { Server, Client, Div, NestedFlow, InputElement, nestedFlowBuild, getBuildView, getNestedFlowByName, saveGlobalData, customFunction, ActionsView, LoggerService, ValidatorElement, Resources, Execute } from 'store-lib';
import { setValueToInputElement, ComponentConfiguration, isInputValue, InputAction, CustomValidator, customAsyncValidator } from 'lazy-lib';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClientServiceImpl } from '../service/http-client.service.impl';
import { CdkStepper } from '@angular/cdk/stepper';

export class ComponentBuild {

  context: any = {};
  destroy$: Subject<boolean>;
  statusNestedFlow$!: BehaviorSubject<boolean>;
  componentConfiguration$: BehaviorSubject<ComponentConfiguration> | ComponentConfiguration;
  formGroup: FormGroup | undefined;

  constructor(
    public store: Store,
    public formBuilder: FormBuilder,
    public httpClientService: HttpClientServiceImpl,
    public logger: LoggerService
  ) {

    this.destroy$ = new Subject<boolean>();
    this.componentConfiguration$ = new BehaviorSubject<ComponentConfiguration>({});

    this.context = {
      [ActionsView.onSubmit]: this.submit,
      [ActionsView.onRoute]: this.route,
      [ActionsView.onRedirect]: this.redirect,
      [ActionsView.onBackStep]: this.backStep,
      [ActionsView.onNextStep]: this.nextStep,
      [ActionsView.onAssistance]: this.assistance
    }

  }


  loadAllConfig(): Observable<ComponentConfiguration> {
    let subject = new BehaviorSubject<any>({});

    this.store.select(getBuildView)
      .pipe(
        takeUntil(this.destroy$),
        filter(v => v.view !== undefined)
      )
      .subscribe(
        v => {

          if (!v.view) throw new Error(`View is undefined.`);

          const { nestedFlow, resources, httpHandlerErrors, execute } = v.view;

          if (!nestedFlow) throw new Error(`nestedFlow is undefined.`);

          this.loadResources(resources);

          if(!httpHandlerErrors) this.logger.warn('httpHandlerErrors global is not configurated.');

          if(execute) {
            this.logger.info('Invoke Services or Clients before init nestedFlow', execute);
            // Execute action => onLoad
            this.executeBuilder(undefined, execute, undefined, undefined, ActionsView.onLoad);
          }

          this.findNestedFlow(nestedFlow.name).subscribe(
            ({ nestedFlow, formGroupParent }) => {
              subject.next({ nestedFlow, formGroupParent });
            }
          );

        }
      );

    return subject.asObservable();
  }

  findNestedFlow(name: string | undefined): Observable<ComponentConfiguration> {
    let subject = new BehaviorSubject<ComponentConfiguration>({});

    if (!name) throw Error('NestedFlow name is not defined.');

    const findNestedFlow = getNestedFlowByName({ name });

    // looking for nestedFlow by name
    this.store.select(findNestedFlow)
      .pipe(
        takeUntil(this.destroy$),
        filter(nf => {
          let flag = nf.nestedFlow !== undefined;
          if (!flag) this.statusNestedFlow$ = new BehaviorSubject<boolean>(false);
          return flag;
        })
      )
      .subscribe(
        nf => {
          const { nestedFlow } = nf;
          this.statusNestedFlow$?.next(true);


          // I need to build component here and call the nestedFlow in localStore or from service backEnd
          if (!nestedFlow) {
            console.warn('Check metadata configurations!!!');
            throw new Error(`NesteFlow is undefined.`);
          }

          let formGroupParent = this.loadFormControls(nestedFlow);

          subject.next({ nestedFlow, formGroupParent });

        }
      );

    this.statusNestedLookUp();
    return subject.asObservable();
  }


  /**
   * 
   * @param form 
   * @returns FormGroup
   * @description Convert object to formGroup and then return the formGroup built
   */
  loadFormControls(nestedFlow: NestedFlow): FormGroup {
    /* Create other instace of nestedFlow 
    ** for update the state after build all configurations */
    let nestedFlowtemp = { ...nestedFlow };
    let { body } = nestedFlowtemp;
    let group: any = {}; // Representation of formGroup in object element

    // Throw error in case body is undefined.
    if (!body) {
      console.error('Check metadata configurations!!!');
      throw new Error(`Body is undefined.`);
    }

    // build all divs in body and inside to.
    this.divBuilder(body, group);

    return this.formBuilder.group(group);

  }

  divBuilder(divParent: Div, group: any, isFormParent?: boolean) {
    const { input, textPlain, textHtml, divList, div, isForm, name } = divParent;

    if (!input && !divList && !div && !textHtml && !textPlain) console.warn('Configurations not found in div element.');

    if (input) {
      const { id, name, value, disabled, validators } = input;

      // if the boolean isForm is true we build inpunt like a formControl otherwise is simple input
      if (isForm || isFormParent) {
        const { validatorsArray, asyncValidatorsArray } = this.validatorsBuild(validators);

        /** Found values from globla variables services */
        

        group[id] = new FormControl({ value, disabled }, validatorsArray, asyncValidatorsArray);
        
        this.logger.log(id, group[id]);

        group[id].valueChanges.subscribe(
          (value: any) => {

            if (isInputValue(value)) {
              // validate value different ot inputValue....
              saveGlobalData(id, value);
              // need send the group global...
              // the group send here in with all forms....
              const { execute } = input;
              
              this.executeBuilder(value, execute, this.formGroup, divParent, ActionsView.onChange);

            }

          }
        );

        // Execute action => onLoad
        const { execute } = input;

        this.executeBuilder(undefined, execute, group, divParent, ActionsView.onLoad);

      }

    }

    let subGroup = group;

    if (isForm) subGroup = {};

    if (divList) {

      for (let div of divList) {
        let isInsideForm = (isForm || div.isForm || isFormParent) // Validate if div is inside a form
        this.divBuilder(div, subGroup, isInsideForm);
      }

    }

    if (div) {
      let isInsideForm = (isForm || div.isForm || isFormParent) // Validate if div is inside a form
      this.divBuilder(div, group, isInsideForm);
    }

    if (isForm) {
      if (!name) throw Error('Property name in div is not defined for formGroup in metadata.');

      group[`${name}`] = this.formBuilder.group(subGroup);
    }

  }

  validatorsBuild(validators: ValidatorElement[]) {
    let validatorsArray: any = [];
    let asyncValidatorsArray: any = [];

    if (validators) {
      for (let valid of validators) {
        // call to customValidator
        if (valid.expression) {
          validatorsArray.push(CustomValidator(valid));
        } else if (valid.execute) {
          //Descomentar para agregar validaciones asincronas
          asyncValidatorsArray.push(customAsyncValidator(valid, {}));
        } else {
          validatorsArray.push(Validators[valid.type]);
        }
      }
    }

    return { validatorsArray, asyncValidatorsArray };
  }

  convertValues(controls: any) {
    for (let c in controls) {
      // this.pokeDataService.formData[c] = controls[c].value;
    }
  }

  private executeBuilder(value: any, execute: Execute | undefined, group: any, nestedFlow: any, actionView?: ActionsView) {

    if (execute) {

      const { clientList, serverList } = execute;

      if (!clientList && !serverList) return; // if both element are null or undefined the validate is not continue.

      if (clientList) {
        this.executeClients(clientList, value, group, nestedFlow, actionView);
      }

      if (serverList) {
        this.executeServers(serverList, value, group, actionView);
      }

    }

  }

  executeClients(clientList: Client[], currentValue: any, group: any, nestedFlow: any, actionView?: ActionsView) {
    let clientListTemp = [...clientList];

    // Filter serverlist in case action is not null|undefined, otherwise remove all actionsView.onLoad
    if (actionView) clientListTemp = clientList.filter((s: Client) => s.actionView === actionView);

    for (let client of clientListTemp) {
      const { expression, inputList, actionView } = client;

      if (expression) { // Validations on runtime with anonymous function,
        let inputFound: any = undefined;

        // inputList

        const { functionResult: { value, onCallback } } = customFunction(currentValue, inputFound, expression) || {};

        this.logger.log(ComponentBuild.name, 'Result expression', value, onCallback);
        //this.store.dispatch();

        //Validate result how to assing to value of group
        // do refresh validations using group
        if (onCallback) this.executeClients(clientList, value, group, nestedFlow, ActionsView.onCallback);

        if (inputList) setValueToInputElement(inputList, group, actionView, value);

      } else {
        if (inputList) setValueToInputElement(inputList, group, actionView, currentValue);
      }
    }

  }

  executeServers(serverList: Server[], value: any, group: any, actionView?: ActionsView) {
    let serverListTemp = [...serverList];

    // Filter serverlist in case action is not null|undefined, otherwise remove all actionsView.onLoad
    if (actionView) serverListTemp = serverList.filter((s: Server) => s.actionView === actionView);


    for (let server of serverListTemp) {
      const { actionView, storageName, inputList } = server;

      this.httpClientService.requestMapping(server).subscribe(
        response => {
          this.logger.log(ComponentBuild.name, response);

          if (storageName) this.logger.log(ComponentBuild.name, 'Information is stored in localStorage');

          if (inputList) setValueToInputElement(inputList, group, actionView, response);

        }
      );

    }

  }


  statusNestedLookUp() {
    // Validate if nestedFlow is not found in localStorage
    this.statusNestedFlow$?.subscribe(
      (flag) => {
        if (flag) return;

        this.logger.info('We need to find nestedFlow from server',)

        let server = {
          uri: environment.uriFlow,
          method: 'GET',
          httpHeaders: {
            'x-auth-view-token': '123323'
          }
        };

        this.store.dispatch(nestedFlowBuild({ server }));
      }
    );

  }

  validateAllFormFields = (formGroup: FormGroup) => {
    for (const control in formGroup?.controls) {
      formGroup.get(control)?.markAsDirty();
      formGroup.get(control)?.markAsTouched();
      formGroup.get(control)?.markAllAsTouched();
      formGroup.get(control)?.updateValueAndValidity();
    }
  }

  loadResources(resources: Resources | undefined) {
    if (!resources) {
      this.logger.warn('resources is not configurated.');
      return;
    }

    const { scripts, styles } = resources;
    
    if (!scripts || scripts.length == 0) this.logger.warn('scripts are not configurated.');

    if (!styles || styles.length == 0) this.logger.warn('styles are not configurated.');

    /** support global Env this.authorizationService.getValueFromEnvironments(r); */
    // Load styles
    if (styles) {
      for (let style of styles) {
        
        let node = document.createElement('link');
        node.href = style; // Se obtiene URL de estilo a cargar, solo se deben cargar de tipo css
        node.rel = 'preload';
        node.as = "style";
        document.getElementsByTagName('head')[0].appendChild(node);

        node = document.createElement('link');
        node.href = style; // Se obtiene URL de estilo a cargar, solo se deben cargar de tipo css
        node.rel = 'stylesheet';
        node.type = 'text/css'
        document.getElementsByTagName('head')[0].appendChild(node);

      }
    }

    if (scripts) {
      for (let src of scripts) {
        let node = document.createElement('link');
        node.href = src; // Se obtiene URL de estilo a cargar, solo se deben cargar de tipo css
        node.rel = 'preload';
        node.as = "script";
        document.getElementsByTagName('head')[0].appendChild(node);

        let script = document.createElement('script');
        script.src = src; // Se obtiene URL de estilo a cargar, solo se deben cargar de tipo css
        script.defer = true;
        script.async = true;
        document.getElementsByTagName('body')[0].appendChild(script);
      }
    }
  }

  /** Actions Views */
  execFn(action: InputAction) {
    const { client } = action;
    const args = Array.prototype.slice.call(arguments, 0);

    if (!client) return;

    return this.context[client.actionView].apply(this.context, args);
  }

  submit = (action: InputAction): boolean => {
    this.logger.error('SUBMIT: Method not supported.');
    const { client } = action || {};

    if (!client) return false;
    const { formParentName } = client || {}

    if (!formParentName) return false;

    this.logger.log(ComponentBuild.name, 'Form found', this.formGroup?.get(formParentName));
    const form = this.formGroup?.get(formParentName);

    if (!form?.valid) {
      form?.markAllAsTouched();
      form?.markAsDirty();
      this.validateAllFormFields(form as FormGroup);
      return false;
    }

    return true;
  }

  route = (action: InputAction) => {
    const { client } = action || {};

    if (!client) return;

    const { nestedFlowName } = client || {};

    if (!nestedFlowName) return;

    this.logger.log(ComponentBuild.name, 'find', nestedFlowName);
    this.findNestedFlow(nestedFlowName).subscribe(
      ({ nestedFlow, formGroupParent }) => {

        (this.componentConfiguration$ as BehaviorSubject<ComponentConfiguration>).next({ nestedFlow, formGroupParent });
        this.formGroup = formGroupParent;
        this.logger.log(ComponentBuild.name, 'Information', formGroupParent);
      }
    );
  }

  redirect = (client: Client) => { this.logger.error(ComponentBuild.name, 'Method not supported.'); }

  nextStep = (event: any) => {
    this.logger.log(ComponentBuild.name, '', event);
    const { extended } = event || {};
    const { cdkStepper } = extended || {};

    // validate submit on next step
    if (!this.submit(event)) return;

    // move to next step
    (cdkStepper as CdkStepper).next();
  }

  backStep = (event: any) => {
    this.logger.log(ComponentBuild.name, '', event);
    const { extended } = event || {};
    const { cdkStepper } = extended || {};

    // move to next step
    (cdkStepper as CdkStepper).previous();
  }

  assistance = (event: any) => {
    this.logger.error(ComponentBuild.name, 'Method not supported.');
    // Define if call a service for assistance help
  }

  jsonLogic = (event: any) => {
    const { extended } = event || {};
    const { condition } = extended || {};
    const { rules, data } = condition || {};

    /* this.interpreterService.JsonLogicApply(rules, data); */
  }
  
  /** Actions Views ***/

}