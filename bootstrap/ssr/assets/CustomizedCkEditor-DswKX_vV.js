import { jsx } from "react/jsx-runtime";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { LineHeight } from "@rickx/ckeditor5-line-height";
import axios from "axios";
import { Autosave, Bold, Essentials, Italic, Underline, Paragraph, Alignment, FontSize, List, FontColor, FontFamily, FontBackgroundColor, Strikethrough, Subscript, Superscript, Link, AutoLink, Table, TableCaption, TableCellProperties, TableColumnResize, TableProperties, TableToolbar, Image, ImageToolbar, ImageUpload, ImageStyle, ImageResize, ImageInsertUI, SimpleUploadAdapter, SelectAll, GeneralHtmlSupport, ClassicEditor, Plugin, ButtonView, Command } from "ckeditor5";
const CustomizedCkEditor = ({
  value,
  onChange,
  setIsUploading
}) => {
  class Direction extends Plugin {
    static get pluginName() {
      return "Direction";
    }
    init() {
      const editor = this.editor;
      editor.commands.add("setDirection", new SetDirectionCommand(editor));
      editor.ui.componentFactory.add("direction:ltr", (locale) => {
        const button = new ButtonView(locale);
        button.set({
          label: "LTR",
          tooltip: true,
          withText: true
        });
        button.on("execute", () => {
          editor.execute("setDirection", { direction: "ltr" });
        });
        return button;
      });
      editor.ui.componentFactory.add("direction:rtl", (locale) => {
        const button = new ButtonView(locale);
        button.set({
          label: "RTL",
          tooltip: true,
          withText: true
        });
        button.on("execute", () => {
          editor.execute("setDirection", { direction: "rtl" });
        });
        return button;
      });
    }
  }
  class SetDirectionCommand extends Command {
    execute({ direction }) {
      const view = this.editor.editing.view;
      const viewRoot = view.document.getRoot();
      view.change((writer) => {
        if (direction) {
          writer.setAttribute("dir", direction, viewRoot);
        } else {
          writer.removeAttribute("dir", viewRoot);
        }
      });
    }
    refresh() {
      this.isEnabled = true;
    }
  }
  class UploadFilePlugin extends Plugin {
    init() {
      const editor = this.editor;
      editor.ui.componentFactory.add("uploadFile", (locale) => {
        const view = new ButtonView(locale);
        view.set({
          label: "Upload File",
          withText: true,
          tooltip: true
        });
        view.on("execute", () => {
          const selection = editor.model.document.selection;
          let selectedText = "";
          if (!selection.isCollapsed) {
            const range = selection.getFirstRange();
            selectedText = range && Array.from(range.getItems()).map((item) => item.data).join("") || "";
          }
          if (!selectedText) return;
          const input = document.createElement("input");
          input.type = "file";
          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            const formData = new FormData();
            formData.append("file", file);
            try {
              setIsUploading(true);
              const response = await axios.post("/upload-file", formData, {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              });
              const url = response.data.url;
              editor.model.change((writer) => {
                const linkText = writer.createText(selectedText, {
                  linkHref: url
                });
                editor.model.insertContent(
                  linkText,
                  editor.model.document.selection
                );
              });
            } catch (error) {
              console.error(error);
            } finally {
              setIsUploading(false);
            }
          };
          input.click();
        });
        return view;
      });
    }
  }
  const editorConfig = {
    toolbar: {
      items: [
        "heading",
        "|",
        "fontfamily",
        "fontsize",
        "fontColor",
        "fontBackgroundColor",
        "lineHeight",
        "direction:ltr",
        "direction:rtl",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "subscript",
        "superscript",
        "|",
        "link",
        "uploadImage",
        "uploadFile",
        "|",
        "bulletedList",
        "numberedList",
        "outdent",
        "indent",
        "insertTable",
        "alignment",
        "selectAll"
      ]
    },
    fontFamily: {
      supportAllValues: true
    },
    fontSize: {
      options: ["default", 8, 10, 12, 14, 16, 18, 20, 24, 28, 32],
      supportAllValues: true
    },
    lineHeight: {
      options: ["default", "10px", "15px", "20px", "25px", "30px", "35px"],
      supportAllValues: true
    },
    plugins: [
      Direction,
      UploadFilePlugin,
      LineHeight,
      Autosave,
      Bold,
      Essentials,
      Italic,
      Underline,
      Paragraph,
      Alignment,
      FontSize,
      List,
      FontColor,
      FontFamily,
      FontBackgroundColor,
      Strikethrough,
      Subscript,
      Superscript,
      Link,
      AutoLink,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      Image,
      ImageToolbar,
      ImageUpload,
      ImageStyle,
      ImageResize,
      ImageInsertUI,
      SimpleUploadAdapter,
      SelectAll,
      GeneralHtmlSupport
    ],
    htmlSupport: {
      allow: [
        {
          name: /.*/,
          attributes: true,
          classes: true,
          styles: true
        }
      ]
    },
    alignment: {
      options: [{ name: "center" }, { name: "justify" }]
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"]
    },
    image: {
      toolbar: ["imageTextAlternative", "imageStyle:full", "imageStyle:side"],
      upload: {
        types: ["jpeg", "png", "gif", "bmp", "webp", "tiff"]
      }
    },
    simpleUpload: {
      uploadUrl: "/upload-file",
      headers: {
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
      }
    },
    licenseKey: "GPL"
  };
  return /* @__PURE__ */ jsx(
    CKEditor,
    {
      onReady: (editor) => {
        editor.execute("selectAll");
        editor.editing.view.focus();
      },
      editor: ClassicEditor,
      data: value || "",
      config: editorConfig,
      onChange
    }
  );
};
export {
  CustomizedCkEditor as default
};
//# sourceMappingURL=CustomizedCkEditor-DswKX_vV.js.map
