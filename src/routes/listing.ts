import { PrismaClient } from "@prisma/client";

const express1 = require("express");
const router = express1.Router();
const prisma = new PrismaClient();
const validateUser1 = require("../middleware/validateUser");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

router.post("/add", validateUser1, upload.single("image"), async (req, res) => {
  const newListing = await prisma.listing.create({
    data: {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      imageUrl: req.file.filename,
      location: req.body.location,
      userId: req.user.id,
      price: parseInt(req.body.price),
      GuestCount: parseInt(req.body.guest),
      roomCount: parseInt(req.body.room),
      bathroomCount: parseInt(req.body.bathroom),
    },
  });

  if (newListing) {
    res.send({ success: true, message: "Property Listed Successfully." });
  } else {
    res.send({ success: false, message: "Internal Server Error." });
  }
});

router.get("/get", async (req, res) => {
  const listings = await prisma.listing.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (listings) {
    res.send({ success: true, message: "listings fetched successfully.",listings:listings });
  } else {
    res.send({ success: false, message: "Internal server Error." });
  }
});

router.get("/get/:id",async(req,res)=>{
  const {id} = req.params
  
  const getListing = await prisma.listing.findFirst({
    where:{
      id:id
    }
  })
  const getUser = await prisma.user.findFirst({
    where:{
      id:getListing.userId
    }
  })

  const reservations = await prisma.reservation.findMany({
    where:{
      listingId:id
    }
  })
  if (getListing) {
    res.send({success:true,message:"Listing Found",listing:getListing,hostedby:getUser.username,reservations:reservations})
  } else {
    res.send({success:false,message:"Invalid id"})
  }
  
})

router.get("/getmylistings",validateUser1,async(req,res)=>{
  const myproperties = await prisma.listing.findMany({
    where:{
      userId:req.user.id  
    }
  })

  if (myproperties) {
    res.send({success:true,message:"Properties Found",properties:myproperties})
  } else {
    res.send({success:false,message:"No properties Exist."})
  }
})

router.post("/remove",validateUser1,async(req,res)=>{
  const deleteListing = await prisma.listing.delete({
    where:{
      id:req.body.listingId
    }
  })

  if (deleteListing) {
    res.send({success:true,message:"Property Deleted."})
  } else {
    res.send({success:false,message:"Internal server Error."})
  }
})
module.exports = router;
