grammar HelloWorld

entry Model:
    (content+=Content)*;

Content:
    Expression;

Expression:
    Logical;

Logical infers Expression:
    Equality (({infer And.left = current} '&&' | {infer Or.left=current} '||')  right=Equality)*;

Equality infers Expression:
    Field (({infer Equals.left = current} '==' | {infer NotEquals.left=current} '!=')  right=Field)*;

Field:
    ref=ID;


hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
