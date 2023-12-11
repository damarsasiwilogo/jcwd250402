import Search from "./Navbar/Search";
import UserMenu from "./Navbar/UserMenu";
import logo from "../asset/Logo.svg";
import Categories from "./Categories";
import Container from "./Container";

const Navbar = () => {
  return (
    <div className="fixed z-10 w-full bg-white shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row items-center justify-between">
            <div className="hidden md:block md:pl-2">
              <a href="/">
                <img src={logo} alt="app logo" className="h-80px w-[120px]" />
              </a>
            </div>
            <Search />
            <UserMenu />
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
