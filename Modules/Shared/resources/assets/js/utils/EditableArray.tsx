import { usePage } from "@inertiajs/react";
import { ReactNode } from "react";
import { inferFieldType } from "./inferFieldType";
import { usePageName } from "./PageContentProvider";
import { useEditorStore } from "./useStore";

const EditableArray = ({
  path,
  fields,
  children,
  className,
  top,
  start,
  dontAddInputsFor
}: {
  children: ReactNode;
  path: string;
  fields: Record<string, string> | any;
  className?: string;
  top?: string;
  start?: string;
  dontAddInputsFor?: Array<string>
}) => {
  const openEditor = useEditorStore((s) => s.openEditor);
  const pageName = usePageName();
  const { locale, auth } = usePage().props;
  const isRTL = locale === "ar";

  let inputs;
  if (typeof fields === "object" && fields !== null && !Array.isArray(fields)) {
    const entries = Object.entries(fields);
    const filteredEntries = dontAddInputsFor ?
      entries.filter(([key, map]) => !dontAddInputsFor.includes(key)) : entries
    inputs = filteredEntries.map(([key]) => ({
      key,
      type: inferFieldType(key),
    }));
  } else {
    inputs = [
      {
        key: inferFieldType(fields),
        type: inferFieldType(fields),
      },
    ];
  }

  const array = true;

  const positionStyles: React.CSSProperties = {
    top: top ?? "5%",
    [isRTL ? "right" : "left"]: start ?? "10%",
    position: "absolute",
    transform: `translate(${isRTL ? "50%" : "-50%"}, -50%)`,
  };

  return (
    <div className={`relative ${className}`}>
      {children}
      {
        // auth ?
        <button
          title="Add Item"
          type="button"
          onClick={() =>
            openEditor(pageName, path, undefined, undefined, { array, inputs })
          }
          className="w-16  h-9 rounded-full shadow-lg flex items-center justify-center gap-2 text-sm
          bg-green-600 text-white cursor-pointer hover:bg-green-700 hover:scale-105 
          transition-transform z-1000"
          style={positionStyles}
        >
          {locale === "en" ? "➕Add" : "➕اضافة"}
        </button>
        // : ""
      }
    </div>
  );
};

export default EditableArray;