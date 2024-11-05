import Alpine from "alpinejs";

export const mobileMenu = {
  visible: false,
  activeSubMenu: "",
  hide() {
    this.visible = false;
    this.activeSubMenu = "";
    Alpine.store("stop-scroll").disable();
  },
  show() {
    this.visible = true;
    this.activeSubMenu = "";
    Alpine.store("stop-scroll").enable();
  },
  changeActiveSubMenu(subMenu) {
    this.activeSubMenu = subMenu;
  },
  goBack() {
    this.activeSubMenu = "";
  },
};
