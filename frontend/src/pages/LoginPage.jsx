import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import API from "../services/api";

import {
  useAuth,
} from "../context/AuthContext";


const LoginPage = () => {

  const navigate =
    useNavigate();

  const {
    login,
  } = useAuth();


  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });


  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleChange = (
    e
  ) => {

    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };


  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    setError("");

    setLoading(true);


    try {

      const response =
        await API.post(
          "/auth/login",
          formData
        );


      login(
        response.data.user,
        response.data.token
      );


      navigate("/dashboard");

    } catch (error) {

      setError(
        error.response?.data
          ?.message ||
          "Login failed"
      );

    } finally {

      setLoading(false);

    }

  };


  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-6 sm:p-8">

        <h1 className="text-2xl font-bold">
          Welcome Back
        </h1>

        <p className="text-slate-500 mt-1">
          Login to manage your tasks.
        </p>


        {error && (
          <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}


        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />


          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />


          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        <p className="text-center text-sm mt-6">

          Don't have an account?

          <Link
            to="/register"
            className="text-indigo-600 ml-1 font-medium"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
};


export default LoginPage;
