import { router, useForm, usePage } from "@inertiajs/react";
import { useSharedCkEditor } from "@shared/utils/editor/useSharedCkEditor";
import axios from "axios";
import { FormEvent, useContext, useState } from "react";
import { DeleteContext } from "./DashboardLayout";
import LoadingSpinner from "@shared/components/LoadingSpinner";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import ImageInput from "@shared/components/ImageInput";
import VideoInput from "@shared/components/VideoInput";
import CustomSelect from "@shared/components/CustomSelect";
import RichTextInput from "@shared/utils/editor/RichTextInput";
import ObjectToFormData from "@dashboard/utils/ObjectToFormData";


export type FieldType = 'text' | 'number' | 'textarea' | 'file' | 'spatie' | 'repeater' | 'richtext' | 'spatie-richtext' | 'select' | 'spatie-file' | 'video' | 'json' | 'spatie-json';

export interface FormField {
  maxItems?: number;
  name: string;
  label: string;
  type: FieldType;
  fullWidth?: boolean;
  itemLabel?: string;
  repeaterFields?: FormField[];
  selectChoices?: any[];
  selectViewedOption?: string;
  selectValueOption?: string;
  selectPickOne?: boolean;
}

export interface DynamicFormProps {
  initialData?: Record<string, any>;
  fields: FormField[];
  submitUrl: string;
  deleteUrl?: string;
  returnUrl?: string;
  itemName?: string;
  isEdit?: boolean;
}
const JsonTextarea = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  const [isInvalid, setIsInvalid] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);
    try {
      if (val) JSON.parse(val);
      setIsInvalid(false);
    } catch {
      setIsInvalid(true);
    }
  };
  return (
    <div className="flex flex-col gap-1">
      <textarea
        value={value}
        onChange={handleChange}
        className={`border p-2 rounded outline-none font-mono text-sm resize-y w-full  ${isInvalid ? 'border-red-500 bg-red-50' : ''}`}
        dir="ltr"
        placeholder={'{\n  "@context": "http://schema.org",\n  "@type": "LocalBusiness"\n}'}
      />
      {isInvalid && (
        <span className="text-red-500 text-xs">Invalid Json</span>
      )}
    </div>
  );
};
export default function DynamicForm({
  initialData = {},
  fields,
  submitUrl,
  deleteUrl,
  returnUrl = '',
  itemName = 'Item',
  isEdit = false
}: DynamicFormProps) {
  const { locale } = usePage().props as any;
  const deleteContext = useContext(DeleteContext);
  const Editor = useSharedCkEditor();
  const setupInitialState = (): Record<string, any> => {
    let state: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.type === 'spatie' || field.type === 'spatie-richtext' || field.type === 'spatie-file') {
        state[field.name] = {
          ar: initialData?.[field.name]?.ar || '',
          en: initialData?.[field.name]?.en || ''
        };
      }
      else if (field.type === 'spatie-json') {
        state[field.name] = {
          ar: initialData?.[field.name]?.ar
            ? (typeof initialData[field.name].ar === 'object'
              ? JSON.stringify(initialData[field.name].ar, null, 2)
              : initialData[field.name].ar)
            : '',
          en: initialData?.[field.name]?.en
            ? (typeof initialData[field.name].en === 'object'
              ? JSON.stringify(initialData[field.name].en, null, 2)
              : initialData[field.name].en)
            : '',
        };
      } else if (field.type === 'json') {
        state[field.name] = initialData?.[field.name]
          ? (typeof initialData[field.name] === 'object'
            ? JSON.stringify(initialData[field.name], null, 2)
            : initialData[field.name])
          : '';
      }
      else if (field.type === 'repeater') {
        state[field.name] = (initialData?.[field.name] || []).map((item: any) => {
          const converted = { ...item };
          field.repeaterFields?.forEach((subField) => {
            if (subField.type === 'spatie-json') {
              converted[subField.name] = {
                ar: item[subField.name]?.ar
                  ? (typeof item[subField.name].ar === 'object'
                    ? JSON.stringify(item[subField.name].ar, null, 2)
                    : item[subField.name].ar)
                  : '',
                en: item[subField.name]?.en
                  ? (typeof item[subField.name].en === 'object'
                    ? JSON.stringify(item[subField.name].en, null, 2)
                    : item[subField.name].en)
                  : '',
              };
            } else if (subField.type === 'json') {
              converted[subField.name] = item[subField.name]
                ? (typeof item[subField.name] === 'object'
                  ? JSON.stringify(item[subField.name], null, 2)
                  : item[subField.name])
                : '';
            }
          });
          return converted;
        });
      }
      else if (field.type === 'select') {
        if (initialData?.[field.name] !== undefined) {
          state[field.name] = Array.isArray(initialData?.[field.name]) ?
            initialData?.[field.name]
            :
            { [field.selectValueOption as string]: initialData?.[field.name] }
        }
        else { field.selectPickOne ? '' : [] };
      } else {
        state[field.name] = initialData?.[field.name] || '';
      }
    });
    return state;
  };


  const { data, setData } = useForm<Record<string, any>>(setupInitialState());
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const getError = (fieldName: string): string | undefined => {
    if (errors[fieldName]) {
      return Array.isArray(errors[fieldName]) ? errors[fieldName][0] : errors[fieldName];
    }
    const nestedError = Object.keys(errors).find((key) => key.startsWith(`${fieldName}.`));
    if (nestedError) {
      return Array.isArray(errors[nestedError]) ? errors[nestedError][0] : errors[nestedError];
    }
    return undefined;
  };
  const handleNumberInput = (value: string) => value.replace(/\D/g, '');
  const getSpatieError = (fieldName: string, lang: 'ar' | 'en'): string | undefined => {
    const key = `${fieldName}.${lang}`;
    if (errors[key]) {
      return Array.isArray(errors[key]) ? errors[key][0] : errors[key];
    }
    return undefined;
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    try {
      const formData = ObjectToFormData(data);

      if (isEdit) {
        formData.append('_method', 'PUT');
        await axios.post("/" + locale + submitUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post("/" + locale + submitUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      router.visit(returnUrl);
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error('Server Error:', error);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleSpatieChange = (fieldName: string, lang: 'ar' | 'en', value: string) => {
    setData(fieldName, { ...data[fieldName], [lang]: value });
  };

  const addRepeaterItem = (repeaterName: string, repeaterFields: FormField[]) => {
    const newItem: Record<string, any> = {};
    repeaterFields.forEach((f) => {
      if (f.type === 'spatie' || f.type === 'spatie-richtext') {
        newItem[f.name] = { ar: '', en: '' };
      }
      else if (f.type === 'spatie-json') {
        newItem[f.name] = { ar: '', en: '' };
      } else if (f.type === 'json') {
        newItem[f.name] = '';
      }
      else if (f.type === 'select') {
        newItem[f.name] = f.selectPickOne ? '' : [];
      } else {
        newItem[f.name] = '';
      }
    });
    setData(repeaterName, [...data[repeaterName], newItem]);
  };

  const updateRepeaterItem = (repeaterName: string, index: number, fieldName: string, value: any) => {
    const newRepeaterArray = [...data[repeaterName]];
    newRepeaterArray[index][fieldName] = value;
    setData(repeaterName, newRepeaterArray);
  };

  const updateRepeaterSpatieItem = (repeaterName: string, index: number, fieldName: string, lang: 'ar' | 'en', value: string) => {
    const newRepeaterArray = [...data[repeaterName]];
    newRepeaterArray[index][fieldName] = { ...newRepeaterArray[index][fieldName], [lang]: value };
    setData(repeaterName, newRepeaterArray);
  };

  const removeRepeaterItem = (repeaterName: string, index: number) => {
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
    return (<LoadingSpinner />)
  else
    return (
      <>
        <form onSubmit={handleSubmit} className="rounded-lg shadow-sm space-y-8 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field, index) => {

              if (field.type === 'repeater') {
                return (
                  <div key={index} className="md:col-span-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">{field.label}</h3>
                    {data[field.name]?.map((item: Record<string, any>, itemIndex: number) => (
                      <div key={itemIndex} className="relative bg-white p-4 rounded border border-gray-300 mb-4 shadow-sm">
                        <button
                          type="button"
                          onClick={() => removeRepeaterItem(field.name, itemIndex)}
                          className="absolute top-4 end-4 text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full"
                          title={locale == "ar" ? "حذف هذا القسم" : "Delete This Section"}
                        >
                          <FiTrash2 />
                        </button>

                        <h4 className="font-semibold mb-4 text-gray-600">
                          {(locale == "ar" ? "القسم رقم #" : "Section number #") + (itemIndex + 1)}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {field.repeaterFields?.map((subField, subIndex) => (
                            <div key={subIndex} className={`flex flex-col ${subField.fullWidth || subField.type.includes('richtext') ? 'md:col-span-2' : ''}`}>
                              <label className="mb-1 text-sm font-medium text-gray-700">{subField.label}</label>

                              {subField.type === 'text' && (
                                <input
                                  type="text"
                                  value={item[subField.name] || ''}
                                  onChange={(e) => updateRepeaterItem(field.name, itemIndex, subField.name, e.target.value)}
                                  className="border p-2 rounded outline-none"
                                />
                              )}
                              {subField.type === 'number' && (
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={item[subField.name] || ''}
                                  onChange={(e) => updateRepeaterItem(field.name, itemIndex, subField.name, handleNumberInput(e.target.value))}
                                  className="border p-2 rounded outline-none"
                                />
                              )}

                              {subField.type === 'textarea' && (
                                <textarea
                                  value={item[subField.name] || ''}
                                  onChange={(e) => updateRepeaterItem(field.name, itemIndex, subField.name, e.target.value)}
                                  className="border p-2 rounded resize-none outline-none h-24"
                                />
                              )}

                              {subField.type === 'file' && (
                                <ImageInput
                                  defaultValue={item[subField.name]}
                                  onChange={(val) => updateRepeaterItem(field.name, itemIndex, subField.name, val)}
                                />
                              )}
                              {subField.type === 'video' && (
                                <VideoInput
                                  defaultValue={item[subField.name]}
                                  onChange={(val) => updateRepeaterItem(field.name, itemIndex, subField.name, val)}
                                />
                              )}
                              {subField.type === 'spatie-file' && (
                                <div className="flex max-mob:flex-col gap-4">
                                  <div className="flex flex-col gap-1 flex-1">
                                    <span className="text-xs text-gray-500 mb-1 block font-medium">
                                      {locale === "ar" ? "(صورة عربي)" : "(Arabic Image)"}
                                    </span>
                                    <div className='w-full flex flex-col gap-1'>
                                      <ImageInput
                                        defaultValue={item[subField.name]?.ar || ''}
                                        onChange={(val) =>
                                          updateRepeaterSpatieItem(field.name, itemIndex, subField.name, 'ar', val)
                                        }
                                      />
                                      {getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, 'ar') && (
                                        <span className="text-red-500 text-xs mt-1">{getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, 'ar')}</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-1 flex-1">
                                    <span className="text-xs text-gray-500 mb-1 block font-medium">
                                      {locale === "ar" ? "(صورة إنجليزي)" : "(English Image)"}
                                    </span>
                                    <div className='w-full flex flex-col gap-1'>
                                      <ImageInput
                                        defaultValue={item[subField.name]?.en || ''}
                                        onChange={(val) =>
                                          updateRepeaterSpatieItem(field.name, itemIndex, subField.name, 'en', val)
                                        }
                                      />
                                      {getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, 'en') && (
                                        <span className="text-red-500 text-xs mt-1">{getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, 'en')}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {subField.type === 'select' && subField.selectChoices && subField.selectViewedOption && subField.selectValueOption && (
                                <CustomSelect
                                  choices={subField.selectChoices}
                                  viewedOption={subField.selectViewedOption}
                                  selectedOption={subField.selectValueOption}
                                  pickOne={subField.selectPickOne}
                                  preSelected={item[subField.name] ? item[subField.name] : []}
                                  onChange={(val) => {
                                    const formattedValue = subField.selectPickOne ? (val.length > 0 ? val[0] : "") : val;
                                    updateRepeaterItem(field.name, itemIndex, subField.name, formattedValue);
                                  }}
                                />
                              )}
                              {subField.type === 'json' && (
                                <JsonTextarea
                                  value={item[subField.name] || ''}
                                  onChange={(val) => updateRepeaterItem(field.name, itemIndex, subField.name, val)}
                                />
                              )}

                              {subField.type === 'spatie-json' && (
                                <div className="flex flex-col gap-4 mt-1">
                                  <div className="flex flex-col gap-1">
                                    <span className="text-xs text-gray-500 mb-1 block">{locale == "ar" ? "(عربي)" : "(Arabic)"}</span>
                                    <JsonTextarea
                                      value={item[subField.name]?.ar || ''}
                                      onChange={(val) => updateRepeaterSpatieItem(field.name, itemIndex, subField.name, 'ar', val)}
                                    />
                                    {getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, 'ar') && (
                                      <span className="text-red-500 text-xs mt-1">
                                        {getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, 'ar')}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-xs text-gray-500 mb-1 block">{locale == "ar" ? "(إنجليزي)" : "(English)"}</span>
                                    <JsonTextarea
                                      value={item[subField.name]?.en || ''}
                                      onChange={(val) => updateRepeaterSpatieItem(field.name, itemIndex, subField.name, 'en', val)}
                                    />
                                    {getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, 'en') && (
                                      <span className="text-red-500 text-xs mt-1">
                                        {getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, 'en')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                              {subField.type === 'spatie' && (
                                <div className="flex max-mob:flex-col gap-4">
                                  <div className='w-full flex flex-col gap-1'>
                                    <input
                                      type="text"
                                      placeholder={locale === "ar" ? `${subField.label} (عربي)` : `${subField.label} (Arabic)`}
                                      value={item[subField.name]?.ar || ''}
                                      onChange={(e) => updateRepeaterSpatieItem(field.name, itemIndex, subField.name, 'ar', e.target.value)}
                                      className="border p-2 rounded w-full dir-rtl outline-none"
                                    />
                                    {getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, 'ar') && (
                                      <span className="text-red-500 text-xs mt-1">{getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, 'ar')}</span>
                                    )}
                                  </div>
                                  <div className='w-full flex flex-col gap-1'>
                                    <input
                                      type="text"
                                      placeholder={locale === "ar" ? `${subField.label} (أنجليزي)` : `${subField.label} (English)`}
                                      value={item[subField.name]?.en || ''}
                                      onChange={(e) => updateRepeaterSpatieItem(field.name, itemIndex, subField.name, 'en', e.target.value)}
                                      className="border p-2 rounded w-full dir-ltr outline-none"
                                    />
                                    {getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, 'en') && (
                                      <span className="text-red-500 text-xs mt-1">{getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, 'en')}</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {subField.type === 'richtext' && (
                                <RichTextInput
                                  Editor={Editor}
                                  name={`${field.name}_${itemIndex}_${subField.name}`}
                                  onChange={(val) => updateRepeaterItem(field.name, itemIndex, subField.name, val)}
                                  value={item[subField.name] || ''}
                                />
                              )}

                              {subField.type === 'spatie-richtext' && (
                                <div className="flex flex-col gap-4 mt-1">
                                  <div>
                                    <span className="text-xs text-gray-500 mb-1 block">{locale == "ar" ? "(عربي)" : "(Arabic)"}</span>
                                    <div className='w-full flex flex-col gap-1'>
                                      <RichTextInput
                                        Editor={Editor}
                                        name={`${field.name}_${itemIndex}_${subField.name}_ar`}
                                        onChange={(val) => updateRepeaterSpatieItem(field.name, itemIndex, subField.name, 'ar', val)}
                                        value={item[subField.name]?.ar || ''}
                                      />
                                      {getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, 'ar') && (
                                        <span className="text-red-500 text-xs mt-1">{getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, 'ar')}</span>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-500 mb-1 block">{locale == "en" ? "(English)" : "(أنكليزي)"}</span>
                                    <div className='w-full flex flex-col gap-1'>
                                      <RichTextInput
                                        Editor={Editor}
                                        name={`${field.name}_${itemIndex}_${subField.name}_en`}
                                        onChange={(val) => updateRepeaterSpatieItem(field.name, itemIndex, subField.name, 'en', val)}
                                        value={item[subField.name]?.en || ''}
                                      />
                                      {getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, 'en') && (
                                        <span className="text-red-500 text-xs mt-1">{getSpatieError(`${field.name}.${itemIndex}.${subField.name}`, 'en')}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {subField.type != 'spatie' && subField.type != 'spatie-richtext' && subField.type != 'spatie-file' && subField.type != 'spatie-json' &&
                                getError(`${field.name}.${itemIndex}.${subField.name}`) && (
                                  <span className="text-red-500 text-xs mt-1">
                                    {getError(`${field.name}.${itemIndex}.${subField.name}`)}
                                  </span>
                                )
                              }
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {getError(field.name) && (
                      <span className="text-red-500 text-xs mt-1 block">
                        {getError(field.name)}
                      </span>
                    )}
                    {(!field.maxItems || data[field.name]?.length < field.maxItems) && (
                      <button
                        type="button"
                        onClick={() => addRepeaterItem(field.name, field.repeaterFields || [])}
                        className="flex items-center gap-2 bg-dark text-white px-4 py-2 rounded hover:bg-arch-accent/90 bg-arch-accent cursor-pointer transition max-mob:mb-4 mt-5"
                      >
                        <FiPlus /> {locale === "ar" ? `إضافة ${field.itemLabel || 'قسم'}` : `Add ${field.itemLabel || 'Section'}`}
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <div key={index} className={`flex flex-col ${field.fullWidth || field.type === 'spatie-richtext' || field.type === 'richtext' ? 'md:col-span-2' : ''}`}>
                  <label className="mb-2 font-semibold text-gray-700">{field.label}</label>

                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={data[field.name]}
                      onChange={(e) => setData(field.name, e.target.value)}
                      className="border p-2 rounded outline-none"
                    />
                  )}
                  {field.type === 'number' && (
                    <input
                      type="text"
                      inputMode="numeric"
                      value={data[field.name]}
                      onChange={(e) => setData(field.name, handleNumberInput(e.target.value))}
                      className="border p-2 rounded outline-none"
                    />
                  )}
                  {field.type === 'textarea' && (
                    <textarea
                      value={data[field.name]}
                      onChange={(e) => setData(field.name, e.target.value)}
                      className="border p-2 rounded outline-none h-24 resize-none"
                    />
                  )}

                  {field.type === 'select' && field.selectChoices && field.selectViewedOption && field.selectValueOption && (
                    <CustomSelect
                      choices={field.selectChoices}
                      viewedOption={field.selectViewedOption as any}
                      selectedOption={field.selectValueOption as any}
                      pickOne={field.selectPickOne}
                      preSelected={data[field.name] ? data[field.name] : []}
                      onChange={(val) => {
                        const formattedValue = field.selectPickOne ? (val.length > 0 ? val[0] : "") : val;
                        setData(field.name, formattedValue);
                      }}
                    />
                  )}

                  {field.type === 'spatie' && (
                    <div className="flex max-mob:flex-col gap-4">
                      <div className='w-full flex flex-col gap-1'>
                        <input
                          type="text"
                          placeholder={locale === "ar" ? `${field.label} (عربي)` : `${field.label} (Arabic)`}
                          value={data[field.name]?.ar || ''}
                          onChange={(e) => handleSpatieChange(field.name, 'ar', e.target.value)}
                          className="border p-2 rounded w-full dir-rtl outline-none"
                        />
                        {getSpatieError(field.name, 'ar') && (
                          <span className="text-red-500 text-xs mt-1">{getSpatieError(field.name, 'ar')}</span>
                        )}
                      </div>
                      <div className='w-full flex flex-col gap-1'>
                        <input
                          type="text"
                          placeholder={locale === "ar" ? `${field.label} (إنجليزي)` : `${field.label} (English)`}
                          value={data[field.name]?.en || ''}
                          onChange={(e) => handleSpatieChange(field.name, 'en', e.target.value)}
                          className="border p-2 rounded w-full dir-ltr outline-none"
                        />
                        {getSpatieError(field.name, 'en') && (
                          <span className="text-red-500 text-xs mt-1">{getSpatieError(field.name, 'en')}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {field.type === 'file' && (
                    <ImageInput
                      defaultValue={data[field.name]}
                      onChange={(val) => setData(field.name, val)}
                    />
                  )}
                  {field.type === 'video' && (
                    <VideoInput
                      defaultValue={data[field.name]}
                      onChange={(val) => setData(field.name, val)}
                    />
                  )}

                  {field.type === 'spatie-file' && (
                    <div className="flex max-mob:flex-col gap-4">
                      <div className="flex flex-col gap-1 flex-1">
                        <span className="text-xs text-gray-500 mb-1 block font-medium">
                          {locale === "ar" ? "(صورة عربي)" : "(Arabic Image)"}
                        </span>
                        <div className='w-full flex flex-col gap-1'>
                          <ImageInput
                            defaultValue={data[field.name]?.ar || ''}
                            onChange={(val) => handleSpatieChange(field.name, 'ar', val)}
                          />
                          {getSpatieError(field.name, 'ar') && (
                            <span className="text-red-500 text-xs mt-1">{getSpatieError(field.name, 'ar')}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <span className="text-xs text-gray-500 mb-1 block font-medium">
                          {locale === "ar" ? "(صورة إنجليزي)" : "(English Image)"}
                        </span>
                        <div className='w-full flex flex-col gap-1'>
                          <ImageInput
                            defaultValue={data[field.name]?.en || ''}
                            onChange={(val) => handleSpatieChange(field.name, 'en', val)}
                          />
                          {getSpatieError(field.name, 'en') && (
                            <span className="text-red-500 text-xs mt-1">{getSpatieError(field.name, 'en')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {field.type === 'richtext' && (
                    <RichTextInput
                      Editor={Editor}
                      name={field.name}
                      onChange={(val) => setData(field.name, val)}
                      value={data[field.name] || ''}
                    />
                  )}
                  {field.type === 'json' && (
                    <JsonTextarea
                      value={data[field.name] || ''}
                      onChange={(val) => setData(field.name, val)}
                    />
                  )}

                  {field.type === 'spatie-json' && (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-500">
                          {locale === "ar" ? "(عربي)" : "(Arabic)"}
                        </span>
                        <JsonTextarea
                          value={data[field.name]?.ar || ''}
                          onChange={(val) => handleSpatieChange(field.name, 'ar', val)}
                        />
                        {getSpatieError(field.name, 'ar') && (
                          <span className="text-red-500 text-xs mt-1">{getSpatieError(field.name, 'ar')}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-500">
                          {locale === "ar" ? "(إنجليزي)" : "(English)"}
                        </span>
                        <JsonTextarea
                          value={data[field.name]?.en || ''}
                          onChange={(val) => handleSpatieChange(field.name, 'en', val)}
                        />
                        {getSpatieError(field.name, 'en') && (
                          <span className="text-red-500 text-xs mt-1">{getSpatieError(field.name, 'en')}</span>
                        )}
                      </div>
                    </div>
                  )}
                  {field.type === 'spatie-richtext' && (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-500">
                          {locale === "ar" ? `(عربي)` : `(Arabic)`}
                        </span>
                        <div className='w-full flex flex-col gap-1'>
                          <RichTextInput
                            Editor={Editor}
                            name={`${field.name}_ar`}
                            onChange={(val) => handleSpatieChange(field.name, 'ar', val)}
                            value={data[field.name]?.ar || ''}
                          />
                          {getSpatieError(field.name, 'ar') && (
                            <span className="text-red-500 text-xs mt-1">{getSpatieError(field.name, 'ar')}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-500">
                          {locale === "ar" ? `(إنجليزي)` : `(English)`}
                        </span>
                        <div className='w-full flex flex-col gap-1'>
                          <RichTextInput
                            Editor={Editor}
                            name={`${field.name}_en`}
                            onChange={(val) => handleSpatieChange(field.name, 'en', val)}
                            value={data[field.name]?.en || ''}
                          />
                          {getSpatieError(field.name, 'en') && (
                            <span className="text-red-500 text-xs mt-1">{getSpatieError(field.name, 'en')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {
                    field.type != 'spatie' && field.type != 'spatie-richtext' && field.type != 'spatie-file' && field.type != 'spatie-json' &&
                    getError(field.name) && (
                      <span className="text-red-500 text-xs mt-1">
                        {getError(field.name)}
                      </span>
                    )
                  }
                </div>
              );
            })}
          </div>

          {/* action buttons */}
          <div className={`flex  ${isEdit ? "justify-between" : "justify-center"} items-center mt-8 border-t pt-4`}>
            {isEdit && deleteUrl ? (
              <button
                type='button'
                onClick={handleDeleteClick}
                className="bg-red-50 text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-colors border border-red-200 duration-200"
              >
                {locale == "en" ? `Delete ${itemName}` : `حذف ${itemName}`}
              </button>
            ) : (
              <div></div>
            )}

            <button
              disabled={processing}
              className="bg-arch-dark hover:bg-arch-charcoal duration-300 text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50"
              type="submit"
            >
              {isEdit ? (locale === "en" ? `Update Data` : `تحديث البيانات`) : (locale === "en" ? `Send Data` : `إرسال البيانات`)}
            </button>
          </div>
        </form>
      </>
    );
}
