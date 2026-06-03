import { useEffect, useState } from "react";

type Props = {
  Editor: any;
  name: string;
  value: string;
  onChange: (data: any) => void;
};

const RichTextInput = ({ Editor, name, value, onChange }: Props) => {
  const [isUploading, setIsUploading] = useState(false);
  const [richTextValue, setRichTextValue] = useState(value || "");

  useEffect(() => {
    setRichTextValue(value || "");
  }, [value]);

  const handleChange = (_event: any, editor: any) => {
    const data = editor.getData();
    setRichTextValue(data);
    onChange(data);
  };

  if (!Editor) {
    return null;
  }

  return (
    <div>
      <Editor
        value={richTextValue}
        onChange={handleChange}
        setIsUploading={setIsUploading}
        onUploadStart={() => setIsUploading(true)}
        onUploadComplete={() => setIsUploading(false)}
      />

      <textarea hidden name={name} value={richTextValue} readOnly />

      {isUploading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white text-xl z-50">
          Uploading File...
        </div>
      )}
    </div>
  );
};

export default RichTextInput;