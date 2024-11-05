export const quickOrder = {
  visible: false,
  id: "",
  initiator: "cart",
  hide() {
    this.visible = false;
    setTimeout(() => {
      this.id = "";
      document.getElementById("quick-order-overlay").innerHTML = "";
    }, 300);
  },
  show({ id, initiator = "cart" } = {}) {
    this.initiator = initiator;
    this.visible = true;
    this.id = id;
  },
};
