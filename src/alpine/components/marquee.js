export const marquee = () => ({
  marqueeInner: null,
  marqueeEls: null,
  marqueeSpeed: null,
  marqueeWidth: 0.0,
  marqueeHeight: 0.0,
  init() {
    /*
      add data attribute 'data-marquee-inner' to parent node of x-data="marquee"
      add data attribute 'data-marquee-el' to each element of marquee
      don't forget about overflow-hidden in section and make sure your marquee is ABSOLUTE and have left-0
    */
    setTimeout(() => {
      this.marqueeLogic();
    }, 100);
  },
  marqueeLogic() {
    this.marqueeInner = this.$el.closest("[data-marquee-inner]");
    this.marqueeEls = this.$el.querySelectorAll("[data-marquee-el]");
    this.marqueeSpeed = this.$el.getAttribute("data-marquee-speed");
    const centerOnFit = this.$el.hasAttribute("data-center-fit");
    this.marqueeWidth = 0.0;
    this.marqueeHeight = 0.0;

    this.marqueeEls.forEach((el) => {
      let elWidth = el.getBoundingClientRect().width;
      let elHeight = el.getBoundingClientRect().height;

      elWidth += parseInt(
        window.getComputedStyle(el).getPropertyValue("margin-left")
      );
      elWidth += parseInt(
        window.getComputedStyle(el).getPropertyValue("margin-right")
      );

      elHeight += parseInt(
        window.getComputedStyle(el).getPropertyValue("margin-top")
      );
      elHeight += parseInt(
        window.getComputedStyle(el).getPropertyValue("margin-bottom")
      );

      this.marqueeWidth += elWidth;
      if (elHeight > this.marqueeHeight) {
        this.marqueeHeight = elHeight;
      }
    });

    /* remove duplicates */
    this.$el
      .querySelectorAll("[data-clone-marquee-el]")
      .forEach((clone) => clone.remove());

    if (!this.marqueeWidth) {
      return;
    }

    let screenWidth =
      this.marqueeInner.getBoundingClientRect().width -
      parseFloat(window.getComputedStyle(this.marqueeInner).paddingLeft) -
      parseFloat(window.getComputedStyle(this.marqueeInner).paddingRight);

    let duplicateTimes = Math.ceil(screenWidth / this.marqueeWidth);

    this.$el.style.width = `${this.marqueeWidth}px`;
    this.marqueeInner.style.height = `${this.marqueeHeight}px`;

    /* disable duplicate */
    if (this.marqueeWidth < screenWidth && centerOnFit) {
      this.marqueeInner.classList.add("justify-center");
      this.$el.classList.remove("marquee", "absolute");
      this.$el.classList.add("static", "w-full", "justify-evenly");
      return;
    }

    this.$el.style.setProperty("--marquee-speed", this.marqueeSpeed);
    this.$el.classList.add("marquee", "absolute");
    this.$el.classList.remove("static", "w-full", "justify-between");
    this.marqueeInner.classList.remove("justify-center");

    this.calculateDuplicates(this.marqueeEls, duplicateTimes);
  },
  calculateDuplicates(elements, duplicateTimes) {
    for (let i = 0; i < duplicateTimes; i++) {
      elements.forEach((el) => {
        let clone = el.cloneNode(true);
        clone.removeAttribute("data-marquee-el");
        clone.setAttribute("data-clone-marquee-el", true);
        this.$el.appendChild(clone);
      });
    }
  },
});
