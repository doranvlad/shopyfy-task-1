import Alpine from "alpinejs";
import { selectOption } from "@/alpine/utils/global";

export const productQuickOrder = ({ variantId = null } = {}) => ({
  product: null,
  selectedVariant: null,
  productOptions: null,
  addedToCart: false,
  loading: false,
  init() {
    const { product, productOptions } = JSON.parse(
      this.$el.querySelector('[type="application/json"]').textContent
    );
    this.product = product;

    if (variantId) {
      this.selectedVariant = product.variants.find(
        (variant) => variant.id === variantId
      );
    } else {
      this.selectedVariant = product.variants.find(
        (variant) => variant.available
      );

      if (!this.selectedVariant) {
        this.selectedVariant = product.variants[0];
      }
    }
    this.selectedVariant[
      "link"
    ] = `/products/${this.product.handle}?variant=${this.selectedVariant.id}`;
    this.productOptions = productOptions;
  },
  async addToCart() {
    try {
      this.loading = true;
      await Alpine.store("cart").addToCart([
        {
          id: this.selectedVariant.id,
          quantity: 1,
        },
      ]);
      this.loading = false;
      this.addedToCart = true;
    } catch (e) {
      this.loading = false;
      throw new Error(e.message);
    }
  },
  selectOption,
  changeVariant({ name }, optionValue) {
    this.selectOption({ name }, optionValue);
  },
});
