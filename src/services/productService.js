import axios from "axios";

// Vite forwards these requests to the local Express server during development.
const PRODUCTS_URL = "/api/products";

/** Small client-side API layer used by pages instead of calling Axios directly. */
export const productService = {
  /** Save a new product and return the product created by the server. */
  createProduct: async (product) => {
    const { data } = await axios.post(PRODUCTS_URL, product);
    return data;
  },

  /** Delete one product by its server-generated ID. */
  deleteProduct: async (id) => {
    const { data } = await axios.delete(`${PRODUCTS_URL}/${id}`);
    return data;
  },

  /** Replace the editable fields of an existing product. */
  updateProduct: async (id, product) => {
    const { data } = await axios.patch(`${PRODUCTS_URL}/${id}`, product);
    return data;
  },

  /** Upload an image file and return its public URL from the server. */
  uploadProductImage: async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const { data } = await axios.post("/api/uploads", formData);
    return data.image;
  },

  /**
   * Fetch products, then optionally filter them in the browser.
   * The API currently returns the full local product list.
   */
  getProducts: async ({
    category = "",
    search = "",
    featuredOnly = false,
  } = {}) => {
    const { data: products } = await axios.get(PRODUCTS_URL);

    let result = products;

    if (featuredOnly) {
      result = result.filter((product) => product.isFeatured);
    }

    if (category && category.toLowerCase() !== "all") {
      result = result.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase(),
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query),
      );
    }

    return result;
  },

  /** Fetch one product for its detail or edit page. */
  getProductById: async (id) => {
    const { data } = await axios.get(`${PRODUCTS_URL}/${id}`);
    return data;
  },

  /** Build the category list from the categories currently in product data. */
  getCategories: async () => {
    const { data: products } = await axios.get(PRODUCTS_URL);
    return [...new Set(products.map((product) => product.category))];
  },
};
