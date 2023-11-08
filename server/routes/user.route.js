const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth.middleware.js');

const Inventory = require('../models/inventory.model.js');

const mongoose = require('mongoose');


router.post('/register', async (req, res)=>{
    try{

        // check if the use already registerd or not using email:

        const userExists = await User.findOne({email:req.body.email});

        if(userExists){
            return res.send({
                success:false,
                message:"User already exists",
            })
        }

        // hash password:

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(req.body.password , salt);


        req.body.password = hashedPassword;


        // save user:

        const user = new User(req.body);
        await user.save();

        return res.send({
            success:true,
            message:"User Registered Successfully",
        })
        

    }
    catch(error){
        return res.send({
            success:false,
            message: error.message,
        })
    }
});



// login user:

router.post('/login', async(req, res)=>{
    try{
        // check if user exists:
        const user = await User.findOne({email: req.body.email});

        if(!user){
            return res.send({
                success:false,
                message:"User Not Found",
            })
        }

        // check if user type is matching:
        if(user.userType !== req.body.userType){
            return res.send({
                success:false,
                message:`User is not registered as a ${req.body.userType}`
            })
        }


        // Compare Password:

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if(!validPassword){
            return res.send({
                success:false,
                message:"Invalid Password",
            })
        }

        // generate token:

        const token = jwt.sign(
            {userId: user._id},
            "shhhhh",
            {
                expiresIn:'1d'
            }
        );

        return res.send({
            success:true,
            message:"User Logged In Successfullly",
            data:token,
        })



    }
    catch(error){
        return res.send({
            success:false,
            message:error.message,
        })
    }
})


// get current user:

router.get('/get-current-user', authMiddleware, async (req, res)=>{
    try{

        // decrypt token and gettign infor from database and send to client:

        const user = await User.findOne({_id: req.body.userId});

        // remove the password and send it to frontend:

        return res.send({
            success:true,
            message:"User fetched Successfully",
            data:user,
        })




    }
    catch(err){
        return res.send({
            success:false,
            message:err.message,
        })
    }
})



// get all unique donors for an organisation:

router.get('/get-all-donors', authMiddleware, async(req, res)=>{
    try{

        // get all unique donor id from invenotry:
        const organization = new mongoose.Types.ObjectId(req.body.userId);

        const uniqueDonorIds = await Inventory.distinct("donor",{
            organization,
        })

        const donors= await User.find({
            _id: {$in: uniqueDonorIds},
        })

        return res.send({
            success:true,
            message:"Donors fetched Successfully",
            data:donors,
        })

    }
    catch(error){
        return res.send({
            success:false,
            message:error.message,
        })
    }
})


// get all unique hospitals:
router.get('/get-all-hospitals', authMiddleware, async(req, res)=>{
    try{
        // get all unique hospitals from inventory:
        const organization = new mongoose.Types.ObjectId(req.body.userId);
        const uniqueHospitalsIds = await Inventory.distinct("hospital",{
            organization,
        })


        const hospitals = await User.find({
            _id: {$in: uniqueHospitalsIds},
        });
        

        return res.send({
            success:true,
            message:"Hospitals fetched Successfully",
            data:hospitals,
        })

        
    }
    catch(error){

        return res.send({
            success:false,
            message:error.message,
        })

    }
})




// get all unique organizations for a particular donor:


router.get('/get-all-organization-for-donor', authMiddleware, async(req, res)=>{
    try{
        // get all unique hospitals from inventory:
        const donor = new mongoose.Types.ObjectId(req.body.userId);
        const uniqueOrgnaisationIds = await Inventory.distinct("organization",{
            donor,
        })


        const hospitals = await User.find({
            _id: {$in: uniqueOrgnaisationIds},
        });
        

        return res.send({
            success:true,
            message:"Hospitals fetched Successfully",
            data:hospitals,
        })

        
    }
    catch(error){

        return res.send({
            success:false,
            message:error.message,
        })

    }
})





router.get('/get-all-organization-for-hospital', authMiddleware, async(req, res)=>{
    try{
        // get all unique Organization for hospital from inventory:
        const hospital = new mongoose.Types.ObjectId(req.body.userId);
        const uniqueOrgnaisationIds = await Inventory.distinct("organization",{
            hospital,
        })


        const hospitals = await User.find({
            _id: {$in: uniqueOrgnaisationIds},
        });



        

        return res.send({
            success:true,
            message:"Hospitals fetched Successfully",
            data:hospitals,
        })

        
    }
    catch(error){

        return res.send({
            success:false,
            message:error.message,
        })

    }
})



module.exports = router;
