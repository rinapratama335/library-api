const jwt = require("jsonwebtoken");
const { User } = require("../../models");

//Key form decript
const jwtKey = process.env.JWT_KEY;

exports.auth = async (req, res, next) => {
  let header, token;

  //If header or token not found or empty
  if (
    !(header = req.header("Authorization")) ||
    !(token = header.replace("Bearer ", ""))
  ) {
    return res.status(400).send({
      message: "Access denied",
    });
  }

  //Check if there is a token
  try {
    const verified = jwt.verify(token, jwtKey);

    req.user = verified;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send({
      error: {
        message: "Invalid token",
      },
    });
  }
};

exports.authAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user.dataValues.role !== 1)
      return res
        .status(400)
        .send({ message: "Invalid Operation, You login as User" });

    next();
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Invalid token" });
  }
};
