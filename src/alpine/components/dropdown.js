export const dropdown = (initialValue) => ({
  activeValue: initialValue,
  expanded: false,
  handleExpand() {
    this.expanded = !this.expanded;
  },
  handleChange(value) {
    this.activeValue = value;
    this.handleExpand();
  },
});
