export const createProjectValidator = {
    name: {
        required: true,
        type: 'string'
    },
    is_active: {
        required: true,
        type: 'boolean'
    }
}

export const updateProjectValidator = {
    name: {
        required: false,
        type: 'string'
    },
    is_active: {
        required: false,
        type: 'boolean'
    }
}