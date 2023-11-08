const router = require('express').Router();
const mongoose = require('mongoose');



const authMiddleware = require('../middlewares/auth.middleware.js');
const Inventory = require('../models/inventory.model.js');


// get all  blood groups , totalin , totalout, available data from inventory


router.get('/blood-groups-data', authMiddleware, async(req, res)=>{
    try{


        const allBloodgroups = ["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"];
        const organization = new mongoose.Types.ObjectId(req.body.userId);
        const bloodGroupsData = [];


        
    await Promise.all(
        allBloodgroups.map(async (bloodGroup) => {
          const totalIn = await Inventory.aggregate([
            {
              $match: {
                bloodGroup: bloodGroup,
                InventoryType: "in",
                organization,
              },
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum: "$quantity",
                },
              },
            },
          ]);




          const totalOut = await Inventory.aggregate([
            {
              $match: {
                bloodGroup: bloodGroup,
                inventoryType: "out",
                organization,
              },
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum: "$quantity",
                },
              },
            },
          ]);

          const available = (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);

          bloodGroupsData.push({
            bloodGroup,
            totalIn: totalIn[0]?.total || 0,
            totalOut: totalOut[0]?.total || 0,
            available,
          });
        })
      );
  




        return res.send({
            success:true,
            message:"Blood Groups Data",
            data:bloodGroupsData,
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
