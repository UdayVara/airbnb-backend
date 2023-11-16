const jwt1 = require("jsonwebtoken");


const validateUser = (req,res,next) => {
    const token = req.header("auth-token")
    if (token) {
        try {
            const verify = jwt1.verify(token,"THISISSECRETTOKEN")
        req.user = verify
        next()
        } catch (error) {
            return res.send({success:false,message:"Invalid User"})
        }
    } else {
        res.send({success:false,message:"Invalid Request"})
    }
    
}

module.exports = validateUser