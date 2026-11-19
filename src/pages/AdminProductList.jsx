import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Loader2, PackageX, Plus, Trash2, Pencil } from "lucide-react";
import { productService } from "../services/productService";

/** Lists locally saved products and provides edit and delete actions. */
export const AdminProductList = () => {
  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getProducts(),
  });

  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: async () => {
      // Remove stale product and category results from the shared query cache.
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleDelete = (product) => {
    // Ask before a permanent local-data change so accidental clicks do not delete.
    const confirmed = window.confirm(`محصول «${product.name}» حذف شود؟`);

    if (confirmed) {
      deleteMutation.mutate(product.id);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">مدیریت محصولات</h1>
          <p className="mt-1 text-sm text-(--color-muted)">
            محصولات ذخیره‌شده در فایل محلی پروژه
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-(--color-primary) px-4 py-2 font-semibold text-white"
        >
          <Plus size={18} />
          افزودن محصول
        </Link>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-16">
          <Loader2 className="animate-spin" />
          <span>در حال دریافت محصولات...</span>
        </div>
      )}

      {isError && (
        <p className="py-10 text-center text-red-600">
          دریافت محصولات انجام نشد. مطمئن شو سرور محلی در حال اجراست.
        </p>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-(--color-border) py-16 text-center">
          <PackageX size={40} className="text-(--color-muted)" />
          <p>هنوز محصولی ثبت نشده است.</p>
        </div>
      )}

      <div className="space-y-3">
        {products.map((product) => (
          <article
            key={product.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-(--color-border) bg-white p-4"
          >
            <img
              src={product.image}
              alt=""
              className="h-20 w-20 rounded-lg bg-(--color-surface) object-contain"
            />

            <div className="min-w-40 flex-1">
              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-sm text-(--color-muted)">{product.category}</p>
              <p className="mt-1 text-sm">
                {product.price.toLocaleString("fa-IR")} تومان
                {" · "}
                موجودی: {product.stockCount}
              </p>
            </div>

            <Link
              to={`/admin/products/${product.id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg border border-(--color-border) px-3 py-2 text-sm"
            >
              <Pencil size={16} />
              ویرایش
            </Link>

            <button
              type="button"
              onClick={() => handleDelete(product)}
              disabled={deleteMutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 disabled:opacity-50"
            >
              <Trash2 size={16} />
              حذف
            </button>
          </article>
        ))}
      </div>

      {deleteMutation.isError && (
        <p className="mt-4 text-sm text-red-600">
          حذف محصول انجام نشد. دوباره تلاش کن.
        </p>
      )}
    </main>
  );
};
