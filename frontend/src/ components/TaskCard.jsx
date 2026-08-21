import {
  Calendar,
  MapPin,
  Paperclip,
  Pencil,
  Trash2,
} from "lucide-react";

import WeatherBadge from "./WeatherBadge";


const TaskCard = ({
  task,
  onEdit,
  onDelete,
}) => {

  const statusStyles = {
    PENDING:
      "bg-yellow-100 text-yellow-700",

    IN_PROGRESS:
      "bg-blue-100 text-blue-700",

    DONE:
      "bg-green-100 text-green-700",
  };


  const priorityStyles = {
    LOW:
      "bg-slate-100 text-slate-600",

    MEDIUM:
      "bg-orange-100 text-orange-700",

    HIGH:
      "bg-red-100 text-red-700",
  };


  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition">

      <div className="flex justify-between gap-4">

        <div className="min-w-0">

          <h3 className="font-semibold text-slate-900 text-lg truncate">
            {task.title}
          </h3>


          {task.description && (
            <p className="text-sm text-slate-600 mt-2">
              {task.description}
            </p>
          )}

        </div>


        <div className="flex gap-1">

          <button
            onClick={() =>
              onEdit(task)
            }
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <Pencil size={17} />
          </button>


          <button
            onClick={() =>
              onDelete(task._id)
            }
            className="p-2 hover:bg-red-50 text-red-500 rounded-lg"
          >
            <Trash2 size={17} />
          </button>

        </div>

      </div>


      <div className="flex flex-wrap gap-2 mt-4">

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[task.status]}`}
        >
          {task.status}
        </span>


        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityStyles[task.priority]}`}
        >
          {task.priority}
        </span>


        <WeatherBadge
          weather={task.weather}
        />

      </div>


      <div className="flex flex-wrap gap-3 mt-4 text-xs text-slate-500">

        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar size={14} />

            {new Date(
              task.dueDate
            ).toLocaleDateString()}
          </div>
        )}


        {task.location && (
          <div className="flex items-center gap-1">
            <MapPin size={14} />

            {task.location}
          </div>
        )}


        {task.fileUrl && (
          <a
            href={task.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-600 hover:underline"
          >
            <Paperclip size={14} />

            Attachment
          </a>
        )}

      </div>

    </div>
  );
};


export default TaskCard;
