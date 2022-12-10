# **BUDGET CONTROL APP**

In this document, it will be specified the testing strategy that will be used

## Testing

In this application we will be using a ***TDD*** strategy, this means we will write the tests first and then we will code enough for the tests pass and then we can refactor knowing that if the test pass the functionality still works.

For making the tests we will be using ***JEST*** and ***Supertest***.  To be able to work with these, we will have to have a file with the application and the main file that will start the server and listen to the specific port.

There will be a test file for each route and inside it will have the following structure:

```Typescript
describe('Test a specific route', () => {
    beforeAll(async () => {
        // Everything that will need to be done before all tests
        // Eg.
        // Cleaning the database,
        // Creating any data required
    })
    aferAll(async () => {
        // Everything that will need to be done after all tests
        // Eg.
        // Closing the database connection
    })
    describe('Creating an element', () => {
        describe('Given a specific condition', () => {
            it('should pass a specific condition', async () => {
                // test code
            })
        })
    })
    describe('Reading element', () => {
        describe('Given a specific condition', () => {
            it('should pass a specific condition', async () => {
                // test code
            })
        })
    })
    describe('Updating element', () => {
        describe('Given a specific condition', () => {
            it('should pass a specific condition', async () => {
                // test code
            })
        })
    })
})
```

[Back](../README.md)
