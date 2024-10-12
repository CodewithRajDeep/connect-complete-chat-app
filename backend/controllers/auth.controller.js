import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import generateTokenandSetCookie from '../utils/generateToken.js';


const handleErrorResponse = (res, errorMessage, statusCode = 500) => {
    console.log(errorMessage);  
    res.status(statusCode).json({ error: errorMessage });
};

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        
        if (password !== confirmPassword) {
            return handleErrorResponse(res, "Password didn't match", 400);
        }

        const user = await User.findOne({ username });
        if (user) {
            return handleErrorResponse(res, "Username already exists", 400);
        }

       
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

      
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        
        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        });

       
        await newUser.save();
        generateTokenandSetCookie(newUser._id, res);  
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
        });
        
    } catch (error) {
        handleErrorResponse(res, "Error in signup controller: " + error.message);
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        
        const user = await User.findOne({ username });

       
        if (!user) {
            return handleErrorResponse(res, "Invalid credentials", 400);
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return handleErrorResponse(res, "Invalid credentials", 400);
        }

        
        generateTokenandSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });

    } catch (error) {
        handleErrorResponse(res, "Error in login controller: " + error.message);
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal server Error" });
    }
};
