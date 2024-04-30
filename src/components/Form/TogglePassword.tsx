import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
function TogglePasswordVisibility() {
  const [type, setType] = useState<"password" | "text">("password");
  function handleClick() {
    type === "password" ? setType("text") : setType("password");
  }
  return {
    type,
    ToggleVisibility:
      type === "password" ? (
        <a
          className="absolute right-5 top-10 hover:cursor-pointer"
          onClick={handleClick}
        >
          <FaEye className="text-black" />
        </a>
      ) : (
        <a
          className="absolute right-5 top-10 hover:cursor-pointer"
          onClick={handleClick}
        >
          <IoMdEyeOff className="text-black" />
        </a>
      ),
  };
}

export default TogglePasswordVisibility;
