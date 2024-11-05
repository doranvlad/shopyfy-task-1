import Alpine from "alpinejs";

export const popup = {
  visible: false,
  activePopup: "",
  //used for multiple popups
  id: "",
  //popup key required
  show({ popup, id = "" } = {}) {
    this.visible = true;
    this.activePopup = popup;
    this.id = id;
    Alpine.store("stop-scroll").enable();
  },
  hide() {
    this.visible = false;
    this.activePopup = "";
    this.id = "";
    Alpine.store("stop-scroll").disable();
  },
};
