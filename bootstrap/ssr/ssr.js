import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useContext, createContext, useRef, useEffect, createElement } from "react";
import { Link, usePage, router, Head, useForm, createInertiaApp } from "@inertiajs/react";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";
import { FiSearch, FiTrash2, FiPlus } from "react-icons/fi";
import { create } from "zustand";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectCoverflow, Thumbs } from "swiper/modules";
import { FaArrowRight } from "react-icons/fa6";
import createServer from "@inertiajs/react/server";
import { FaBars } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { ImWhatsapp } from "react-icons/im";
import { MdOutlineLanguage } from "react-icons/md";
import ReactDOMServer from "react-dom/server";
const Image = ({ src, className }) => {
  return /* @__PURE__ */ jsx("img", { loading: "lazy", src: typeof src == "string" ? src : "", className: `${className}` });
};
const Button = ({
  disable,
  className,
  children,
  clickFunction,
  icon,
  transparent,
  border,
  black,
  dontAddPadding,
  dontAddHoverEffect,
  dontAddShadow
}) => {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      disabled: disable,
      className: `
        ${!dontAddHoverEffect && "hover:scale-105"}
        ${!dontAddShadow && "shadow-md"}
        text-[18px]
        font-semibold
        cursor-pointer
        duration-300
        active:scale-90
        disabled:opacity-60 disabled:cursor-not-allowed
      flex items-center justify-center 
      rounded-md
      ${!dontAddPadding && "px-5 py-2"}
      ${black ? "text-arch-dark" : "text-arch-light"}
      ${border && "border-1 border-arch-accent"}
      ${icon && "gap-2"}
      ${transparent ? "bg-transparent" : "bg-arch-accent"}
      ${className || ""}
    `,
      onClick: clickFunction,
      children: [
        children,
        icon && /* @__PURE__ */ jsx(Image, { className: "w-5 shrink-0 object-contain icon", src: icon })
      ]
    }
  );
};
const SectionTitle = ({ children, className }) => {
  return /* @__PURE__ */ jsx("h2", { className: `${className}`, children });
};
const DashboardToggleLink = ({ btn }) => {
  const [list, setList] = useState(false);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onClick: () => setList((prev) => !prev),
      className: `
        cursor-pointer
        rounded-lg
        font-medium
        text-light
        text-lg
        
      `,
      children: [
        /* @__PURE__ */ jsxs("span", { className: `flex justify-between items-center w-full px-4 py-2 hover:bg-primary 
        rounded-lg duration-300`, children: [
          btn.text,
          /* @__PURE__ */ jsx(
            IoIosArrowDown,
            {
              className: `
            duration-300
            ${list ? "rotate-180" : ""}
          `
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `
          grid
          duration-300
          ${list ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
        `,
            children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: btn.links && btn.links.map((lnk, i) => /* @__PURE__ */ jsx(
              Link,
              {
                href: lnk.link,
                className: "block px-4 py-2 mt-2  rounded-lg text-light bg-light/20",
                children: lnk.text
              },
              i
            )) })
          }
        )
      ]
    }
  );
};
const DashboardSideBar = ({ data }) => {
  const { dashboardSideBarLinks, dashboardSideBarTitle } = data;
  const { url } = usePage();
  const [open, setOpen] = useState(false);
  const { locale } = usePage().props;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        clickFunction: () => setOpen(!open),
        className: `lg:hidden cursor-pointer fixed  top-32 left-1/2  -translate-x-1/2 z-50  shadow-md ${open && "opacity-0!"} `,
        children: locale == "en" ? "Control Panel" : "لوحة التحكم"
      }
    ),
    open && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/40 z-40 lg:hidden",
        onClick: () => setOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs(
      "aside",
      {
        className: `
    pt-32
    lg:sticky
    lg:top-0
    lg:h-[calc(100vh)]
    lg:overflow-y-auto
    lg:w-64
    lg:shrink-0
    max-lg:fixed
    max-lg:top-0
    max-lg:start-0
    max-lg:h-[calc(100vh)]
    max-lg:w-64
    max-lg:overflow-y-auto
    max-lg:z-50
    bg-gradient-to-b 
    from-arch-gray/95 
    via-gray-200 
    to-arch-gray/95
    text-light
    flex
    flex-col
    p-6
    shadow-lg
    transform
    transition-transform
    duration-300
    ${open ? "max-lg:translate-x-0" : "max-lg:-translate-x-full max-lg:rtl:translate-x-full"}
  `,
        children: [
          /* @__PURE__ */ jsx(SectionTitle, { className: "text-2xl font-bold mb-8 border-b border-arch-light pb-2 text-arch-dark", children: dashboardSideBarTitle }),
          /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-3", children: dashboardSideBarLinks.map((btn, i) => btn.link ? /* @__PURE__ */ jsx(
            Link,
            {
              href: btn.link,
              className: `px-4 py-2 rounded-lg hover:text-arch-charcoal transition-colors font-medium text-light text-lg text-arch-dark`,
              onClick: () => setOpen(false),
              children: btn.text
            },
            i
          ) : /* @__PURE__ */ jsx(
            DashboardToggleLink,
            {
              btn
            },
            i
          )) })
        ]
      }
    )
  ] });
};
const DeletePopUp = () => {
  const ctx = useContext(DeleteContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { locale } = usePage().props;
  if (!ctx || !ctx) return null;
  const close = () => {
    ctx.setDeleteState(null);
    setErrorMessage(null);
  };
  const handleDelete = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await axios.delete(`${ctx.deleteState?.url}` || "");
      close();
      router.visit(`${ctx.deleteState?.returnedUrl}` || "");
    } catch (error) {
      if (error.response?.status === 422) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(locale == "en" ? "Something went wrong. Please try again." : "حدث خطأ ما. حاول مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center ", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 bg-black/50",
        onClick: close
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg", children: [
      /* @__PURE__ */ jsx("p", { className: "text-gray-800 text-lg mb-6", children: ctx.deleteState?.message }),
      errorMessage && /* @__PURE__ */ jsx("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 rounded-lg", children: /* @__PURE__ */ jsx("p", { className: "text-red-600 text-sm", children: errorMessage }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: loading,
            onClick: close,
            className: "px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50",
            children: locale == "en" ? "Cancel" : "الغاء"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleDelete,
            disabled: loading,
            className: "px-4 py-2 rounded-lg bg-red-500 text-white disabled:opacity-50",
            children: loading ? locale == "en" ? "Deleting..." : "جاري الحذف...." : locale == "en" ? "Confirm" : "تأكيد"
          }
        )
      ] })
    ] })
  ] });
};
const DeleteContext = createContext(null);
const DashboardLayout = ({ children }) => {
  const { globalData } = usePage().props;
  const [deleteState, setDeleteState] = useState(null);
  return /* @__PURE__ */ jsx(DeleteContext.Provider, { value: { deleteState, setDeleteState }, children: /* @__PURE__ */ jsxs("div", { className: "w-full min-h-screen flex justify-end items-start  ", children: [
    /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
    deleteState != null && /* @__PURE__ */ jsx(DeletePopUp, {}),
    /* @__PURE__ */ jsx(DashboardSideBar, { data: globalData }),
    /* @__PURE__ */ jsx("div", { className: "w-[calc(100%-16rem)] max-lg:w-full", children })
  ] }) });
};
const SearchHeader = ({ placeHolder, searchFields, onSearchModeChange }) => {
  const { locale } = usePage().props;
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const { url } = usePage();
  const currentPath = url.split("?")[0];
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const trimmed = search.trim();
    const debounce = setTimeout(() => {
      if (trimmed !== "") {
        onSearchModeChange?.(true);
        router.get(
          currentPath,
          { search, searchFields: JSON.stringify(searchFields) },
          {
            preserveState: true,
            replace: true,
            preserveScroll: true,
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false)
          }
        );
      } else {
        onSearchModeChange?.(false);
        setLoading(false);
        router.get(
          currentPath,
          {},
          { preserveState: true, replace: true, preserveScroll: true }
        );
      }
    }, 700);
    return () => clearTimeout(debounce);
  }, [search]);
  return /* @__PURE__ */ jsx("div", { className: "mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "relative max-w-md", children: [
    /* @__PURE__ */ jsx("span", { className: "absolute inset-y-0 start-0 flex items-center ps-3", children: /* @__PURE__ */ jsx(FiSearch, { className: "text-gray-400" }) }),
    loading && /* @__PURE__ */ jsx("span", { className: "absolute inset-y-0 end-0 flex items-center pe-3", children: /* @__PURE__ */ jsxs(
      "svg",
      {
        className: "animate-spin h-4 w-4 text-gray-500",
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        children: [
          /* @__PURE__ */ jsx(
            "circle",
            {
              className: "opacity-25",
              cx: "12",
              cy: "12",
              r: "10",
              stroke: "currentColor",
              strokeWidth: "4"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              className: "opacity-75",
              fill: "currentColor",
              d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value: search,
        onChange: (e) => setSearch(e.target.value),
        className: "block w-full ps-10 pe-10 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 focus:outline-none sm:text-sm transition duration-150 ease-in-out",
        placeholder: placeHolder || (locale === "ar" ? "ابحث هنا..." : "Search here...")
      }
    )
  ] }) });
};
const Layer = ({ className }) => {
  return /* @__PURE__ */ jsx("div", { className: `  absolute  ${className}` });
};
const ProjectCard = ({ description, images, name, created_at, isActive, onCLick }) => {
  const project = {
    name,
    description,
    images,
    created_at
  };
  return /* @__PURE__ */ jsxs("div", { onClick: () => onCLick && onCLick({ ...project }), className: `group relative rounded-lg overflow-hidden  
      ${isActive ? "scale-100  " : "scale-90"} cursor-pointer duration-300   `, children: [
    /* @__PURE__ */ jsx(
      Image,
      {
        src: images[0].image,
        className: "w-full h-[28rem] max-mob:h-[22rem] object-cover group-hover:scale-105 duration-500 "
      }
    ),
    /* @__PURE__ */ jsx(
      Layer,
      {
        className: "bg-gradient-to-t from-black/90 via-black/20 to-transparent top-0 left-0 w-full h-full"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 start-3 z-10 max-w-[calc(100%-0.75rem)] ", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "text-yellow-500 text-sm",
          children: created_at
        }
      ),
      /* @__PURE__ */ jsx(
        SectionTitle,
        {
          className: "text-arch-light text-xl leading-3 font-bold",
          children: name
        }
      )
    ] })
  ] });
};
const Pagination = ({ links }) => {
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-2 flex-wrap", children: links.map((link, index) => /* @__PURE__ */ jsx(
    Link,
    {
      preserveScroll: true,
      preserveState: true,
      href: link.url || "",
      dangerouslySetInnerHTML: { __html: link.label },
      className: `
                        px-4 py-2 rounded-xl text-sm font-medium transition-all
                        ${link.active ? "bg-arch-accent text-arch-card" : "bg-arch-card text-arch-dark hover:bg-arch-light"}
                        ${!link.url && "opacity-50 pointer-events-none"}
                    `
    },
    index
  )) });
};
const DashboardProjects = ({ allData }) => {
  const { projects, links, content } = allData;
  const [isSearching, setIsSearching] = useState(false);
  return /* @__PURE__ */ jsx(DashboardLayout, { children: /* @__PURE__ */ jsxs("div", { className: "max-lg:pt-48 py-10 pt-32 px-5", children: [
    /* @__PURE__ */ jsx(
      SearchHeader,
      {
        searchFields: content.searchFields,
        placeHolder: content.searchHeaderPlaceholder,
        onSearchModeChange: setIsSearching
      }
    ),
    !isSearching && /* @__PURE__ */ jsx(
      Link,
      {
        href: content.addButton.link,
        className: "block w-fit  mt-5 mb-10 mx-auto",
        children: /* @__PURE__ */ jsx(Button, { children: content.addButton.text })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 mob:grid-cols-2 tab:grid-cols-3 gap-6 mb-10", children: projects.map((project, i) => /* @__PURE__ */ createElement(ProjectCard, { ...project, key: i })) }),
    /* @__PURE__ */ jsx(Pagination, { links })
  ] }) });
};
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DashboardProjects
}, Symbol.toStringTag, { value: "Module" }));
function ObjectToFormData(obj, formData = new FormData(), parentKey = "") {
  if (obj === null || obj === void 0) {
    if (parentKey) formData.append(parentKey, "");
    return formData;
  }
  if (obj instanceof File) {
    formData.append(parentKey, obj);
    return formData;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      formData.append(`${parentKey}`, "");
    } else {
      obj.forEach((item, index) => {
        ObjectToFormData(item, formData, `${parentKey}[${index}]`);
      });
    }
    return formData;
  }
  if (typeof obj === "object") {
    Object.keys(obj).forEach((key) => {
      const formKey = parentKey ? `${parentKey}[${key}]` : key;
      ObjectToFormData(obj[key], formData, formKey);
    });
    return formData;
  }
  formData.append(parentKey, String(obj));
  return formData;
}
let editorPromise = null;
function SharedCkEditorLoader() {
  if (!editorPromise) {
    editorPromise = import("./assets/CustomizedCkEditor-DswKX_vV.js").then(
      (mod) => mod.default
    );
  }
  return editorPromise;
}
let cachedEditor = null;
let loadingPromise = null;
function useSharedCkEditor() {
  const [Editor, setEditor] = useState(() => cachedEditor);
  useEffect(() => {
    if (cachedEditor) {
      setEditor(() => cachedEditor);
      return;
    }
    if (!loadingPromise) {
      loadingPromise = SharedCkEditorLoader().then((editor) => {
        cachedEditor = editor;
        return editor;
      });
    }
    loadingPromise.then((editor) => {
      setEditor(() => editor);
    });
  }, []);
  return Editor;
}
function LoadingSpinner() {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50000000000000000000 flex items-center justify-center bg-black/50 backdrop-blur-sm", children: /* @__PURE__ */ jsx(
    "div",
    {
      className: "\r\n          w-12 h-12\r\n          border-4\r\n          border-arch-light\r\n          border-t-transparent\r\n          rounded-full\r\n          animate-spin\r\n          shadow-2xl\r\n        "
    }
  ) });
}
const ImageInput = ({ onChange, name, defaultValue }) => {
  const [preview, setPreview] = useState(defaultValue instanceof File ? URL.createObjectURL(defaultValue) : defaultValue || null);
  const { locale } = usePage().props;
  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPreview(null);
    onChange(null);
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs("label", { className: "cursor-pointer w-full ", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          name,
          type: "file",
          hidden: true,
          accept: "image/*",
          onChange: (e) => {
            if (e.target.files)
              setPreview(URL.createObjectURL(e.target.files[0]));
            onChange(e.target.files?.[0] || null);
          }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-secondary-500 transition ", children: preview ? /* @__PURE__ */ jsx(
        "img",
        {
          src: preview,
          className: "w-full h-48 object-cover rounded-md"
        }
      ) : /* @__PURE__ */ jsx("span", { className: "text-gray-500 ", children: locale == "en" ? "Click to upload image" : "أضغط لتحميل صورة" }) })
    ] }),
    preview && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: handleRemove,
        className: "absolute cursor-pointer top-1 end-1 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-700 transition z-10",
        title: locale == "en" ? "Remove image" : "حذف الصورة",
        children: /* @__PURE__ */ jsx(FiTrash2, { size: 14 })
      }
    )
  ] });
};
const VideoInput = ({ onChange, name, defaultValue }) => {
  const [preview, setPreview] = useState(
    defaultValue instanceof File ? URL.createObjectURL(defaultValue) : defaultValue || null
  );
  const { locale } = usePage().props;
  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPreview(null);
    onChange(null);
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs("label", { className: "cursor-pointer w-full", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          name,
          type: "file",
          hidden: true,
          accept: "video/mp4,video/webm,video/mov,video/avi",
          onChange: (e) => {
            if (e.target.files?.[0]) {
              setPreview(URL.createObjectURL(e.target.files[0]));
              onChange(e.target.files[0]);
            }
          }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-secondary-500 transition", children: preview ? /* @__PURE__ */ jsx(
        "video",
        {
          src: preview,
          className: "w-full h-48 object-cover rounded-md",
          controls: true,
          muted: true
        }
      ) : /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: locale == "en" ? "Click to upload video" : "أضغط لتحميل فيديو" }) })
    ] }),
    preview && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: handleRemove,
        className: "absolute top-2 end-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-700 transition z-10",
        title: locale == "en" ? "Remove video" : "حذف الفيديو",
        children: /* @__PURE__ */ jsx(FiTrash2, { size: 14 })
      }
    )
  ] });
};
function CustomSelect({
  pickOne,
  choices,
  viewedOption,
  selectedOption,
  onChange,
  preSelected = []
}) {
  const { locale } = usePage().props;
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const initialized = useRef(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!initialized.current) {
      if (Array.isArray(preSelected)) {
        setSelected(
          preSelected.map((choice) => {
            if (typeof choice === "object" && choice !== null) {
              return {
                [selectedOption]: String(choice[selectedOption])
              };
            }
            return {
              [selectedOption]: String(choice)
            };
          })
        );
      } else if (preSelected) {
        setSelected([
          {
            [selectedOption]: String(preSelected[selectedOption])
          }
        ]);
      }
      initialized.current = true;
    }
  }, [preSelected]);
  const toggleOption = (choice) => {
    const value = String(choice[selectedOption]);
    let newSelected;
    const exists = selected.some(
      (item) => String(item[selectedOption]) === value
    );
    if (pickOne) {
      newSelected = exists ? [] : [{ [selectedOption]: value }];
      setOpen(false);
    } else {
      if (exists) {
        newSelected = selected.filter(
          (item) => String(item[selectedOption]) !== value
        );
      } else {
        newSelected = [
          ...selected,
          { [selectedOption]: value }
        ];
      }
    }
    setSelected(newSelected);
    onChange(newSelected);
  };
  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const getSelectedLabel = () => {
    if (pickOne && selected.length > 0) {
      const currentValue = String(
        selected[0][selectedOption]
      );
      const foundChoice = choices.find(
        (choice) => String(choice[selectedOption]) === currentValue
      );
      return foundChoice?.[viewedOption] || (locale === "en" ? "Select option" : "اختر خيار");
    }
    if (selected.length > 0) {
      return `${selected.length} ${locale === "en" ? "options selected" : "خيارات مختارة"}`;
    }
    return locale === "en" ? "Select options" : "اختر الخيارات";
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: "relative w-full",
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setOpen((prev) => !prev),
            className: "w-full border rounded-lg px-4 py-3 bg-white cursor-pointer flex justify-between items-center text-sm sm:text-base",
            children: [
              /* @__PURE__ */ jsx("span", { children: getSelectedLabel() }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "▼" })
            ]
          }
        ),
        open && /* @__PURE__ */ jsxs("div", { className: "absolute left-0 top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-10 max-h-56 overflow-y-auto", children: [
          choices.map((choice, i) => {
            const value = String(
              choice[selectedOption]
            );
            const active = selected.some(
              (item) => String(item[selectedOption]) === value
            );
            return /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => toggleOption(choice),
                className: `w-full flex justify-between items-center px-4 py-3 text-sm sm:text-base hover:bg-gray-100 transition ${active ? "bg-gray-100 font-medium" : ""}`,
                children: [
                  /* @__PURE__ */ jsx("span", { children: String(choice[viewedOption]) }),
                  active && /* @__PURE__ */ jsx("span", { children: "✔" })
                ]
              },
              i
            );
          }),
          choices.length === 0 && /* @__PURE__ */ jsx("div", { className: "px-4 py-3 text-sm text-gray-500", children: locale === "en" ? "No options found" : "لا يوجد خيارات" })
        ] })
      ]
    }
  );
}
const RichTextInput = ({ Editor, name, value, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [richTextValue, setRichTextValue] = useState(value || "");
  useEffect(() => {
    setRichTextValue(value || "");
  }, [value]);
  const handleChange = (_event, editor) => {
    const data = editor.getData();
    setRichTextValue(data);
    onChange(data);
  };
  if (!Editor) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      Editor,
      {
        value: richTextValue,
        onChange: handleChange,
        setIsUploading,
        onUploadStart: () => setIsUploading(true),
        onUploadComplete: () => setIsUploading(false)
      }
    ),
    /* @__PURE__ */ jsx("textarea", { hidden: true, name, value: richTextValue, readOnly: true }),
    isUploading && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white text-xl z-50", children: "Uploading File..." })
  ] });
};
const JsonTextarea = ({ value, onChange }) => {
  const [isInvalid, setIsInvalid] = useState(false);
  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    try {
      if (val) JSON.parse(val);
      setIsInvalid(false);
    } catch {
      setIsInvalid(true);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
    /* @__PURE__ */ jsx(
      "textarea",
      {
        value,
        onChange: handleChange,
        className: `border p-2 rounded outline-none font-mono text-sm resize-y w-full  ${isInvalid ? "border-red-500 bg-red-50" : ""}`,
        dir: "ltr",
        placeholder: '{\n  "@context": "http://schema.org",\n  "@type": "LocalBusiness"\n}'
      }
    ),
    isInvalid && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs", children: "Invalid Json" })
  ] });
};
function DynamicForm({
  initialData = {},
  fields,
  submitUrl,
  deleteUrl,
  returnUrl = "",
  itemName = "Item",
  isEdit = false
}) {
  const { locale } = usePage().props;
  const deleteContext = useContext(DeleteContext);
  const Editor = useSharedCkEditor();
  const setupInitialState = () => {
    let state = {};
    fields.forEach((field) => {
      if (field.type === "spatie" || field.type === "spatie-richtext" || field.type === "spatie-file") {
        state[field.name] = {
          ar: initialData?.[field.name]?.ar || "",
          en: initialData?.[field.name]?.en || ""
        };
      } else if (field.type === "spatie-json") {
        state[field.name] = {
          ar: initialData?.[field.name]?.ar ? typeof initialData[field.name].ar === "object" ? JSON.stringify(initialData[field.name].ar, null, 2) : initialData[field.name].ar : "",
          en: initialData?.[field.name]?.en ? typeof initialData[field.name].en === "object" ? JSON.stringify(initialData[field.name].en, null, 2) : initialData[field.name].en : ""
        };
      } else if (field.type === "json") {
        state[field.name] = initialData?.[field.name] ? typeof initialData[field.name] === "object" ? JSON.stringify(initialData[field.name], null, 2) : initialData[field.name] : "";
      } else if (field.type === "repeater") {
        state[field.name] = (initialData?.[field.name] || []).map((item) => {
          const converted = { ...item };
          field.repeaterFields?.forEach((subField) => {
            if (subField.type === "spatie-json") {
              converted[subField.name] = {
                ar: item[subField.name]?.ar ? typeof item[subField.name].ar === "object" ? JSON.stringify(item[subField.name].ar, null, 2) : item[subField.name].ar : "",
                en: item[subField.name]?.en ? typeof item[subField.name].en === "object" ? JSON.stringify(item[subField.name].en, null, 2) : item[subField.name].en : ""
              };
            } else if (subField.type === "json") {
              converted[subField.name] = item[subField.name] ? typeof item[subField.name] === "object" ? JSON.stringify(item[subField.name], null, 2) : item[subField.name] : "";
            }
          });
          return converted;
        });
      } else if (field.type === "select") {
        if (initialData?.[field.name] !== void 0) {
          state[field.name] = Array.isArray(initialData?.[field.name]) ? initialData?.[field.name] : { [field.selectValueOption]: initialData?.[field.name] };
        } else {
          field.selectPickOne ? "" : [];
        }
      } else {
        state[field.name] = initialData?.[field.name] || "";
      }
    });
    return state;
  };
  const { data, setData } = useForm(setupInitialState());
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const getError = (fieldName) => {
    if (errors[fieldName]) {
      return Array.isArray(errors[fieldName]) ? errors[fieldName][0] : errors[fieldName];
    }
    const nestedError = Object.keys(errors).find((key) => key.startsWith(`${fieldName}.`));
    if (nestedError) {
      return Array.isArray(errors[nestedError]) ? errors[nestedError][0] : errors[nestedError];
    }
    return void 0;
  };
  const handleNumberInput = (value) => value.replace(/\D/g, "");
  const getSpatieError = (fieldName, lang) => {
    const key = `${fieldName}.${lang}`;
    if (errors[key]) {
      return Array.isArray(errors[key]) ? errors[key][0] : errors[key];
    }
    return void 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    try {
      const formData = ObjectToFormData(data);
      if (isEdit) {
        formData.append("_method", "PUT");
        await axios.post("/" + locale + submitUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await axios.post("/" + locale + submitUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      router.visit(returnUrl);
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Server Error:", error);
      }
    } finally {
      setProcessing(false);
    }
  };
  const handleSpatieChange = (fieldName, lang, value) => {
    setData(fieldName, { ...data[fieldName], [lang]: value });
  };
  const addRepeaterItem = (repeaterName, repeaterFields) => {
    const newItem = {};
    repeaterFields.forEach((f) => {
      if (f.type === "spatie" || f.type === "spatie-richtext") {
        newItem[f.name] = { ar: "", en: "" };
      } else if (f.type === "spatie-json") {
        newItem[f.name] = { ar: "", en: "" };
      } else if (f.type === "json") {
        newItem[f.name] = "";
      } else if (f.type === "select") {
        newItem[f.name] = f.selectPickOne ? "" : [];
      } else {
        newItem[f.name] = "";
      }
    });
    setData(repeaterName, [...data[repeaterName], newItem]);
  };
  const updateRepeaterItem = (repeaterName, index, fieldName, value) => {
    const newRepeaterArray = [...data[repeaterName]];
    newRepeaterArray[index][fieldName] = value;
    setData(repeaterName, newRepeaterArray);
  };
  const updateRepeaterSpatieItem = (repeaterName, index, fieldName, lang, value) => {
    const newRepeaterArray = [...data[repeaterName]];
    newRepeaterArray[index][fieldName] = { ...newRepeaterArray[index][fieldName], [lang]: value };
    setData(repeaterName, newRepeaterArray);
  };
  const removeRepeaterItem = (repeaterName, index) => {
    const newRepeaterArray = [...data[repeaterName]];
    newRepeaterArray.splice(index, 1);
    setData(repeaterName, newRepeaterArray);
  };
  const handleDeleteClick = () => {
    if (deleteContext && deleteContext.setDeleteState && deleteUrl) {
      deleteContext.setDeleteState({
        message: locale == "ar" ? `هل أنت متأكد من رغبتك في حذف ${itemName}؟` : `Are you sure you want to delete this ${itemName}?`,
        url: "/" + locale + deleteUrl,
        returnedUrl: returnUrl
      });
    }
  };
  if (!Editor || processing)
    return /* @__PURE__ */ jsx(LoadingSpinner, {});
  else
    return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "rounded-lg shadow-sm space-y-8 p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: fields.map((field, index) => {
        if (field.type === "repeater") {
          return /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 border border-gray-200 rounded-lg p-4 bg-gray-50", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg text-gray-800 mb-4", children: field.label }),
            data[field.name]?.map((item, itemIndex) => /* @__PURE__ */ jsxs("div", { className: "relative bg-white p-4 rounded border border-gray-300 mb-4 shadow-sm", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => removeRepeaterItem(field.name, itemIndex),
                  className: "absolute top-4 end-4 text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full",
                  title: locale == "ar" ? "حذف هذا القسم" : "Delete This Section",
                  children: /* @__PURE__ */ jsx(FiTrash2, {})
                }
              ),
              /* @__PURE__ */ jsx("h4", { className: "font-semibold mb-4 text-gray-600", children: (locale == "ar" ? "القسم رقم #" : "Section number #") + (itemIndex + 1) }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: field.repeaterFields?.map((subField, subIndex) => /* @__PURE__ */ jsxs("div", { className: `flex flex-col ${subField.fullWidth || subField.type.includes("richtext") ? "md:col-span-2" : ""}`, children: [
                /* @__PURE__ */ jsx("label", { className: "mb-1 text-sm font-medium text-gray-700", children: subField.label }),
                subField.type === "text" && /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: item[subField.name] || "",
                    onChange: (e) => updateRepeaterItem(field.name, itemIndex, subField.name, e.target.value),
                    className: "border p-2 rounded outline-none"
                  }
                ),
                subField.type === "number" && /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    inputMode: "numeric",
                    value: item[subField.name] || "",
                    onChange: (e) => updateRepeaterItem(field.name, itemIndex, subField.name, handleNumberInput(e.target.value)),
                    className: "border p-2 rounded outline-none"
                  }
                ),
                subField.type === "textarea" && /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: item[subField.name] || "",
                    onChange: (e) => updateRepeaterItem(field.name, itemIndex, subField.name, e.target.value),
                    className: "border p-2 rounded resize-none outline-none h-24"
                  }
                ),
                subField.type === "file" && /* @__PURE__ */ jsx(
                  ImageInput,
                  {
                    defaultValue: item[subField.name],
                    onChange: (val) => updateRepeaterItem(field.name, itemIndex, subField.name, val)
                  }
                ),
                subField.type === "video" && /* @__PURE__ */ jsx(
                  VideoInput,
                  {
                    defaultValue: item[subField.name],
                    onChange: (val) => updateRepeaterItem(field.name, itemIndex, subField.name, val)
                  }
                ),
                subField.type === "spatie-file" && /* @__PURE__ */ jsxs("div", { className: "flex max-mob:flex-col gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 flex-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 mb-1 block font-medium", children: locale === "ar" ? "(صورة عربي)" : "(Arabic Image)" }),
                    /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col gap-1", children: [
                      /* @__PURE__ */ jsx(
                        ImageInput,
                        {
                          defaultValue: item[subField.name]?.ar || "",
                          onChange: (val) => updateRepeaterSpatieItem(field.name, itemIndex, subField.name, "ar", val)
                        }
                      ),
                      getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, "ar") && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1", children: getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, "ar") })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 flex-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 mb-1 block font-medium", children: locale === "ar" ? "(صورة إنجليزي)" : "(English Image)" }),
                    /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col gap-1", children: [
                      /* @__PURE__ */ jsx(
                        ImageInput,
                        {
                          defaultValue: item[subField.name]?.en || "",
                          onChange: (val) => updateRepeaterSpatieItem(field.name, itemIndex, subField.name, "en", val)
                        }
                      ),
                      getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, "en") && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1", children: getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, "en") })
                    ] })
                  ] })
                ] }),
                subField.type === "select" && subField.selectChoices && subField.selectViewedOption && subField.selectValueOption && /* @__PURE__ */ jsx(
                  CustomSelect,
                  {
                    choices: subField.selectChoices,
                    viewedOption: subField.selectViewedOption,
                    selectedOption: subField.selectValueOption,
                    pickOne: subField.selectPickOne,
                    preSelected: item[subField.name] ? item[subField.name] : [],
                    onChange: (val) => {
                      const formattedValue = subField.selectPickOne ? val.length > 0 ? val[0] : "" : val;
                      updateRepeaterItem(field.name, itemIndex, subField.name, formattedValue);
                    }
                  }
                ),
                subField.type === "json" && /* @__PURE__ */ jsx(
                  JsonTextarea,
                  {
                    value: item[subField.name] || "",
                    onChange: (val) => updateRepeaterItem(field.name, itemIndex, subField.name, val)
                  }
                ),
                subField.type === "spatie-json" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 mt-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 mb-1 block", children: locale == "ar" ? "(عربي)" : "(Arabic)" }),
                    /* @__PURE__ */ jsx(
                      JsonTextarea,
                      {
                        value: item[subField.name]?.ar || "",
                        onChange: (val) => updateRepeaterSpatieItem(field.name, itemIndex, subField.name, "ar", val)
                      }
                    ),
                    getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, "ar") && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1", children: getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, "ar") })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 mb-1 block", children: locale == "ar" ? "(إنجليزي)" : "(English)" }),
                    /* @__PURE__ */ jsx(
                      JsonTextarea,
                      {
                        value: item[subField.name]?.en || "",
                        onChange: (val) => updateRepeaterSpatieItem(field.name, itemIndex, subField.name, "en", val)
                      }
                    ),
                    getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, "en") && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1", children: getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, "en") })
                  ] })
                ] }),
                subField.type === "spatie" && /* @__PURE__ */ jsxs("div", { className: "flex max-mob:flex-col gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        placeholder: locale === "ar" ? `${subField.label} (عربي)` : `${subField.label} (Arabic)`,
                        value: item[subField.name]?.ar || "",
                        onChange: (e) => updateRepeaterSpatieItem(field.name, itemIndex, subField.name, "ar", e.target.value),
                        className: "border p-2 rounded w-full dir-rtl outline-none"
                      }
                    ),
                    getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, "ar") && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1", children: getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, "ar") })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        placeholder: locale === "ar" ? `${subField.label} (أنجليزي)` : `${subField.label} (English)`,
                        value: item[subField.name]?.en || "",
                        onChange: (e) => updateRepeaterSpatieItem(field.name, itemIndex, subField.name, "en", e.target.value),
                        className: "border p-2 rounded w-full dir-ltr outline-none"
                      }
                    ),
                    getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, "en") && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1", children: getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, "en") })
                  ] })
                ] }),
                subField.type === "richtext" && /* @__PURE__ */ jsx(
                  RichTextInput,
                  {
                    Editor,
                    name: `${field.name}_${itemIndex}_${subField.name}`,
                    onChange: (val) => updateRepeaterItem(field.name, itemIndex, subField.name, val),
                    value: item[subField.name] || ""
                  }
                ),
                subField.type === "spatie-richtext" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 mt-1", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 mb-1 block", children: locale == "ar" ? "(عربي)" : "(Arabic)" }),
                    /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col gap-1", children: [
                      /* @__PURE__ */ jsx(
                        RichTextInput,
                        {
                          Editor,
                          name: `${field.name}_${itemIndex}_${subField.name}_ar`,
                          onChange: (val) => updateRepeaterSpatieItem(field.name, itemIndex, subField.name, "ar", val),
                          value: item[subField.name]?.ar || ""
                        }
                      ),
                      getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, "ar") && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1", children: getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, "ar") })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 mb-1 block", children: locale == "en" ? "(English)" : "(أنكليزي)" }),
                    /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col gap-1", children: [
                      /* @__PURE__ */ jsx(
                        RichTextInput,
                        {
                          Editor,
                          name: `${field.name}_${itemIndex}_${subField.name}_en`,
                          onChange: (val) => updateRepeaterSpatieItem(field.name, itemIndex, subField.name, "en", val),
                          value: item[subField.name]?.en || ""
                        }
                      ),
                      getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, "en") && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1", children: getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, "en") })
                    ] })
                  ] })
                ] }),
                subField.type != "spatie" && subField.type != "spatie-richtext" && subField.type != "spatie-file" && subField.type != "spatie-json" && getError(`${field.name}.${itemIndex}.${subField.name}`) && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1", children: getError(`${field.name}.${itemIndex}.${subField.name}`) })
              ] }, subIndex)) })
            ] }, itemIndex)),
            getError(field.name) && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1 block", children: getError(field.name) }),
            (!field.maxItems || data[field.name]?.length < field.maxItems) && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => addRepeaterItem(field.name, field.repeaterFields || []),
                className: "flex items-center gap-2 bg-dark text-light px-4 py-2 rounded hover:bg-primary transition max-mob:mb-4",
                children: [
                  /* @__PURE__ */ jsx(FiPlus, {}),
                  " ",
                  locale === "ar" ? `إضافة ${field.itemLabel || "قسم"}` : `Add ${field.itemLabel || "Section"}`
                ]
              }
            )
          ] }, index);
        }
        return /* @__PURE__ */ jsxs("div", { className: `flex flex-col ${field.fullWidth || field.type === "spatie-richtext" || field.type === "richtext" ? "md:col-span-2" : ""}`, children: [
          /* @__PURE__ */ jsx("label", { className: "mb-2 font-semibold text-gray-700", children: field.label }),
          field.type === "text" && /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: data[field.name],
              onChange: (e) => setData(field.name, e.target.value),
              className: "border p-2 rounded outline-none"
            }
          ),
          field.type === "number" && /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              inputMode: "numeric",
              value: data[field.name],
              onChange: (e) => setData(field.name, handleNumberInput(e.target.value)),
              className: "border p-2 rounded outline-none"
            }
          ),
          field.type === "textarea" && /* @__PURE__ */ jsx(
            "textarea",
            {
              value: data[field.name],
              onChange: (e) => setData(field.name, e.target.value),
              className: "border p-2 rounded outline-none h-24 resize-none"
            }
          ),
          field.type === "select" && field.selectChoices && field.selectViewedOption && field.selectValueOption && /* @__PURE__ */ jsx(
            CustomSelect,
            {
              choices: field.selectChoices,
              viewedOption: field.selectViewedOption,
              selectedOption: field.selectValueOption,
              pickOne: field.selectPickOne,
              preSelected: data[field.name] ? data[field.name] : [],
              onChange: (val) => {
                const formattedValue = field.selectPickOne ? val.length > 0 ? val[0] : "" : val;
                setData(field.name, formattedValue);
              }
            }
          ),
          field.type === "spatie" && /* @__PURE__ */ jsxs("div", { className: "flex max-mob:flex-col gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col gap-1", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: locale === "ar" ? `${field.label} (عربي)` : `${field.label} (Arabic)`,
                  value: data[field.name]?.ar || "",
                  onChange: (e) => handleSpatieChange(field.name, "ar", e.target.value),
                  className: "border p-2 rounded w-full dir-rtl outline-none"
                }
              ),
              getSpatieError(field.name, "ar") && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1", children: getSpatieError(field.name, "ar") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col gap-1", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: locale === "ar" ? `${field.label} (إنجليزي)` : `${field.label} (English)`,
                  value: data[field.name]?.en || "",
                  onChange: (e) => handleSpatieChange(field.name, "en", e.target.value),
                  className: "border p-2 rounded w-full dir-ltr outline-none"
                }
              ),
              getSpatieError(field.name, "en") && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1", children: getSpatieError(field.name, "en") })
            ] })
          ] }),
          field.type === "file" && /* @__PURE__ */ jsx(
            ImageInput,
            {
              defaultValue: data[field.name],
              onChange: (val) => setData(field.name, val)
            }
          ),
          field.type === "video" && /* @__PURE__ */ jsx(
            VideoInput,
            {
              defaultValue: data[field.name],
              onChange: (val) => setData(field.name, val)
            }
          ),
          field.type === "spatie-file" && /* @__PURE__ */ jsxs("div", { className: "flex max-mob:flex-col gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 flex-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 mb-1 block font-medium", children: locale === "ar" ? "(صورة عربي)" : "(Arabic Image)" }),
              /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col gap-1", children: [
                /* @__PURE__ */ jsx(
                  ImageInput,
                  {
                    defaultValue: data[field.name]?.ar || "",
                    onChange: (val) => handleSpatieChange(field.name, "ar", val)
                  }
                ),
                getSpatieError(field.name, "ar") && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1", children: getSpatieError(field.name, "ar") })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 flex-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 mb-1 block font-medium", children: locale === "ar" ? "(صورة إنجليزي)" : "(English Image)" }),
              /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col gap-1", children: [
                /* @__PURE__ */ jsx(
                  ImageInput,
                  {
                    defaultValue: data[field.name]?.en || "",
                    onChange: (val) => handleSpatieChange(field.name, "en", val)
                  }
                ),
                getSpatieError(field.name, "en") && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1", children: getSpatieError(field.name, "en") })
              ] })
            ] })
          ] }),
          field.type === "richtext" && /* @__PURE__ */ jsx(
            RichTextInput,
            {
              Editor,
              name: field.name,
              onChange: (val) => setData(field.name, val),
              value: data[field.name] || ""
            }
          ),
          field.type === "json" && /* @__PURE__ */ jsx(
            JsonTextarea,
            {
              value: data[field.name] || "",
              onChange: (val) => setData(field.name, val)
            }
          ),
          field.type === "spatie-json" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-500", children: locale === "ar" ? "(عربي)" : "(Arabic)" }),
              /* @__PURE__ */ jsx(
                JsonTextarea,
                {
                  value: data[field.name]?.ar || "",
                  onChange: (val) => handleSpatieChange(field.name, "ar", val)
                }
              ),
              getSpatieError(field.name, "ar") && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1", children: getSpatieError(field.name, "ar") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-500", children: locale === "ar" ? "(إنجليزي)" : "(English)" }),
              /* @__PURE__ */ jsx(
                JsonTextarea,
                {
                  value: data[field.name]?.en || "",
                  onChange: (val) => handleSpatieChange(field.name, "en", val)
                }
              ),
              getSpatieError(field.name, "en") && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1", children: getSpatieError(field.name, "en") })
            ] })
          ] }),
          field.type === "spatie-richtext" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-500", children: locale === "ar" ? `(عربي)` : `(Arabic)` }),
              /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col gap-1", children: [
                /* @__PURE__ */ jsx(
                  RichTextInput,
                  {
                    Editor,
                    name: `${field.name}_ar`,
                    onChange: (val) => handleSpatieChange(field.name, "ar", val),
                    value: data[field.name]?.ar || ""
                  }
                ),
                getSpatieError(field.name, "ar") && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1", children: getSpatieError(field.name, "ar") })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-500", children: locale === "ar" ? `(إنجليزي)` : `(English)` }),
              /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col gap-1", children: [
                /* @__PURE__ */ jsx(
                  RichTextInput,
                  {
                    Editor,
                    name: `${field.name}_en`,
                    onChange: (val) => handleSpatieChange(field.name, "en", val),
                    value: data[field.name]?.en || ""
                  }
                ),
                getSpatieError(field.name, "en") && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1", children: getSpatieError(field.name, "en") })
              ] })
            ] })
          ] }),
          field.type != "spatie" && field.type != "spatie-richtext" && field.type != "spatie-file" && field.type != "spatie-json" && getError(field.name) && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs mt-1", children: getError(field.name) })
        ] }, index);
      }) }),
      /* @__PURE__ */ jsxs("div", { className: `flex ${isEdit ? "justify-between" : "justify-center"} items-center mt-8 border-t pt-4`, children: [
        isEdit && deleteUrl ? /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleDeleteClick,
            className: "bg-red-50 text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-colors border border-red-200 duration-200",
            children: locale == "en" ? `Delete ${itemName}` : `حذف ${itemName}`
          }
        ) : /* @__PURE__ */ jsx("div", {}),
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: processing,
            className: "bg-dark hover:bg-primary duration-300 text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50",
            type: "submit",
            children: isEdit ? locale === "en" ? `Update Data` : `تحديث البيانات` : locale === "en" ? `Send Data` : `إرسال البيانات`
          }
        )
      ] })
    ] }) });
}
const DashboardProjectsCrud = ({ allData }) => {
  const { isEdit, content, project } = allData;
  console.log(project);
  return /* @__PURE__ */ jsx(DashboardLayout, { children: /* @__PURE__ */ jsx("div", { className: "max-lg:pt-20 py-6 px-5", children: /* @__PURE__ */ jsx(
    DynamicForm,
    {
      deleteUrl: isEdit ? content.submitUrl + "/" + project.id : void 0,
      initialData: isEdit ? project : void 0,
      fields: content.inputs,
      submitUrl: isEdit ? content.submitUrl + "/" + project.id : content.submitUrl,
      returnUrl: "/dashboard/projects/services",
      itemName: content.itemName,
      isEdit
    }
  ) }) });
};
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DashboardProjectsCrud
}, Symbol.toStringTag, { value: "Module" }));
const MainTitle = ({ children, className, white, black, hero, center }) => {
  return /* @__PURE__ */ jsx(
    "h1",
    {
      className: `
      font-bold
      ${white ? "text-arch-card" : black && "text-arch-dark"}
      ${hero ? "text-4xl leading-3" : "text-3xl leading-2"}
      ${center && "text-center"}
    ${className}
    `,
      children
    }
  );
};
function inferFieldType(key, richText) {
  if (!key) {
    return;
  }
  const k = key.toLowerCase();
  if (k.includes("icon") || k.includes("image") || k.includes("logo") || k.includes("webp") || k.includes("png") || k.includes("jpg") || k.includes("svg"))
    return "image";
  if (k.includes("description") && richText)
    return "richtext";
  if (k.includes("content"))
    return "textarea";
  return "text";
}
const PageContentContext = createContext("");
const usePageName = () => useContext(PageContentContext);
const PageContentProvider = ({ pageName, children }) => {
  return /* @__PURE__ */ jsx(PageContentContext.Provider, { value: pageName, children });
};
const useEditorStore = create((set) => ({
  deletable: false,
  array: false,
  fields: void 0,
  canDelete: false,
  open: false,
  pageName: "",
  path: "",
  type: void 0,
  value: null,
  openEditor: (pageName, path, type, value, options) => set({
    open: true,
    pageName,
    path,
    type,
    value,
    array: options?.array ?? false,
    fields: options?.inputs,
    deletable: options?.deletable
  }),
  setValue: (value) => set({ value }),
  closeEditor: () => set({ open: false })
}));
const EditableObject = ({
  path,
  fields,
  children,
  className,
  top,
  start,
  deletable,
  richText,
  hideFirst,
  dontAddInputsFor
}) => {
  const openEditor = useEditorStore((s) => s.openEditor);
  const pageName = usePageName();
  const { locale, auth } = usePage().props;
  const isRTL = locale === "ar";
  let inputs = [{}];
  let editorValue = "";
  if (typeof fields === "object" && fields !== null) {
    const entries = Object.entries(fields);
    const filteredEntries = dontAddInputsFor ? entries.filter(([key]) => !dontAddInputsFor.includes(key)) : entries;
    inputs = filteredEntries.map(([key, value]) => ({
      key,
      value,
      type: inferFieldType(key, richText)
    }));
    const richInput = inputs.find((input) => input.type === "richtext");
    editorValue = richInput?.value;
  } else {
    const value = fields;
    const type = inferFieldType(value);
    inputs = richText ? [{
      key: "text",
      value,
      type: "richtext"
    }] : [{
      key: type,
      value,
      type
    }];
    editorValue = value;
  }
  const positionStyles = {
    top: top ?? "10%",
    [isRTL ? "right" : "left"]: start ?? "90%",
    position: "absolute",
    transform: `translate(${isRTL ? "50%" : "-50%"}, -50%)`
  };
  return /* @__PURE__ */ jsxs("div", { className: `relative ${hideFirst && "first:hidden"} ${className}`, children: [
    children,
    // auth ?
    /* @__PURE__ */ jsx(
      "button",
      {
        title: "Object Edit",
        type: "button",
        onClick: (e) => {
          e.preventDefault();
          openEditor(pageName, path, "object", editorValue, { inputs, deletable });
        },
        className: "w-7 h-7 bg-gray-500/80 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 duration-300 z-1000 text-sm",
        style: positionStyles,
        children: "🧩"
      }
    )
  ] });
};
const EditableText = ({ path, children, richtext, top, start, text, className }) => {
  const openEditor = useEditorStore((s) => s.openEditor);
  const pageName = usePageName();
  const { locale } = usePage().props;
  const isRTL = locale === "ar";
  const positionStyles = {
    top: top ?? "40%",
    [isRTL ? "right" : "left"]: start ?? "50%",
    position: "absolute",
    transform: `translate(${isRTL ? "50%" : "-50%"}, -50%)`
  };
  const { auth } = usePage().props;
  return /* @__PURE__ */ jsxs("div", { className: `relative ${className}`, children: [
    !richtext && children,
    richtext && typeof children === "string" && /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: children } }),
    // auth ?
    /* @__PURE__ */ jsx(
      "button",
      {
        title: "Text Editing",
        type: "button",
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          openEditor(pageName, path, richtext ? "richtext" : "text", text);
        },
        style: positionStyles,
        className: "w-7 h-7 bg-gray-500/80 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 duration-300 z-1000 text-sm",
        children: "✏️"
      }
    )
  ] });
};
const Label = ({ title, path, dontEdit, className }) => {
  if (dontEdit) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `w-fit ${className} `,
        children: /* @__PURE__ */ jsx("span", { className: "text-arch-accent text-sm font-medium mb-4 leading-5", children: title })
      }
    );
  } else
    return /* @__PURE__ */ jsx(
      EditableText,
      {
        className: `w-fit ${className} `,
        top: "40%",
        start: "10%",
        path: path || "",
        text: title || "",
        children: /* @__PURE__ */ jsx("span", { className: "text-arch-accent text-sm font-medium mb-4 leading-5", children: title })
      }
    );
};
const CourseCard = ({ topics, description, image, learningPoints, name, price, id, newCourse, viewCourseButton }) => {
  const { locale } = usePage().props;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "\r\n        bg-arch-card\r\n        rounded-3xl\r\n        overflow-hidden\r\n        shadow-md\r\n        hover:shadow-2xl\r\n        transition-all\r\n        duration-300\r\n        hover:-translate-y-2\r\n        border border-gray-100\r\n        group\r\n        flex flex-col justify-between\r\n      ",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
          /* @__PURE__ */ jsx(
            Image,
            {
              src: image,
              className: "\r\n            h-64\r\n            w-full\r\n            object-cover\r\n            group-hover:scale-105\r\n            transition-all\r\n            duration-500\r\n          "
            }
          ),
          newCourse && /* @__PURE__ */ jsx(
            "div",
            {
              className: "\r\n              absolute\r\n              top-4\r\n              end-4\r\n              bg-arch-accent\r\n              text-arch-light\r\n              text-xs\r\n              px-3\r\n              py-1\r\n              rounded-full\r\n              font-semibold\r\n              shadow-lg\r\n            ",
              children: locale == "en" ? "NEW" : "جديد"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 w-full grow flex flex-col justify-between", children: [
          /* @__PURE__ */ jsx(
            SectionTitle,
            {
              className: "\r\n            w-full\r\n            text-xl\r\n            font-bold\r\n            text-arch-dark\r\n            mb-3\r\n          ",
              children: name
            }
          ),
          /* @__PURE__ */ jsx(
            EditableObject,
            {
              className: "w-fit max-mob:w-full",
              dontAddInputsFor: ["link"],
              fields: viewCourseButton,
              path: "viewCourseButton",
              children: /* @__PURE__ */ jsx(Button, { className: "max-mob:w-full", children: /* @__PURE__ */ jsx(
                Link,
                {
                  href: viewCourseButton.link + id,
                  children: viewCourseButton.text
                }
              ) })
            }
          )
        ] })
      ]
    }
  );
};
const CourseDetailsPage = ({ allData }) => {
  const { data, course, moreCourses } = allData;
  const { courses, links } = moreCourses;
  return /* @__PURE__ */ jsx(PageContentProvider, { pageName: "Course", children: /* @__PURE__ */ jsxs("div", { className: "pb-16 pt-32 relative bg-arch-accent/10", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-largeSaveSpace max-desc:px-mobSaveSpace ", children: [
      /* @__PURE__ */ jsx(
        Image,
        {
          className: "w-full h-[80vh] object-cover absolute inset-0 ",
          src: course.heroImage
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "bg-arch-card rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 desc:grid-cols-2 content-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-8 max-mob:p-6 text-arch-dark", children: [
          /* @__PURE__ */ jsx(
            Image,
            {
              src: course.image,
              className: "w-full aspect-[1.5] object-cover rounded-2xl mb-10"
            }
          ),
          /* @__PURE__ */ jsx(MainTitle, { black: true, className: "mb-7", children: course.name }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "text-arch-gray leading-8 text-lg mb-2",
              dangerouslySetInnerHTML: { __html: course.description }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsx(
              EditableText,
              {
                path: "priceTitle",
                text: data.priceTitle,
                className: "text-sm font-semibold text-arch-accent w-fit",
                children: data.priceTitle
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "text-3xl font-bold text-arch-dark",
                children: [
                  course.price,
                  /* @__PURE__ */ jsx("span", { className: "text-arch-accent", children: "$" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            EditableObject,
            {
              className: "w-fit max-mob:w-full",
              fields: data.enrollButton,
              path: "enrollButton",
              children: /* @__PURE__ */ jsx("a", { target: "_blank", href: data.enrollButton.link, children: /* @__PURE__ */ jsx(Button, { className: "mx-auto max-mob:w-full", children: data.enrollButton.text }) })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-8 max-mob:p-6 desc:border-s border-gray-300", children: [
          course.newCourse && /* @__PURE__ */ jsx(EditableText, { path: "newCourseTitle", text: data.newCourseTitle, className: "block w-fit bg-arch-accent text-arch-light px-4 py-1 rounded-full text-sm font-semibold mb-6", children: data.newCourseTitle }),
          /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsx(EditableText, { start: "10%", path: "CourseTopicsTitle", text: data.CourseTopicsTitle, className: "text-2xl font-bold mb-3 text-arch-dark", children: data.CourseTopicsTitle }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: course.topics.map((topic) => /* @__PURE__ */ jsxs(
              "li",
              {
                className: "flex items-center gap-3 text-arch-charcoal leading-7",
                children: [
                  /* @__PURE__ */ jsx("span", { className: " w-2 aspect-square bg-arch-accent/95 rounded-full" }),
                  topic.title
                ]
              },
              topic.id
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              EditableText,
              {
                start: "10%",
                text: data.learningPointsTitle,
                path: "learningPointsTitle",
                className: "text-2xl font-bold mb-3 text-arch-dark",
                children: data.learningPointsTitle
              }
            ),
            /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: course.learningPoints.map((point) => /* @__PURE__ */ jsxs(
              "li",
              {
                className: "flex items-center gap-3 text-arch-charcoal  leading-7",
                children: [
                  /* @__PURE__ */ jsx("span", { className: " w-2 h-2 bg-arch-accent/95 rounded-full" }),
                  point.title
                ]
              },
              point.id
            )) })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative pt-16 overflow-hidden  ", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 px-largeSaveSpace max-desc:px-mobSaveSpace", children: [
        /* @__PURE__ */ jsx(Label, { title: data.label, path: "label" }),
        /* @__PURE__ */ jsx(EditableText, { className: "w-fit", path: "title", text: data.title, children: /* @__PURE__ */ jsx(MainTitle, { black: true, children: data.title }) })
      ] }),
      /* @__PURE__ */ jsx(
        Swiper,
        {
          modules: [Autoplay, Navigation, EffectCoverflow],
          effect: "coverflow",
          grabCursor: true,
          centeredSlides: true,
          loop: true,
          slidesPerView: "auto",
          speed: 900,
          autoplay: {
            delay: 3e3,
            disableOnInteraction: false
          },
          navigation: {
            nextEl: ".arch-next",
            prevEl: ".arch-prev"
          },
          coverflowEffect: {
            rotate: 0,
            stretch: 60,
            depth: 220,
            modifier: 1,
            slideShadows: false,
            scale: 0.82
          },
          className: "!overflow-visible",
          children: course.images.map((image, index) => /* @__PURE__ */ jsx(
            SwiperSlide,
            {
              className: "!w-[320px] mob:!w-[420px] tab:!w-[560px] desc:!w-[680px]",
              children: ({ isActive }) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: `relative overflow-hidden transition-all duration-700 ${isActive ? "opacity-100" : "opacity-40 scale-95"}`,
                  children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-[16/10] overflow-hidden", children: [
                    /* @__PURE__ */ jsx(
                      Image,
                      {
                        src: image.image,
                        className: `w-full h-full object-cover transition-all duration-700 ${isActive ? "grayscale-0 scale-100" : "grayscale scale-105"}`
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" }),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `absolute bottom-0 left-0 h-[2px] bg-arch-accent transition-all duration-700 ${isActive ? "w-full" : "w-0"}`
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "absolute bottom-5 left-5 bg-arch-dark px-2 py-1", children: /* @__PURE__ */ jsx("div", { className: "text-arch-card font-medium text-sm", children: ` ${index + 1}` }) })
                  ] })
                }
              )
            },
            index
          ))
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-6  px-largeSaveSpace max-desc:px-mobSaveSpace   ", children: [
        /* @__PURE__ */ jsx(
          EditableText,
          {
            className: "w-fit",
            text: data.prevLabel,
            path: "prevLabel",
            children: /* @__PURE__ */ jsxs(Button, { className: "arch-prev", children: [
              /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-10 h-10", children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsx("path", { d: "M10 3L5 8L10 13", stroke: "currentColor", strokeWidth: "1.2" }) }) }),
              /* @__PURE__ */ jsx("span", { className: "text-xs tracking-[0.12em] uppercase hidden sm:block ", children: data.prevLabel })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-1 mx-6", children: [
          /* @__PURE__ */ jsx("div", { className: "h-[1px] flex-1 bg-gray-300" }),
          /* @__PURE__ */ jsx("span", { className: "w-3 aspect-square bg-arch-accent rounded-full" }),
          /* @__PURE__ */ jsx("div", { className: "h-[1px] flex-1 bg-gray-300" })
        ] }),
        /* @__PURE__ */ jsx(
          EditableText,
          {
            className: "w-fit",
            text: data.nextLabel,
            path: "nextLabel",
            children: /* @__PURE__ */ jsxs(Button, { className: "arch-next", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs tracking-[0.12em] uppercase hidden sm:block ", children: data.nextLabel }),
              /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-10 h-10 ", children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsx("path", { d: "M6 3L11 8L6 13", stroke: "currentColor", strokeWidth: "1.2" }) }) })
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full px-largeSaveSpace max-desc:px-mobSaveSpace pt-20", children: [
      /* @__PURE__ */ jsx(Label, { title: data.showMoreLabel, path: "showMoreLabel" }),
      /* @__PURE__ */ jsx(
        EditableText,
        {
          text: data.showMoreTitle,
          path: "showMoreTitle",
          className: "w-fit mb-14",
          children: /* @__PURE__ */ jsx(MainTitle, { black: true, children: data.showMoreTitle })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "grid max-mob:grid-cols-1 max-desc:grid-cols-2 grid-cols-3 gap-8", children: courses.map((course2) => /* @__PURE__ */ jsx(
        CourseCard,
        {
          viewCourseButton: data.viewCourseButton,
          ...course2
        },
        course2.id
      )) }),
      /* @__PURE__ */ jsx("div", { className: "mt-14 flex justify-center", children: /* @__PURE__ */ jsx(Pagination, { links }) })
    ] })
  ] }) });
};
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CourseDetailsPage
}, Symbol.toStringTag, { value: "Module" }));
const AboutSection = ({ aboutButton, aboutDescription, aboutImages, aboutTitle, aboutLabel }) => {
  return /* @__PURE__ */ jsxs("div", { id: "about", className: "scroll-m-10 w-full py-20 flex justify-between items-center gap-10 max-desc:flex-col px-largeSaveSpace max-desc:px-mobSaveSpace ", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { path: "aboutLabel", title: aboutLabel }),
      /* @__PURE__ */ jsx(
        EditableText,
        {
          start: "10%",
          top: "40%",
          path: "aboutTitle",
          text: aboutTitle,
          children: /* @__PURE__ */ jsx(
            MainTitle,
            {
              black: true,
              children: aboutTitle
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        EditableText,
        {
          start: "10%",
          top: "40%",
          className: "mt-4 mb-7 text-arch-gray text-justify text-lg leading-4 ",
          text: aboutDescription,
          path: "aboutDescription",
          richtext: true,
          children: aboutDescription
        }
      ),
      /* @__PURE__ */ jsx(
        EditableObject,
        {
          className: "w-fit max-desc:mx-auto  max-mob:w-full",
          path: "aboutButton",
          fields: aboutButton,
          children: /* @__PURE__ */ jsx("a", { target: "", href: aboutButton.id, children: /* @__PURE__ */ jsx(
            Button,
            {
              className: "max-mob:w-full",
              children: aboutButton.text
            }
          ) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      EditableObject,
      {
        className: "max-w-xl w-full rounded-lg overflow-hidden",
        path: "aboutImages",
        fields: aboutImages,
        children: [
          /* @__PURE__ */ jsx(
            Image,
            {
              className: "w-full h-full absolute inset-0  object-cover ",
              src: aboutImages.image2
            }
          ),
          /* @__PURE__ */ jsx(
            Image,
            {
              className: "w-full aspect-[1.2] object-cover mix-blend-multiply  opacity-85 ",
              src: aboutImages.image1
            }
          )
        ]
      }
    )
  ] });
};
const EditableArray = ({
  path,
  fields,
  children,
  className,
  top,
  start,
  dontAddInputsFor
}) => {
  const openEditor = useEditorStore((s) => s.openEditor);
  const pageName = usePageName();
  const { locale, auth } = usePage().props;
  const isRTL = locale === "ar";
  let inputs;
  if (typeof fields === "object" && fields !== null && !Array.isArray(fields)) {
    const entries = Object.entries(fields);
    const filteredEntries = dontAddInputsFor ? entries.filter(([key, map]) => !dontAddInputsFor.includes(key)) : entries;
    inputs = filteredEntries.map(([key]) => ({
      key,
      type: inferFieldType(key)
    }));
  } else {
    inputs = [
      {
        key: inferFieldType(fields),
        type: inferFieldType(fields)
      }
    ];
  }
  const array = true;
  const positionStyles = {
    top: top ?? "5%",
    [isRTL ? "right" : "left"]: start ?? "10%",
    position: "absolute",
    transform: `translate(${isRTL ? "50%" : "-50%"}, -50%)`
  };
  return /* @__PURE__ */ jsxs("div", { className: `relative ${className}`, children: [
    children,
    // auth ?
    /* @__PURE__ */ jsx(
      "button",
      {
        title: "Add Item",
        type: "button",
        onClick: () => openEditor(pageName, path, void 0, void 0, { array, inputs }),
        className: "w-16  h-9 rounded-full shadow-lg flex items-center justify-center gap-2 text-sm\n          bg-green-600 text-white cursor-pointer hover:bg-green-700 hover:scale-105 \n          transition-transform z-1000",
        style: positionStyles,
        children: locale === "en" ? "➕Add" : "➕اضافة"
      }
    )
  ] });
};
const EditableImage = ({
  src,
  path,
  className,
  children,
  top,
  start,
  zIndex
}) => {
  const openEditor = useEditorStore((s) => s.openEditor);
  const pageName = usePageName();
  const { locale, auth } = usePage().props;
  const isRTL = locale === "ar";
  const positionStyles = {
    top: top ?? "20%",
    [isRTL ? "right" : "left"]: start ?? "50%",
    position: "absolute",
    transform: `translate(${isRTL ? "50%" : "-50%"}, -50%)`,
    zIndex
  };
  return /* @__PURE__ */ jsxs("div", { className: `relative ${className}`, children: [
    children,
    // auth ?
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        title: "Edit image",
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          openEditor(pageName, path, "image", src);
        },
        style: positionStyles,
        className: "w-7 h-7 bg-gray-500/80 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 duration-300 z-1000 text-sm",
        children: "🖼️"
      }
    )
  ] });
};
const AchivementsSection = ({ achivements, achivementsLabel, achivementsTitle, achivementsImage }) => {
  const { locale } = usePage().props;
  return /* @__PURE__ */ jsxs("div", { id: "achivements", className: "w-full scroll-m-20 px-largeSaveSpace max-desc:px-mobSaveSpace  py-20 relative", children: [
    /* @__PURE__ */ jsx(EditableImage, { start: "90%", top: "4rem", path: "achivementsImage", src: achivementsImage, className: "w-full h-full absolute! top-0 left-0 ", children: /* @__PURE__ */ jsx(Image, { className: "w-full h-full absolute top-0 left-0 object-cover opacity-10", src: achivementsImage }) }),
    /* @__PURE__ */ jsx(Label, { title: achivementsLabel, path: "achivementsLabel", className: "mx-auto" }),
    /* @__PURE__ */ jsx(EditableText, { path: "achivementsTitle", text: achivementsTitle, className: "mb-6 w-fit mx-auto mt-2 ", children: /* @__PURE__ */ jsx(MainTitle, { center: true, black: true, children: achivementsTitle }) }),
    /* @__PURE__ */ jsx("div", { dir: "ltr", children: /* @__PURE__ */ jsxs(
      EditableArray,
      {
        top: "-0.8rem",
        start: "4rem",
        fields: achivements[0],
        path: "achivements",
        className: "flex flex-col items-center max-desc:items-start gap-8 w-full pt-4 ",
        children: [
          achivements.map((ahv, i) => /* @__PURE__ */ jsx(
            EditableObject,
            {
              path: `achivements.${i}`,
              fields: ahv,
              hideFirst: true,
              deletable: true,
              richText: true,
              className: ` ${i % 2 != 0 ? "desc:-translate-x-1/2 desc:left-5" : "desc:translate-x-1/2 desc:right-5"}  z-10 `,
              top: "40%",
              start: "40%",
              children: /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `w-fit  flex max-desc:flex-col-reverse 
                ${i % 2 == 0 && "desc:flex-row-reverse"}  items-start max-desc:items-center  gap-8 `,
                  children: [
                    /* @__PURE__ */ jsxs("div", { dir: locale == "ar" ? "rtl" : "ltr", className: "desc:max-w-[23rem] w-full  ", children: [
                      /* @__PURE__ */ jsx(SectionTitle, { children: ahv.title, className: `text-2xl leading-4 text-arch-dark  font-medium mb-3  ` }),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "text-lg text-arch-gray leading-3",
                          dangerouslySetInnerHTML: { __html: ahv.description }
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "shrink-0 mt-3 w-10 aspect-square rounded-full flex justify-center items-center text-arch-card bg-arch-accent ",
                        children: i
                      }
                    )
                  ]
                }
              )
            },
            i
          )),
          /* @__PURE__ */ jsx("div", { className: "w-1 bg-arch-gray/20 h-full absolute top-0 left-1/2 -translate-x-1/2 max-desc:hidden" })
        ]
      }
    ) })
  ] });
};
const CoursesSection = ({ viewCourseButton, courses, coursesTitle, links, coursesLabel }) => {
  return /* @__PURE__ */ jsxs("div", { id: "courses", className: "scroll-m-10 py-16 px-largeSaveSpace max-desc:px-mobSaveSpace bg-arch-accent/10", children: [
    /* @__PURE__ */ jsx(Label, { path: "coursesLabel", title: coursesLabel }),
    /* @__PURE__ */ jsx(EditableText, { path: "coursesTitle", text: coursesTitle, className: "w-fit mb-14", children: /* @__PURE__ */ jsx(MainTitle, { black: true, children: coursesTitle }) }),
    /* @__PURE__ */ jsx("div", { className: "grid max-mob:grid-cols-1 max-desc:grid-cols-2 grid-cols-3 gap-8", children: courses.map((course) => /* @__PURE__ */ jsx(
      CourseCard,
      {
        viewCourseButton,
        ...course
      },
      course.id
    )) }),
    /* @__PURE__ */ jsx("div", { className: "mt-14 flex justify-center", children: /* @__PURE__ */ jsx(Pagination, { links }) })
  ] });
};
const Description = ({ children, className }) => {
  return /* @__PURE__ */ jsx("p", { className: `${className}`, children });
};
const ProjectPopup = ({ project, onClose }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);
  if (!project) return null;
  const { locale } = usePage().props;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[1300] bg-black/80 flex items-center justify-center animate-fadeIn", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative w-[90%] max-w-[1920px] h-[90%] bg-arch-light rounded-2xl removeScroll shadow-2xl flex max-desc:flex-col animate-scaleIn overflow-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-[60%] h-full max-desc:w-full  bg-black removeScroll ", children: [
        /* @__PURE__ */ jsx("div", { className: "h-[calc(100%-100px)]", children: /* @__PURE__ */ jsx(
          Swiper,
          {
            modules: [Thumbs],
            thumbs: { swiper: thumbsSwiper },
            className: "h-full",
            children: project.images.map((img, i) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx(
              "img",
              {
                src: img.image,
                className: "w-full h-full object-cover"
              }
            ) }, i))
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "h-[100px] p-2 bg-black", children: /* @__PURE__ */ jsx(
          Swiper,
          {
            modules: [Thumbs],
            onSwiper: setThumbsSwiper,
            slidesPerView: 4,
            spaceBetween: 10,
            watchSlidesProgress: true,
            className: "h-full",
            children: project.images.map((img, i) => /* @__PURE__ */ jsx(SwiperSlide, { className: "p-2", children: /* @__PURE__ */ jsx("div", { className: "h-full w-full cursor-pointer rounded-md overflow-hidden border-2 border-transparent  swiper-thumb", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: img.image,
                className: "w-full h-full object-cover"
              }
            ) }) }, i))
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-[40%] max-desc:w-full p-10 max-desc:p-6 max-mob:p-mobSaveSpace flex flex-col justify-center", children: [
        /* @__PURE__ */ jsx(Description, { className: "text-sm text-gray-400 mb-2", children: project.created_at }),
        /* @__PURE__ */ jsx(SectionTitle, { className: "text-3xl font-bold mb-4", children: project.name }),
        /* @__PURE__ */ jsx(Description, { className: "text-gray-600 leading-7", children: project.description }),
        /* @__PURE__ */ jsx(
          Button,
          {
            className: "mt-6 w-fit max-mob:w-full",
            children: locale === "en" ? "close" : "اغلاق",
            clickFunction: onClose
          }
        )
      ] })
    ] })
  ] });
};
const ProjectsSection = ({ projects, projectsDescription, projectsLabel, projectsTitle }) => {
  const [activeProject, setActiveProject] = useState(null);
  return /* @__PURE__ */ jsxs("div", { id: "projects", className: "w-full py-20 scroll-m-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-full px-largeSaveSpace max-desc:px-mobSaveSpace mb-16", children: [
      /* @__PURE__ */ jsx(Label, { className: "mx-auto", path: "projectsLabel", title: projectsLabel }),
      /* @__PURE__ */ jsx(
        EditableText,
        {
          top: "50%",
          path: "projectsTitle",
          text: projectsTitle,
          className: "w-fit mx-auto",
          children: /* @__PURE__ */ jsx(
            MainTitle,
            {
              center: true,
              children: projectsTitle,
              black: true
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        EditableText,
        {
          richtext: true,
          text: projectsDescription,
          path: "projectsDescription",
          children: projectsDescription,
          className: "text-arch-gray w-fit my-4 text-lg leading-4  text-center "
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      Swiper,
      {
        modules: [Autoplay],
        slidesPerView: 1.5,
        centeredSlides: true,
        spaceBetween: 0,
        initialSlide: 2,
        speed: 900,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false
        },
        breakpoints: {
          768: {
            slidesPerView: 2.5
          },
          992: {
            slidesPerView: 3.5
          }
        },
        className: "projects-swiper  ",
        children: projects.map((project, index) => /* @__PURE__ */ jsx(SwiperSlide, { children: ({ isActive }) => /* @__PURE__ */ jsx(
          ProjectCard,
          {
            onCLick: setActiveProject,
            ...project,
            isActive
          }
        ) }, index))
      }
    ),
    activeProject && /* @__PURE__ */ jsx(
      ProjectPopup,
      {
        project: activeProject,
        onClose: () => setActiveProject(null)
      }
    )
  ] });
};
const ServicesSection = ({ services, servicesLabel, servicesTitle, viewCardButtonText }) => {
  const goToPage = (e, link) => {
    e.preventDefault();
    router.visit(link);
  };
  return /* @__PURE__ */ jsx("section", { id: "services", className: "py-20 bg-arch-accent/10 px-largeSaveSpace max-desc:px-mobSaveSpace scroll-m-16", children: /* @__PURE__ */ jsxs("div", { className: "", children: [
    /* @__PURE__ */ jsx(Label, { title: servicesLabel, path: "servicesLabel" }),
    /* @__PURE__ */ jsx(
      EditableText,
      {
        className: "w-fit mt-1 mb-8",
        text: servicesTitle,
        path: "servicesTitle",
        children: /* @__PURE__ */ jsx(MainTitle, { children: servicesTitle, black: true })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-6", children: services.map((service, index) => /* @__PURE__ */ jsx(
      EditableObject,
      {
        dontAddInputsFor: ["link"],
        richText: true,
        fields: service,
        path: `services.${index}`,
        className: "bg-arch-light rounded-lg shadow-md   hover:shadow-xl transition border-2 border-transparent hover:border-arch-accent w-[calc((100%-3rem)/3)] max-desc:w-[calc((100%-3rem)/2)] max-mob:w-full ",
        children: /* @__PURE__ */ jsxs(
          "a",
          {
            className: "w-full p-6  h-full flex flex-col justify-between",
            onClick: (e) => !service.link.includes("#") && goToPage(e, service.link),
            href: service.link,
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-arch-accent/20 p-3 w-fit aspect-square flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx(Image, { src: service.icon, className: "w-16 object-contain" }) }),
                /* @__PURE__ */ jsx(SectionTitle, { className: "font-bold text-xl text-arch-dark mb-3 ", children: service.title }),
                /* @__PURE__ */ jsx("div", { className: "text-arch-gray font-medium", dangerouslySetInnerHTML: { __html: service.description } })
              ] }),
              /* @__PURE__ */ jsx(
                EditableText,
                {
                  text: viewCardButtonText,
                  path: "viewCardButtonText",
                  className: "w-fit max-mob:w-full mt-5",
                  children: /* @__PURE__ */ jsx(Button, { className: "max-mob:w-full", children: viewCardButtonText })
                }
              )
            ]
          }
        )
      },
      index
    )) })
  ] }) });
};
const Review = ({ description, stars, userImage, userJob, userName, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const descRef = useRef(null);
  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    setIsClamped(el.scrollHeight >= el.clientHeight + 1);
  }, [description]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-[25.5rem] bg-arch-card rounded-3xl\r\n                  border border-arch-gray/10\r\n                  p-8\r\n                  shadow-review\r\n                  hover:shadow-reviewHover\r\n                  transition-all duration-500\r\n                  hover:-translate-y-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
      userImage ? /* @__PURE__ */ jsx(
        Image,
        {
          src: userImage,
          className: "\r\n                        w-16 aspect-square rounded-full object-cover\r\n                        border-2 border-arch-accent/20\r\n                      "
        }
      ) : /* @__PURE__ */ jsx(
        "div",
        {
          className: "\r\n                        w-16 aspect-square rounded-full\r\n                        bg-arch-light\r\n                        border-2 border-arch-accent/20\r\n                        flex items-center justify-center\r\n                        text-arch-accent\r\n                        font-bold text-lg\r\n                      ",
          children: userName?.charAt(0)
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(SectionTitle, { children: userName, className: "text-lg font-medium text-arch-dark" }),
        /* @__PURE__ */ jsx(
          Description,
          {
            children: userJob,
            className: "text-sm text-arch-gray"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: descRef,
        className: `
          text-xl text-arch-gray leading-4
          overflow-hidden
          transition-all duration-500 ease-in-out
          ${!expanded ? "line-clamp-4" : "line-clamp-none"}
        `,
        dangerouslySetInnerHTML: { __html: description }
      }
    ),
    isClamped && /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(
      Button,
      {
        transparent: true,
        dontAddShadow: true,
        dontAddHoverEffect: true,
        dontAddPadding: true,
        black: true,
        clickFunction: () => setExpanded((prev) => !prev),
        className: "",
        children: expanded ? "Show Less ↑" : "Show More ↓"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 flex items-center gap-1", children: Array.from({ length: 5 }).map((_, i) => {
      const starsNumbers = Number(stars);
      const filled = i < Math.floor(starsNumbers);
      const half = !filled && i < starsNumbers;
      return /* @__PURE__ */ jsxs(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          className: "w-5 h-5",
          stroke: "currentColor",
          strokeWidth: 1.5,
          fill: "none",
          style: { color: "var(--color-arch-accent, #B09B71)" },
          children: [
            /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("clipPath", { id: `half-${index}-${i}`, children: /* @__PURE__ */ jsx("rect", { x: "0", y: "0", width: "12", height: "24" }) }) }),
            /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                fill: "currentColor",
                clipPath: half ? `url(#half-${index}-${i})` : void 0,
                opacity: filled || half ? 1 : 0,
                d: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              }
            ),
            /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              }
            )
          ]
        },
        i
      );
    }) })
  ] });
};
function StudentReviews({ reviews, reviewsLabel, reviewsTitle }) {
  return /* @__PURE__ */ jsx("section", { id: "reviews", className: "w-full py-24 bg-arch-accent/10 overflow-hidden scroll-m-8", children: /* @__PURE__ */ jsxs("div", { className: "px-largeSaveSpace max-desc:px-mobSaveSpace", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-12", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { title: reviewsLabel, path: "reviewsLabel" }),
        /* @__PURE__ */ jsx(
          EditableText,
          {
            className: "w-fit",
            path: "reviewsTitle",
            text: reviewsTitle,
            children: /* @__PURE__ */ jsx(MainTitle, { children: reviewsTitle, black: true })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hidden tab:flex rtl:flex-row-reverse items-center gap-3", children: [
        /* @__PURE__ */ jsx(Button, { className: "student-prev button", children: /* @__PURE__ */ jsx(FaArrowRight, { className: "-scale-x-100" }) }),
        /* @__PURE__ */ jsx(Button, { className: "student-next button", children: /* @__PURE__ */ jsx(FaArrowRight, {}) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      EditableArray,
      {
        fields: reviews[0],
        path: "reviews",
        top: "-1rem",
        start: "1rem",
        children: /* @__PURE__ */ jsx(
          Swiper,
          {
            modules: [Navigation, Autoplay],
            centeredSlides: true,
            spaceBetween: 24,
            slidesPerView: 1.2,
            speed: 900,
            autoplay: {
              delay: 3500,
              disableOnInteraction: false
            },
            navigation: {
              prevEl: ".student-prev",
              nextEl: ".student-next"
            },
            breakpoints: {
              768: {
                slidesPerView: 2
              },
              992: {
                slidesPerView: 3
              }
            },
            className: "!overflow-visible",
            children: reviews.map((review, index) => index > 0 && /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx(
              EditableObject,
              {
                path: `reviews.${index}`,
                fields: review,
                deletable: true,
                richText: true,
                children: /* @__PURE__ */ jsx(Review, { ...review, index })
              }
            ) }, index))
          }
        )
      }
    )
  ] }) });
}
const Hero = ({
  heroBackground,
  heroProjectsButton,
  heroCoursesButton,
  heroDescription,
  heroProfileImage,
  heroTitle
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "w-full min-h-screen relative overflow-hidden px-largeSaveSpace max-desc:px-mobSaveSpace flex justify-center items-center  pt-32 max-desc:pt-40 pb-10",
      children: [
        heroBackground && /* @__PURE__ */ jsxs(
          EditableImage,
          {
            start: "40%",
            top: "8rem",
            className: "absolute! top-0 start-0 w-full h-full",
            src: heroBackground,
            path: "heroBackground",
            children: [
              /* @__PURE__ */ jsx(
                Image,
                {
                  className: "absolute w-full h-full top-0 left-0 object-cover",
                  src: heroBackground
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0  bg-gradient-to-br from-arch-dark/35  to-arch-charcoal/50" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "w-full flex justify-between items-center max-desc:items-start gap-10 max-desc:gap-5 max-desc:flex-col ",
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "desc:max-w-xl  w-full",
                  children: [
                    heroTitle && /* @__PURE__ */ jsx(
                      EditableText,
                      {
                        top: "30%",
                        start: "10%",
                        text: heroTitle,
                        path: "heroTitle",
                        children: /* @__PURE__ */ jsx(
                          MainTitle,
                          {
                            hero: true,
                            className: "mb-4",
                            white: true,
                            children: heroTitle
                          }
                        )
                      }
                    ),
                    heroDescription && /* @__PURE__ */ jsx(
                      EditableText,
                      {
                        start: "10%",
                        top: "40%",
                        text: heroDescription,
                        path: "heroDescription",
                        className: "text-arch-light/90 text-lg leading-4",
                        richtext: true,
                        children: heroDescription
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "flex max-mob:flex-col items-center max-desc:justify-center gap-4 mt-6",
                        children: [
                          heroProjectsButton && /* @__PURE__ */ jsx(
                            EditableObject,
                            {
                              dontAddInputsFor: ["id"],
                              className: "max-mob:w-full",
                              fields: heroProjectsButton,
                              path: "heroProjectsButton",
                              children: /* @__PURE__ */ jsx("a", { href: heroProjectsButton.id, children: /* @__PURE__ */ jsx(
                                Button,
                                {
                                  className: "max-mob:w-full",
                                  children: heroProjectsButton.text
                                }
                              ) })
                            }
                          ),
                          heroCoursesButton && /* @__PURE__ */ jsx(
                            EditableObject,
                            {
                              dontAddInputsFor: ["id"],
                              className: "max-mob:w-full",
                              fields: heroCoursesButton,
                              path: "heroCoursesButton",
                              children: /* @__PURE__ */ jsx("a", { href: heroCoursesButton.id, children: /* @__PURE__ */ jsx(
                                Button,
                                {
                                  className: "max-mob:w-full",
                                  children: heroCoursesButton.text,
                                  border: true
                                }
                              ) })
                            }
                          )
                        ]
                      }
                    )
                  ]
                }
              ),
              heroProfileImage && /* @__PURE__ */ jsx(
                EditableImage,
                {
                  className: "max-w-sm w-full max-desc:self-center rounded-lg overflow-hidden",
                  src: heroProfileImage,
                  path: "heroProfileImage",
                  children: /* @__PURE__ */ jsx(
                    Image,
                    {
                      className: "w-full",
                      src: heroProfileImage
                    }
                  )
                }
              )
            ]
          }
        )
      ]
    }
  );
};
const Home = ({ allData }) => {
  const { data, projects, coursesData } = allData;
  const { courses, links } = coursesData;
  const hero = {
    heroProjectsButton: data.heroProjectsButton,
    heroBackground: data.heroBackground,
    heroCoursesButton: data.heroCoursesButton,
    heroDescription: data.heroDescription,
    heroTitle: data.heroTitle,
    heroProfileImage: data.heroProfileImage
  };
  const about = {
    aboutButton: data.aboutButton,
    aboutDescription: data.aboutDescription,
    aboutImages: data.aboutImages,
    aboutTitle: data.aboutTitle,
    aboutLabel: data.aboutLabel
  };
  const projectsSectionProps = {
    projects,
    projectsDescription: data.projectsDescription,
    projectsLabel: data.projectsLabel,
    projectsTitle: data.projectsTitle
  };
  const coursesSectionProps = {
    coursesTitle: data.coursesTitle,
    viewCourseButton: data.viewCourseButton,
    courses,
    links,
    coursesLabel: data.coursesLabel
  };
  const achivements = {
    achivements: data.achivements,
    achivementsLabel: data.achivementsLabel,
    achivementsTitle: data.achivementsTitle,
    achivementsImage: data.achivementsImage
  };
  const reviews = {
    reviews: data.reviews,
    reviewsLabel: data.reviewsLabel,
    reviewsTitle: data.reviewsTitle
  };
  const services = {
    services: data.services,
    servicesLabel: data.servicesLabel,
    servicesTitle: data.servicesTitle,
    viewCardButtonText: data.viewCardButtonText
  };
  return /* @__PURE__ */ jsx(PageContentProvider, { pageName: "Home", children: /* @__PURE__ */ jsxs("div", { className: "", children: [
    /* @__PURE__ */ jsx(Hero, { ...hero }),
    /* @__PURE__ */ jsx(AboutSection, { ...about }),
    /* @__PURE__ */ jsx(ServicesSection, { ...services }),
    /* @__PURE__ */ jsx(ProjectsSection, { ...projectsSectionProps }),
    /* @__PURE__ */ jsx(CoursesSection, { ...coursesSectionProps }),
    /* @__PURE__ */ jsx(AchivementsSection, { ...achivements }),
    /* @__PURE__ */ jsx(StudentReviews, { ...reviews })
  ] }) });
};
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Home
}, Symbol.toStringTag, { value: "Module" }));
const GlobalServices = ({ discoverButton, services }) => {
  return /* @__PURE__ */ jsxs("div", { className: "w-full px-largeSaveSpace max-desc:px-mobSaveSpace py-20", children: [
    /* @__PURE__ */ jsx(EditableArray, { top: "-1.5rem", path: "services", fields: services[0], className: "w-full", children: services.map((service, i) => /* @__PURE__ */ jsxs(
      EditableObject,
      {
        top: "30%",
        start: i % 2 == 0 ? "10%" : "90%",
        richText: true,
        fields: service,
        deletable: true,
        hideFirst: true,
        path: `services.${i}`,
        className: `w-full flex ${i % 2 == 0 ? "max-desc:flex-col" : "max-desc:flex-col flex-row-reverse"}  justify-between items-center gap-8 mb-10`,
        children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              SectionTitle,
              {
                children: service.title,
                className: "text-xl font-bold text-arch-dark leading-2 mb-4"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "text-arch-gray text-lg leading-2",
                dangerouslySetInnerHTML: { __html: service.description }
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            Image,
            {
              src: service.image,
              className: "max-w-xl w-full"
            }
          )
        ]
      },
      i
    )) }),
    /* @__PURE__ */ jsx(
      EditableObject,
      {
        className: "w-fit max-mob:w-full mx-auto mt-24",
        fields: discoverButton,
        path: "discoverButton",
        children: /* @__PURE__ */ jsx("a", { href: discoverButton.link, target: "_blank", className: "max-mob:w-full max-mob:block", children: /* @__PURE__ */ jsx(
          Button,
          {
            className: "max-mob:w-full",
            children: discoverButton.text
          }
        ) })
      }
    )
  ] });
};
const Services = ({ allData }) => {
  const { data, serviceName } = allData;
  const hero = {
    heroBackground: data.heroBackground,
    heroDescription: data.heroDescription,
    heroTitle: data.heroTitle
  };
  const global = {
    discoverButton: data.discoverButton,
    services: data.services
  };
  return /* @__PURE__ */ jsx(PageContentProvider, { pageName: serviceName, children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(Hero, { ...hero }),
    /* @__PURE__ */ jsx(GlobalServices, { ...global })
  ] }) });
};
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Services
}, Symbol.toStringTag, { value: "Module" }));
const Login = () => {
  const { locale } = usePage().props;
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const button = form.querySelector("button[type='submit']");
    const email = form.email.value;
    const password = form.password.value;
    button.disabled = true;
    button.innerHTML = `
      <span class="flex items-center justify-center gap-2">
        <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ${locale === "ar" ? "جاري تسجيل الدخول..." : "Logging in..."}
      </span>
    `;
    setError("");
    try {
      const res = await axios.post("/login", { email, password });
      if (res.data) {
        router.reload();
        router.visit("/dashboard");
      }
    } catch {
      setError(
        locale === "ar" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Invalid email or password"
      );
    } finally {
      button.disabled = false;
      button.innerHTML = locale === "ar" ? "تسجيل الدخول" : "Login";
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex items-center justify-center bg-gray-100", children: [
    /* @__PURE__ */ jsx(Head, { title: "login" }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: submit,
        className: "w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4",
        children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-center", children: locale === "ar" ? "تسجيل الدخول" : "Login" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              name: "email",
              type: "email",
              placeholder: locale === "ar" ? "البريد الإلكتروني" : "Email",
              className: "w-full border rounded-lg px-4 py-2",
              required: true
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              name: "password",
              type: "password",
              placeholder: locale === "ar" ? "كلمة المرور" : "Password",
              className: "w-full border rounded-lg px-4 py-2 ",
              required: true
            }
          ),
          error && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 text-center", children: error }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center",
              children: locale === "ar" ? "تسجيل الدخول" : "Login"
            }
          )
        ]
      }
    )
  ] });
};
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login
}, Symbol.toStringTag, { value: "Module" }));
const Footer = ({ contactInformations, footerLogo, footerRightsText, footerSocialMediaLinks, siteMap, contactTitle, siteMapTitle }) => {
  const { component } = usePage();
  const scrollToSection = (id, e) => {
    e.preventDefault();
    router.visit("/" + id);
  };
  return /* @__PURE__ */ jsx("div", { className: "w-full py-20 bg-arch-charcoal", children: /* @__PURE__ */ jsxs("div", { className: "w-full px-largeSaveSpace max-desc:px-mobSaveSpace", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-full  flex max-desc:flex-col justify-between gap-8 pb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          EditableImage,
          {
            className: "w-fit desc:mx-auto",
            src: footerLogo,
            path: "footerLogo",
            children: /* @__PURE__ */ jsx(Image, { src: footerLogo, className: "w-28 object-contain " })
          }
        ),
        /* @__PURE__ */ jsx(
          EditableArray,
          {
            top: "-1.5rem",
            className: "flex items-center gap-4 mt-6",
            fields: footerSocialMediaLinks[0],
            path: "footerSocialMediaLinks",
            children: footerSocialMediaLinks.map((socialmedia, i) => /* @__PURE__ */ jsx(
              EditableObject,
              {
                fields: socialmedia,
                path: `footerSocialMediaLinks.${i}`,
                deletable: true,
                hideFirst: true,
                children: /* @__PURE__ */ jsx("a", { href: socialmedia.link, target: "_blank", children: /* @__PURE__ */ jsx(Image, { src: socialmedia.icon, className: "w-5 object-contain" }) })
              },
              i
            ))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          EditableText,
          {
            className: "w-fit mb-5",
            text: siteMapTitle,
            path: "siteMapTitle",
            children: /* @__PURE__ */ jsx(SectionTitle, { children: siteMapTitle, className: "text-arch-card font-medium text-xl  leading-2" })
          }
        ),
        siteMap.map((site, i) => /* @__PURE__ */ jsx(
          EditableText,
          {
            text: site.text,
            path: `siteMap.${i}.text`,
            className: "mb-4 w-fit",
            children: /* @__PURE__ */ jsx(
              "a",
              {
                className: "text-arch-card leading-2 hover:underline underline-offset-8",
                onClick: (e) => component != "Home" && scrollToSection(site.id, e),
                href: site.id,
                children: site.text
              }
            )
          },
          i
        ))
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          EditableText,
          {
            className: "w-fit mb-5",
            text: contactTitle,
            path: "contactTitle",
            children: /* @__PURE__ */ jsx(SectionTitle, { children: contactTitle, className: "text-arch-card font-medium text-xl  leading-2" })
          }
        ),
        /* @__PURE__ */ jsx("div", { dir: "ltr", className: "w-fit", children: /* @__PURE__ */ jsx(
          EditableArray,
          {
            fields: contactInformations[0],
            path: "contactInformations",
            children: contactInformations.map((contact, i) => /* @__PURE__ */ jsxs(
              EditableObject,
              {
                deletable: true,
                hideFirst: true,
                fields: contact,
                path: `contactInformations.${i}`,
                className: "flex items-center gap-2 mb-6 w-fit",
                children: [
                  /* @__PURE__ */ jsx(Image, { src: contact.icon, className: "w-5 object-contain" }),
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      target: "_blank",
                      className: "text-arch-card leading-2",
                      href: contact.link,
                      children: contact.text
                    }
                  )
                ]
              },
              i
            ))
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "w-full  pt-8 border-t-2 border-t-arch-card/10", children: /* @__PURE__ */ jsx(
      EditableText,
      {
        richtext: true,
        text: footerRightsText,
        path: "footerRightsText",
        className: "text-arch-card text-center text-lg leading-2",
        children: footerRightsText
      }
    ) })
  ] }) });
};
const Bars = ({ list, showList }) => {
  return /* @__PURE__ */ jsxs("div", { className: "w-8 h-8 relative hidden max-desc:block text-arch-dark", children: [
    /* @__PURE__ */ jsx(
      FaBars,
      {
        onClick: () => showList(true),
        className: `
          ${list ? "scale-0" : "scale-100"}
                absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                text-[1.2rem] cursor-pointer duration-300`
      }
    ),
    /* @__PURE__ */ jsx(
      RxCross2,
      {
        onClick: () => showList(false),
        className: `
          ${list ? "scale-100" : "scale-0"}
                    absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                    text-[1.2rem] cursor-pointer duration-300`
      }
    )
  ] });
};
const NavBarLinks = ({ mainLinks, navBarWhatsApp, className, closeList, navBarLogo }) => {
  const { component } = usePage();
  const scrollToSection = (id, e) => {
    e.preventDefault();
    router.visit("/" + id);
  };
  return /* @__PURE__ */ jsxs("ul", { onClick: () => closeList && closeList(false), className: `  ${className} `, children: [
    navBarLogo && /* @__PURE__ */ jsx(
      EditableObject,
      {
        top: "40%",
        start: "50%",
        path: "navBarLogo",
        fields: navBarLogo,
        children: /* @__PURE__ */ jsx(Link, { href: navBarLogo.link, children: /* @__PURE__ */ jsx(Image, { className: ` w-[4.5rem] block  object-contain mb-10 mx-auto `, src: navBarLogo.icon }) })
      }
    ),
    mainLinks.map((navBarLink, i) => /* @__PURE__ */ jsx(
      "a",
      {
        onClick: (e) => component != "Home" && scrollToSection(navBarLink.id, e),
        href: navBarLink.id,
        className: `
              underline-offset-8
              hover:underline
              text-arch-dark
              duration-300
              max-desc:block 
              max-desc:mx-auto 
              max-desc:w-fit
              max-desc:my-4
              `,
        children: /* @__PURE__ */ jsx(EditableText, { start: "80%", text: navBarLink.text, path: `mainLinks.${i}.text`, children: navBarLink.text })
      },
      i
    )),
    /* @__PURE__ */ jsx(
      EditableObject,
      {
        start: "40%",
        top: "40%",
        className: "max-mob:block hidden w-fit mx-auto",
        path: "navBarWhatsApp",
        fields: navBarWhatsApp,
        children: /* @__PURE__ */ jsxs("a", { className: "flex items-center gap-1 px-4 py-2 ", target: "_blank", href: navBarWhatsApp.link, rel: "noreferrer", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              transparent: true,
              black: true,
              dontAddShadow: true,
              dontAddHoverEffect: true,
              dontAddPadding: true,
              children: navBarWhatsApp.text
            }
          ),
          /* @__PURE__ */ jsx(ImWhatsapp, { className: "text-[18px]" })
        ] })
      }
    )
  ] });
};
const LanguageChanger = ({
  className,
  navBarLang
}) => {
  const {
    props: { locale }
  } = usePage();
  const [newUrl, setNewUrl] = useState(null);
  useEffect(() => {
    const { pathname, search, hash } = window.location;
    const noPublic = pathname.replace(/^\/public/, "");
    const cleanPath = noPublic.replace(/^\/(en|ar)/, "");
    const finalPath = `${cleanPath || "/"}${search}${hash}`;
    const url = locale === "en" ? `/ar${finalPath}` : `/en${finalPath}`;
    setNewUrl(url);
  }, [locale]);
  return /* @__PURE__ */ jsx(EditableObject, { dontAddInputsFor: ["icon"], top: "40%", path: "navBarLang", fields: navBarLang, children: /* @__PURE__ */ jsxs(
    Link,
    {
      href: newUrl || "",
      className: `${className} flex justify-center items-center gap-1 text-l overflow-hidden`,
      children: [
        /* @__PURE__ */ jsx("span", { className: "leading-27  ", children: navBarLang.text }),
        /* @__PURE__ */ jsx(MdOutlineLanguage, { className: "text-[18px]" })
      ]
    }
  ) });
};
const NavBarWhatsAppAndLanguageChanger = ({
  className,
  navBarLang,
  navBarWhatsApp
}) => {
  return /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-5 text-arch-dark `, children: [
    /* @__PURE__ */ jsx(LanguageChanger, { navBarLang }),
    /* @__PURE__ */ jsx(
      EditableObject,
      {
        start: "40%",
        top: "40%",
        className: "max-mob:hidden",
        path: "navBarWhatsApp",
        fields: navBarWhatsApp,
        children: /* @__PURE__ */ jsxs("a", { className: "flex items-center gap-1 px-4 py-2 ", target: "_blank", href: navBarWhatsApp.link, rel: "noreferrer", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              transparent: true,
              black: true,
              dontAddShadow: true,
              dontAddHoverEffect: true,
              dontAddPadding: true,
              children: navBarWhatsApp.text
            }
          ),
          /* @__PURE__ */ jsx(ImWhatsapp, { className: "text-[18px]" })
        ] })
      }
    )
  ] });
};
const NavBar = ({ mainLinks, navBarLang, navBarLogo, navBarWhatsApp }) => {
  const [list, setList] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        onClick: () => setList(false),
        className: `fixed inset-0 z-[1150] bg-black/50   transition-opacity duration-300 ` + (list ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"),
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "max-w-[1920px] w-full fixed z-1100 top-0 left-1/2 -translate-x-1/2 pt-5 px-5  bg-transparent", children: /* @__PURE__ */ jsxs(
      "nav",
      {
        className: `    
            w-full h-20 flex justify-between items-center
            bg-gradient-to-r from-arch-gray/95 via-gray-200 to-arch-gray/95
            border-2 border-arch-accent
            rounded-xl
            px-5
            `,
        children: [
          /* @__PURE__ */ jsx(
            EditableObject,
            {
              start: "60%",
              top: "40%",
              path: "navBarLogo",
              fields: navBarLogo,
              children: /* @__PURE__ */ jsx(Link, { href: navBarLogo.link, children: /* @__PURE__ */ jsx(Image, { className: ` w-[4.5rem] block  object-contain `, src: navBarLogo.icon }) })
            }
          ),
          /* @__PURE__ */ jsx(
            NavBarLinks,
            {
              className: `flex justify-center items-center gap-4 max-desc:hidden`,
              mainLinks,
              navBarWhatsApp
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsx(
                  NavBarWhatsAppAndLanguageChanger,
                  {
                    className: "flex",
                    navBarLang,
                    navBarWhatsApp
                  }
                ),
                /* @__PURE__ */ jsx(Bars, { list, showList: setList })
              ]
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(
      NavBarLinks,
      {
        closeList: setList,
        className: `
          desc:hidden
          max-desc:block
          max-desc:py-[20vh]
          max-desc:bg-gradient-to-b 
          max-desc:from-arch-gray/95 
          max-desc:via-gray-200 
          max-desc:to-arch-gray/95
          max-desc:max-w-3xs
          max-desc:w-full
          max-desc:h-screen
          max-desc:fixed  
          max-desc:top-0
          max-desc:start-0
          max-desc:z-[1200]
          max-desc:overflow-auto
          ${list ? "max-desc:translate-x-0" : "max-desc:-translate-x-full rtl:translate-x-full"}
          max-desc:duration-300
        `,
        navBarLogo,
        mainLinks,
        navBarWhatsApp
      }
    )
  ] });
};
const SuccessNotification = ({
  message,
  setMessage,
  duration = 3e3
}) => {
  useEffect(() => {
    const timeout = setTimeout(() => setMessage(null), duration);
    return () => clearTimeout(timeout);
  }, []);
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 flex items-end justify-center p-4 z-50 pointer-events-none", children: /* @__PURE__ */ jsx(
    "div",
    {
      className: `max-w-md w-full bg-primary-500 backdrop-blur-md rounded-xl py-4 px-6 shadow-xl text-white font-medium text-center transition-all duration-300 ease-out `,
      role: "alert",
      children: message
    }
  ) });
};
const EditorModal = () => {
  const {
    deletable,
    open,
    type,
    path,
    pageName,
    value: editorValue,
    setValue,
    closeEditor,
    array,
    fields
  } = useEditorStore();
  const { locale, auth } = usePage().props;
  const [previews, setPreviews] = useState({});
  const [loading, setLoading] = useState(false);
  const Editor = useSharedCkEditor();
  if (!open) return null;
  const t = {
    title: locale === "en" ? "Edit Content" : "تعديل المحتوى",
    cancel: locale === "en" ? "Cancel" : "إلغاء",
    save: locale === "en" ? "Save" : "حفظ",
    addItem: locale === "en" ? "Add Item" : "إضافة عنصر",
    delete: locale === "en" ? "Delete" : "حذف",
    uploadImage: locale === "en" ? "Click to upload image" : "اضغط لاختيار صورة"
  };
  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (array) return;
    const form = e.currentTarget;
    const formData = new FormData();
    formData.append("page_name", pageName);
    formData.append("path", path);
    if (type === "object" && fields) {
      fields.forEach((field) => {
        const input = form.elements.namedItem(field.key);
        if (!input) return;
        if (field.type === "image") {
          if (input.files?.[0]) {
            formData.append(field.key, input.files[0]);
          } else if (field.value) {
            formData.append(field.key, field.value);
          }
        } else if (field.type === "richtext") {
          formData.append(field.key, editorValue || "");
        } else {
          formData.append(field.key, input.value);
        }
      });
    } else if (type === "image") {
      const input = form.elements.namedItem("image");
      if (input?.files?.[0]) {
        formData.append("image", input.files[0]);
      } else if (editorValue) {
        formData.append("value", editorValue);
      }
    } else if (type === "richtext") {
      formData.append("value", editorValue || "");
    } else {
      const input = form.elements.namedItem("value");
      if (input) {
        formData.append("value", input.value);
      }
    }
    try {
      await axios.post(`/${locale}/cms-update`, formData);
      setPreviews({});
      setLoading(false);
      closeEditor();
      router.reload();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const addItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!array || !fields) return;
    const form = e.currentTarget;
    const formData = new FormData();
    formData.append("page_name", pageName);
    formData.append("path", path);
    fields.forEach((field) => {
      const input = form.elements.namedItem(field.key);
      if (!input) return;
      if (field.type === "image") {
        if (input.files?.[0]) {
          formData.append(field.key, input.files[0] || "");
        } else
          formData.append(field.key, "");
      } else {
        formData.append(field.key, input.value || "");
      }
    });
    try {
      await axios.post(`/${locale}/cms-update-array`, formData);
      setPreviews({});
      setLoading(false);
      closeEditor();
      router.reload();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const deleteItem = async () => {
    setLoading(true);
    try {
      await axios.post(`/${locale}/cms-delete-item`, { page_name: pageName, path }, {
        headers: { "Accept": "application/json" }
      });
      setPreviews({});
      setLoading(false);
      closeEditor();
      router.reload();
    } catch (err) {
      setLoading(false);
      console.log(err);
      router.reload();
    }
  };
  if (!Editor)
    return /* @__PURE__ */ jsx(LoadingSpinner, {});
  return /* @__PURE__ */ jsx("div", { className: "fixed w-full px-6 inset-0 z-1200 flex items-center justify-center bg-black/60", children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: array ? addItem : save,
      className: "w-full   max-w-[40rem]  max-h-[90vh] overflow-auto relative  bg-white rounded-2xl p-6 shadow-xl",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-6 border-b pb-3", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-3", children: t.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 truncate", children: pageName })
        ] }),
        array && fields && /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-5", children: fields.map((field) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700", children: field.key }),
          field.type === "image" ? /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                id: `file-${field.key}`,
                name: field.key,
                accept: "image/*",
                className: "hidden",
                onChange: (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = URL.createObjectURL(file);
                  setPreviews((prev) => ({
                    ...prev,
                    [field.key]: url
                  }));
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "label",
              {
                htmlFor: `file-${field.key}`,
                className: "flex items-center justify-center h-40 w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:border-arch-accent hover:bg-gray-100 transition overflow-hidden",
                children: previews[field.key] ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: previews[field.key],
                    alt: "preview",
                    className: "w-full h-full object-contain"
                  }
                ) : /* @__PURE__ */ jsxs("div", { className: "text-gray-500 text-sm flex flex-col items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-3xl", children: "🖼️" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Select ",
                    field.key
                  ] })
                ] })
              }
            )
          ] }) : /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: field.key,
              placeholder: field.key,
              className: "h-11 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-arch-accent transition"
            }
          )
        ] }, field.key)) }),
        !array && /* @__PURE__ */ jsxs(Fragment, { children: [
          type === "object" && fields && /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-5", children: fields.map((field, i) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700", children: field.key }),
            // image
            field.type === "image" ? /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "file",
                  id: `file-${field.key}`,
                  name: field.key,
                  accept: "image/*",
                  className: "hidden",
                  onChange: (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setPreviews((prev) => ({
                      ...prev,
                      [field.key]: url
                    }));
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: `file-${field.key}`,
                  className: "flex items-center justify-center h-40 w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:border-arch-accent hover:bg-gray-100 transition overflow-hidden",
                  children: previews[field.key] ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: previews[field.key],
                      className: "w-full h-full object-contain"
                    }
                  ) : field.value ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: field.value,
                      className: "w-full h-full object-contain"
                    }
                  ) : /* @__PURE__ */ jsxs("span", { className: "text-gray-500 text-sm", children: [
                    "Select ",
                    field.key
                  ] })
                }
              )
            ] }) : (
              // rich text
              field.type === "richtext" ? /* @__PURE__ */ jsx(
                RichTextInput,
                {
                  Editor,
                  name: field.key,
                  value: editorValue || "",
                  onChange: (data) => setValue(data)
                }
              ) : (
                // regular input
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: field.key,
                    defaultValue: field.value,
                    className: "h-11 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-arch-accent transition"
                  }
                )
              )
            )
          ] }, field.key + i + "")) }),
          type === "text" && /* @__PURE__ */ jsx(
            "input",
            {
              name: "value",
              type: "text",
              defaultValue: editorValue,
              className: "w-full h-12 rounded-lg border px-4"
            }
          ),
          type === "richtext" && /* @__PURE__ */ jsx(
            RichTextInput,
            {
              Editor,
              name: "value",
              value: editorValue || "",
              onChange: (data) => setValue(data)
            }
          ),
          type === "image" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                hidden: true,
                id: "image-input",
                name: "image",
                type: "file",
                accept: "image/*",
                onChange: (e) => setValue(e.target.files?.[0] ?? null)
              }
            ),
            /* @__PURE__ */ jsx(
              "label",
              {
                htmlFor: "image-input",
                className: "h-56 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer",
                children: editorValue instanceof File ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: URL.createObjectURL(editorValue),
                    className: "h-full object-contain"
                  }
                ) : editorValue ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: editorValue,
                    className: "h-full object-contain"
                  }
                ) : /* @__PURE__ */ jsx("span", { children: t.uploadImage })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "w-full flex justify-center items-center  mb-6 mt-4", children: loading && /* @__PURE__ */ jsx("div", { className: "w-7 h-7 border-2 border-gray-300 border-t-arch-accent rounded-full animate-spin" }) }),
          /* @__PURE__ */ jsxs("div", { className: " flex flex-wrap justify-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                disabled: loading,
                type: "button",
                onClick: closeEditor,
                className: "px-5 h-10 disabled:opacity-20 rounded-lg bg-gray-100 hover:bg-gray-200 duration-200 cursor-pointer",
                children: t.cancel
              }
            ),
            deletable && /* @__PURE__ */ jsx(
              "button",
              {
                disabled: loading,
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteItem();
                },
                type: "button",
                className: "px-6 h-10 disabled:opacity-20 rounded-lg bg-red-600 hover:bg-red-700 duration-200 cursor-pointer text-white",
                children: t.delete
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                disabled: loading,
                type: "submit",
                className: "px-6 h-10 disabled:opacity-20 rounded-lg bg-arch-accent hover:bg-arch-accent duration-200 cursor-pointer text-white",
                children: array ? t.addItem : t.save
              }
            )
          ] })
        ] })
      ]
    }
  ) });
};
const Notify = createContext(null);
const ProjectLayout = ({ children }) => {
  const [message, setMessage] = useState(null);
  const { globalData, locale, auth } = usePage().props;
  const { url } = usePage();
  const isDashboard = () => url.includes("/dashboard");
  const navProps = {
    navBarLang: globalData.navBarLang,
    mainLinks: globalData.mainLinks,
    navBarLogo: globalData.navBarLogo,
    navBarWhatsApp: globalData.navBarWhatsApp
  };
  const footer = {
    contactInformations: globalData.contactInformations,
    contactTitle: globalData.contactTitle,
    footerLogo: globalData.footerLogo,
    footerRightsText: globalData.footerRightsText,
    footerSocialMediaLinks: globalData.footerSocialMediaLinks,
    siteMap: globalData.siteMap,
    siteMapTitle: globalData.siteMapTitle
  };
  return /* @__PURE__ */ jsx(Notify.Provider, { value: { message, setMessage }, children: /* @__PURE__ */ jsx(PageContentProvider, { pageName: "Global", children: /* @__PURE__ */ jsxs(
    "div",
    {
      id: "pageLayout",
      dir: locale == "ar" ? "rtl" : "ltr",
      className: `max-w-[1920px] bg-gray-100  w-full font-family-main cursor-default select-none mx-auto overflow-x-clip`,
      children: [
        message && /* @__PURE__ */ jsx(SuccessNotification, { message, setMessage }),
        /* @__PURE__ */ jsxs(Head, { children: [
          /* @__PURE__ */ jsx("link", { rel: "icon", type: "image", href: "/storage/images/logo.png" }),
          /* @__PURE__ */ jsx("title", { children: globalData.headTitle })
        ] }),
        /* @__PURE__ */ jsx(EditorModal, {}),
        auth && !isDashboard() && /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/dashboard",
            className: "\n                fixed bottom-6 left-6\n                flex items-center gap-2\n                px-5 py-3\n                bg-gradient-to-r from-indigo-600 to-purple-600\n              text-arch-light font-semibold\n                rounded-full\n                shadow-lg\n                hover:shadow-xl\n                hover:scale-105\n                active:scale-95\n                transition-all duration-200 cursor-pointer  \n                z-50\n                ",
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-lg", children: "🏠" }),
              "Dashboard"
            ]
          }
        ),
        /* @__PURE__ */ jsx(NavBar, { ...navProps }),
        children,
        /* @__PURE__ */ jsx(Footer, { ...footer })
      ]
    }
  ) }) });
};
const renderPage = (page) => createInertiaApp({
  page,
  render: ReactDOMServer.renderToString,
  resolve: (name) => {
    const pages = /* @__PURE__ */ Object.assign({
      "/Modules/Dashboard/resources/assets/js/pages/DashboardProjects.tsx": __vite_glob_0_0,
      "/Modules/Dashboard/resources/assets/js/pages/DashboardProjectsCrud.tsx": __vite_glob_0_1,
      "/Modules/Pages/resources/assets/js/pages/CourseDetailsPage.tsx": __vite_glob_0_2,
      "/Modules/Pages/resources/assets/js/pages/Home.tsx": __vite_glob_0_3,
      "/Modules/Pages/resources/assets/js/pages/Services.tsx": __vite_glob_0_4,
      "/Modules/Shared/resources/assets/js/pages/Login.tsx": __vite_glob_0_5
    });
    const pageModule = Object.entries(pages).find(([path]) => path.includes(`/${name}.tsx`))?.[1];
    if (!pageModule) throw new Error(`Page not found: ${name}`);
    pageModule.default.layout = (p) => /* @__PURE__ */ jsx(ProjectLayout, { children: p });
    return pageModule;
  },
  setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
});
{
  createServer(
    renderPage,
    { cluster: true }
  );
}
export {
  renderPage as default
};
//# sourceMappingURL=ssr.js.map
