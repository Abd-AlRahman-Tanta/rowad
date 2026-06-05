import { usePage } from "@inertiajs/react";
import { ReactNode } from "react";
import { usePageName } from "./PageContentProvider";
import { useEditorStore } from "./useStore";

interface EditableTextProps {
  richtext?: boolean;
  path: string;
  children: string | ReactNode;
  top?: string;
  start?: string;
  text: string;
  className?: string
  style?: React.CSSProperties

}

const EditableText = ({ path, children, richtext, top, start, text, className, style }: EditableTextProps) => {
  const openEditor = useEditorStore((s) => s.openEditor);
  const pageName = usePageName();
  const { locale } = usePage().props;
  const isRTL = locale === "ar";

  const positionStyles: React.CSSProperties = {
    top: top ?? "40%",
    [isRTL ? "right" : "left"]: start ?? "50%",
    position: "absolute",
    transform: `translate(${isRTL ? "50%" : "-50%"}, -50%)`,
  };

  const { auth } = usePage().props
  const { url } = usePage()
  return (
    <div className={`relative ${className}`} style={style} >
      {!richtext && children}
      {richtext && typeof children === "string" && <div dangerouslySetInnerHTML={{ __html: children }} />}
      {
        auth && !url.includes("dashboard") ?
          <button
            title="Text Editing"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation()
              openEditor(pageName, path, richtext ? "richtext" : "text", text);
            }}
            style={positionStyles}
            className="w-7 h-7 bg-gray-500/80 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 duration-300 z-1000 text-sm"
          >
            ✏️
          </button>
          : ""
      }
    </div>
  );
};

export default EditableText;