const express = require("express");
const { Category } = require("../../models");
const Joi = require("@hapi/joi");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      message: "Categories successfully loaded",
      data: {
        categories: categories,
      },
    });
  } catch (err) {
    res.status(500).send({
      message: "Server error",
    });

    console.log(err);
  }
};

exports.getDetailCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const detailCategory = await Category.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      message: "Category successfully loaded",
      data: {
        category: detailCategory,
      },
    });
  } catch (err) {
    res.status(500).send({
      message: "Server error",
    });

    console.log(err);
  }
};

exports.addCategory = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  }

  try {
    const newCategory = await Category.create({
      name: req.body.name,
    });

    if (newCategory) {
      const categoryResult = await Category.findOne({
        where: {
          id: newCategory.id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      res.send({
        message: "Data successfully added",
        data: {
          category: categoryResult,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Server error",
    });

    console.log(err);
  }
};

exports.editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updateCategory = await Category.update(
      {
        name: name,
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (updateCategory) {
      const returnUpdateCategory = Category.findOne({
        where: { id },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      res.send({
        message: "Category has been updated",
        data: { category: await returnUpdateCategory },
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).send({
      message: "Server error",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const cat = await Category.findByPk(id);

    if (cat) {
      await Category.destroy({
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
        message: "Category not found",
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).send({
      message: "Server error",
    });
  }
};
