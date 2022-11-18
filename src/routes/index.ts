import express, { Router } from 'express'
import usersRoute from './users-route'
import companyRoute from './company-route'
import loginRoute from './login-route'
import supplierRoute from './supplier-route'
import projectRoute from './project-route'
import budgetItemRoute from './budget-items-route'
import budgetRoute from './budget-route'
import invoiceRoute from './invoice-route'

const router: Router = express.Router()

router.use('/users', usersRoute)
router.use('/companies', companyRoute)
router.use('/login', loginRoute)
router.use('/suppliers', supplierRoute)
router.use('/projects', projectRoute)
router.use("/budget-items", budgetItemRoute)
router.use('/budgets', budgetRoute)
router.use('/invoices', invoiceRoute)

export default router