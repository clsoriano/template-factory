import { switchMap } from 'rxjs/operators';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { ValidatorElement } from 'store-lib';

/**
 * Función para manejar validaciones asíncronas de campos de formulario
 * actualmente valida que el código de respuesta sea de success
 * @param validator objeto de tipo ValidatorElement que contiene metadata del error
 * @param controlSchema objeto metadata del control, para validar maxlength que indica el momento en que la validación debe hacerse, si es cero se asume o indefinido que se dispará siempre que la validación sea invocada
 * @param authorizationService Service que contiene las funciones para ejecutar las peticiones de validación
 */
export function customAsyncValidator(validator: ValidatorElement, controlSchema: any): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        //Pasar solo si maxlength no esta definido, que el control.value esta definido y su length es igual o mayor al maxlength del esquema y q el valor este en la global.
        let debounceTime = 500;
        return timer(debounceTime).pipe(
            switchMap(() => {
                /* if (((!controlSchema.maxlength && control.value && control.value !== '') ||
                    (control.value && control.value.length >= controlSchema.maxlength)) &&
                    (typeof authorizationService.globalMap.global[controlSchema.key] != 'undefined' && authorizationService.globalMap.global[controlSchema.key].length >= controlSchema.maxlength)) {
                        validator.execute.server.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
                    for (let s in validator.execute.server) {
                        return authorizationService.buildRequest(null, validator.execute.server[s])
                        .then((response: any) => {
                            //Se valida que el código de respuesta sea de success
                            return validator.execute.server[s].responseModel.successCode == response ? null : {[validator.type]: true};
                        })
                        .catch(() =>{
                            return {[validator.type]: true};
                        });
                    }
                } */
                return of(null);
            })
        );
    };
}