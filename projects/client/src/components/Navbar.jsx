import Search from "./Navbar/Search";
import UserMenu from "./Navbar/UserMenu";
import logo from "../asset/Logo.svg";

const Navbar = () => {
  return (
    <div className="fixed z-10 w-full p-3 bg-[#FFF] shadow-sm">
      <div id="container" className="max-w-[2520px]">
        <div className="flex flex-row items-center justify-between">
          <div className="hidden md:block">
            <a href="/">
              <img src={logo} alt="app logo" className="h-80px w-[120px]" />
            </a>
          </div>
          <Search />
          <UserMenu />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
