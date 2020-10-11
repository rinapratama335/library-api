const express = require("express");
const { User } = require("../../models");

// Encript with bcrypt
const bcrypt = require("bcrypt");

//Make token for auth
const jwt = require("jsonwebtoken");

//Key for decrypt jwt token
const jwtKey = process.env.JWT_KEY;

//Import hapy joy for validation
const joi = require("@hapi/joi");

//Register function
exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      phone,
      gender,
      address,
      role,
    } = req.body;
    const schema = joi.object({
      email: joi.string().email().min(13).required(),
      password: joi.string().min(8).required(),
      fullName: joi.string().min(3).required(),
      gender: joi.required(),
      phone: joi.number().required(),
      address: joi.required(),
      role: joi.string(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }

    //Check if email already exist
    const checkEmail = await User.findOne({
      where: {
        email: email,
      },
    });

    //If email already exist
    if (checkEmail) {
      return res.status(400).send({
        error: "Email already exist",
      });
    }

    //Create salt strength
    const saltStrength = 10;

    //Encrypt password
    const hashedPassword = await bcrypt.hash(password, saltStrength);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      gender,
      phone,
      address,
      role,
    });

    //Create JWT token after register success
    const token = jwt.sign(
      {
        id: user.id,
      },
      jwtKey
    );

    //Send data with JWT token
    res.send({
      message: "Success register",
      data: {
        user: {
          email: user.email,
          token,
        },
      },
    });
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server error",
      },
    });

    console.log(err);
  }
};
