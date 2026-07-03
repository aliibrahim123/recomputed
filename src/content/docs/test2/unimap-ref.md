---
title: unimap language reference
discription: the language reference of unimap
tags: [red, blue]
---
# Language Reference

**unimap** is a minimal programming language that allows you to do computations using pure pattern matching and data structure transformations, without the usage of any sort of control flow or built-in math.

In unimap, you create functions that take data structures, match them against patterns, and then map them to new data structures.

Through composition and piping, you walk up the abstraction layers until you create your own universe, a universe capable of computing your exact needs using just pure data transformation.

Here is a hello world example:
```unimap
symbol hello_world!;
fn main () => hello_world!;
```

Here is a better example:
```unimap
fn filter_zero (arr) => arr: {
	[] => [],
	[0, ..let tail] => filter_zero(tail),
	[let head, ..let tail] => [head, ..filter_zero(tail)]
};

fn map_one (arr) => arr: {
	[] => [],
	[1, ..let tail] => [2, ..map_one(tail)],
	[let head, ..let tail] => [head, ..map_one(tail)]
};

fn main () => filter_zero([1, 0, 0, 2, 0, 3]) |> map_one(_); // => [2, 2, 3]
```

This document serves as a reference for the language, describing its syntax and semantics, and detailing its execution model.

*Disclaimer: This language is an experiment and is not designed for production. It is not guaranteed to be updated or fixed, nor will it remain backward-compatible. Use it for fun, not for production!*

---

# General Grammar

This document uses the [gramex meta language](https://docs.rs/gramex/latest/gramex/docs/gram_ref/index.html) as a grammar notation, and expects the source to be a valid UTF-8 file.

unimap is whitespace-insignificant, whitespace serves only to separate tokens. The whitespace characters are: space ` `, horizontal tab `\t`, line feed `\n`, and carriage return `\r`.

All comma-separated lists can have a trailing comma.

### Comments
```gramex
let comment = "//" !"\n"* "\n"? | "/*" !"*/"* "*/";
```
unimap supports line and block comments in their respective C-style syntax.

Comments can be written in any position in the source, and they are ignored by the parser.
```unimap
/* prints hello world */
fn main () => hello_world!; // => hello_world!
```

### Identifiers
```gramex
let language_symbol = "." | ":" | "," | ";" | "=" | "|" | "/" | "(" | ")" | "{" | "}" | "[" | "]";
let language_keyword = "fn" | "let" | "symbol" | "import";
let ident = !({category("Z")} | {category("C")} | language_symbol)+ & !language_keyword & !nb &!"_";
```
An identifier is a sequence of characters that represents a name in the program.

An identifier can contain any Unicode character except control, whitespace, unassigned, or private characters (categories `Z` and `C`), and symbols used by the language itself.

An identifier also cannot be an underscore (`_`), a number, or a language keyword.
```unimap
abc;
abc123;
_abc-123;
#$+-?;
λ😀ع↑;
```

---

# Values and Structures
```unimap
{ a: 1, 2: b, c: [1, 2, c] }
```
unimap features a unique and unconventional data model. Its type system is not numeric based, it is purely symbolic and structural.

In unimap, you model the world as symbols and data structures. These data structures are immutable, heterogeneous, and can be nested infinitely.

You do not mutate values. Instead, you create new structures, match against them, extract their inner values, and transform them into new ones.

## Symbols
Symbols are globally unique primitive units that represent a distinct value.

They are the fundamental building blocks of the language and the units used to build all other data structures. They only match themselves and are semantically represented by an identifier.

```unimap
symbol a, b;

fn equal_a (v) => v: { a => 1, _ => 0 };

let test1 = equal_a(a); // => 1
let test2 = equal_a(b); // => 0
```

### `symbol` Declaration
```gramex
let symbol_decl = "symbol" list<ident ("{" list<ident, ","> "}")?, ","> ";";
```
To avoid typo related bugs, symbols cannot be created out of thin air, they must be declared using the symbol declaration.

A symbol declaration is a top-level declaration that defines a list of local symbols.

Symbols are not globally unique by name. Multiple symbols in different modules can share the same name, but each retains its distinct, unique value.

```unimap
// file_a
symbol a;
let other_a = a;

// file_b
import file_a { other_a };
symbol a;
let is_a = other_a: { a => 1, _ => 0 }; // => 0
```

### Symbol Enums
Multiple symbols can be grouped together into a symbol enum.

Symbol enums are defined inside a symbol declaration by following the enum identifier with a comma-separated list of variant identifiers enclosed inside curly braces.

Symbol variants act like normal symbols (they have their own distinct values), but they are referred to using dot notation: `Enum.variant`.

Enum symbols themselves do not act like normal symbols. Instead, they serve as namespaces for symbols and act as a pattern that matches any of their variants.

```unimap
symbol Color { red, green, blue }, a;

fn is_red (v) => v: { Color.red => 1, _ => 0 };
fn is_color (v) => v: { Color => 1, _ => 0 };

let test1 = is_red(Color.red);   // => 1
let test2 = is_color(Color.red); // => 1
let test3 = is_color(a);         // => 0
```

## Numbers
```gramex
let nb = "0" | "1".."9" ("0".."9")*;
```
Numbers are a special kind of symbol with unique properties.

Numbers are arbitrary sequences of decimal digits, starting with a non-zero digit or being exactly `0`.

They are defined intrinsically by the language, are globally unique, and are used to index arrays. Other than these specific properties, numbers behave exactly like regular symbols.

```unimap
symbol 01;
fn is_1 (v) => v: { 1 => 1, _ => 0 };

let test1 = is_1(1);  // => 1
let test2 = is_1(2);  // => 0
let test3 = is_1(01); // => 0
```

## Records
Records are heterogeneous key-value data structures that have symbols as fields, and any value as field values (even other records).

They are defined by a list of `field = value` pairs separated by commas, enclosed inside curly braces.

They can be created, accessed via `rec.field` or `rec[index]`, matched and matched against, and passed to and from functions. Like any value in unimap, they are strictly immutable.

Records equal each other if they have the exact same fields with equal values.

```unimap
symbol a, b, c, deeply, nested, record;

let rec = { a = 1, b = 2, 3 = c };
let field_a = rec.a;  // => 1
let field_b = rec[b]; // => 2

let rec2 = { deeply = { nested = { record = {} }, } };
let field_deep = rec2.deeply[nested]; // => { record = {} }

fn equal (a, b) => a: { b => 1, _ => 0 };

let test1 = equal(rec, rec);                            // => 1
let test2 = equal(rec, { a = 1, b = 2, 3 = c });        // => 1
let test3 = equal(rec, { a = 1, b = 2, 3 = a });        // => 0
let test4 = equal(rec, { a = 1, b = 2, 3 = c, 1 = a }); // => 0
```

## Arrays
Arrays are heterogeneous sequences of values, zero-indexed by numbers.

They are defined by a comma-separated list of values enclosed inside square brackets.

Like records, they can be created, accessed via `arr.nb` or `arr[index]`, matched, and are fully immutable.

Arrays equal each other if they are equal in length and have identical elements.

Arrays are a specialization/optimization of records, providing additional structural features (like the spread pattern).

```unimap
symbol a, b, c, arr;

let arr = [1, 2, c];
let item_0 = arr[0]; // => 1
let item_2 = arr.2;  // => c

let arr2 = [1, [a, b, c], { arr = [] }];

fn equal (a, b) => a: { b => 1, _ => 0 };

let test1 = equal(arr, arr);          // => 1
let test2 = equal(arr, [1, 2, c]);    // => 1
let test3 = equal(arr, [1, 2, a]);    // => 0
let test4 = equal(arr, [1, 2, c, 1]); // => 0
```

---

# Module System
unimap features a very simple module system where each file acts as a distinct module with its own scope and path.

Each module consists of a list of top-level declarations that define a number of local items. These declarations include `import`, `fn`, `let` (constants), and `symbol` declarations.

These declarations can be ordered in any way, and can safely reference other items declared or imported below them.

Declared items are completely local to their module by default, but they can be brought into other modules using the `import` statement.

Each item must have a locally unique identifier. However, multiple items across different modules can share the exact same name perfectly fine, as long as they don't conflict when imported into the same scope.

```unimap
symbol a, b, c;
let arr = [a, b, f(), d];

import other { d };

fn f () => c;
```

## `import` Declaration
```gramex
let import_decl = "import" path "{" list<ident, ","> "}" ";";
let path = list<ident, ".">;
```
`import` declarations bring a number of items declared in another module into the current module's scope.

An `import` declaration consists of a path to the source module followed by a comma-separated list of item identifiers to import.

The imported items must not conflict with locally declared items or other imported items. Just like local items, imported items can be used in the file before the `import` declaration itself.

```unimap
// file a.unim
symbol a, b, c;

// file b.unim
let arr = [a, b, c];
import a { a, b, c };
```

The path is a dot-separated list of identifiers that refers to a specific module. Paths are resolved relative to the base directory and are converted into file system paths (e.g., `some.file` -> `{base_dir}/some/file.unim`).

To prevent ambiguity, a path component cannot resolve to both a directory and a file at the same time:
```unimap
// Error: Does 'base' resolve to base.unim or the directory base/?
import base { a, b }; 
import base.sub { c, d }; 
```

Modules can import from each other in any arrangement. Cyclic dependency graphs are fully supported and do not need to form a strict tree-like structure.
```unimap
// file a
symbol a, b, c;
import b { d };
fn f () => d;

// file b
let d = [a, b, c];
import a { a, b, c };
```

---

# Expressions
unimap is an expression-based language. It is built entirely around expressions, operations, and literals that evaluate to values.

Expressions are divided according to their associativity and hierarchy into three categories: **Primary**, **Postfix**, and **Flow**.

## Primary Expressions
```gramex
let primary_expr = "_" | ident | nb | call_expr | "(" expr ")" | arr_expr | rec_expr | dbg_expr;
```
Primary expressions are the foundational, top-level expressions. They create or resolve to values which the rest of the expressions then operate on.

### Intermediate Expression
The intermediate expression (`_`) evaluates to the value piped from the previous expression in a pipe chain.

It is strictly forbidden to use `_` outside of a pipe chain.

```unimap
symbol a, b, c, nested;
let result = 1 |> [_, 2, 3] |> { a = _[0], b = _[1], c = { nested = _[2] } }; 
// => { a = 1, b = 2, c = { nested = 3 } }
```

### Grouped Expression
The grouped expression is an expression enclosed inside parentheses. It evaluates to the value of the expression inside it.

```unimap
let one = (1 |> [_, 2, 3]).0; // => 1
```

### Identifier Expression
The identifier expression evaluates to the value of the symbol, constant, or local that the identifier resolves to in the current scope.

```unimap
symbol a;
let b = 1;
fn f (c) => [a, b, c];
```

### Call Expression
```gramex
let call_expr = ident "(" list<expr, ",">? ")";
```
The call expression calls a function by its identifier with a list of arguments, evaluating to its returned result.

The argument list is a comma-separated list of expressions enclosed inside parentheses.

```unimap
fn f1 (a, b, c) => [a, b, c];
fn f2 () => 3;
let result = f1(1, 2, f2()); // => [1, 2, 3]
```

### Debug Expression
```gramex
let dbg_expr = "dbg" "(" expr ","? ")";
```
The debug expression acts like a function call to a built-in `dbg` utility. It prints the value of the passed argument, and then evaluates to that exact same value.

If a local item is named `dbg`, a call to `dbg` will resolve to that local item, overriding the built-in debug expression.

```unimap
let value = [1, 2, 3] |> dbg(_) |> some_fn(_);
```

## Literals
Literals are primary expressions that directly create values.

### Number Literal
The number literal evaluates directly to a number symbol.

```unimap
let nb = 1;
```

### Array Literal
```gramex
let arr_expr = "[" list<expr | ".." expr, ",">? "]";
```
The array literal creates an array value from a list of elements.

It consists of a comma-separated list enclosed inside square brackets, containing:
- **Expressions**, whose evaluated values are appended directly to the array.
- **The Spread Operator (`..`)**, followed by an expression that evaluates to an array. The individual items of that array are appended to the new array.

```unimap
let arr1 = [1, 2, 3];
let arr2 = [0, ..arr1, 4, ..[5, 6]]; // => [0, 1, 2, 3, 4, 5, 6]
```

### Record Literal
```gramex
let field = ident | symbol;
let rec_expr = "{" list<rec_item, ",">? "}";
let rec_item = field "=" expr | "[" expr "]" "=" expr | ".." expr;
```
The record literal creates a record value from a list of record items.

It consists of a comma-separated list enclosed inside curly braces, containing:
- **A Field Item:** A field symbol and its value expression, separated by `=`.
- **An Indexed Item:** An expression enclosed inside square brackets (which evaluates to a field symbol), followed by `=` and the field value expression.
- **The Spread Operator (`..`):** Followed by an expression that evaluates to a record, whose fields are added to the new record.

If two items in the literal evaluate to the exact same field symbol, the last one evaluated wins.

```unimap
symbol a, b, c, e { v1, v2 };
let rec1 = { a = 1, b = 2, 3 = c };
let rec2 = { a = 2, ..rec1, [e.v1] = e.v2 } // => { a = 1, b = 2, 3 = c, e.v1 = e.v2 }
```

## Postfix Expressions
```gramex
let postfix_expr = primary_expr postfix_op*;
let postfix_op = field_expr | index_expr | map_expr;
```
Postfix expressions are primary expressions followed by a chain of postfix operators that operate directly on the previous expression's value.

### Field Access Operator
```gramex
let field_expr = "." field;
```
The field access operator evaluates to the value of a specific field in a record, or a specific item in an array.

It is written as a `.` followed by a field symbol. If the record or array doesn't contain the requested field/item, an error is raised.

The field access operator is also used when resolving symbol variants.

```unimap
symbol a, b, c, e { v1, v2 };
let rec = { a = 1, b = 2, 3 = c };
let arr = [a, b, 3];

let field_a = rec.a; // => 1
let item_2 = arr.1;  // => 2
let variant = e.v1;
```

### Index Operator
```gramex
let index_expr = "[" expr "]";
```
The index operator indexes into an array or a record, evaluating to the matched item or field value.

It is written as an expression enclosed inside square brackets. If the array or record doesn't contain the evaluated index, an error is raised.

```unimap
symbol a, b, c, e { v1, v2 };
let rec = { a = 1, b = 2, 3 = c };
let arr = [a, b, 3];
let rec2 = { [e.v1] = [e.v2] };

let field_a = rec[a];      // => 1
let item_2 = arr[1];       // => 2
let nested = rec2[e.v1].0; // => e.v2
```

## Map Operator
```gramex
let map_expr = ":" "{" list<pat "=>" expr, ","> "}";
```
The map operator is the absolute heart of unimap. 

It is a postfix operator that takes the previous expression's value, matches it against a set of patterns, then maps the value using the first successful match map expression. 

If the provided patterns are not exhaustive, an error is raised.

It is written as a `:` followed by a comma-separated list of match arms enclosed inside curly braces. Each arm consists of a pattern and a map expression separated by `=>`. 

The map expression is the only form of control flow in the language.

```unimap
symbol a, b, c;
fn match (v) => v: {
	a => 1,
	b => 2,
	_ => 3,
};

let result1 = match(a); // => 1
let result2 = match(c); // => 3
```

## Flow Expressions
```gramex
let expr = postfix_expr | pipe_expr;
```
Flow expressions are the entry level of the expression hierarchy. they can be a regular primary expression, a postfix expression, or a pipe expression.

### Pipe Expression
```gramex
let pipe_expr = list<expr, "|>">;
```
The pipe expression is a chain of expressions separated by the pipe operator `|>` that evaluate in sequence.

Each expression's evaluated value is piped to the next expression in the chain. The evaluated value of the final expression becomes the value of the entire chain.

Along with the map operator, the pipe expression is the only form of execution flow inside the language.

```unimap
let result = 1      // => 3
	|> [_, 2, 3]
	|> dbg(_)
	|> _[2];
```

---

# Patterns
```gramex
let pat = "_" | ident | nb | ident "." ident | let_pat | rec_pat | arr_pat | or_pat;
```
Pattern matching is the core identity of the language.

Patterns are used to assert the equality and structural shape of values. They also can destructuct the values and extract their inner contents.

### Wildcard Pattern
The wildcard pattern `_` matches any value.

```unimap
let result = 0: { _ => 1 } // => 1
```

### Identifier Pattern
The identifier pattern matches by equality against the value of the symbol, constant, or local that the identifier resolves to in the current scope.

```unimap
symbol a, e { v1, v2 };
let b = 1;

fn match (v, c) => v: {
	a => 1,
	b => 2,
	c => 3,
	e => 4,
};

let test1 = match(a, 2);    // => 1
let test2 = match(1, 2);    // => 2
let test3 = match(2, 2);    // => 3
let test4 = match(e.v1, 2); // => 4
```

### Number Pattern
The number pattern is a literal number that matches itself.

```unimap
fn is_1 (v) => v: { 1 => 1, _ => 0 };

let test1 = is_1(1); // => 1
let test2 = is_1(0); // => 0
```

### Variant Pattern
The variant pattern matches a specific symbol variant belonging to an enum.

It is written as the enum identifier, followed by a dot `.`, followed by the variant identifier.

```unimap
symbol e { v1, v2 };
fn is_v1 (v) => v: { e.v1 => 1, _ => 0 };

let test1 = is_v1(e.v1); // => 1
let test2 = is_v1(e.v2); // => 0
```

## Let Pattern
```gramex
let let_pat = "let" ident (":" pat)?;
```
The let pattern assigns the evaluated value to a local, provided it matches an optional sub-pattern.

It is written as the keyword `let` followed by the local identifier, and an optional sub-pattern preceded by a colon `:`.

If no sub-pattern is provided, the let pattern always succeeds.

```unimap
fn map (v, from, to) => v: {
	from => to,
	let x => x,
};

let test1 = map(1, 1, 0); // => 0
let test2 = map(2, 1, 0); // => 2
```

## Array Pattern
```gramex
let arr_pat = "[" list<pat, ",">? (","? ".." pat?)? "]";
```
The array pattern matches an array value by destructuring its items and matching them positionally against a pattern list.

This list is a comma-separated sequence enclosed inside square brackets.

### Rest Pattern
The array pattern can optionally take a rest pattern, which slices the remainder of the array's items into a new array value and matches a pattern against it.

The rest pattern must be the last item in the list. It starts with `..` followed by an optional pattern. If no pattern is given, the rest pattern always succeeds.

If there are no items left to slice, the rest pattern evaluates to an empty array rather than failing the match.

If no rest pattern is provided, the matched array must have the exact same length as the pattern list.

```unimap
fn filter (v, filtered) => v: {
	[] => [],
	[filtered, ..let rest] => filter(rest, filtered),
	[let item, ..let rest] => [item, ..filter(rest, filtered)],
};

let result = filter([1, 2, 3], 2); // => [1, 3]
```

## Record Pattern
```gramex
let rec_pat = "{" list<field_pat, ","> "}";
let field_pat = field ":" pat | "[" expr "]" ":" pat | "let" ident (":" pat)?;
```
The record pattern matches a record value on the individual field level.

It consists of a comma-separated list of field patterns enclosed inside curly braces. These patterns can be:
- **Direct:** A field symbol followed by a colon `:`, then the value pattern.
- **Indexed:** An expression enclosed inside square brackets (evaluating to a field symbol), followed by a colon `:`, then the value pattern.
- **Let Shorthand:** A shorthand for `field: let field: pat` where the field symbol and the local share the same identifier. Just like the standard let pattern, the value pattern (`: pat`) is optional.

The evaluated record must contain exactly the fields specified by the field patterns, but it is allowed to have extra unmatched fields.

```unimap
symbol a, b, c;
fn match (v, f) => v: {
	{ a: 1, [f]: b } => 1,
	{ a: 1, let b, c: let d } => b[d],
	_ => 0,
};

let test1 = match({ a = 1, b = b }, b);                 // => 1
let test2 = match({ a = 1, b = [1, 2, 3], c = 2 }, b);  // => 3
let test3 = match({ a = 1 }, b);                        // => 0 (missing fields)
let test4 = match({ a = 1, b = b, c = 2 }, b);          // => 1 (ignores extra field 'c')
```

## Or Pattern
```gramex
let or_pat = list<pat, "|">;
```
The or pattern matches if any of the patterns in a `|` separated list succeed.

To ensure safety and predictable variable bindings, an or pattern cannot contain any `let` patterns inside it.

```unimap
fn match (v) => v: {
	1 | 2 | 3 => 1,
	_ => 0,
};

let test1 = match(2); // => 1
let test2 = match(4); // => 0
```

---

# Execution

## Functions
```gramex
let fn_decl = "fn" ident "(" list<ident, ","> ")" "=>" expr ";";
```
A function declaration is a top-level declaration that defines a function.

It consists of a function identifier, a comma-separated list of argument identifiers enclosed inside parentheses, the `=>` arrow, and a body expression.

Functions are items called by the call expression. They take a number of arguments, evaluate the body expression with them, and then return the result.

They can be called recursively until the stack overflows.

Arguments are used inside the body expression through the identifier expression and pattern.

Functions are composed of a single body expression. If you want sequential execution, use the pipe operator `|>` instead.

```unimap
fn filter (v, filtered) => v: {
	[] => [],
	[filtered, ..let rest] => filter(rest, filtered),
	[let item, ..let rest] => [item, ..filter(rest, filtered)],
};

let result = filter([1, 2, 3], 2); // => [1, 3]
```

## Constants
```gramex
let const_decl = "let" ident "=" expr ";";
```
A constant declaration is a top-level declaration that defines a constant.

It consists of a constant identifier, followed by an `=`, and an init expression.

Constants are items that store a value. These values are evaluated from the init expression.

They can be retrieved inside the current module through the identifier expression and pattern.

Constants are lazy-evaluated. They may never evaluate if they are never called, but if they are called, they are evaluated exactly once during the program's execution.

```unimap
let a = 1;
let b = [1, 2, 3];

fn f () => b[a];
```

## Execution
Execution in unimap follows a compute and print model.

The runtime looks in the entry module to determine which execution mode it will use.

### Main Mode
The default execution mode. Execution starts in a function named `main` within the entry module.

It is a function taking no arguments. It is called by the runtime exactly once, and its evaluated result is printed as the final output.

```unimap
symbol hello_world!;
fn main () => hello_world!;
```

### Continuous Mode
The continuous mode is a secondary execution mode that is triggered if no `main` function is provided. In this mode, a `loop` function is called continuously to update an accumulated state.

First, the runtime calls an `init` function in the entry module. This is a zero-argument function that provides the initial value of the accumulator.

Then, the runtime continuously calls the `loop` function. Each iteration, `loop` takes the current accumulator as its only argument and must return a two-item array acting as a tuple: `[control, acc]`.

- **`control`**: A symbol that controls the loop. It can be named `continue` to advance the loop, or `end` to stop it.
- **`acc`**: The new accumulator value for the next iteration, or the final output if `control` is `end`.

The continuous mode acts as an optimization for programs that run in a loop model with a massive iteration count, as a deep recursive loop may overflow the stack.

```unimap
symbol continue, end;

// print numbers 0 to 9
fn init () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

fn loop (acc) => acc: {
	[let last] => [end, last],
	[let cur, ..let rest] => dbg(cur) |> [continue, rest],
};
```