import {
  addItems,
  changeQuantity,
  getCart,
  removeItem,
  updateCart,
  changeItem,
} from "@/alpine/utils/api";
import Alpine from "alpinejs";

export const cart = {
  obj: {
    item_count: 0,
  }, // obj === cart,
  cart_progress_bar_threshold: 0,
  visible: false,
  isLoading: false, // used for checkout btn for adding spinner in button
  isFetching: true, // used onetime for swapping shopAll or cartButton in header on page loading
  isUpdating: false, // used for all another triggers in cart, for example for main cart spinner
  anchor: "cart-anchor", // used for scrolling cart-drawer to top
  upsells: [],
  async init() {
    await this.getCart();
  },
  show() {
    this.visible = true;
    Alpine.store("stop-scroll").enable();
  },
  hide() {
    this.visible = false;
    Alpine.store("stop-scroll").disable();
  },
  checkout() {
    this.isLoading = true;
    window.location.href = "/checkout";
  },
  async getCart() {
    try {
      this.isUpdating = true;

      const cart = await getCart();

      this.obj = await this.getAdditionalData(cart);
      this.isFetching = false;
      this.isUpdating = false;
    } catch (e) {
      this.isUpdating = false;
      throw new Error(e);
    }
  },
  async getAdditionalData(cart) {
    const products = await fetch(`/cart?view=additional-data`).then((res) =>
      res.json()
    );

    cart.items = cart.items.map((item) => {
      if (!Object.prototype.hasOwnProperty.call(products, item.id)) {
        return item;
      }

      return {
        ...item,
        ...products[item.id],
      };
    });

    cart.cart_compared_price = Object.values(cart.items).reduce(
      (cart_compared_price, item) => {
        return item.compare_at_price
          ? cart_compared_price + item.compare_at_price * item.quantity
          : cart_compared_price + item.price * item.quantity;
      },
      0
    );

    return cart;
  },
  async addToCart(products, openCart = false) {
    try {
      this.isUpdating = true;
      await addItems(products);
      await this.getCart();
      this.isUpdating = false;
      if (openCart) {
        this.show();
      }
    } catch (e) {
      this.isUpdating = false;
      throw new Error(e);
    }
  },
  async removeItem(key) {
    const $lineItemImage = document.querySelector(
      `[data-line-item-img="${key}"]`
    );

    try {
      this.isUpdating = true;
      $lineItemImage.setAttribute("aria-busy", "true");
      const cart = await removeItem(key);
      const cartWithAdditionalData = await this.getAdditionalData(cart);

      this.updateCart(cartWithAdditionalData);
      this.isUpdating = false;
      $lineItemImage.setAttribute("aria-busy", "false");
    } catch (e) {
      this.isUpdating = false;
      $lineItemImage.setAttribute("aria-busy", "false");
      throw new Error(e);
    }
  },
  async changeQuantity({ key, quantity }) {
    const $lineItemImage = document.querySelector(
      `[data-line-item-img="${key}"]`
    );

    try {
      this.isUpdating = true;
      $lineItemImage.setAttribute("aria-busy", "true");
      let cart = await changeQuantity(key, quantity);
      const cartWithAdditionalData = await this.getAdditionalData(cart);

      this.updateCart(cartWithAdditionalData);
      this.isUpdating = false;
      $lineItemImage.setAttribute("aria-busy", "false");
    } catch (e) {
      this.isUpdating = false;
      $lineItemImage.setAttribute("aria-busy", "false");
      throw new Error(e);
    }
  },
  async updateOrderNote(note) {
    try {
      this.isUpdating = true;
      const cart = await updateCart({ note });
      const cartWithAdditionalData = await this.getAdditionalData(cart);

      this.updateCart(cartWithAdditionalData);
      this.isUpdating = false;
    } catch (e) {
      this.isUpdating = false;
      throw new Error(e.message);
    }
  },
  updateCart(cart) {
    this.obj = cart;
  },
  async changeItem(newItem) {
    try {
      console.log(newItem);
      this.isUpdating = true;
      const cart = await changeItem(newItem);
      const cartWithAdditionalData = await this.getAdditionalData(cart);

      this.updateCart(cartWithAdditionalData);
      this.isUpdating = false;
    } catch (e) {
      this.isUpdating = false;
      throw new Error(e);
    }
  },
  scrollContentToTop() {
    if (document.getElementById(this.anchor)) {
      document.getElementById(this.anchor).scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }
  },
};
