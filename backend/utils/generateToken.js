import jwt from 'jsonwebtoken';

const generateTokenandSetCookie = (userId, res) => {
const token= jwt.sign({userId},process.env.JWT_SECRET, {
    expiresIn: '30d',
});

res.cookie("jwt", token, {
    maxAge: 15*24*60*60*1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development"
})
}

export default generateTokenandSetCookie;