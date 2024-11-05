import { calcThumbWrapperWidth, selectOption } from "@/alpine/utils/global";
import { colorOptionNames } from "@/constants";
import Swiper, { Navigation, Thumbs } from "swiper";
import api from "@/alpine/utils/api";
Swiper.use([Thumbs, Navigation]);

export const pdpGrid = ({ enabledImagesSwitchingByColor = false } = {}) => ({
  product: null,
  selectedVariant: null,
  productOptions: null,
  qty: 1,
  sellPlan: null,
  sellPlanId: null,
  loading: false,
  mainSlider: null,
  thumbsSlider: null,
  thumbsSliderMaxWidth: 0,
  slidesPerView: 5,
  spaceBetween: 8,
  isBeginning: true,
  isEnd: false,
  images: [],
  sliderUpdated: false,
  enabledImagesSwitchingByColor,
  init() {
    const params = new URL(document.location).searchParams;
    const sellPlanId = params.get("selling_plan");
    const { product, productOptions, selectedVariant } = JSON.parse(
      this.$el.querySelector('[type="application/json"]').textContent
    );
    this.product = product;
    this.productOptions = productOptions;
    this.selectedVariant = selectedVariant;
    this.selectedVariant[
      "link"
    ] = `/products/${this.product.handle}?variant=${this.selectedVariant.id}`;

    if (enabledImagesSwitchingByColor) {
      this.switchImagesByColor();
      this.thumbsSliderMaxWidth = calcThumbWrapperWidth({
        maxWidth: 40,
        slidesPerView: this.slidesPerView,
        currentImageCount: this.images.length,
        spaceBetween: this.spaceBetween,
      });
    } else {
      this.images = product.media;
      this.thumbsSliderMaxWidth = calcThumbWrapperWidth({
        maxWidth: 40,
        slidesPerView: this.slidesPerView,
        currentImageCount: product.media.length,
        spaceBetween: this.spaceBetween,
      });
    }

    if (product.selling_plan_groups && product.selling_plan_groups.length) {
      //find selling plan by query param
      if (sellPlanId) {
        this.sellPlan = product.selling_plan_groups[0].selling_plans.find(
          (plan) => plan.id === parseInt(sellPlanId)
        );
      } else {
        //setup first selling plan by default
        this.sellPlan = product.selling_plan_groups[0].selling_plans[0];
      }

      //if product sells only with subscription$
      if (product.requires_selling_plan) {
        this.sellPlanId = this.sellPlan.id;
      }
    }

    this.initSliders();
  },
  selectOption,
  changeVariant({ name }, optionValue) {
    this.selectOption({ name }, optionValue);
    if (enabledImagesSwitchingByColor && colorOptionNames.includes(name)) {
      this.switchImagesByColor();
      this.mainSlider.slideTo(0);
      this.thumbsSlider.slideTo(0);
    }
  },
  switchImagesByColor() {
    const { position } = this.productOptions.find((option) =>
      colorOptionNames.includes(option.name)
    );
    const colorOptionValue = this.selectedVariant[`option${position}`];
    this.images = this.product.media.filter((img) =>
      img.alt.includes(colorOptionValue)
    );
  },
  initSliders() {
    const _this = this;
    if (enabledImagesSwitchingByColor) {
      this.thumbsSlider = new Swiper(this.$refs["thumb-slider-js"], {
        slidesPerView: "auto",
        spaceBetween: 8,
        observer: true,
        breakpoints: {},
        on: {
          slideChange: function (swiper) {
            _this.isBeginning = swiper.isBeginning;
            _this.isEnd = swiper.isEnd;
          },
        },
      });

      this.mainSlider = new Swiper(this.$refs["main-slider-js"], {
        slidesPerView: 1,
        observer: true,
        thumbs: {
          swiper: this.thumbsSlider,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    }
  },
  async addToCart() {
    try {
      this.loading = true;
      await this.$store.cart.addToCart(
        [
          {
            id: this.selectedVariant.id,
            quantity: this.qty,
            selling_plan: this.sellPlanId,
          },
        ],
        true
      );
      this.$store.drawer.hide();
      this.loading = false;
    } catch (e) {
      this.loading = false;
      console.log(e);
    }
  },
  changeActiveSellingPlan({ sellPlan }) {
    this.sellPlan = sellPlan;
    this.$el
      .closest("[data-selling-plan-container]")
      .querySelectorAll("[data-selling-plan-option]")
      .forEach((e) => e.classList.remove("!bg-sc-subtitle/30"));
    this.$el.classList.add("!bg-sc-subtitle/30");
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
      productRecommendationsSection.innerHTML = recommendations.innerHTML;
    } catch (e) {
      console.log(e);
    }
  },
});
