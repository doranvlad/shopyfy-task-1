import { login, register, reset, resetPassword } from "@/alpine/utils/api";
import { checkRequiredInputs, setRequiredInputs } from "@/alpine/utils/global";

export const account = () => ({
  login_tab: "login",
  loginEmail: "",
  loginPassword: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  token: "",
  statusState: false,
  statusMessage: "[data-status-message]",
  statusContainer: "[data-status-paste]",
  loading: false,
  invalidElements: {},
  init() {
    this.setRequiredInputs();
  },
  setRequiredInputs,
  checkRequiredInputs,
  changeUrl(url) {
    window.history.replaceState({}, url, url);
  },
  clearStatus() {
    const statusContainer = this.$root.querySelector(this.statusContainer);
    if (statusContainer) {
      statusContainer.innerHTML = "";
    }
    this.statusState = true;
  },
  checkForStatus(response, return_to) {
    let dom = document.createElement("div");
    dom.innerHTML = response.data;
    const statusMessage = dom.querySelector(this.statusMessage);
    const statusContainer = this.$root.querySelector(this.statusContainer);

    this.loading = false;

    if (statusMessage) {
      if (statusContainer) {
        statusContainer.innerHTML = "";
        statusContainer.append(statusMessage);
      }

      this.statusState = true;
      return;
    }

    if (return_to) {
      window.location.href = return_to;
      return;
    }
    window.location.href = "/account";
  },
  async loginFormSubmit() {
    try {
      if (await this.checkRequiredInputs()) {
        return;
      }
      this.loading = true;

      let response = await login({
        email: this.loginEmail.trim(),
        password: this.loginPassword.trim(),
      });
      console.log("Form successfully submitted.");

      this.checkForStatus(response);
    } catch (e) {
      console.log(e);
    }
  },
  async registerFormSubmit() {
    try {
      if (await this.checkRequiredInputs()) {
        return;
      }
      this.loading = true;

      let response = await register({
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email.trim(),
        password: this.password.trim(),
      });
      console.log("Form successfully submitted.");

      this.checkForStatus(response);
    } catch (e) {
      console.log(e);
    }
  },
  async resetFormSubmit() {
    try {
      if (await this.checkRequiredInputs()) {
        return;
      }
      this.loading = true;

      let response = await reset({ email: this.loginEmail.trim() });
      console.log("Form successfully submitted.");

      this.checkForStatus(response);
    } catch (e) {
      console.log(e);
    }
  },
  async resetPassword() {
    try {
      if (await this.checkRequiredInputs()) {
        return;
      }
      this.loading = true;

      let response = await resetPassword({
        password: this.password.trim(),
        password_confirmation: this.passwordConfirmation.trim(),
        token: this.token.trim(),
      });
      console.log("Form successfully submitted.");

      this.checkForStatus(response, "/");
    } catch (e) {
      console.log(e);
    }
  },
});
