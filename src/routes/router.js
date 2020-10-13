const express = require("express");
const router = express.Router();

const { auth, authAdmin } = require("../middleware/authentication");
const { upload } = require("../middleware/uploadFile");
const { register: registration, login } = require("../controllers/auth");
const { getAllUsers, deleteUser } = require("../controllers/user");
const {
  getAllCategories,
  getDetailCategory,
  addCategory,
  editCategory,
  deleteCategory,
} = require("../controllers/category");
const {
  getAllBooks,
  addBook,
  detailBook,
  editBook,
  deleteBook,
} = require("../controllers/book");
const {
  addToMyLibraries,
  getAllMyLibrary,
  deleteItemLibrary,
} = require("../controllers/mylibrary");

router.post("/register", registration);
router.post("/login", login);
router.get("/users", auth, getAllUsers);
router.delete("/user/:id", auth, deleteUser);

router.get("/categories", auth, getAllCategories);
router.get("/category/:id", auth, getDetailCategory);
router.post("/category", auth, authAdmin, addCategory);
router.patch("/category/:id", auth, authAdmin, editCategory);
router.delete("/category/:id", auth, authAdmin, deleteCategory);

router.get("/books", auth, getAllBooks);
router.post("/book", auth, upload.single("file"), addBook);
router.get("/book/:id", auth, detailBook);
router.patch("/book/:id", auth, authAdmin, editBook);
router.delete("/book/:id", auth, authAdmin, deleteBook);

router.post("/mylibrary/:id", auth, addToMyLibraries);
router.get("/mylibraries", auth, getAllMyLibrary);
router.delete("/mylibrary/:id", auth, deleteItemLibrary);

module.exports = router;
