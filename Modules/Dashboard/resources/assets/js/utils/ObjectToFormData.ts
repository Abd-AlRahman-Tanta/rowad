function ObjectToFormData(
  obj: any,
  formData: FormData = new FormData(),
  parentKey: string = ''
): FormData {

  if (obj === null || obj === undefined) {
    if (parentKey) formData.append(parentKey, '');
    return formData;
  }

  if (obj instanceof File) {
    formData.append(parentKey, obj);
    return formData;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      formData.append(`${parentKey}`, '');
    } else {
      obj.forEach((item, index) => {
        ObjectToFormData(item, formData, `${parentKey}[${index}]`);
      });
    }
    return formData;
  }

  if (typeof obj === 'object') {
    Object.keys(obj).forEach((key) => {
      const formKey = parentKey ? `${parentKey}[${key}]` : key;
      ObjectToFormData(obj[key], formData, formKey);
    });
    return formData;
  }

  formData.append(parentKey, String(obj));
  return formData;
}

export default ObjectToFormData;