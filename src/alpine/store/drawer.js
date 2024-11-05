import Alpine from "alpinejs";

export const drawer = {
  visible: false,
  id: "",
  title: "",
  hide() {
    this.visible = false;
    Alpine.store("stop-scroll").disable();
    setTimeout(() => {
      this.id = "";
    }, 300);
  },
  show({ id = "id" } = {}) {
    this.visible = true;
    this.id = id;
    Alpine.store("stop-scroll").enable();
  },
};
