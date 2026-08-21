const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendTaskCreatedEmail = async (user, task) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,

      subject: "Task Created Successfully",

      html: `
        <h2>Hello ${user.name}</h2>

        <p>Your task has been created successfully.</p>

        <h3>${task.title}</h3>

        <p>Status: ${task.status}</p>

        <p>Priority: ${task.priority}</p>
      `,
    });
  } catch (error) {
    console.error(
      "Email sending error:",
      error.message
    );
  }
};

const sendTaskCompletedEmail = async (user, task) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,

      subject: "Task Completed Successfully 🎉",

      html: `
        <h2>Congratulations ${user.name}!</h2>

        <p>You completed the following task:</p>

        <h3>${task.title}</h3>

        <p>Status: DONE</p>
      `,
    });
  } catch (error) {
    console.error(
      "Email sending error:",
      error.message
    );
  }
};

module.exports = {
  sendTaskCreatedEmail,
  sendTaskCompletedEmail,
};
