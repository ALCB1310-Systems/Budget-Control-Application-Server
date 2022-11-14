import express, { Router } from 'express'
import usersRoute from './users-route'
import companyRoute from './company-route'
import loginRoute from './login-route'
import supplierRoute from './supplier-route'

const router: Router = express.Router()

router.use('/users', usersRoute)
router.use('/companies', companyRoute)
router.use('/login', loginRoute)
router.use('/suppliers', supplierRoute)


export default router