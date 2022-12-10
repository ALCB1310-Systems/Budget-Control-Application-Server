export const invoiceDetailCreateValidator = {
    budgetItemUUID: {
        required: true,
        type: 'uuid'
    },
    quantity: {
        required: true,
        type: 'number'
    },
    cost: {
        required: true,
        type: 'number'
    }
}