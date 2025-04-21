import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import AAU_Logo from "../assets/AAU_Logo.png";

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    userName: Yup.string()
      .required("Username is required.")
      .min(5, "Username must be at least 5 characters long."),
    password: Yup.string()
      .required("Password is required.")
      .min(8, "Password must be at least 8 characters long."),
  });

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login/",
        {
          username: values.userName,
          password: values.password,
        }
      );

      const { access, refresh, role } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user_role", role);

      // Redirect based on role
      if (role === "student") navigate("/dashboard/student");
      else if (role === "instructor") navigate("/dashboard/lecturer");
      else if (role === "proctor") navigate("/dashboard/proctor");
      else navigate("/"); // fallback
    } catch (error) {
      setErrors({
        password: "Invalid username or password.",
      });
    } finally {
      setSubmitting(false);
      console.log("Login submitted:", response.data);
    }
  };

  return (
    <Formik
      initialValues={{ userName: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleLogin}
    >
      {({ isSubmitting, handleChange, values }) => (
        <Form className="flex flex-col">
          <Field
            type="text"
            name="userName"
            placeholder="Username"
            className="border border-gray-400 p-2 mt-5 w-[70vw] sm:w-[22vw] text-[10px]"
          />
          <ErrorMessage
            name="userName"
            component="div"
            className="text-[14px] text-[red] mt-1"
          />
          {/* <Field
            type="password"
            name="password"
            placeholder="Password"
            className="border border-gray-400 p-2 mt-5 w-[70vw] sm:w-[22vw] text-[10px]"
          /> */}
          {/* Custom password field with toggle */}
          <div className="relative mt-5 w-[70vw] sm:w-[22vw]">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              className="border border-gray-400 p-2 w-full text-[10px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              {showPassword ? (
                <AiFillEyeInvisible size={18} />
              ) : (
                <AiFillEye size={18} />
              )}
            </button>
          </div>
          <ErrorMessage
            name="password"
            component="div"
            className="text-[14px] text-[red] mt-1"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#96B85C] text-white py-2 mt-5 w-[70vw] sm:w-[22vw]"
          >
            {isSubmitting ? "Logging in..." : "Continue"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

const LoginPage = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center box-border bg-login-bg bg-gray-200 text-center mx-auto w-[100vw] h-[100vh] sm:w-auto sm:h-auto sm:bg-none sm:bg-transparent">
        <header>
          <img
            src={AAU_Logo}
            alt="Ayzon Foundation Logo"
            className="p-8 block"
          />
        </header>
        <img src={AAU_Logo} alt="AAU Logo" className="p-8 block sm:hidden" />
        <h1 className="text-[20px] pt-5">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
