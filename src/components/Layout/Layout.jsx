import Header from "./Header";
import Footer from "./Footer";
import { useCart } from "../../context/CartContext";
import "./Layout.css";

const Layout = ({ children }) => {
  const { getCartCount } = useCart();

  return (
    <div className="layout">
      <Header cartCount={getCartCount()} />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
