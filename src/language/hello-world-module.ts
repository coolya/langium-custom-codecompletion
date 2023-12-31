import {
    createDefaultModule, createDefaultSharedModule, DefaultSharedModuleContext, inject,
    LangiumServices, LangiumSharedServices, Module, PartialLangiumServices
} from 'langium';
import { HelloWorldGeneratedModule, HelloWorldGeneratedSharedModule } from './generated/module';
import { HelloWorldValidator, registerValidationChecks } from './hello-world-validator';
import {CompletionProvider, FieldProvider} from "./completion";

/**
 * Declaration of custom services - add your own service classes here.
 */
export type HelloWorldAddedServices = {
    validation: {
        HelloWorldValidator: HelloWorldValidator
    }
    fields: FieldProvider
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type HelloWorldServices = LangiumServices & HelloWorldAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const HelloWorldModule: Module<HelloWorldServices, PartialLangiumServices & HelloWorldAddedServices> = {
    fields: () => new FieldProvider(),
    validation: {
        HelloWorldValidator: (s) => new HelloWorldValidator(s)
    },
    lsp: {
        CompletionProvider: (s) => new CompletionProvider(s),
    },
};

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createHelloWorldServices(context: DefaultSharedModuleContext): {
    shared: LangiumSharedServices,
    HelloWorld: HelloWorldServices
} {
    const shared = inject(
        createDefaultSharedModule(context),
        HelloWorldGeneratedSharedModule
    );
    const HelloWorld = inject(
        createDefaultModule({ shared }),
        HelloWorldGeneratedModule,
        HelloWorldModule
    );
    shared.ServiceRegistry.register(HelloWorld);
    registerValidationChecks(HelloWorld);
    return { shared, HelloWorld };
}
