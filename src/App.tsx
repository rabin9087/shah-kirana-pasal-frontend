import "./App.css";
import { ModeToggle } from "./components/ThemeToggle";
import SignIn from "./pages/signin-signup/SignIn";

function App(){
  return (
    <div>
      <div className="text-end p-2">
      <ModeToggle />
      </div>
      <SignIn/>
    </div>
  );
}

export default App;
