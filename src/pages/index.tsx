import { useRouter } from "next/router";

import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DotsVerticalIcon,
  SearchIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useState, useRef } from "react";
import clickOutside from "@/hooks/clickOutside";

const Index = () => {
  const router = useRouter();

  const [inputSearchTag, setInputSearchTag] = useState("");
  const [searchTags, setSearchTags] = useState([
    {
      label: "Python",
      selected: false,
    },
    {
      label: "Javascript",
      selected: false,
    },
    {
      label: "Ruby",
      selected: false,
    },
    {
      label: "JAVA",
      selected: false,
    },
    {
      label: "ASP.Net",
      selected: false,
    },
    {
      label: "C++",
      selected: false,
    },
    {
      label: "SQL",
      selected: false,
    },
    {
      label: "HTML",
      selected: false,
    },
  ]);

  const [dropdowntagsIsOpen, setDropdowntagsIsOpen] = useState(false);
  const dropdownTagsWrapperRef = useRef(null);

  const [dropdownSearchIsOpen, setDropdownSearchIsOpen] = useState(false);
  const dropdownSearchWrapperRef = useRef(null);

  clickOutside(dropdownTagsWrapperRef, () => setDropdowntagsIsOpen(false));
  clickOutside(dropdownSearchWrapperRef, () => setDropdownSearchIsOpen(false));

  const handleSearchTags = (tag: string) => {
    const newTags = searchTags.map((t) => {
      if (t.label === tag) {
        return { ...t, selected: !t.selected };
      }
      return t;
    });
    setSearchTags(newTags);
    setInputSearchTag("");
    // setIsOpen(false);
  };

  return (
    <Main
      meta={
        <Meta
          title="Next.js Boilerplate Presentation"
          description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
        />
      }
    >
      <div className="w-full max-w-lg mx-auto p-5 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </span>

          <input
            type="text"
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
            placeholder="Search"
          />
        </div>

        <div>
          <div ref={dropdownTagsWrapperRef} className="flex flex-col items-center relative">
            <div className="w-full ">
              <div className="my-2 p-1 flex border border-gray-200 bg-white rounded">
                <div className="flex flex-auto flex-wrap">
                  {searchTags
                    .filter((tag) => tag.selected)
                    .map((tag) => (
                      <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-teal-700 bg-teal-100 border border-teal-300 ">
                        <div className="text-xs font-normal leading-none max-w-full flex-initial">
                          {tag.label}
                        </div>
                        <div className="flex flex-auto flex-row-reverse">
                          <div>
                            <XIcon
                              className="cursor-pointer hover:text-teal-400 rounded-full w-4 h-4 ml-2"
                              onClick={() => handleSearchTags(tag.label)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  <div className="flex-1">
                    <input
                      placeholder=""
                      className="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800"
                      value={inputSearchTag}
                      onChange={(e) => {
                        setInputSearchTag(e.target.value);
                        if (e.target.value !== "") {
                          setDropdowntagsIsOpen(true);
                        } else {
                          setDropdowntagsIsOpen(false);
                        }
                      }}
                    />
                  </div>
                </div>
                <div
                  className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200"
                  onClick={() => setDropdowntagsIsOpen(!dropdowntagsIsOpen)}
                >
                  <button className="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none">
                    {dropdowntagsIsOpen ? (
                      <ChevronUpIcon className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {dropdowntagsIsOpen && (
              <div className="absolute shadow top-full bg-white z-40 w-full lef-0 rounded max-h-select overflow-y-auto">
                <div className="flex flex-col w-full">
                  {searchTags
                    .filter(
                      (tag) =>
                        inputSearchTag === "" ||
                        tag.label
                          .toLowerCase()
                          .includes(inputSearchTag.toLowerCase())
                    )
                    .map((tag) => (
                      <div
                        className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-teal-100"
                        onClick={() => handleSearchTags(tag.label)}
                      >
                        <div
                          className={`flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative ${
                            tag.selected
                              ? "border-teal-600"
                              : "hover:border-teal-100"
                          }`}
                        >
                          {/* border-teal-600 */}
                          <div className="w-full items-center flex">
                            <div className="mx-2 leading-6  ">{tag.label}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full gap-2">
          <button className="w-full bg-slate-200 hover:bg-slate-300 text-gray-600 text-sm py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Open in IFrames
          </button>

          <div ref={dropdownSearchWrapperRef} className="relative inline-block">
            <button
              onClick={() => setDropdownSearchIsOpen(!dropdownSearchIsOpen)}
              className="h-full bg-slate-200 hover:bg-slate-300 text-gray-600 text-sm py-2 px-3 rounded focus:outline-none focus:shadow-outline"
            >
              <DotsVerticalIcon className="w-4 h-4 text-gray-600" />
            </button>

            <div
              className={
                `absolute right-0 z-20 w-56 py-2 mt-2 overflow-hidden bg-white rounded-md shadow-xl dark:bg-gray-800 ` +
                (dropdownSearchIsOpen ? "" : "hidden")
              }
            >
              <a
                href="#"
                className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                {/* <UserIcon className="w-5 h-5 mx-1" /> */}

                <span className="mx-1"> view profile </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Index;
