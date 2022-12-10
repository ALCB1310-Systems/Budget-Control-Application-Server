import { BudgetItem } from "../models/budget-items-entity";

export type invoiceDetailCreate = {
    budgetItem: BudgetItem,
    quantity: number,
    cost: number,
    total: number
}