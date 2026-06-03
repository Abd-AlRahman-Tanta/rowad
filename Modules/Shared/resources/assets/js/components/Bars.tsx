import { Dispatch, SetStateAction } from "react";
import { FaBars } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

/**
 * Mobile hamburger menu toggle button.
 * - Shows a "menu" icon when closed, "close" icon when open.
 * - Uses scale animation to fade between icons.
 */
const Bars = ({ list, showList }: { list: boolean; showList: Dispatch<SetStateAction<boolean>> }) => {
  return (
    <div className="w-8 h-8 relative hidden max-desc:block text-arch-dark">
      {/* Hamburger icon — visible when menu is closed */}
      <FaBars
        onClick={() => showList(true)}
        className={`
          ${list ? "scale-0" : "scale-100"}
                absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                text-[1.2rem] cursor-pointer duration-300`}
      />

      {/* Close (X) icon — visible when menu is open */}
      <RxCross2
        onClick={() => showList(false)}
        className={`
          ${list ? "scale-100" : "scale-0"}
                    absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                    text-[1.2rem] cursor-pointer duration-300`}
      />
    </div>
  );
};

export default Bars;
