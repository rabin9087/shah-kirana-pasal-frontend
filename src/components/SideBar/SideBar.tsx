import { useAppSelector } from "@/hooks";
import { motion } from "framer-motion";
const SideBar = () => {
  const { open } = useAppSelector((store) => store.sidebar);
  return (
    <motion.div
      initial={{ width: 100 }}
      animate={{ width: open ? "260px" : 100 }}
      className={`   sm:block  bg-accent p-3  overflow-y-auto animate-side-bar-open ${
        open ? " w-screen sm:w-[100px] md:w-[240px]" : "w-[100px] hidden"
      }`}
    >
      <div className="flex flex-col p-1">
        <ul className="flex flex-col gap-4">
          {Array(5)
            .fill("")
            .map((index) => (
              <li
                className="p-2 font-bold text-secondary-foreground rounded-md overflow-hidden bg-destructive"
                key={index}
              >
                menu
              </li>
            ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default SideBar;
