import {CompletionAcceptor, CompletionContext, DefaultCompletionProvider, MaybePromise, NextFeature} from "langium";
import {Field, isField} from "./generated/ast";
import {isRuleCall} from "langium/lib/grammar/generated/ast";
import {HelloWorldServices} from "./hello-world-module";


export class FieldProvider {
    allFields(): string[] {
        return ["hallo", "world"]
    }
}

export class CompletionProvider extends DefaultCompletionProvider {
    #fieldProvider: FieldProvider
    constructor(services: HelloWorldServices) {
        super(services);
        this.#fieldProvider = services.fields
    }

    protected override completionFor(context: CompletionContext, next: NextFeature, acceptor: CompletionAcceptor): MaybePromise<void> {
        if(isField(context.node) || isRuleCall(next.feature) && next.type === Field) {
            this.#fieldProvider.allFields().map(it => acceptor({ label: it, kind: 5}))
        }
        return super.completionFor(context, next, acceptor);
    }
}
