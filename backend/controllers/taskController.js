const Task = require("../models/Task");

const {
  getWeatherByCity,
} = require("../utils/weatherService");

const {
  sendTaskCreatedEmail,
  sendTaskCompletedEmail,
} = require("../utils/emailService");


// GET ALL TASKS

const getTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      search,
      startDate,
      endDate,
    } = req.query;

    const query = {
      user: req.user._id,
    };

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (startDate || endDate) {
      query.dueDate = {};

      if (startDate) {
        query.dueDate.$gte =
          new Date(startDate);
      }

      if (endDate) {
        query.dueDate.$lte =
          new Date(endDate);
      }
    }

    const numericPage = Math.max(
      Number(page) || 1,
      1
    );

    const numericLimit = Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );

    const skip =
      (numericPage - 1) *
      numericLimit;

    const [tasks, total] =
      await Promise.all([
        Task.find(query)
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(numericLimit),

        Task.countDocuments(query),
      ]);

    res.json({
      data: tasks,

      meta: {
        total,
        page: numericPage,
        limit: numericLimit,

        lastPage: Math.max(
          Math.ceil(
            total / numericLimit
          ),
          1
        ),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET SINGLE TASK

const getTaskById = async (
  req,
  res
) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// CREATE TASK

const createTask = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      location,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    let weather = null;

    if (location) {
      weather =
        await getWeatherByCity(
          location
        );
    }

    const task =
      await Task.create({
        user: req.user._id,

        title,

        description:
          description || "",

        status:
          status || "PENDING",

        priority:
          priority || "MEDIUM",

        dueDate:
          dueDate || null,

        location:
          location || "",

        fileUrl:
          req.file
            ? req.file.path
            : "",

        weather,
      });

    await sendTaskCreatedEmail(
      req.user,
      task
    );

    res.status(201).json({
      message:
        "Task created successfully",

      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE TASK

const updateTask = async (
  req,
  res
) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const oldStatus =
      task.status;

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      location,
    } = req.body;

    if (title !== undefined) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description =
        description;
    }

    if (status !== undefined) {
      task.status = status;
    }

    if (priority !== undefined) {
      task.priority = priority;
    }

    if (dueDate !== undefined) {
      task.dueDate =
        dueDate || null;
    }

    if (location !== undefined) {
      task.location = location;

      task.weather =
        await getWeatherByCity(
          location
        );
    }

    if (req.file) {
      task.fileUrl =
        req.file.path;
    }

    await task.save();

    if (
      oldStatus !== "DONE" &&
      task.status === "DONE"
    ) {
      await sendTaskCompletedEmail(
        req.user,
        task
      );
    }

    res.json({
      message:
        "Task updated successfully",

      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// DELETE TASK

const deleteTask = async (
  req,
  res
) => {
  try {
    const task =
      await Task.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message:
        "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
