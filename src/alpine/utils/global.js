import api from "@/alpine/utils/api";

export function selectOption({ name }, optionValue) {
  const selectedValue = optionValue;

  const selectedOption = this.productOptions.find(
    (option) => option.name === name
  );
  const allOptionValuesWithoutSelected = selectedOption.values.filter(
    (value) => value !== selectedValue
  );

  const targetOptions = [
    selectedValue,
    ...this.selectedVariant.options.filter(
      (value) => !allOptionValuesWithoutSelected.includes(value)
    ),
  ];

  this.product.variants.some((variant) => {
    if (variant.options.every((option) => targetOptions.includes(option))) {
      this.selectedVariant = variant;
      this.selectedVariant[
        "link"
      ] = `/products/${this.product.handle}?variant=${this.selectedVariant.id}`;
      return true;
    }
  });
}

export async function checkRequiredInputs() {
  const inputs = [...this.$el.querySelectorAll("[data-rules]")];
  let hasInvalidInput = false;
  inputs.forEach((input) => {
    if (
      window.Iodine.assert(input.value, JSON.parse(input.dataset.rules))
        .valid !== true
    ) {
      this.invalidElements[input.id] = true;
      hasInvalidInput = true;
    }
  });
  if (hasInvalidInput) {
    return true;
  }
}

export function setRequiredInputs() {
  const inputs = [...this.$el.querySelectorAll("[data-rules]")];
  inputs.map((input) => {
    this.invalidElements[input.id] = false;
  });

  window.Iodine.rule("matchingPassword", (value) => value === this.password);
  window.Iodine.setErrorMessage(
    "matchingPassword",
    "Password confirmation needs to match password"
  );
}

// Price range for clp
const PriceRange = class extends HTMLElement {
  connectedCallback() {
    this._abortController = new AbortController();
    this.rangeLowerBound = this.querySelector(
      'input[type="range"]:first-child'
    );
    this.rangeHigherBound = this.querySelector(
      'input[type="range"]:last-child'
    );
    this.textInputLowerBound = this.querySelector(
      'input[name="filter.v.price.gte"]'
    );
    this.textInputHigherBound = this.querySelector(
      'input[name="filter.v.price.lte"]'
    );
    this.textInputLowerBound.addEventListener(
      "focus",
      () => this.textInputLowerBound.select(),
      { signal: this._abortController.signal }
    );
    this.textInputHigherBound.addEventListener(
      "focus",
      () => this.textInputHigherBound.select(),
      { signal: this._abortController.signal }
    );
    this.textInputLowerBound.addEventListener(
      "change",
      (event) => {
        event.preventDefault();
        event.target.value = Math.max(
          Math.min(
            parseInt(event.target.value),
            parseInt(this.textInputHigherBound.value || event.target.max) - 1
          ),
          event.target.min
        );
        this.rangeLowerBound.value = event.target.value;
        this.rangeLowerBound.parentElement.style.setProperty(
          "--range-min",
          `${
            (parseInt(this.rangeLowerBound.value) /
              parseInt(this.rangeLowerBound.max)) *
            100
          }%`
        );
      },
      { signal: this._abortController.signal }
    );
    this.textInputHigherBound.addEventListener(
      "change",
      (event) => {
        event.preventDefault();
        event.target.value = Math.min(
          Math.max(
            parseInt(event.target.value),
            parseInt(this.textInputLowerBound.value || event.target.min) + 1
          ),
          event.target.max
        );
        this.rangeHigherBound.value = event.target.value;
        this.rangeHigherBound.parentElement.style.setProperty(
          "--range-max",
          `${
            (parseInt(this.rangeHigherBound.value) /
              parseInt(this.rangeHigherBound.max)) *
            100
          }%`
        );
      },
      { signal: this._abortController.signal }
    );
    this.rangeLowerBound.addEventListener(
      "change",
      (event) => {
        event.stopPropagation();
        this.textInputLowerBound.value = event.target.value;
        this.textInputLowerBound.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      },
      { signal: this._abortController.signal }
    );
    this.rangeHigherBound.addEventListener(
      "change",
      (event) => {
        event.stopPropagation();
        this.textInputHigherBound.value = event.target.value;
        this.textInputHigherBound.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      },
      { signal: this._abortController.signal }
    );
    this.rangeLowerBound.addEventListener(
      "input",
      (event) => {
        event.target.value = Math.min(
          parseInt(event.target.value),
          parseInt(this.textInputHigherBound.value || event.target.max) - 1
        );
        event.target.parentElement.style.setProperty(
          "--range-min",
          `${
            (parseInt(event.target.value) / parseInt(event.target.max)) * 100
          }%`
        );
        this.textInputLowerBound.value = event.target.value;
      },
      { signal: this._abortController.signal }
    );
    this.rangeHigherBound.addEventListener(
      "input",
      (event) => {
        event.target.value = Math.max(
          parseInt(event.target.value),
          parseInt(this.textInputLowerBound.value || event.target.min) + 1
        );
        event.target.parentElement.style.setProperty(
          "--range-max",
          `${
            (parseInt(event.target.value) / parseInt(event.target.max)) * 100
          }%`
        );
        this.textInputHigherBound.value = event.target.value;
      },
      { signal: this._abortController.signal }
    );
  }
  disconnectedCallback() {
    this._abortController.abort();
  }
};
if (!window.customElements.get("price-range")) {
  window.customElements.define("price-range", PriceRange);
}

export function calcThumbWrapperWidth({
  maxWidth,
  slidesPerView,
  spaceBetween,
  currentImageCount,
}) {
  if (currentImageCount >= slidesPerView) {
    return maxWidth * slidesPerView + spaceBetween * (slidesPerView - 1);
  }
  return maxWidth * currentImageCount + spaceBetween * (currentImageCount - 1);
}

/* FACETS */

export function serializeForm(form) {
  let params = "";
  const elements = form.querySelectorAll("input");
  for (let i = 0; i < elements.length; ++i) {
    const element = elements[i];
    const name = element.name;
    const value = element.value;
    if (
      (value &&
        element.checked &&
        (name.includes("filter") || name.includes("sort_by"))) ||
      (value && name.includes("filter.v.price"))
    ) {
      params += `&${name}=${value}`;
    }
  }
  return params.substring(1);
}

export function setParams(form) {
  this.facets_params = this.serializeForm(form);
}

export function getHasNextPage(node, counter = 1) {
  this.nextPageCount = counter;
  this.hasNextPage = !!node.querySelector("[data-next-page]");
}

export function addNextPageItems(items) {
  const collectionItemsGrid = document.getElementById("coll-grid");
  items.forEach((item) => {
    collectionItemsGrid.append(item);
  });
}

export function getNewItems(response) {
  return response.querySelectorAll("#coll-grid article");
}

export async function loadMore(_this, newURL) {
  _this.isLoading = true;

  try {
    const response = await api.get(newURL, { responseType: "document" });

    const newItems = _this.getNewItems(response);
    if (newItems && newItems.length) {
      _this.addNextPageItems(newItems);
      _this.isLoading = false;
    }

    _this.getHasNextPage(response, _this.nextPageCount);

    _this.isLoading = false;
  } catch (e) {
    console.log(e);
    _this.isLoading = false;
  }
}

/* FACETS */

export function scrollToAnchor(node) {
  const anchorBlock = node;

  if (anchorBlock) {
    const elementPosition = anchorBlock.getBoundingClientRect().top;
    const offsetPosition =
      elementPosition +
      window.pageYOffset -
      parseFloat(
        document.documentElement.style.getPropertyValue("--header-height") || 0
      );

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}
