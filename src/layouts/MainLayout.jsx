import { Link, Outlet } from "react-router-dom";
import {
  BadgeCheck,
  Heart,
  Menu,
  PackageCheck,
  Search,
  ShoppingCart,
  Truck,
  Home,
  Settings,
} from "lucide-react";
import { useCart } from "../hooks/useCart";

const COPYRIGHT_YEAR = new Date().getFullYear();

/**
 * Shared storefront shell: announcement, search/navigation, page outlet, and footer.
 * Nested routes render inside <Outlet /> while keeping the same site frame.
 */
export const MainLayout = () => {
  const { items } = useCart();

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="flex min-h-screen flex-col bg-(--color-page) text-(--color-text)">
      {/* Site-wide header stays visible while visitors scroll through a page. */}
      <header className="sticky top-0 z-50 bg-white">
        <div className="bg-(--color-dark) px-4 py-2 text-xs text-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
            <p>خرید بیش از یک میلیون تومان، ارسال رایگان</p>
            <Link to="/shop" className="hover:text-pink-300">
              خدمات مشتریان
            </Link>
          </div>
        </div>

        <div className="border-b border-(--color-border) px-4">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 py-4">
            <Link
              to="/"
              aria-label="زی‌هوم، صفحهٔ اصلی"
              className="flex shrink-0 items-center"
            >
              <img src="/zihome-logo.svg" alt="زی‌هوم" className="h-9 w-auto" />
            </Link>

            <form
              role="search"
              className="order-3 flex w-full items-center rounded-xl border border-(--color-border) px-3 py-2 sm:order-2 sm:w-auto sm:max-w-xl sm:flex-1"
            >
              <input
                type="search"
                aria-label="جست‌وجوی محصولات"
                placeholder="جست‌وجو در محصولات"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-(--color-muted)"
              />
              <Search size={20} className="text-(--color-muted)" />
            </form>

            <Link
              to="/cart"
              aria-label="سبد خرید"
              className="order-2 rounded-lg p-2 transition hover:bg-(--color-surface) sm:order-3"
            >
              <span className="relative inline-flex">
                <ShoppingCart size={22} />

                {cartCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -left-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-(--color-primary) px-1 text-xs font-bold text-white"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </span>
            </Link>
          </div>
        </div>

        <nav
          aria-label="ناوبری اصلی"
          className="border-b border-(--color-border) px-4"
        >
          <div className="mx-auto flex max-w-6xl items-center gap-5 overflow-x-auto py-3 text-sm">
            <Link
              to="/"
              className="flex shrink-0 items-center gap-1 hover:text-(--color-primary)"
            >
              <Home size={18} />
              خانه
            </Link>

            <Link
              to="/shop"
              className="flex shrink-0 items-center gap-1 hover:text-(--color-primary)"
            >
              <Menu size={18} />
              دسته‌بندی کالاها
            </Link>

            <Link
              to="/shop"
              className="flex shrink-0 items-center gap-1 hover:text-(--color-primary)"
            >
              <BadgeCheck size={17} />
              شگفت‌انگیزها
            </Link>

            <Link
              to="/shop"
              className="flex shrink-0 items-center gap-1 hover:text-(--color-primary)"
            >
              <Heart size={17} />
              محبوب‌ترین‌ها
            </Link>

            <Link
              to="/shop"
              className="flex shrink-0 items-center gap-1 hover:text-(--color-primary)"
            >
              <PackageCheck size={17} />
              پرفروش‌ترین‌ها
            </Link>

            <Link
              to="/admin/products"
              className="flex shrink-0 items-center gap-1 hover:text-(--color-primary)"
            >
              <Settings size={17} />
              مدیریت محصولات
            </Link>
          </div>
        </nav>
      </header>

      {/* React Router inserts the page for the current nested route here. */}
      <main className="grow">
        <Outlet />
      </main>

      {/* Shared footer content appears below every route using this layout. */}
      <footer className="mt-12 bg-(--color-surface)">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <section className="lg:col-span-2">
            <Link
              to="/"
              aria-label="زی‌هوم، صفحهٔ اصلی"
              className="flex shrink-0 items-center"
            >
              <img src="/zihome-logo.svg" alt="زی‌هوم" className="h-8 w-auto" />
            </Link>

            <h2 className="mt-4 text-base font-bold">دربارهٔ زی‌هوم</h2>

            <p className="mt-2 max-w-xl text-sm leading-7 text-(--color-muted)">
              مجموعه‌ای از محصولات خانه و آشپزخانه برای کمک به انتخاب و خریدی
              ساده‌تر.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold">دسته‌بندی‌ها</h2>

            <ul className="mt-3 space-y-2 text-sm text-(--color-muted)">
              <li>مبلمان و دکوراسیون</li>
              <li>لوازم آشپزخانه</li>
              <li>نور و روشنایی</li>
              <li>ابزار خانه</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold">خدمات مشتریان</h2>

            <ul className="mt-3 space-y-2 text-sm text-(--color-muted)">
              <li>
                <Link to="/cart" className="hover:text-(--color-primary)">
                  سبد خرید
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-(--color-primary)">
                  مشاهدهٔ محصولات
                </Link>
              </li>
            </ul>
          </section>
        </div>

        <div className="border-t border-(--color-border) px-4 py-5">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6 text-sm text-(--color-muted) sm:justify-between">
            <span className="flex items-center gap-2">
              <Truck size={18} />
              ارسال سریع
            </span>

            <span className="flex items-center gap-2">
              <BadgeCheck size={18} />
              ضمانت بازگشت کالا
            </span>

            <span className="flex items-center gap-2">
              <PackageCheck size={18} />
              اصالت کالا
            </span>
          </div>
        </div>

        <div className="border-t border-(--color-border) px-4 py-6">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6">
            <img
              src="/footer-trust-mark-blue.png"
              alt="نشان اعتماد"
              className="h-16 w-auto object-contain"
              loading="lazy"
            />

            <img
              src="/footer-trust-seal-blue.png"
              alt="مهر اعتماد آبی"
              className="h-16 w-auto object-contain"
              loading="lazy"
            />

            <img
              src="/footer-trust-seal-gold.png"
              alt="مهر اعتماد طلایی"
              className="h-16 w-auto object-contain"
              loading="lazy"
            />
          </div>
        </div>

        <div className="bg-(--color-dark) px-4 py-3 text-center text-xs text-white">
          © {COPYRIGHT_YEAR} زی‌هوم
        </div>
      </footer>
    </div>
  );
};
