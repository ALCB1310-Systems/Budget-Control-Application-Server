export const createUserValidator = {
    email: {
        required: true,
        type: 'email'
    },
    password: {
        required: true,
        type: 'string',
        length: 8
    },
    name: {
        required: true,
        type: 'string'
    }
}

export const updateUserValidator = {
    email: {
        required: false,
        type: 'email'
    },
    password: {
        required: false,
        type: 'string',
        length: 8
    },
    name: {
        required: false,
        type: 'string'
    }
}