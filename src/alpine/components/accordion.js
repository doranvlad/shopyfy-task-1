export const accordion = (initState = false) => ({
  isOpen: initState,
  toggle() {
    this.isOpen = !this.isOpen;
  },
});
