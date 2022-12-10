export const createBudgetItemValidator = {
    code: {
        required: true,
        type: 'string'
    },
    name: {
        required: true,
        type: 'string'
    },
    accumulates: {
        required: true,
        type: 'boolean'
    },
    level: {
        required: true,
        type: 'number'
    },
    parentUuid: {
        required: false,
        type: 'uuid'
    }
}

export const updateBudgetItemValidator = {
    code: {
        required: true,
        type: 'string'
    },
    name: {
        required: true,
        type: 'string'
    },
    accumulates: {
        required: true,
        type: 'boolean'
    },
    level: {
        required: true,
        type: 'number'
    },
    parentUuid: {
        required: false,
        type: 'uuid'
    }
}