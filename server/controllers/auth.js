import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// register user 

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email, 
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = User({
            firstName,
            lastName,
            email, 
            password: hashedPassword,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        })

        const savedUser = await newUser.save()
        res.status(201).json(savedUser)

    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

// login user 

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email: email})
        if (!user) return res.status(400).json({message: "User not found!"})

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({message: "Invalid Credentials!"})

        const token = jwt.sign({id: user._id}, process.env.SECRET_PHRASE)
        delete user.password  // so the password will not return to frontend
        res.status(200).json({token, user})

    } catch (err) {
        res.status(500).json({error: err.message});
    }
    }
