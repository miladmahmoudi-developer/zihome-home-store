import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { productService } from "../services/productService";

// Validate browser form values before sending them to the Express API.
// The server checks the same product fields again because clients are not trusted.
const productSchema = z.object({
  name: z.string().trim().min(2, "نام محصول را وارد کن."),
  category: z.string().trim().min(2, "دسته‌بندی را وارد کن."),
  price: z.coerce.number().positive("قیمت باید بیشتر از صفر باشد."),
  image: z.string().trim().min(1, "آدرس تصویر را وارد کن."),
  description: z.string().trim().min(5, "توضیحات محصول را وارد کن."),
  stockCount: z.coerce.number().int().min(0, "موجودی نمی‌تواند منفی باشد."),
  isFeatured: z.boolean(),
});

const defaultValues = {
  name: "",
  category: "",
  price: "",
  image: "",
  description: "",
  stockCount: 0,
  isFeatured: false,
};

// Shared input styling keeps every field visually consistent.
const inputClassName =
  "w-full rounded-lg border border-(--color-border) bg-white px-3 py-2 outline-none focus:border-(--color-primary)";

/**
 * One form handles both creating and editing products.
 * The route ID decides which mode is active.
 */
export const AdminProducts = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const productQuery = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id),
    enabled: isEditing,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");

  const imagePath = useWatch({
    control,
    name: "image",
  });

  // When edit data arrives, copy it into React Hook Form's field state.
  useEffect(() => {
    if (productQuery.data) {
      reset({
        name: productQuery.data.name,
        category: productQuery.data.category,
        price: productQuery.data.price,
        image: productQuery.data.image,
        description: productQuery.data.description,
        stockCount: productQuery.data.stockCount,
        isFeatured: Boolean(productQuery.data.isFeatured),
      });
    }
  }, [productQuery.data, reset]);

  const saveMutation = useMutation({
    mutationFn: ({ productId, product }) => {
      if (productId) {
        return productService.updateProduct(productId, product);
      }

      return productService.createProduct(product);
    },
    onSuccess: async (_, variables) => {
      // Refresh lists that may show the changed product or its category.
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });

      if (variables.productId) {
        await queryClient.invalidateQueries({
          queryKey: ["product", variables.productId],
        });
        navigate("/admin/products");
      } else {
        reset(defaultValues);
      }
    },
  });

  const handleImageChange = async (event) => {
    const input = event.currentTarget;
    const imageFile = input.files?.[0];

    if (!imageFile) return;

    setIsUploadingImage(true);
    setImageUploadError("");

    try {
      // Upload first; the API returns a URL that can be saved with the product.
      const uploadedImagePath =
        await productService.uploadProductImage(imageFile);

      setValue("image", uploadedImagePath, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch (error) {
      setImageUploadError(
        error.response?.data?.message || "آپلود تصویر انجام نشد.",
      );
    } finally {
      // Clearing the input allows selecting the same file again after an error.
      setIsUploadingImage(false);
      input.value = "";
    }
  };

  const onSubmit = (values) => {
    // HTML number inputs provide strings, so convert them before saving.
    const stockCount = Number(values.stockCount);

    const product = {
      ...values,
      price: Number(values.price),
      stockCount,
      inStock: stockCount > 0,
    };

    saveMutation.mutate({ productId: id, product });
  };

  if (isEditing && productQuery.isLoading) {
    return <p className="py-16 text-center">در حال دریافت اطلاعات محصول...</p>;
  }

  if (isEditing && productQuery.isError) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="mb-4 text-red-600">اطلاعات محصول دریافت نشد.</p>
        <Link to="/admin/products" className="text-(--color-primary)">
          بازگشت به مدیریت محصولات
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold">
        {isEditing ? "ویرایش محصول" : "افزودن محصول"}
      </h1>

      <p className="mb-6 text-sm text-(--color-muted)">
        اطلاعات محصول در فایل محلی پروژه ذخیره می‌شود.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-2xl border border-(--color-border) bg-white p-6"
      >
        <label className="block space-y-1">
          <span>نام محصول</span>
          <input {...register("name")} className={inputClassName} />
          {errors.name && (
            <span className="text-sm text-red-600">{errors.name.message}</span>
          )}
        </label>

        <label className="block space-y-1">
          <span>دسته‌بندی</span>
          <input {...register("category")} className={inputClassName} />
          {errors.category && (
            <span className="text-sm text-red-600">
              {errors.category.message}
            </span>
          )}
        </label>

        <label className="block space-y-1">
          <span>قیمت به تومان</span>
          <input
            {...register("price")}
            type="number"
            min="1"
            className={inputClassName}
          />
          {errors.price && (
            <span className="text-sm text-red-600">{errors.price.message}</span>
          )}
        </label>

        <div className="space-y-2">
          <label className="block space-y-1">
            <span>تصویر محصول</span>
            <input type="hidden" {...register("image")} />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              disabled={isUploadingImage}
              className={inputClassName}
            />
          </label>

          {isUploadingImage && (
            <p className="text-sm text-(--color-muted)">
              در حال آپلود تصویر...
            </p>
          )}

          {imageUploadError && (
            <p className="text-sm text-red-600">{imageUploadError}</p>
          )}

          {errors.image && (
            <p className="text-sm text-red-600">{errors.image.message}</p>
          )}

          {imagePath && (
            <img
              src={imagePath}
              alt="پیش‌نمایش تصویر محصول"
              className="h-32 w-32 rounded-lg border border-(--color-border) object-contain"
            />
          )}
        </div>

        <label className="block space-y-1">
          <span>توضیحات</span>
          <textarea
            {...register("description")}
            rows={4}
            className={inputClassName}
          />
          {errors.description && (
            <span className="text-sm text-red-600">
              {errors.description.message}
            </span>
          )}
        </label>

        <label className="block space-y-1">
          <span>تعداد موجودی</span>
          <input
            {...register("stockCount")}
            type="number"
            min="0"
            className={inputClassName}
          />
          {errors.stockCount && (
            <span className="text-sm text-red-600">
              {errors.stockCount.message}
            </span>
          )}
        </label>

        <label className="flex items-center gap-2">
          <input {...register("isFeatured")} type="checkbox" />
          محصول ویژه است
        </label>

        {saveMutation.isError && (
          <p className="text-sm text-red-600">ذخیرهٔ محصول انجام نشد.</p>
        )}

        {saveMutation.isSuccess && !isEditing && (
          <p className="text-sm text-green-700">محصول ذخیره شد.</p>
        )}

        <button
          type="submit"
          disabled={saveMutation.isPending || isUploadingImage}
          className="rounded-lg bg-(--color-primary) px-5 py-2 font-semibold text-white disabled:opacity-60"
        >
          {saveMutation.isPending
            ? "در حال ذخیره..."
            : isEditing
              ? "ذخیرهٔ تغییرات"
              : "ذخیرهٔ محصول"}
        </button>
      </form>
    </main>
  );
};
