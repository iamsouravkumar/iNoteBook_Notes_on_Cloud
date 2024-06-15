const express = require('express');
const router = express.Router();
const User = require('../models/User');
const fetchUser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator'); //for validating credentials values
const bcrypt = require('bcryptjs'); //for encrypting password in hash and salt
const JWT_SECRET = 'userauthenticatedsuccessfully' //for auth using signature
const jwt = require('jsonwebtoken');  //for authenticate user through token

//ROUTE : 1 - create a user using POST "/api/auth/createuser". No Login required.

router.post('/createuser', [
    body('email', 'Enter a valid Email').isEmail(),
    body('name', 'Enter a vaid Name').isLength({ min: 3 }),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    //if there are errors return bad request and errors
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        //check whether the user with email exists already.

        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success,error: 'sorry, a user with this email is already exists' })
        }
        //create a new user
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken })

    } catch (error) {
        console.log(err.message);
        res.status(500).send("some error occured");
    }
})

//ROUTE : 2 - Authenticate a user using POST "/api/auth/login". No Login required.
router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'password is required').exists(),
], async (req, res) => {
    //if there are errors return bad request and errors
let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "please try to login with correct credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ success, error: "please try to login with correct credentials" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken })

    } catch (error) {
        console.log(err.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE : 3 - Get loggedin user details using POST "/api/auth/getuser". Login required.
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user)
    } catch (error) {
        console.log(err.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router;