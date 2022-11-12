import express, { Router } from 'express'
import usersRoute from './users-route'
import companyRoute from './company-route'

const router: Router = express.Router()

router.use('/users', usersRoute)
router.use('/companies', companyRoute)

export default router