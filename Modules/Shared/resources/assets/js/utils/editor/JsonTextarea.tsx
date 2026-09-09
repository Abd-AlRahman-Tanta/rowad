import { useState } from "react";

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
        className={`border min-h-32 p-2 rounded outline-none font-mono text-sm resize-y w-full  ${isInvalid ? 'border-red-500 bg-red-50' : ''}`}
        dir="ltr"
        placeholder={'{\n  "@context": "http://schema.org",\n  "@type": "LocalBusiness"\n}'}
      />
      {isInvalid && (
        <span className="text-red-500 text-xs">Invalid Json</span>
      )}
    </div>
  );
};
export default JsonTextarea;