const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB =
  require("./config/db");

const authRoutes =
  require("./routes/authRoutes");

const taskRoutes =
  require("./routes/taskRoutes");

const {
  notFound,
  errorHandler,
} = require(
  "./middleware/errorMiddleware"
);


dotenv.config();

connectDB();

const app = express();


app.use(
  cors({
    origin: "*",
  })
);

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true,
  })
);


app.get("/", (req, res) => {
  res.json({
    message:
      "Task Management API is running",
  });
});


app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/tasks",
  taskRoutes
);


app.use(notFound);

app.use(errorHandler);


const PORT =
  process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
