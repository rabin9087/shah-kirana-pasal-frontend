import { Link } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <div className="p-4 border shadow-sm sticky top-0 rounded-md z-50 bg-inherit flex justify-between">
      <div>logo</div>
      <div className="flex gap-5">
        <Link to="/">
          <Button className="rounded-full" variant={"default"}>
            Home
          </Button>
        </Link>
        <Link to="/">
          <Button className="rounded-full" variant={"secondary"}>
            About
          </Button>
        </Link>
        <Link to="/">
          <Button className="rounded-full" variant={"secondary"}>
            Contact
          </Button>
        </Link>
      </div>
      <div className="flex gap-4">
        <Link to="/sign-in">
          <Button className="rounded-full">Login</Button>
        </Link>
        <Link to="/sign-up">
          <Button className="rounded-full" variant={"outline"}>
            Signup
          </Button>{" "}
        </Link>

        <ThemeToggle />
      </div>
    </div>
  );
};

export default Header;
