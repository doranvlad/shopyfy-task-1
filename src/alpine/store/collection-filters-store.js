import Alpine from "alpinejs";

export const collectionFiltersStore = {
  visible: false,

  hide() {
    this.visible = false;
    Alpine.store("stop-scroll").disable();
  },

  show() {
    this.visible = true;
    Alpine.store("stop-scroll").enable();
  },
};
