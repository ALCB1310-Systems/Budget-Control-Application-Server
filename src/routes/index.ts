import express, { Router } from 'express'
import usersRoute from './users-route'

const router: Router = express.Router()

router.use('/users', usersRoute)

export default router