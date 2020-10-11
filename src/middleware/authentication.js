const jwt = require("jsonwebtoken");
const { head } = require("../routes/router");

//Key form decript
const jwtKey = process.env.JWT_KEY;

exports.authentication = async (req, res, next) => {
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
