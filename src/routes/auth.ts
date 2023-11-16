import { PrismaClient } from "../../node_modules/.prisma/client/index";

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();
var salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const JWTSECRET = "THISISSECRETTOKEN";

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const checkUser = await prisma.user.findFirst({
    where: {
      OR:[
        {email:email},
        {username:username}
      ]
    },
  });

  if (checkUser) {
    const compare = bcrypt.compareSync(password, checkUser.hashedpass);
    if (compare) {
      const token = jwt.sign({ id: checkUser.id }, JWTSECRET);
      res.send({
        success: true,
        message: "User Login Successfully",
        token: token,
      });
    } else {
      res.send({
        success: false,
        message: "Invalid Crenditals",
        createdAt: checkUser[0].createdAt,
      });
    }
  } else {
    var hash = bcrypt.hashSync(password, salt);
    const newUser = await prisma.user.create({
      data: {
        email: email,
        username: username,
        hashedpass: hash,
      },
    });

    if (newUser) {
      const token = jwt.sign({ id: newUser.id }, JWTSECRET);
      res.send({
        success: true,
        message: "User created Successfully",
        token: token,
      });
    } else {
      res.send({ success: false, message: "Interal Server Error" });
    }
  }
});

module.exports = router;
