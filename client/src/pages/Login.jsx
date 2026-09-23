import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Header from "../components/Header";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import { useForm } from "react-hook-form";


export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);

const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting }, } = useForm({ defaultValues: { username: "", email: "", password: "", }, });


  const handleAuth = async (formData) => {
   
   

    try {
      const url = isLogin ? "/auth/login" : "/auth/register";
      const response = await API.post(url, formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      dispatch(loginSuccess(response.data.user));
      navigate("/");
    } catch (err) {
      setError("root.serverError", { type: "server", message: err.response?.data?.msg || "An error occurred", }); }
    
  };

  const handleModeChange = (loginMode) => { 
    setIsLogin(loginMode);
     // Clear previous validation/server errors 
      reset(); 
    };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className=" bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-3 md:mx-0">
          <h1 className="text-3xl font-bold mb-6 text-center">
            📈 Trading Journal
          </h1>

          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => handleModeChange(true)}
              className={`flex-1 py-2 rounded font-semibold transition ${
                isLogin
                  ? "bg-emerald-400 text-black"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleModeChange(false)}
              className={`flex-1 py-2 rounded font-semibold transition ${
                !isLogin
                  ? "bg-emerald-400 text-black"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit(handleAuth)} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Username"
                  {
                    ...register("username" , {
                        required : "Username is required"
                    })
                  }
                />
                {errors.username && ( <p className="text-red-600 text-sm mt-1"> {errors.username.message} </p> )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
            
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Email"
                {
                    ...register("email" , {
                        required : "Email is required "
                    })
                }
              />
                {errors.email && ( <p className="text-red-600 text-sm mt-1"> {errors.email.message} </p> )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
             
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Password"
                {...register("password" , {
                    required : "Password is required"
                })}
              />
                {errors.password && ( <p className="text-red-600 text-sm mt-1"> {errors.password.message} </p> )}
            </div>

            {/* Server error */} 
            {errors.root?.serverError && ( <p className="text-red-600 text-sm"> {errors.root.serverError.message} </p> )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-400 hover:bg-emerald-300 text-black font-semibold py-2 px-4 rounded transition"
            >
              {isSubmitting ? "Processing..." : isLogin ? "Login" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
