"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsTo(models.Category, {
        as: "category",
        foreignKey: {
          name: "categoryId",
        },
      });

      Book.belongsTo(models.User, {
        as: "user",
        foreignKey: {
          name: "userId",
        },
      });

      Book.belongsToMany(models.User, {
        as: "users",
        through: {
          model: "mylibraries",
          as: "library",
        },
      });
    }
  }
  Book.init(
    {
      title: DataTypes.STRING,
      publication: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      pages: DataTypes.INTEGER,
      ISBN: DataTypes.BIGINT,
      aboutBook: DataTypes.TEXT,
      file: DataTypes.TEXT,
      status: DataTypes.ENUM("approved", "waiting", "canceled"),
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
