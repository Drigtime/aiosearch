import Link from "next/link";
import { LegacyRef, ReactNode, useEffect, useRef, useState } from "react";

import {
  ChevronDownIcon,
  CogIcon,
  LogoutIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import clickOutside from "@/hooks/clickOutside";

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const wrapperRef = useRef(null);
  clickOutside(wrapperRef, () => setIsOpen(false));

  return (
    <div className="w-full px-1 text-gray-700 antialiased">
      {props.meta}

      <header className="flex justify-between p-3 max-w-7xl mx-auto">
        <div className="flex items-center space-x-5">
          <Link href="/">
            <a className="text-2xl text-center text-gray-700 dark:text-white">
              AIO Search
            </a>
          </Link>
        </div>
        <div className="flex items-center space-x-5">
          {session && session.user ? (
            <>
              <div ref={wrapperRef} className="relative inline-block">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="relative z-10 flex items-center p-2 text-sm text-gray-600 bg-white border border-transparent rounded-md focus:border-blue-500 focus:ring-opacity-40 dark:focus:ring-opacity-40 focus:ring-blue-300 dark:focus:ring-blue-400 focus:ring dark:text-white dark:bg-gray-800 focus:outline-none"
                >
                  <span className="mx-1">{session.user.name}</span>
                  <ChevronDownIcon className="h-3 w-3" />
                </button>

                <div
                  className={
                    `absolute right-0 z-20 w-56 py-2 mt-2 overflow-hidden bg-white rounded-md shadow-xl dark:bg-gray-800 ` +
                    (isOpen ? "" : "hidden")
                  }
                >
                  <a
                    href="#"
                    className="flex items-center p-3 -mt-2 text-sm text-gray-600 transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <UserCircleIcon className="w-10 h-10 mx-1" />
                    <div className="mx-1">
                      <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {session.user.name}
                      </h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {session.user.email}
                      </p>
                    </div>
                  </a>

                  <hr className="border-gray-200 dark:border-gray-700 " />

                  <a
                    href="#"
                    className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <UserIcon className="w-5 h-5 mx-1" />

                    <span className="mx-1"> view profile </span>
                  </a>

                  <a
                    href="#"
                    className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <CogIcon className="w-5 h-5 mx-1" />

                    <span className="mx-1"> Settings </span>
                  </a>

                  <hr className="border-gray-200 dark:border-gray-700 " />

                  <a
                    href="#"
                    className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                    onClick={() => signOut()}
                  >
                    <LogoutIcon className="w-5 h-5 mx-1" />

                    <span className="mx-1"> Sign Out </span>
                  </a>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth">
                <a className="px-4 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded hover:bg-gray-600 focus:outline-none">
                  Sign In
                </a>
              </Link>
            </>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-screen-md">
        <div className="content py-5">{props.children}</div>
      </div>
    </div>
  );
};

export { Main };
