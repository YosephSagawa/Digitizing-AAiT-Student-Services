import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import AAU_Logo from "../assets/AAU_Logo.png";

const LoginForm = () => {
  const validationSchema = Yup.object({
    userName: Yup.string()
      .required("Username is required.")
      .min(5, "Username must be at least 5 characters long."),
    password: Yup.string()
      .required("Password is required.")
      .min(8, "Password must be at least 8 characters long."),
  });

  return (
    <Formik
      initialValues={{ userName: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {() => (
        <Form className="flex flex-col ">
          <Field
            type="text"
            name="userName"
            placeholder="Username"
            className="border border-gray-400 p-2 mt-5 w-[70vw] sm:w-[22vw] text-[10px]"
          />
          <ErrorMessage
            name="userName"
            component="div"
            className="text-[14px] text-[red] mt-1 "
          />
          <Field
            type="password"
            name="password"
            placeholder="Password"
            className="border border-gray-400 p-2 mt-5 w-[70vw] sm:w-[22vw] text-[10px]"
          />
          <ErrorMessage
            name="password"
            component="div"
            className="text-[14px] text-[red] mt-1 "
          />
          <button
            type="submit"
            className="bg-[#96B85C] text-white py-2 mt-5 w-[70vw] sm:w-[22vw]"
          >
            Continue
          </button>
        </Form>
      )}
    </Formik>
  );
};

const LoginPage = () => {
  return (
    <div className="flex flex-col">
      <div
        className={`flex flex-col items-center justify-center box-border bg-login-bg bg-gray-200 text-center mx-auto w-[100vw] h-[100vh] sm:w-auto sm:h-auto sm:bg-none sm:bg-transparent `}
      >
        <header>
          <img
            src={AAU_Logo}
            alt="Ayzon Foundation Logo"
            className="p-8 block"
          />
        </header>
        <img src={AAU_Logo} alt="AAU Logo" className="p-8 block sm:hidden" />
        <h1 className="text-[20px] pt-5">Login</h1>
        <LoginForm className="flex flex-col" />
      </div>
    </div>
  );
};

export default LoginPage;
