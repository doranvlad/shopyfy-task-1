import { checkRequiredInputs } from "@/alpine/utils/global";

export const klaviyoForm = (list_id) => ({
  submit: false,
  invalidElements: {},
  listId: list_id,
  init() {
    const inputs = [...this.$el.querySelectorAll("[data-rules]")];
    inputs.map((input) => {
      this.invalidElements[input.id] = false;
    });
  },
  checkRequiredInputs,
  async sendKlaviyo(listId) {
    try {
      if (await this.checkRequiredInputs()) {
        return;
      }

      const url = `https://manage.kmail-lists.com/ajax/subscriptions/subscribe`;
      const profiles = new URLSearchParams();

      profiles.append(
        "email",
        this.$root.querySelector('[name="email"]').value
      );
      profiles.append("$fields", "$source");
      profiles.append("g", listId);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache",
        },
        body: profiles,
      });

      this.submit = true;

      return await res.json();
    } catch (e) {
      console.log(e);
    }
  },
});
