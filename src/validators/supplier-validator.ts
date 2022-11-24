export const createSupplierValidator = {
    supplier_id: {
        required: true,
        type: 'string',
        length: 10
    },
    name: {
        required: true,
        type: 'string'
    },
    contact_name: {
        required: false,
        type: 'string'
    },
    contact_email: {
        required: false,
        type: 'email'
    },
    contact_phone: {
        required: false,
        type: 'string',
        length: 7
    }
}
export const updateSupplierValidator = {
    supplier_id: {
        required: false,
        type: 'string',
        length: 10
    },
    name: {
        required: false,
        type: 'string'
    },
    contact_name: {
        required: false,
        type: 'string'
    },
    contact_email: {
        required: false,
        type: 'email'
    },
    contact_phone: {
        required: false,
        type: 'string',
        length: 7
    }
}