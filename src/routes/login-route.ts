import { verifyPassword } from './../middleware/passwordHashing';
import { validatePassword } from './../middleware/validatePassword';
import { validateEmail } from './../middleware/validateEmail';
import express, { Request, Response, Router } from 'express'
import { User } from '../models/users-entity'
import { AppDataSource } from '../db/data-source'

const router: Router = express.Router()
const userRepository = AppDataSource.getRepository(User)

router.post("/", validateEmail, validatePassword, async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await userRepository.findOne({
        where: { email: email },
        relations: ["company"]
    })

    if (!user) return res.status(401).json({detail: `Invalid credentials`})

    const isCorrectPassword: boolean = await verifyPassword(password, user.password)
    
    if (!isCorrectPassword) return res.status(401).json({detail: `Invalid credentials`})

    return res.sendStatus(204)
})

export default router 
