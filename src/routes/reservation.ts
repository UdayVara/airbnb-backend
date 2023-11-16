import { PrismaClient } from "@prisma/client";
const express1 = require("express");
const router = express1.Router();
const prisma = new PrismaClient();
const validateUser = require("../middleware/validateUser");

router.post("/reserve", validateUser, async (req, res) => {
  const { listingId, startDate, endDate, totalPrice } = req.body;
//   res.send({ listingId, startDate, endDate, totalPrice });
  const newReservation = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      reservations: {
        create: {
          startDate: startDate,
          endDate: endDate,
          totalPrice: totalPrice,
          userId: req.user.id,
        },
      },
    },
  });

  if (newReservation) {
    res.send({ success: true, message: "Reserved Successfully." });
  } else {
    res.send({ success: false, message: "Internal Server Error." });
  }
});


router.get("/gettrips",validateUser,async(req,res)=>{
  const mytrips = await prisma.reservation.findMany({
    where:{
      userId:req.user.id
    }
  })
  const listings = []

  for (let index = 0; index < mytrips.length; index++) {
    const listing = await prisma.listing.findFirst({
      where:{
        id:mytrips[index].listingId
      }
    })
    listings.push(listing)
    
  }
  if (mytrips) {
    res.send({success:true,message:"Trips Fetched",trips:mytrips,listings:listings})
  } else {
    res.send({success:false,message:"Internal Server Error."})
  }
})


router.post("/cancel",validateUser,async(req,res)=>{
  const deleteReservation = await prisma.reservation.delete({
    where:{
      id:req.body.reservationId
    }
  })  



  if (deleteReservation) {
    res.send({success:true,message:"Cancelled Successfully."})
  } else {
    res.send({success:false,message:"Internal Server Error."})
  }
})
module.exports = router;
