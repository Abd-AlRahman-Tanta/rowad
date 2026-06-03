import { useEffect, useState } from "react";
import { SharedCkEditorLoader } from "./SharedCkEditorLoader";

let cachedEditor: any = null;
let loadingPromise: Promise<any> | null = null;

export function useSharedCkEditor() {
  const [Editor, setEditor] = useState<any>(() => cachedEditor);
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