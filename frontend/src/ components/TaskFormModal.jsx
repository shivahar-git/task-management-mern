import {
  useEffect,
  useState,
} from "react";

import {
  X,
} from "lucide-react";


const TaskFormModal = ({
  task,
  onClose,
  onSubmit,
}) => {

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      status: "PENDING",
      priority: "MEDIUM",
      dueDate: "",
      location: "",
      file: null,
    });


  useEffect(() => {

    if (task) {
      setFormData({
        title:
          task.title || "",

        description:
          task.description || "",

        status:
          task.status || "PENDING",

        priority:
          task.priority || "MEDIUM",

        dueDate:
          task.dueDate
            ? task.dueDate
                .split("T")[0]
            : "",

        location:
          task.location || "",

        file: null,
      });
    }

  }, [task]);


  const handleChange = (
    e
  ) => {

    const {
      name,
      value,
      files,
    } = e.target;


    setFormData({
      ...formData,

      [name]:
        files
          ? files[0]
          : value,
    });
  };


  const handleSubmit = (
    e
  ) => {

    e.preventDefault();

    const data =
      new FormData();


    Object.keys(formData).forEach(
      (key) => {

        if (
          formData[key] !== null &&
          formData[key] !== ""
        ) {

          if (key === "file") {
            data.append(
              "file",
              formData[key]
            );
          } else {
            data.append(
              key,
              formData[key]
            );
          }

        }
      }
    );


    onSubmit(data);
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">

      <div className="bg-white w-full sm:max-w-lg sm:rounded-xl rounded-t-2xl max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center p-5 border-b">

          <h2 className="font-bold text-lg">
            {task
              ? "Edit Task"
              : "Create New Task"}
          </h2>


          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <X size={20} />
          </button>

        </div>


        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-4"
        >

          <div>

            <label className="block text-sm font-medium mb-1">
              Title *
            </label>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>


          <div>

            <label className="block text-sm font-medium mb-1">
              Description
            </label>

            <textarea
              name="description"
              value={
                formData.description
              }
              onChange={handleChange}
              rows="4"
              className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>


          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-medium mb-1">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2.5"
              >
                <option value="PENDING">
                  Pending
                </option>

                <option value="IN_PROGRESS">
                  In Progress
                </option>

                <option value="DONE">
                  Done
                </option>

              </select>

            </div>


            <div>

              <label className="block text-sm font-medium mb-1">
                Priority
              </label>

              <select
                name="priority"
                value={
                  formData.priority
                }
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2.5"
              >
                <option value="LOW">
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>

              </select>

            </div>

          </div>


          <div>

            <label className="block text-sm font-medium mb-1">
              Due Date
            </label>

            <input
              type="date"
              name="dueDate"
              value={
                formData.dueDate
              }
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2.5"
            />

          </div>


          <div>

            <label className="block text-sm font-medium mb-1">
              Location
            </label>

            <input
              name="location"
              placeholder="Example: Hyderabad"
              value={
                formData.location
              }
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2.5"
            />

          </div>


          <div>

            <label className="block text-sm font-medium mb-1">
              Attachment
            </label>

            <input
              type="file"
              name="file"
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>


          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg"
          >
            {task
              ? "Update Task"
              : "Create Task"}
          </button>

        </form>

      </div>

    </div>
  );
};


export default TaskFormModal;
