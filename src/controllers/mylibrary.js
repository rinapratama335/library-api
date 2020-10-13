const express = require("express");
const { Book, User, Mylibrary } = require("../../models");

exports.addToMyLibraries = async (req, res) => {
  try {
    const { id } = req.params;

    const addToMyLibrary = await Mylibrary.create({
      userId: req.user.id,
      bookId: id,
    });

    res.send({
      message: "Book added to My Library",
      data: {
        library: addToMyLibrary,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      message: "Server error",
    });
  }
};

exports.getAllMyLibrary = async (req, res) => {
  try {
    // const { id } = req.user;

    console.log("User ID : ", req.user.id);

    const myLibrayItems = await User.findOne({
      include: {
        model: Book,
        as: "books",
        attributes: {
          exclude: ["userId", "createdAt", "updatedAt"],
        },
      },
      where: {
        id: req.user.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      message: "Success load data",
      data: {
        libraryItems: myLibrayItems.books,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      message: "Server error",
    });
  }
};

exports.deleteItemLibrary = async (req, res) => {
  const { id } = req.params;
  try {
    await Mylibrary.destroy({
      where: {
        id,
      },
    });

    res.send({
      message: "Book has been deleted",
      id,
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      message: "Server error",
    });
  }
};
