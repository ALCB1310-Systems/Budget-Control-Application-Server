export const budgetCreateValidator = {
    project_id: {
        required: true,
        type: 'uuid'
    },
    budget_item_id: {
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
export const updateBudgetValidator = {
    project_id: {
        required: false,
        type: 'uuid'
    },
    budget_item_id: {
        required: false,
        type: 'uuid'
    },
    quantity: {
        required: false,
        type: 'number'
    },
    cost: {
        required: false,
        type: 'number'
    }
}