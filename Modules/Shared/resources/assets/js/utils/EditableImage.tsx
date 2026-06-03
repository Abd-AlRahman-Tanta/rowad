import { usePage } from "@inertiajs/react";
import { ReactNode } from "react";
import { usePageName } from "./PageContentProvider";
import { useEditorStore } from "./useStore";

const EditableImage = ({
  src,
  path,
  className,
  children,
  top,
  start,
  zIndex,
}: {
  src: string;
  path: string;
  className?: string;
  children?: ReactNode;
  top?: string;
  bottom?: string;
  start?: string;
  end?: string;
  zIndex?: string
}) => {
  const openEditor = useEditorStore((s) => s.openEditor);
  const pageName = usePageName();
  const { locale, auth } = usePage().props;
  const isRTL = locale === "ar";

  const positionStyles: React.CSSProperties = {
    top: top ?? "20%",
    [isRTL ? "right" : "left"]: start ?? "50%",
    position: "absolute",
    transform: `translate(${isRTL ? "50%" : "-50%"}, -50%)`,
    zIndex: zIndex
  };

  return (
    <div className={`relative ${className}`}>
      {children}
      {
        // auth ?
        <button
          type="button"
          title="Edit image"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openEditor(pageName, path, "image", src);
          }}
          style={positionStyles}
          className="w-7 h-7 bg-gray-500/80 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 duration-300 z-1000 text-sm"
        >
          🖼️
        </button>
        // : ""
      }
    </div>
  );
};

export default EditableImage;