import { usePage } from "@inertiajs/react";
import { ReactNode } from "react";
import { inferFieldType } from "./inferFieldType";
import { usePageName } from "./PageContentProvider";
import { useEditorStore } from "./useStore";

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
  dontAddInputsFor,
  style,
}: {
  children: ReactNode;
  path: string;
  fields: Record<string, string> | any;
  className?: string;
  top?: string;
  start?: string;
  deletable?: boolean;
  hideFirst?: boolean,
  richText?: boolean,
  dontAddInputsFor?: Array<string>
  style?: React.CSSProperties
}) => {
  const openEditor = useEditorStore((s) => s.openEditor);
  const pageName = usePageName();
  const { locale, auth } = usePage().props;
  const isRTL = locale === "ar";
  let inputs: any = [{}];
  let editorValue = "";
  if (typeof fields === "object" && fields !== null) {
    const entries = Object.entries(fields);
    const filteredEntries = dontAddInputsFor
      ? entries.filter(([key]) => !dontAddInputsFor.includes(key))
      : entries;
    inputs = filteredEntries.map(([key, value]) => ({
      key,
      value,
      type: inferFieldType(key, richText),
    }));

    const richInput = inputs.find((input: any) => input.type === "richtext");
    editorValue = richInput?.value;

  } else {

    const value = fields;
    const type = inferFieldType(value);

    inputs = richText
      ? [{
        key: "text",
        value,
        type: "richtext"
      }]
      : [{
        key: type,
        value,
        type
      }];

    editorValue = value;
  }
  const positionStyles: React.CSSProperties = {
    top: top ?? "10%",
    [isRTL ? "right" : "left"]: start ?? "90%",
    position: "absolute",
    transform: `translate(${isRTL ? "50%" : "-50%"}, -50%)`,
  };
  const { url } = usePage()
  return (
    <div className={`relative ${hideFirst && "first:hidden"} ${className}`} style={style}>
      {children}
      {
        auth && !url.includes("dashboard") ?
          <button
            title="Object Edit"
            type="button"
            onClick={(e) => {
              e.preventDefault()
              openEditor(pageName, path, "object", editorValue, { inputs, deletable })
            }
            }
            className="w-7 h-7 bg-gray-500/80 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 duration-300 z-1000 text-sm"
            style={positionStyles}
          >
            🧩
          </button>
          : ""
      }
    </div>
  );
};

export default EditableObject;