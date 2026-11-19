import { Link } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";

/**
 * Reusable summary card for product grids.
 * The whole card links to details so the image, name, and price share one action.
 */
export const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-(--color-border) bg-white shadow-[0_2px_0_0_#d4d5d6] transition-shadow hover:shadow-md"
    >
      <div className="flex aspect-4/3 items-center justify-center overflow-hidden bg-white p-4">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-4">
        <div>
          <div
            className="mb-2 flex items-center gap-1 text-xs text-(--color-muted)"
            aria-label={`امتیاز ${product.rating} از ۵`}
          >
            <Star
              size={14}
              aria-hidden="true"
              className="fill-amber-400 text-amber-400"
            />
            <span>{product.rating}</span>
            <span>({product.reviewsCount})</span>
          </div>

          <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-(--color-text) transition-colors group-hover:text-(--color-primary)">
            {product.name}
          </h3>
        </div>

        <div className="flex items-end justify-between border-t border-(--color-border) pt-3">
          <div>
            <span className="mb-1 block text-xs text-(--color-muted)">
              قیمت
            </span>
            <span className="font-bold text-(--color-text)">
              {product.price.toLocaleString("fa-IR")} تومان
            </span>
          </div>

          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--color-surface) text-(--color-primary) transition-colors group-hover:bg-(--color-primary) group-hover:text-white"
          >
            <ArrowLeft size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
};
