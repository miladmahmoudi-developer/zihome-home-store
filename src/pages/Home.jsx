import React from "react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { ProductCard } from "../components/ProductCard";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";

export const Home = () => {
  // The homepage reads live product data from the local API.
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getProducts(),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-3">
        <Loader2 className="animate-spin text-indigo-600" size={36} />
        <span className="text-sm text-gray-500 font-medium">
          در حال دریافت محصولات...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500 font-medium">
        خطایی در دریافت اطلاعات رخ داد.
      </div>
    );
  }

  // These values are derived from fetched data rather than stored separately.
  const featuredProducts = products
    .filter((product) => product.isFeatured)
    .slice(0, 3);

  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero image introduces the store before product sections begin. */}
      <section aria-label="بنر اصلی زی‌هوم" className="w-full overflow-hidden">
        <img
          src="/mainbaner.png"
          alt="ترندترین کالکشن دکوراسیون؛ زی‌هوم، زیبایی به سبک ایرانی"
          className="block h-auto w-full"
          fetchPriority="high"
        />
      </section>

      {/* Show up to three products marked as featured in the admin form. */}
      <section className="mx-auto max-w-6xl px-4">
        <h2 className="sr-only">محصولات ویژه</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex min-h-72 flex-col justify-between rounded-2xl bg-(--color-primary) p-6 text-white">
            <div>
              <Sparkles size={24} aria-hidden="true" />
              <h3 className="mt-4 text-xl font-bold">پیشنهاد شگفت‌انگیز</h3>
            </div>

            <Link
              to="/shop"
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-(--color-primary) transition hover:bg-(--color-surface)"
            >
              مشاهدهٔ محصولات
              <ArrowLeft size={16} aria-hidden="true" />
            </Link>
          </div>

          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Category cards are generated from categories present in product data. */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-end justify-between border-b border-(--color-border) pb-3">
          <h2 className="text-xl font-bold">دسته‌بندی محصولات</h2>

          <Link
            to="/shop"
            className="flex items-center gap-1 text-sm font-semibold text-(--color-primary)"
          >
            همهٔ محصولات
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((category) => {
            const categoryProduct = products.find(
              (product) => product.category === category,
            );

            return (
              <Link
                key={category}
                to="/shop"
                className="group flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-(--color-border) bg-white p-4 shadow-[0_2px_0_0_#d4d5d6] transition hover:shadow-md"
              >
                <img
                  src={categoryProduct.image}
                  alt=""
                  aria-hidden="true"
                  className="h-20 w-24 object-contain transition-transform group-hover:scale-105"
                  loading="lazy"
                />

                <span className="text-sm font-semibold text-(--color-text) group-hover:text-(--color-primary)">
                  {category}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <Link
          to="/shop"
          aria-label="مشاهدهٔ محصولات لوازم آشپزخانه"
          className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-primary)"
        >
          <img
            src="/marketing.png"
            alt=""
            className="block h-auto w-full"
            loading="lazy"
          />
        </Link>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 md:grid-cols-2">
        <Link
          to="/shop"
          aria-label="مشاهدهٔ محصولات دکوراسیون"
          className="block overflow-hidden rounded-2xl"
        >
          <img
            src="/promo-cabinet-left.png"
            alt=""
            className="block h-auto w-full"
            loading="lazy"
          />
        </Link>

        <Link
          to="/shop"
          aria-label="مشاهدهٔ محصولات دکوراسیون"
          className="block overflow-hidden rounded-2xl"
        >
          <img
            src="/promo-cabinet-right.png"
            alt=""
            className="block h-auto w-full"
            loading="lazy"
          />
        </Link>
      </section>

      {/* Group product cards by the same categories returned from the API. */}
      {categories.map((category) => {
        const categoryProducts = products
          .filter((product) => product.category === category)
          .slice(0, 4);

        return (
          <section key={category} className="mx-auto w-full max-w-6xl px-4">
            <div className="mb-6 flex items-end justify-between border-b border-(--color-border) pb-3">
              <h2 className="text-xl font-bold">{category}</h2>

              <Link
                to="/shop"
                className="text-sm font-semibold text-(--color-primary)"
              >
                مشاهدهٔ همه
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="mx-auto max-w-6xl px-4">
        <Link
          to="/shop"
          aria-label="مشاهدهٔ کالکشن چوبی"
          className="block overflow-hidden rounded-2xl"
        >
          <img
            src="/promo-wooden-collection.png"
            alt=""
            className="block h-auto w-full"
            loading="lazy"
          />
        </Link>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        {/* Editorial cards are static presentation content, not API records. */}
        <div className="mb-6 flex items-end justify-between border-b border-(--color-border) pb-3">
          <h2 className="text-xl font-bold">مطالب مجلهٔ زی‌هوم</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <article className="overflow-hidden rounded-xl border border-(--color-border) bg-white">
            <img
              src="/blog-bedroom-decor.png"
              alt="ایده‌هایی برای دکوراسیون اتاق خواب"
              className="aspect-4/3 w-full object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h3 className="font-bold">چطور اتاق خوابی دلنشین بسازیم؟</h3>
              <p className="mt-2 text-sm leading-6 text-(--color-muted)">
                چند ایدهٔ ساده برای زیباتر کردن فضای اتاق خواب.
              </p>
            </div>
          </article>

          <article className="overflow-hidden rounded-xl border border-(--color-border) bg-white">
            <img
              src="/blog-living-room.png"
              alt="ایده‌هایی برای چیدمان اتاق نشیمن"
              className="aspect-4/3 w-full object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h3 className="font-bold">چیدمان بهتر برای اتاق نشیمن</h3>
              <p className="mt-2 text-sm leading-6 text-(--color-muted)">
                با چند تغییر کوچک، فضای نشیمن را کاربردی‌تر کن.
              </p>
            </div>
          </article>

          <article className="overflow-hidden rounded-xl border border-(--color-border) bg-white">
            <img
              src="/blog-dishwasher-cleaning.png"
              alt="راهنمای نگهداری و تمیزکردن ماشین ظرف‌شویی"
              className="aspect-4/3 w-full object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h3 className="font-bold">روش درست تمیزکردن ماشین ظرف‌شویی</h3>
              <p className="mt-2 text-sm leading-6 text-(--color-muted)">
                نکته‌هایی برای نگهداری بهتر از لوازم آشپزخانه.
              </p>
            </div>
          </article>

          <article className="overflow-hidden rounded-xl border border-(--color-border) bg-white">
            <img
              src="/blog-gardening.png"
              alt="راهنمای نگهداری از گیاهان خانگی"
              className="aspect-4/3 w-full object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h3 className="font-bold">سبزتر کردن خانه با گیاهان</h3>
              <p className="mt-2 text-sm leading-6 text-(--color-muted)">
                چند نکته برای انتخاب و نگهداری گیاهان خانگی.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};
