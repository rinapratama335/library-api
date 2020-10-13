const express = require("express");
const fs = require("fs");
const util = require("util");
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
const directory = "uploads";
const { Book, Category, User } = require("../../models");

exports.getAllBooks = async (req, res) => {
  try {
    const booksData = await Book.findAll({
      include: [
        {
          model: Category,
          as: "category",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "role"],
          },
        },
      ],
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "password",
          "categoryId",
          "userId",
          "CategoryId",
          "UserId",
        ],
      },
    });

    res.send({
      message: "Books successfully loaded",
      data: {
        books: booksData,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      message: "Server error",
    });
  }
};

exports.detailBook = async (req, res) => {
  const { id } = req.params;

  try {
    const detail = await Book.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Category,
          as: "category",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "role"],
          },
        },
      ],
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "password",
          "categoryId",
          "userId",
          "CategoryId",
          "UserId",
        ],
      },
    });

    res.send({
      message: "Data successfully loaded",
      data: detail,
    });
  } catch (err) {
    res.status(500).send({
      message: "Server error",
    });
  }
};

exports.addBook = async (req, res) => {
  const checkISBN = await Book.findOne({
    where: {
      ISBN: req.body.ISBN,
    },
  });

  if (checkISBN) {
    return res.status(400).send({
      error: "Book with this ISBN has been already exist",
    });
  }

  const saveBook = await Book.create({
    ...req.body,
    file: req.file.filename,
  });

  if (saveBook) {
    const returnSaveData = await Book.findOne({
      where: {
        id: saveBook.id,
      },
      include: [
        {
          model: Category,
          as: "category",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "role"],
          },
        },
      ],
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "password",
          "categoryId",
          "userId",
          "CategoryId",
          "UserId",
        ],
      },
    });

    res.send({
      message: "Add data success",
      data: {
        book: returnSaveData,
      },
    });
  }
};

exports.editBook = async (req, res) => {
  const { title, publication, pages, aboutBook, ISBN, status } = req.body;
  const { id } = req.params;

  try {
    const findBook = await Book.findOne({
      where: {
        id,
      },
    });

    // const checkISBN = await Book.findOne({
    //   where: {
    //     ISBN: req.body.ISBN,
    //   },
    // });

    // if (checkISBN) {
    //   return res.status(400).send({
    //     error: "Book with this ISBN has been already exist",
    //   });
    // }

    if (findBook) {
      const updatedBook = await Book.update(
        {
          title: title,
          publication: publication,
          pages: pages,
          aboutBook: aboutBook,
          ISBN: ISBN,
          status: status,
        },
        {
          where: {
            id,
          },
        }
      );

      if (updatedBook) {
        const returnUpdatedBook = await Book.findOne({
          where: {
            id: findBook.id,
          },
          include: [
            {
              model: Category,
              as: "category",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            {
              model: User,
              as: "user",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password", "role"],
              },
            },
          ],
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password",
              "categoryId",
              "userId",
              "CategoryId",
              "UserId",
            ],
          },
        });

        res.send({
          message: "Book has been updated",
          data: {
            book: await returnUpdatedBook,
          },
        });
      }
    }
  } catch (err) {
    res.status(500).send({
      message: "Ada masalah server",
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const findBook = await Book.findOne({
      where: {
        id: id,
      },
    });

    if (findBook) {
      const files = await readdir(directory);
      files.map((filename) => unlink(`${directory}/${findBook.file}`));

      await Book.destroy({
        where: {
          id,
        },
      });

      return res.send({
        data: {
          id,
        },
      });
    } else {
      return res.status(400).send({
        message: "Book not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
