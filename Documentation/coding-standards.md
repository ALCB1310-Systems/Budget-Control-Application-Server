# **BUDGET CONTROL APP**

In this document, it will be specified the different coding standards that will be used while coding the project

## Coding Standards

### Semicolons

In this app we will ***not*** be using semicolons at the end of each line

### Variable names

All variables will be named in a snake case format eg:

```Typescript
this_is_a_variable_name
```

All variables will be declared as a const unless it will need to change value, then they are going to be declared as let, also since we are using TypeScript, all of the variables must have a type

```Typescript
const this_is_a_variable: [type] = "Value"
let this_is_a_variable: [type] = "Value"
```

In case that there will be a need of constants they will be declared all caps

```Typescript
const THIS_IS_A_CONSTANT = "Value"
```

### Strings

All the strings will be formed with template strings, only the routes will use single quote strings

```Typescript
const this_is_a_string = `This is the string's value``

app.get('/', (req: Request, res: Response) => {})

```

### Functions

All functions will be declared using ES6 syntax, will be declared as a const equals to an arrow function, the naming convention will be like a variable.  All of the user defined functions will need to have docstrings indicating what are the parameters and their type as well as what does the function returns

``` Typescript
/**
 * Description of what the function does
 * 
 * @param {[type]} param1 [description]
 * @param {[type]} param2 [description]
 * ...
 * @param {[type]} paramN [description]
 * @return {[type]} [description]
 */
const this_is_a_function = (param1: [type], param2: [type], ...., paramN: [type]) => {
     code will go here
}
```

[Back](../README.md)
