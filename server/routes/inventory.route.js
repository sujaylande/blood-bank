const router = require('express').Router();
const Inventory = require('../models/inventory.model.js');
const User = require('../models/user.model.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

const mongoose = require('mongoose');



// add inventory:
router.post('/add', authMiddleware , async(req, res)=>{
    try{

        // validate email and inventory type:

        
        const user = await User.findOne({email:req.body.email});

        if(!user) throw new Error("Invalid Email");

        if(req.body.InventoryType === "in" && user.userType !== 'donor'){
            throw new Error("The email is not recognized as the donor");
        }

        if(req.body.InventoryType === "out" && user.userType !== 'hospital'){
            throw new Error("The email is not recognized as the Hospital");
        }


        if(req.body.InventoryType === 'out'){

            // validation:
            // check if inventory is available

            const requestedGroup = req.body.bloodGroup;
            const requestedQuantity = req.body.quantity;

            const organization = new mongoose.Types.ObjectId(req.body.userId);

            const totalInOfRequestedGroup = await Inventory.aggregate([
                {
                  $match: {
                    organization,
                    InventoryType: "in",
                    bloodGroup: requestedGroup,
                  },
                },
                {
                  $group: {
                    _id: "$bloodGroup",
                    total: { $sum: "$quantity" },
                  },
                },
              ]);

              const totalIn = totalInOfRequestedGroup[0].total || 0;


              const totalOutOfRequestedGroup = await Inventory.aggregate([
                {
                  $match: {
                    organization,
                    InventoryType: "out",
                    bloodGroup: requestedGroup,
                  },
                },
                {
                  $group: {
                    _id: "$bloodGroup",
                    total: { $sum: "$quantity" },
                  },
                },
              ]);


              const totalOut = totalOutOfRequestedGroup[0]?.total || 0;


              const availableQuantityOfRequestedGroup = totalIn - totalOut;



              if (availableQuantityOfRequestedGroup < requestedQuantity) {
                throw new Error(
                  `Only ${availableQuantityOfRequestedGroup} units of ${requestedGroup.toUpperCase()} is available`
                );
              }


            req.body.hospital = user._id;
        }
        else{
            req.body.donor = user._id;
        }


        // add inventory:
        const inventory = new Inventory(req.body);
        await inventory.save();


        return res.send({
            success:true,
            message:"Inventory added successfully"
        });

    }
    catch(error){

        return res.send({
            success:false,
            message:error.message,
        })
    }


})



// get inventory:

router.get('/get', authMiddleware, async(req, res)=>{
    try{
        const inventory = await Inventory.find({organization: req.body.userId}).sort({createdAt:-1}).populate("donor").populate("hospital");

        return res.send({
            success:true,
            data:inventory
        })
    } 
    catch(error){
        return res.send({
            success:false,
            message:error.message
        })
    }
})

router.post('/filter', authMiddleware, async(req, res)=>{
    try{
        const inventory = await Inventory.find(req.body.filters).sort({createdAt:-1}).populate("donor").populate("hospital").populate('organization');


        return res.send({
            success:true,
            data:inventory
        })
    } 
    catch(error){
        return res.send({
            success:false,
            message:error.message
        })
    }
})








module.exports = router;
