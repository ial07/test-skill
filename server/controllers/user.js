
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/user.js'

export const signin = async (req, res) => {
    const { email, password } = req.body

    try {
        const existingUser = await User.findOne({ email })
        if (!existingUser) return res.status(404).json({ message: "User doesn't exist" })

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid Password" })

        const token = jwt.sign({ email: existingUser, id: existingUser._id }, '24w6qfdtayw54ea325a', { expiresIn: "1d" })

        res.status(200).json({ result: existingUser, token })

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(error)
    }
}

export const signup = async (req, res) => {
    const { firstname, lastname, email, password, confirmPassword } = req.body;

    console.log(firstname)
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(404).json({ message: "User has been Registered" })
        if (password !== confirmPassword) return res.status(404).json({ message: "Password doesn't match." })

        const hashedPassword = await bcrypt.hash(password, 12)

        const result = await User.create({
            email,
            password: hashedPassword,
            name: `${firstname} ${lastname}`,
        })

        const token = jwt.sign({ email: result.email, id: result._id }, 'Bearer', { expiresIn: "1d" })

        res.status(200).json({ result, token })

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}