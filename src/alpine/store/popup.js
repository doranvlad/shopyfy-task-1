export const popup = {
  isOpen: false,
  open({ image, title }) {
    this.image = image;
    this.title = title;
    this.isOpen = true;
  },
  close() {
    this.image = "";
    this.title = "";
    this.isOpen = false;
  },
  init() {
    console.log("Modal component initialized!");
  },
  image: "",
  title: "",
};
