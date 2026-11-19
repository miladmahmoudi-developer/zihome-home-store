import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { AdminProducts } from "../pages/AdminProducts";
import { AdminProductList } from "../pages/AdminProductList";
import { Home } from "../pages/Home";
import { Shop } from "../pages/Shop";
import ProductDetails from "../pages/ProductDetails";
import { Cart } from "../pages/Cart";
import { NotFound } from "../pages/NotFound";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Store pages share the header, footer, and other site-wide layout. */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin/products/new" element={<AdminProducts />} />
        <Route path="/admin/products" element={<AdminProductList />} />
        <Route path="/admin/products/:id/edit" element={<AdminProducts />} />
      </Route>

      {/* Keep the not-found page outside the store layout. */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
