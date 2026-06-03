
let editorPromise: Promise<any> | null = null;

export function SharedCkEditorLoader() {
  if (!editorPromise) {
    editorPromise = import("./CustomizedCkEditor").then(
      (mod) => mod.default
    );
  }

  return editorPromise;
}