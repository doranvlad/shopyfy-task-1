import { setRequiredInputs } from "@/alpine/utils/global";

export const nativeForm = () => ({
  password: "",
  invalidElements: {},
  init() {
    this.setRequiredInputs();

    this.$el.addEventListener("submit", (e) => {
      this.submit(e);
    });
  },
  setRequiredInputs,
  submit(e) {
    const inputs = [...this.$el.querySelectorAll("[data-rules]")];
    inputs.forEach((input) => {
      if (
        window.Iodine.assert(input.value, JSON.parse(input.dataset.rules))
          .valid !== true
      ) {
        this.invalidElements[input.id] = true;
        e.preventDefault();
      }
    });
  },
});
