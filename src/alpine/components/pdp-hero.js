import Swiper, { Autoplay, Grid, Pagination, Thumbs } from "swiper";
import Alpine from "alpinejs";
import api from "@/alpine/utils/api";
import { selectOption } from "@/alpine/utils/global";

Swiper.use([Autoplay, Pagination, Thumbs, Grid]);

export const pdpHero = () => ({
  product: null,
  selectedVariant: null,
  productOptions: null,
  isFetching: true,
  loading: false,
  slider: null,
  thumbs_slider: null,
  recommended_slider: null,
  product_media: null,
  quantity: 1,
  init() {
    const { product, productOptions } = JSON.parse(
      this.$el.querySelector('[type="application/json"]').textContent
    );
    this.product = product;
    const params = new URL(document.location).searchParams;
    const varId = params.get("variant");
    if (varId) {
      this.selectedVariant = product.variants.find(
        (variant) => variant.id === +varId
      );
    } else {
      this.selectedVariant = product.variants.find(
        (variant) => variant.available
      );
    }
    if (!this.selectedVariant) {
      this.selectedVariant = product.variants[0];
    }
    this.product_media = this.product.media;

    this.initSliders();
    this.productOptions = productOptions;

    this.isFetching = false;

    window.onpopstate = () => {
      window.location.reload();
    };
  },
  initSliders() {
    this.thumbs_slider = new Swiper('[data-slider="pdp_slider_thumbs"]', {
      slidesPerView: 2,
      followFinger: false,
      observer: true,
      grid: {
        rows: 2,
      },
      spaceBetween: 30,
    });
    this.slider = new Swiper('[data-slider="pdp_slider"]', {
      slidesPerView: 1,
      spaceBetween: 0,
      grabCursor: true,
      observer: true,
      breakpoints: {
        640: {
          slidesPerView: 1.7,
          spaceBetween: 20,
          slidesOffsetBefore: 30,
          slidesOffsetAfter: 30,
        },
        1024: {
          slidesPerView: 1,
          spaceBetween: 0,
          slidesOffsetBefore: 0,
          slidesOffsetAfter: 0,
        },
      },
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 4,
      },
      thumbs: {
        swiper: this.thumbs_slider,
      },
    });
  },
  selectOption,
  changeVariant({ name, index }, optionValue) {
    this.selectOption({ name, index }, optionValue);
    this.updateShopPay();
    this.changeUrl(
      `/products/${this.product.handle}?variant=${this.selectedVariant.id}`
    );
  },
  updateShopPay() {
    const shopPay = document.querySelectorAll("shopify-payment-terms");

    if (shopPay) {
      shopPay.forEach((item) => {
        item.setAttribute("variant-id", this.selectedVariant.id);
      });
    }
  },
  async addToCart() {
    this.loading = true;
    await Alpine.store("cart").addToCart({
      item: {
        id: this.selectedVariant.id,
        quantity: this.quantity,
      },
      product_handle: this.product.handle,
    });
    this.loading = false;
  },
  async loadRecommendations(url) {
    try {
      const productRecommendationsSection = this.$root.querySelector(
        ".product-recommendations"
      );
      const response = await api.get(url, { responseType: "document" });
      const recommendations = response.querySelector(
        ".product-recommendations"
      );

      if (recommendations && recommendations.innerHTML.trim().length) {
        productRecommendationsSection.innerHTML = recommendations.innerHTML;

        this.recommended_slider = new Swiper(
          '[data-slider="pdp-recommended-products"]',
          {
            slidesPerView: "auto",
            spaceBetween: 10,
            breakpoints: {
              1024: {
                slidesPerView: 4,
                spaceBetween: 10,
              },
            },
          }
        );
      }
    } catch (e) {
      console.log(e);
    }
  },
  async changeFlavor(url) {
    try {
      const main = document.querySelector("main");
      const response = await api.get(url, { responseType: "document" });
      main.innerHTML = response.querySelector("main").innerHTML;
      this.changeUrl(url);
      document.body.scrollIntoView({ behavior: "smooth" });
    } catch (e) {
      console.log(e);
    }
  },
  changeUrl(url) {
    window.history.pushState({}, url, url);
  },
});
