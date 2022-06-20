import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { GetServerSideProps, NextPage } from "next";
import { getCsrfToken, getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

type ISignUpProps = {
  csrfToken: string;
};

const SignUp: NextPage<ISignUpProps> = ({ csrfToken }) => {
  const [formInputs, setFormInputs] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorName, setErrorName] = useState({
    message: "",
    isVisible: false,
  });
  const [errorEmail, setErrorEmail] = useState({
    message: "",
    isVisible: false,
  });
  const [errorPassword, setErrorPassword] = useState({
    message: "",
    isVisible: false,
  });
  const [errorConfirmPassword, setErrorConfirmPassword] = useState({
    message: "",
    isVisible: false,
  });

  const [error, setError] = useState<string | null>("");
  const [errorIsVisible, setErrorIsVisible] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formInputs;
    let errorFlag = false;

    if (password.length < 8) {
      setErrorPassword({
        message: "Password must be at least 8 characters",
        isVisible: true,
      });
      errorFlag = true;
    } else if (password !== confirmPassword) {
      setErrorConfirmPassword({
        message: "Passwords do not match",
        isVisible: true,
      });
      setErrorPassword({
        message: "Passwords do not match",
        isVisible: true,
      });
      errorFlag = true;
    } else {
      setErrorConfirmPassword({
        message: "",
        isVisible: false,
      });
      setErrorPassword({
        message: "",
        isVisible: false,
      });
    }

    if (name.length < 3) {
      setErrorName({
        message: "Name must be at least 3 characters",
        isVisible: true,
      });
      errorFlag = true;
    } else {
      setErrorName({
        message: "",
        isVisible: false,
      });
    }

    if (!email.includes("@")) {
      setErrorEmail({
        message: "Email must contain an @",
        isVisible: true,
      });
      errorFlag = true;
    } else {
      setErrorEmail({
        message: "",
        isVisible: false,
      });
    }

    if (errorFlag) {
      return;
    }

    // if all is good, submit form
    const form = e.currentTarget;
    const formData = new FormData(form);
    // @ts-ignore
    const formDataObj = Object.fromEntries([...new FormData(form).entries()]);

    // submit form
    fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(formDataObj),
    })
      .then(async (res) => {
        if (res.status === 201) {
          // redirect to login page
          await signIn("credentials", { email, password, callbackUrl: "/" });
        } else {
          // display error
          const response = await res.json();
          setError(response.message);
          setErrorIsVisible(true);
        }
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormInputs({ ...formInputs, [name]: value });
  };

  return (
    <Main
      meta={
        <Meta
          title="AIO Search - Sign Up"
          description="Sign up to AIO Search"
        />
      }
    >
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="px-6 py-4">
          <p className="mt-1 text-center text-gray-500 dark:text-gray-400">
            Login or create account
          </p>

          {errorIsVisible && (
            <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="flex items-center justify-center w-12 bg-red-500">
                <svg
                  className="w-6 h-6 text-white fill-current"
                  viewBox="0 0 40 40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
                </svg>
              </div>

              <div className="px-4 py-2 -mx-3 w-full">
                <div className="mx-3">
                  <span className="font-semibold text-red-500 dark:text-red-400">
                    Error
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    {error}
                  </p>
                </div>
              </div>

              <button
                className="p-1 transition-colors duration-200 transform rounded-md hover:bg-opacity-25 hover:bg-gray-600 focus:outline-none"
                onClick={() => setErrorIsVisible(false)}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18L18 6M6 6L18 18"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}

          <form method="post" action="/api/auth/signup" onSubmit={handleSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

            <div className="w-full mt-4">
              <input
                className={
                  `block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300` +
                  (errorName.isVisible ? " border-red-500" : "")
                }
                type="text"
                name="name"
                value={formInputs.name}
                onChange={handleChange}
                placeholder="Username"
                aria-label="usernmae"
              />
              {errorName.isVisible && (
                <p className="text-red-500 text-xs italic">
                  {errorName.message}
                </p>
              )}
            </div>

            <div className="w-full mt-4">
              <input
                className={
                  `block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300` +
                  (errorEmail.isVisible ? " border-red-500" : "")
                }
                type="email"
                name="email"
                value={formInputs.email}
                onChange={handleChange}
                placeholder="Email Address"
                aria-label="Email Address"
              />
              {errorEmail.isVisible && (
                <p className="text-red-500 text-xs italic">
                  {errorEmail.message}
                </p>
              )}
            </div>

            <div className="w-full mt-4">
              <input
                className={
                  `block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300` +
                  (errorPassword.isVisible ? " border-red-500" : "")
                }
                type="password"
                name="password"
                value={formInputs.password}
                onChange={handleChange}
                placeholder="Password"
                aria-label="Password"
              />
              {errorPassword.isVisible && (
                <p className="text-red-500 text-xs italic">
                  {errorPassword.message}
                </p>
              )}
            </div>

            <div className="w-full mt-4">
              <input
                className={
                  `block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300` +
                  (errorConfirmPassword.isVisible ? " border-red-500" : "")
                }
                type="password"
                name="confirmPassword"
                value={formInputs.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                aria-label="Confirm Password"
              />
              {errorConfirmPassword.isVisible && (
                <p className="text-red-500 text-xs italic">
                  {errorConfirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                className="px-4 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded hover:bg-gray-600 focus:outline-none"
                type="submit"
              >
                Register
              </button>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-center py-4 text-center bg-gray-50 dark:bg-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-200">
            Already have an account?
          </span>

          <Link href={"/auth"}>
            <a className="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline">
              Login
            </a>
          </Link>
        </div>
      </div>
    </Main>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      csrfToken: await getCsrfToken(ctx),
    },
  };
};

export default SignUp;
