export const popup = () => ({
  isOpen: false,
  open() {
    this.isOpen = true;
  },
  close() {
    this.isOpen = false;
  },
  init() {
    console.log("Modal component initialized!");
  },
});
