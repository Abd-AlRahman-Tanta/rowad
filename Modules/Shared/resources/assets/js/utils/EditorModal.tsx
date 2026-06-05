import { router, usePage } from "@inertiajs/react";
import axios from "axios";
import { FormEvent, useState } from "react";
import { useEditorStore } from "./useStore";

import RichTextInput from "./editor/RichTextInput";
import { useSharedCkEditor } from "./editor/useSharedCkEditor";
import LoadingSpinner from "@shared/components/LoadingSpinner";

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
    fields,
  } = useEditorStore();

  const { locale, auth } = usePage().props as any;
  // ✅ preview per field (supports multiple images)
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<any>(false);
  const Editor = useSharedCkEditor();
  if (!open) return null;
  if (!auth) return null;

  /* ======================
     TRANSLATIONS
  ====================== */
  const t = {
    title: locale === "en" ? "Edit Content" : "تعديل المحتوى",
    cancel: locale === "en" ? "Cancel" : "إلغاء",
    save: locale === "en" ? "Save" : "حفظ",
    addItem: locale === "en" ? "Add Item" : "إضافة عنصر",
    delete: locale === "en" ? "Delete" : "حذف",
    uploadImage:
      locale === "en" ? "Click to upload image" : "اضغط لاختيار صورة",
  };

  /* ======================
     SAVE
  ====================== */
  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    if (array) return;

    const form = e.currentTarget;
    const formData = new FormData();

    formData.append("page_name", pageName);
    formData.append("path", path);

    // object
    if (type === "object" && fields) {
      fields.forEach((field) => {
        const input = form.elements.namedItem(field.key) as HTMLInputElement;
        if (!input) return;

        if (field.type === "image") {
          if (input.files?.[0]) {
            formData.append(field.key, input.files[0]);
          }
          else if (field.value) {
            formData.append(field.key, field.value);
          }
        }
        else if (field.type === "richtext") {
          formData.append(field.key, editorValue || "");
        }
        else {
          formData.append(field.key, input.value);
        }
      });
    }

    // image
    else if (type === "image") {
      const input = form.elements.namedItem("image") as HTMLInputElement;

      if (input?.files?.[0]) {
        formData.append("image", input.files[0]);
      }
      else if (editorValue) {
        formData.append("value", editorValue);
      }
    }
    // richtext
    else if (type === "richtext") {
      formData.append("value", editorValue || "");
    }
    // normal text or link
    else {
      const input = form.elements.namedItem("value") as HTMLInputElement;
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
      setLoading(false)
      console.log(error)
    }
  };

  /* ======================
    ADD ARRAY ITEM
  ====================== */
  const addItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    if (!array || !fields) return;

    const form = e.currentTarget;
    const formData = new FormData();

    formData.append("page_name", pageName);
    formData.append("path", path);

    fields.forEach((field) => {
      const input = form.elements.namedItem(field.key) as HTMLInputElement;
      if (!input) return;

      if (field.type === "image") {
        if (input.files?.[0]) {
          formData.append(field.key, input.files[0] || "");
        }
        else
          formData.append(field.key, "");
      } else {
        formData.append(field.key, input.value || "");
      }
    });

    try {
      await axios.post(`/${locale}/cms-update-array`, formData);
      // reset previews after submit
      setPreviews({});
      setLoading(false);
      closeEditor();
      router.reload();
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  };
  // delete item
  const deleteItem = async () => {
    setLoading(true);
    try {
      await axios.post(`/${locale}/cms-delete-item`, { page_name: pageName, path: path }, {
        headers: { "Accept": "application/json" }
      });
      setPreviews({});
      setLoading(false);
      closeEditor()
      router.reload();
    } catch (err) {
      setLoading(false)
      console.log(err);
      router.reload();
    }
  };


  if (!Editor)
    return <LoadingSpinner />
  return (
    <div className="fixed w-full px-6 inset-0 z-1200 flex items-center justify-center bg-black/60">
      <form
        onSubmit={array ? addItem : save}
        className="w-full   max-w-[40rem]  max-h-[90vh] overflow-auto relative  bg-white rounded-2xl p-6 shadow-xl"
      >
        {/* Header */}
        <div className="mb-6 border-b pb-3">
          <h2 className="text-xl font-semibold mb-3">{t.title}</h2>
          <p className="text-sm text-gray-500 truncate">{pageName}</p>
        </div>

        {/* ======================
            ARRAY INPUTS
        ====================== */}
        {array && fields && (
          <div className="flex flex-col gap-5">
            {fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {field.key}
                </label>

                {field.type === "image" ? (
                  <div>
                    <input
                      type="file"
                      id={`file-${field.key}`}
                      name={field.key}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const url = URL.createObjectURL(file);
                        setPreviews((prev) => ({
                          ...prev,
                          [field.key]: url,
                        }));
                      }}
                    />
                    <label
                      htmlFor={`file-${field.key}`}
                      className="flex items-center justify-center h-40 w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:border-arch-accent hover:bg-gray-100 transition overflow-hidden"
                    >
                      {previews[field.key] ? (
                        <img
                          src={previews[field.key]}
                          alt="preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-gray-500 text-sm flex flex-col items-center gap-2">
                          <span className="text-3xl">🖼️</span>
                          <span>Select {field.key}</span>
                        </div>
                      )}
                    </label>
                  </div>
                ) : (
                  <input
                    type="text"
                    name={field.key}
                    placeholder={field.key}
                    className="h-11 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-arch-accent transition"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ======================
            NORMAL INPUTS
        ====================== */}
        {!array && (
          <>
            {type === "object" && fields &&
              <div className="flex flex-col gap-5">
                {fields.map((field, i) => (
                  <div key={field.key + i + ""} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      {field.key}
                    </label>

                    {
                      // image
                      field.type === "image" ? (
                        <div>
                          <input
                            type="file"
                            id={`file-${field.key}`}
                            name={field.key}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              const url = URL.createObjectURL(file);
                              setPreviews((prev) => ({
                                ...prev,
                                [field.key]: url,
                              }));
                            }}
                          />

                          <label
                            htmlFor={`file-${field.key}`}
                            className="flex items-center justify-center h-40 w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:border-arch-accent hover:bg-gray-100 transition overflow-hidden"
                          >
                            {previews[field.key] ? (
                              <img
                                src={previews[field.key]}
                                className="w-full h-full object-contain"
                              />
                            ) : field.value ? (
                              <img
                                src={field.value}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-gray-500 text-sm">
                                Select {field.key}
                              </span>
                            )}
                          </label>
                        </div>
                      ) :
                        // rich text
                        field.type === "richtext" ?
                          <RichTextInput
                            Editor={Editor}
                            name={field.key}
                            value={editorValue || ""}
                            onChange={(data: string) => setValue(data)}
                          />
                          :
                          // regular input
                          (
                            <input
                              type="text"
                              name={field.key}
                              defaultValue={field.value}
                              className="h-11 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-arch-accent transition"
                            />
                          )
                    }
                  </div>
                ))}
              </div>
            }

            {type === "text" && (
              <input
                name="value"
                type="text"
                defaultValue={editorValue}
                className="w-full h-12 rounded-lg border px-4"
              />
            )}

            {type === "richtext" && (
              <RichTextInput
                Editor={Editor}
                name="value"
                value={editorValue || ""}
                onChange={(data: string) => setValue(data)}
              />
            )}

            {type === "image" && (
              <div className="flex flex-col gap-3">
                <input
                  hidden
                  id="image-input"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setValue(e.target.files?.[0] ?? null)
                  }
                />

                <label
                  htmlFor="image-input"
                  className="h-56 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer"
                >
                  {editorValue instanceof File ? (
                    <img
                      src={URL.createObjectURL(editorValue)}
                      className="h-full object-contain"
                    />
                  ) : editorValue ? (
                    <img
                      src={editorValue}
                      className="h-full object-contain"
                    />
                  ) : (
                    <span>{t.uploadImage}</span>
                  )}
                </label>
              </div>
            )}
          </>
        )}

        {/* Actions */}
        <div>
          {/* loading */}
          <div className="w-full flex justify-center items-center  mb-6 mt-4">
            {
              loading && <div className="w-7 h-7 border-2 border-gray-300 border-t-arch-accent rounded-full animate-spin"></div>
            }
          </div>
          <div className=" flex flex-wrap justify-center gap-3">
            <button
              disabled={loading}
              type="button"
              onClick={closeEditor}
              className="px-5 h-10 disabled:opacity-20 rounded-lg bg-gray-100 hover:bg-gray-200 duration-200 cursor-pointer"
            >
              {t.cancel}
            </button>
            {
              deletable &&
              <button
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteItem();
                }}
                type="button"
                className="px-6 h-10 disabled:opacity-20 rounded-lg bg-red-600 hover:bg-red-700 duration-200 cursor-pointer text-white"
              >
                {t.delete}
              </button>
            }
            <button
              disabled={loading}
              type="submit"
              className="px-6 h-10 disabled:opacity-20 rounded-lg bg-arch-accent hover:bg-arch-accent duration-200 cursor-pointer text-white"
            >
              {array ? t.addItem : t.save}
            </button>

          </div>
        </div>
      </form>
    </div>
  );
};

export default EditorModal;