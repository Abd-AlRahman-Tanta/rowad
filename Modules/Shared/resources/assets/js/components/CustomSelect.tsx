import { usePage } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";

type SelectProps<T> = {
  pickOne?: boolean;
  choices: T[];
  viewedOption: keyof T;
  selectedOption: keyof T;
  onChange: (value: any[]) => void;
  preSelected?: T[] | any;
};

function CustomSelect<T extends Record<string, any>>({
  pickOne,
  choices,
  viewedOption,
  selectedOption,
  onChange,
  preSelected = [],
}: SelectProps<T>) {

  const { locale } = usePage().props as any;

  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState<any[]>([]);

  const initialized = useRef(false);

  const ref = useRef<HTMLDivElement>(null);

  /*
  |--------------------------------------------------------------------------
  | Initialize Selected Values
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (!initialized.current) {
      if (Array.isArray(preSelected)) {
        setSelected(
          preSelected.map((choice) => {
            if (typeof choice === "object" && choice !== null) {
              return {
                [selectedOption]: String(choice[selectedOption])
              };
            }
            return {
              [selectedOption]: String(choice)
            };
          })
        );
      }
      else if (preSelected) {
        setSelected([
          {
            [selectedOption]: String(preSelected[selectedOption])
          }
        ]);
      }
      initialized.current = true;
    }
  }, [preSelected]);
  const toggleOption = (choice: T) => {
    const value = String(choice[selectedOption]);
    let newSelected: any[];
    const exists = selected.some(
      item => String(item[selectedOption]) === value
    );
    if (pickOne) {
      newSelected = exists
        ? []
        : [{ [selectedOption]: value }];
      setOpen(false);
    }
    else {
      if (exists) {
        newSelected = selected.filter(
          item => String(item[selectedOption]) !== value
        );
      } else {
        newSelected = [
          ...selected,
          { [selectedOption]: value }
        ];
      }
    }
    setSelected(newSelected);
    onChange(newSelected);
  };
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () =>
      document.removeEventListener("mousedown", close);
  }, []);
  const getSelectedLabel = () => {
    if (pickOne && selected.length > 0) {
      const currentValue = String(
        selected[0][selectedOption]
      );
      const foundChoice = choices.find(
        choice =>
          String(choice[selectedOption]) === currentValue
      );
      return (
        foundChoice?.[viewedOption] ||
        (locale === "en"
          ? "Select option"
          : "اختر خيار")
      );
    }
    if (selected.length > 0) {
      return `${selected.length} ${locale === "en"
        ? "options selected"
        : "خيارات مختارة"
        }`;
    }
    return locale === "en"
      ? "Select options"
      : "اختر الخيارات";
  };
  return (
    <div
      ref={ref}
      className="relative w-full"
    >
      {/* select header */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="w-full border rounded-lg px-4 py-3 bg-white cursor-pointer flex justify-between items-center text-sm sm:text-base"
      >
        <span>
          {getSelectedLabel()}
        </span>
        <span className="text-gray-500">
          ▼
        </span>
      </button>
      {/* dropdown */}
      {open && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-10 max-h-56 overflow-y-auto">
          {choices.map((choice, i) => {
            const value = String(
              choice[selectedOption]
            );
            const active = selected.some(
              item =>
                String(item[selectedOption]) === value
            );
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggleOption(choice)}
                className={`w-full flex justify-between items-center px-4 py-3 text-sm sm:text-base hover:bg-gray-100 transition ${active
                  ? "bg-gray-100 font-medium"
                  : ""
                  }`}
              >
                <span>
                  {String(choice[viewedOption])}
                </span>
                {active && (
                  <span>✔</span>
                )}
              </button>
            );
          })}
          {choices.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">
              {locale === "en"
                ? "No options found"
                : "لا يوجد خيارات"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;