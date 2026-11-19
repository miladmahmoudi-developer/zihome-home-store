import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../hooks/useCart";

export const Cart = () => {
  // CartContext owns the items; this page calculates and displays them.
  const { items, removeFromCart, changeQuantity } = useCart();

  // Each line total is price multiplied by quantity; then all lines are summed.
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <ShoppingBag size={48} className="mx-auto mb-4 text-(--color-muted)" />
        <h1 className="mb-2 text-2xl font-bold">سبد خریدت خالی است</h1>
        <p className="mb-6 text-(--color-muted)">
          از فروشگاه محصولی انتخاب کن و به سبد خرید اضافه کن.
        </p>
        <Link
          to="/shop"
          className="inline-flex rounded-lg bg-(--color-primary) px-5 py-2.5 font-semibold text-white"
        >
          رفتن به فروشگاه
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">سبد خرید</h1>

      <div className="grid gap-6 md:grid-cols-[1fr_280px]">
        <section className="space-y-3" aria-label="محصولات سبد خرید">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-(--color-border) bg-white p-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-24 w-24 rounded-lg bg-(--color-surface) object-contain"
              />

              <div className="min-w-40 flex-1">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="mt-1 text-sm text-(--color-muted)">
                  {item.price.toLocaleString("fa-IR")} تومان
                </p>
                <p className="mt-1 text-sm font-semibold">
                  جمع این کالا:{" "}
                  {(item.price * item.quantity).toLocaleString("fa-IR")} تومان
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-(--color-border) p-1">
                <button
                  type="button"
                  onClick={() => changeQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stockCount}
                  aria-label={`افزایش تعداد ${item.name}`}
                  className="rounded p-1 disabled:opacity-40"
                >
                  <Plus size={18} />
                </button>

                <span className="min-w-6 text-center">{item.quantity}</span>

                <button
                  type="button"
                  onClick={() => changeQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label={`کاهش تعداد ${item.name}`}
                  className="rounded p-1 disabled:opacity-40"
                >
                  <Minus size={18} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                aria-label={`حذف ${item.name} از سبد خرید`}
                className="rounded-lg p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={18} />
              </button>
            </article>
          ))}
        </section>

        <aside className="h-fit rounded-xl border border-(--color-border) bg-white p-5">
          <h2 className="mb-4 text-lg font-bold">خلاصهٔ سفارش</h2>

          <div className="mb-4 flex justify-between gap-3">
            <span>تعداد کالاها</span>
            <span>
              {items.reduce((count, item) => count + item.quantity, 0)}
            </span>
          </div>

          <div className="mb-5 flex justify-between gap-3 border-t border-(--color-border) pt-4 font-bold">
            <span>مبلغ کل</span>
            <span>{totalPrice.toLocaleString("fa-IR")} تومان</span>
          </div>

          <Link
            to="/shop"
            className="block rounded-lg border border-(--color-border) px-4 py-2 text-center"
          >
            ادامهٔ خرید
          </Link>
        </aside>
      </div>
    </main>
  );
};
