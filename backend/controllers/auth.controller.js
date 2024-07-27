import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import generateTokenandSetCookie from '../utils/generateToken.js';
export const signup = async (req, res) => {
    
    try{
        const {fullName,username,password,confirmPassword,gender}= req.body;
        if(password!==confirmPassword){
            return res.status(400).json({error:"Password didn't match"});
        }

        const user = await User.findOne({username});
        if(user){
            return res.status(400).json({error: "Username already exists"});
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt);
        //https://avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        })
    if(newUser){
        generateTokenandSetCookie(newUser._id, res);
        await newUser.save();
        res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic
        });
    } else{
        res.status(400).json({error:"Invalid  user"});
    }
    } catch(error){
        console.log("Error in signup controller", error.message);
        res.status(500).json({error:"Internal server Error"});
    }
};

export const login = async (req, res) => {
    try{
    const {username, password} = req.body;
    const user = await User.findOne({username});
    const isPasswordCorrect = await bcryptjs.compare(password, user?.password || "");
    if(!user || !isPasswordCorrect){
        return res.status(400).json({error:"Invalid credentials"});
    }
    generateTokenandSetCookie(user._id, res);
    res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        profilePic: user.profilePic,
    });
    }
    catch(error){
        console.log("Error in login controller", error.message);
        res.status(500).json({error:"Internal server Error"});
    }
}

export const logout =  (req, res) => {
   try {
    res.cookie("jwt", "", {maxAge:0});
    res.status(200).json({message: "Logout successfull"});
   } catch (error) {
    console.log("Error in logout controller", error.message);
        res.status(500).json({error:"Internal server Error"});
   }
}



