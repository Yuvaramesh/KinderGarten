import { cn } from "../../lib/utils";
import { ClassValue } from "clsx";

const Tooltip = ({ className }: { className: ClassValue }) => {
  return (
    <div
      className={cn(
        className,
        "flex items-center justify-center bg-white/10 shadow-sm shadow-black backdrop-blur-sm"
      )}
    >
      <span className=" inline-block align-middle">siva</span>
    </div>
  );
};

export default Tooltip;
