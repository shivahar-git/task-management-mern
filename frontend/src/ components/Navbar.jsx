import {
  CheckSquare,
  LogOut,
} from "lucide-react";

import {
  useAuth,
} from "../context/AuthContext";


const Navbar = () => {
  const {
    user,
    logout,
  } = useAuth();


  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 text-white rounded-lg">
            <CheckSquare size={20} />
          </div>

          <h1 className="font-bold text-lg sm:text-xl">
            TaskFlow
          </h1>
        </div>


        <div className="flex items-center gap-3">

          <span className="hidden sm:block text-sm text-slate-600">
            Hi, {user?.name}
          </span>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition"
          >
            <LogOut size={18} />

            <span className="hidden sm:inline">
              Logout
            </span>
          </button>

        </div>

      </div>
    </nav>
  );
};


export default Navbar;
