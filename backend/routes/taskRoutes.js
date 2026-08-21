const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const upload = require(
  "../middleware/uploadMiddleware"
);

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require(
  "../controllers/taskController"
);


router
  .route("/")
  .get(protect, getTasks)
  .post(
    protect,
    upload.single("file"),
    createTask
  );


router
  .route("/:id")
  .get(
    protect,
    getTaskById
  )
  .put(
    protect,
    upload.single("file"),
    updateTask
  )
  .delete(
    protect,
    deleteTask
  );


module.exports = router;
