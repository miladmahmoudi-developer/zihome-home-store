import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { useCart } from "../hooks/useCart";

import {
  Star,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

/** Displays one product and lets a visitor choose a quantity for the cart. */
export default function ProductDetails() {
  // The route parameter selects which product the API should return.
  const { id } = useParams();

  // Quantity belongs to this page until the visitor adds the product to the cart.
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [addedMessage, setAddedMessage] = useState("");

  // React Query loads the product and keeps its result in the shared query cache.
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id),
  });

  // Show a temporary state while the API request is still running.
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="mt-4 text-slate-500">در حال دریافت مشخصات محصول...</p>
      </div>
    );
  }

  // A failed request or missing product ID both lead to a recovery link.
  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          محصولی پیدا نشد!
        </h2>
        <p className="text-slate-500 mb-6">
          {error?.message || "محصول مورد نظر وجود ندارد."}
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <ArrowRight size={18} />
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleIncrease = () => {
    // Never offer a quantity larger than the server's available stock.
    if (quantity < product.stockCount) setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    // CartProvider repeats the stock check as a second safety guard.
    if (product.stockCount < 1) return;

    addToCart(product, quantity);
    setAddedMessage(`${quantity} عدد به سبد خرید اضافه شد.`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Return to the product list without losing the current route history. */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition font-medium text-sm"
      >
        <ArrowRight size={16} />
        بازگشت به همه محصولات
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
        {/* Product image column. */}
        <div className="flex items-center justify-center bg-slate-50 rounded-xl p-8 border border-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-95 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product information and purchase controls. */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-sm">
                <Star size={16} fill="currentColor" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-slate-400">
                  ({product.reviewsCount} نظر)
                </span>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4">
              {product.name}
            </h1>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="mb-6">
              <span className="text-xs text-slate-400 block mb-1">
                قیمت محصول
              </span>
              <div className="text-2xl md:text-3xl font-black text-indigo-600">
                {product.price.toLocaleString("fa-IR")}{" "}
                <span className="text-sm font-normal text-slate-500">
                  تومان
                </span>
              </div>
            </div>
          </div>

          <div>
            {/* Quantity controls and the primary cart action. */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={handleDecrease}
                  className="px-3.5 py-2 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  -
                </button>
                <span className="px-4 py-2 font-bold text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="px-3.5 py-2 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stockCount < 1}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart size={18} />
                {product.stockCount < 1 ? "ناموجود" : "افزودن به سبد خرید"}
              </button>
            </div>

            {addedMessage && (
              <p className="mb-4 text-sm text-green-700" role="status">
                {addedMessage}
              </p>
            )}

            {/* Short service promises displayed below the purchase action. */}
            <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-6 text-center text-xs text-slate-500">
              <div className="flex flex-col items-center gap-1">
                <Truck size={20} className="text-indigo-600" />
                <span>ارسال سریع</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={20} className="text-indigo-600" />
                <span>ضمانت اصالت</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw size={20} className="text-indigo-600" />
                <span>۷ روز مهلت بازگشت</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
