import { Link } from "react-router-dom";

/** Fallback route shown when the URL does not match a page in AppRoutes. */
export const NotFound = () => {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-sm font-semibold text-(--color-primary)">خطای ۴۰۴</p>
      <h1 className="mt-2 text-3xl font-bold">این صفحه پیدا نشد</h1>
      <p className="mt-3 text-(--color-muted)">
        شاید آدرس را اشتباه وارد کرده‌ای یا صفحه جابه‌جا شده است.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-lg bg-(--color-primary) px-5 py-2.5 font-semibold text-white"
      >
        بازگشت به صفحهٔ اصلی
      </Link>
    </main>
  );
};
