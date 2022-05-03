const router = require("express").Router();
const { check, validationResult } = require("express-validator")
const { users } = require("../db")
const bcrypt = require('bcrypt')
const JWT = require("jsonwebtoken")

router.post ('/signup',[
    check("email", "Please input  valid email")
        .isEmail(),
        check("password", "Please input  password with a minimum length of 8")
        .isLength({min: 8})

], async (req,res) => {
    const { password, email } = req.body;

// validated input
    const errors = validationResult (req);

    if (!errors.isEmpty()) {
        return res.status(400).json ({
            errors: errors.array ()
        })
    }


// validate if user dosen't already exist

let user = users.find((user) => {
        return user.email === email
    });

    if(user) {
        return res.status(422).json({
            "errors": [
                {
                    "msg": "This user already exists",
                }
            ]
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // saving the password into the db
    users.push({
        email,
        password: hashedPassword
    });


    const token = await JWT.sign({
    email 
    },"72te2geu2eo2elnflknlkshadoihew0fe8fry3fh" , {
        expiresIn: 360000000000000
    } )

    res.json({
        token
        })
});

// login
router.post('/login', async (req, res) => {
    const { email, password } = req.body
 // checking if user with email exists
    let user = users.find((user) => {
        return user.email === email
    });

    if(!user){
        return res.status(422).json({
            "errors": [
                {
                    "msg": "invalid credentials",
                }
            ]
        })
    };
// checking if password if valid
    let isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(404).json({
            errors: [
                {
                    msg: "invalid credentials" 
                }
            ]
        })
    }


})




router.get("/all", (req, res) => {
    res.json(users)
})

module.exports = router