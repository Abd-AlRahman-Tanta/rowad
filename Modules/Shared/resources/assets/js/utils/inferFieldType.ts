export function inferFieldType(key: string, richText?: boolean): "text" | "textarea" | "image" | any {
  if (!key) {
    return;
  }
  const k = key.toLowerCase();

  if (k.includes("icon") || k.includes("image") || k.includes("logo") || k.includes("webp") || k.includes("png") || k.includes("jpg") || k.includes("svg"))
    return "image";

  if (k.includes("description") && richText)
    return "richtext";

  if (k.includes("content"))
    return "textarea";

  return "text";
}