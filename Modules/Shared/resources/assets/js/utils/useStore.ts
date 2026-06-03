import { create } from "zustand";

type EditorType = "text" | "image" | "link" | "richtext" | "object" | undefined;

type EditorState = {
  deletable?: boolean
  array?: boolean;
  fields?: Array<Record<string, string>>;
  open: boolean;
  pageName: string;
  path: string;
  type: EditorType;
  value: any;

  openEditor: (
    pageName: string,
    path: string,
    type: EditorType,
    value?: any,
    options?: {
      array?: boolean;
      inputs?: Array<Record<string, string>>;
      deletable?: boolean;
    }
  ) => void;

  setValue: (value: any) => void;
  closeEditor: () => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  deletable: false,
  array: false,
  fields: undefined,
  canDelete: false,
  open: false,
  pageName: "",
  path: "",
  type: undefined,
  value: null,

  openEditor: (pageName, path, type, value, options) =>
    set({
      open: true,
      pageName,
      path,
      type,
      value,
      array: options?.array ?? false,
      fields: options?.inputs,
      deletable: options?.deletable,
    }),

  setValue: (value) => set({ value }),
  closeEditor: () => set({ open: false }),
}));