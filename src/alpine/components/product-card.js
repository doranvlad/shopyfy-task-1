import Alpine from "alpinejs";
import { selectOption } from "@/alpine/utils/global";

export const productCard = () => ({
  product: null,
  selectedVariant: null,
  productOptions: null,
  variantId: null,
  init() {
    const { product, productOptions } = JSON.parse(
      this.$el.querySelector('[type="application/json"]').textContent
    );
    this.product = product;
    this.selectedVariant = product.variants.find(
      (variant) => variant.available
    );
    if (!this.selectedVariant) {
      this.selectedVariant = product.variants[0];
    }
    this.variantId = this.selectedVariant.id;
    this.selectedVariant[
      "link"
    ] = `/products/${this.product.handle}?variant=${this.selectedVariant.id}`;
    this.productOptions = productOptions;
  },
  async addToCart() {
    try {
      await Alpine.store("cart").addToCart([
        {
          id: this.selectedVariant.id,
          quantity: 1,
        },
      ]);
      this.addedToCart = true;
    } catch (e) {
      throw new Error(e.message);
    }
  },
  selectOption,
  changeVariant({ name }, optionValue) {
    this.selectOption({ name }, optionValue);
    this.variantId = this.selectedVariant.id;
  },
});
