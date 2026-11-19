import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { ProductCard } from "../components/ProductCard";
import { Search, SlidersHorizontal, Loader2, PackageX } from "lucide-react";

export const Shop = () => {
  // These values describe the visitor's current search, category, and sort choice.
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // Product records come from the local API through the shared query cache.
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getProducts(),
  });

  // Categories are fetched separately so the filter buttons stay data-driven.
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productService.getCategories(),
  });

  // Filtering and sorting are applied to the array returned by filter().
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        const matchesCategory =
          selectedCategory === "all" || product.category === selectedCategory;

        // Search filter (name or description)
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0; // default order
      });
  }, [products, selectedCategory, searchTerm, sortBy]);

  const isLoading = isLoadingProducts || isLoadingCategories;

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-8">
      {/* Page introduction. */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900">
          فروشگاه زی‌هوم
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          تمام محصولات و دکوراسیون خانه در یک قاب
        </p>
      </div>

      {/* Control Bar: Search, Category Buttons & Sorting */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="جستجوی محصول..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <SlidersHorizontal size={18} className="text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-auto bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-indigo-600 transition cursor-pointer"
            >
              <option value="default">مرتب‌سازی: پیش‌فرض</option>
              <option value="price-low">ارزان‌ترین</option>
              <option value="price-high">گران‌ترین</option>
              <option value="rating">محبوب‌ترین (امتیاز)</option>
            </select>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm no-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition cursor-pointer ${
              selectedCategory === "all"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid / Status */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-80 gap-3">
          <Loader2 className="animate-spin text-indigo-600" size={36} />
          <span className="text-sm text-gray-500 font-medium">
            در حال دریافت و فیلتر محصولات...
          </span>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="space-y-4">
          <p className="text-xs text-gray-500">
            نمایش{" "}
            <span className="font-bold text-gray-800">
              {filteredProducts.length}
            </span>{" "}
            کالا
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 bg-white rounded-2xl border border-dashed border-gray-200">
          <PackageX size={48} className="text-gray-300" />
          <h3 className="text-lg font-bold text-gray-700">
            محصولی با این مشخصات پیدا نشد!
          </h3>
          <p className="text-sm text-gray-400 max-w-xs">
            کلمه دیگری را جستجو کنید یا فیلتر دسته‌بندی را تغییر دهید.
          </p>
        </div>
      )}
    </div>
  );
};
