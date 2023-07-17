import { ValidationAcceptor, ValidationChecks } from 'langium';
import {Field, HelloWorldAstType } from './generated/ast';
import type { HelloWorldServices } from './hello-world-module';
import {FieldProvider} from "./completion";

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: HelloWorldServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.HelloWorldValidator;
    const checks: ValidationChecks<HelloWorldAstType> = {
        Field: validator.checkFieldExists

    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class HelloWorldValidator {
    #fields: FieldProvider;
    constructor(services: HelloWorldServices) {
        this.#fields = services.fields
    }

    checkFieldExists(field: Field, accept:ValidationAcceptor) {
        if(!this.#fields.allFields().includes(field.ref)) {
            accept('warning', `Field ${field.ref} does not exists`, {node: field})
        }
    }
}
