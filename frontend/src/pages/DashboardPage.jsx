import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import API from "../services/api";

import Navbar from "../components/Navbar";

import TaskCard from "../components/TaskCard";

import TaskFormModal from "../components/TaskFormModal";


const DashboardPage = () => {

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState(null);


  const [filters, setFilters] =
    useState({
      search: "",
      status: "",
      priority: "",
      page: 1,
      limit: 6,
    });


  const [meta, setMeta] =
    useState({
      page: 1,
      lastPage: 1,
      total: 0,
    });


  const fetchTasks = async () => {

    try {

      setLoading(true);

      const params =
        new URLSearchParams();


      Object.entries(filters).forEach(
        ([key, value]) => {

          if (
            value !== ""
          ) {

            params.append(
              key,
              value
            );
          }

        }
      );


      const response =
        await API.get(
          `/tasks?${params.toString()}`
        );


      setTasks(
        response.data.data
      );

      setMeta(
        response.data.meta
      );

      setError("");

    } catch (error) {

      setError(
        error.response?.data
          ?.message ||
          "Failed to load tasks"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    const timer =
      setTimeout(() => {
        fetchTasks();
      }, 300);


    return () =>
      clearTimeout(timer);

  }, [
    filters.search,
    filters.status,
    filters.priority,
    filters.page,
  ]);


  const handleFilterChange = (
    e
  ) => {

    setFilters({
      ...filters,

      [e.target.name]:
        e.target.value,

      page: 1,
    });
  };


  const handleCreateOrUpdate =
    async (formData) => {

      try {

        if (editingTask) {

          await API.put(
            `/tasks/${editingTask._id}`,
            formData
          );

        } else {

          await API.post(
            "/tasks",
            formData
          );

        }


        setShowModal(false);

        setEditingTask(null);

        fetchTasks();

      } catch (error) {

        alert(
          error.response?.data
            ?.message ||
            "Operation failed"
        );

      }

    };


  const handleEdit = (
    task
  ) => {

    setEditingTask(task);

    setShowModal(true);

  };


  const handleDelete = async (
    id
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this task?"
      );


    if (!confirmed) {
      return;
    }


    try {

      await API.delete(
        `/tasks/${id}`
      );

      fetchTasks();

    } catch (error) {

      alert(
        error.response?.data
          ?.message ||
          "Failed to delete task"
      );

    }

  };


  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar />


      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">


        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

          <div>

            <h1 className="text-2xl sm:text-3xl font-bold">
              My Tasks
            </h1>

            <p className="text-slate-500 mt-1">
              {meta.total} tasks in total
            </p>

          </div>


          <button
            onClick={() => {
              setEditingTask(null);
              setShowModal(true);
            }}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium"
          >
            <Plus size={19} />

            New Task
          </button>

        </div>


        <div className="bg-white border rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">

          <div className="relative sm:col-span-1">

            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search tasks..."
              className="w-full border rounded-lg pl-10 pr-3 py-2.5"
            />

          </div>


          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2.5"
          >

            <option value="">
              All Status
            </option>

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


          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2.5"
          >

            <option value="">
              All Priorities
            </option>

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


        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-5">
            {error}
          </div>
        )}


        {loading ? (

          <div className="text-center py-16 text-slate-500">
            Loading tasks...
          </div>

        ) : tasks.length === 0 ? (

          <div className="bg-white border rounded-xl p-10 text-center">

            <h2 className="font-semibold text-lg">
              No tasks found
            </h2>

            <p className="text-slate-500 mt-2">
              Create your first task to get started.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {tasks.map(
              (task) => (

                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />

              )
            )}

          </div>

        )}


        <div className="flex justify-center items-center gap-4 mt-8">

          <button
            disabled={meta.page <= 1}
            onClick={() =>
              setFilters({
                ...filters,
                page:
                  filters.page - 1,
              })
            }
            className="p-2 border rounded-lg disabled:opacity-40"
          >
            <ChevronLeft size={20} />
          </button>


          <span className="text-sm">
            Page {meta.page} of{" "}
            {meta.lastPage}
          </span>


          <button
            disabled={
              meta.page >=
              meta.lastPage
            }
            onClick={() =>
              setFilters({
                ...filters,
                page:
                  filters.page + 1,
              })
            }
            className="p-2 border rounded-lg disabled:opacity-40"
          >
            <ChevronRight size={20} />
          </button>

        </div>

      </main>


      {showModal && (

        <TaskFormModal
          task={editingTask}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          onSubmit={
            handleCreateOrUpdate
          }
        />

      )}

    </div>
  );
};


export default DashboardPage;
