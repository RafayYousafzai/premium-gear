import { ShoppingCart, User } from "lucide-react"; // Updated icons
import { Link } from "react-router-dom";

export default function SidebarNavigation() {
  return (
    <div className="fixed top-0 bottom-0 w-64 h-screen bg-gray-900 text-gray-300 flex flex-col">
      <img
        src="/assets/logo.png"
        alt="Premium Car"
        className="w-40 mx-auto mt-10 h-auto object-cover"
      />
      <div className="p-4 flex items-center justify-center border-b border-gray-700">
        <h1 className="text-xl font-bold text-yellow-500">PREMIUM CAR</h1>
      </div>
      <nav className="flex-1">
        <ul className="py-4">
          <NavItem icon={User} to="/profile" text="Profile" />
          <NavItem icon={ShoppingCart} to="/user" text="  Orders" />
        </ul>
      </nav>
    </div>
  );
}

function NavItem({ icon: Icon, text, to }) {
  return (
    <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
      <Link to={to} className="flex items-center">
        <Icon className="w-5 h-5 mr-4" />
        <span>{text}</span>
      </Link>
    </li>
  );
}
