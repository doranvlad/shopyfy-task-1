import axios from "axios";
import { getProduct } from "@/alpine/utils/api";
export const sellingPlan = ({ lineItem }) => ({
  loading: false,
  selling_plans: [],
  discountType: "",
  discountValue: "",
  activeSellingPlanId: null,
  line: 0,
  async init() {
    const { handle } = lineItem;
    this.line = this.$store.cart.obj.items.findIndex(
      (i) => i.key === lineItem.key
    );
    try {
      const product = await getProduct(handle);
      if (product.selling_plan_groups && product.selling_plan_groups.length) {
        this.selling_plans = product.selling_plan_groups[0].selling_plans;
        this.discountType =
          product.selling_plan_groups[0].selling_plans[0].price_adjustments[0].value_type;
        this.discountValue =
          product.selling_plan_groups[0].selling_plans[0].price_adjustments[0].value;
        this.activeSellingPlanId =
          product.selling_plan_groups[0].selling_plans[0].id;
        this.$el.querySelector("label").innerHTML = this.createLabelText();
      } else {
        this.$el.style.display = "none";
      }
    } catch (e) {
      throw new Error(e.message);
    }
  },
  showSellingPlanDrawer({ id }) {
    this.$store["drawer"].show({
      id,
    });
  },
  async changeSellingPlan() {
    try {
      this.loading = true;
      await this.$store.cart.changeItem({
        line: this.line + 1,
        selling_plan: this.activeSellingPlanId,
      });
      this.loading = false;
      this.$store.drawer.hide();
    } catch (e) {
      this.loading = false;
      throw new Error(e.message);
    }
  },
  async removeSellingPlan() {
    try {
      await this.$store.cart.changeItem({
        line: this.line + 1,
        selling_plan: null,
      });
    } catch (e) {
      throw new Error(e.message);
    }
  },
  getDiscountPrice() {
    if (this.discountType === "percentage") {
      return window.currency(
        lineItem.price * ((100 - this.discountValue) / 100)
      );
    } else {
      return window.currency(lineItem.price - this.discountValue);
    }
  },
  createLabelText() {
    const moneySymbol = window.themeVariables.settings.moneyFormat[0];
    if (this.discountType === "percentage") {
      return `Subscribe and Save ${this.discountValue}%`;
    } else {
      return `Subscribe and Save ${this.discountValue}${moneySymbol}`;
    }
  },
  changeActiveSellingPlan({ id }) {
    this.activeSellingPlanId = id;
    document
      .querySelectorAll("[data-selling-plan-option]")
      .forEach((e) => e.classList.remove("!bg-sc-subtitle/30"));
    this.$el.classList.add("!bg-sc-subtitle/30");
  },
});
