import axios from "axios";

const HEADERS = {
  Accept: "*/*",
  "Content-Type": "application/json;",
  "X-Requested-With": "XMLHttpRequest",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  Expires: "0",
};

export default {
  async get(url, config = {}) {
    try {
      const response = await axios.get(url, config);
      return response.data;
    } catch (e) {
      console.log(e);
    }
  },
  async post(url, payload) {
    try {
      const response = await axios.post(url, payload);
      return response.data;
    } catch (e) {
      console.log(e);
    }
  },
};

export function getCart() {
  return axios
    .get("/cart.js", {
      headers: HEADERS,
    })
    .then((res) => res.data);
}

export function updateCart(updates = {}) {
  return axios
    .post("/cart/update.js", updates, {
      headers: HEADERS,
    })
    .then((response) => response.data);
}

export function addItems(items = []) {
  return axios.post(
    "/cart/add.js",
    {
      items: items.map((i) => ({
        ...i,
        properties: { ...i.properties, _defaultProperty: true },
      })),
    },
    {
      headers: HEADERS,
    }
  );
}

export function addItem(item) {
  return addItems([
    { ...item, properties: { ...item.properties, _defaultProperty: true } },
  ]).then((response) => response.data);
}

export function changeItem(newItem) {
  return axios
    .post("/cart/change.js", newItem, {
      headers: HEADERS,
    })
    .then((res) => res.data);
}

export function changeQuantity(key, quantity) {
  return changeItem({
    id: key,
    quantity,
  });
}

export function removeItem(key) {
  return changeQuantity(key, 0);
}

export function getVariant(id) {
  return axios.get(`/variants/${id}.js`).then((res) => res.data);
}

export function getProduct(handle) {
  return axios.get(`/products/${handle}.js`).then((res) => res.data);
}

/* TRANSFORM DATA START */
function transformformData(data) {
  let form_data = new FormData();

  for (let key in data) {
    form_data.append(key, data[key]);
  }

  return form_data;
}
/* TRANSFORM DATA END */

export function reset({ email }) {
  const data = {
    email: email,
    form_type: "recover_customer_password",
    utf8: "✓",
  };

  return axios.post("/account/recover", transformformData(data));
}

export function login({ email, password }) {
  const data = {
    "customer[email]": email,
    "customer[password]": password,
    form_type: "customer_login",
    utf8: "✓",
  };

  return axios.post("/account/login", transformformData(data));
}

export function register({ first_name, last_name, email, password }) {
  const data = {
    "customer[first_name]": first_name,
    "customer[last_name]": last_name,
    "customer[email]": email,
    "customer[password]": password,
    form_type: "create_customer",
    utf8: "✓",
  };

  return axios.post("/account", transformformData(data));
}

export function resetPassword({ password, password_confirmation, token }) {
  const data = {
    "customer[password]": password,
    "customer[password_confirmation]": password_confirmation,
    token: token,
    form_type: "reset_customer_password",
    utf8: "✓",
  };

  return axios.post("/account/reset", transformformData(data));
}
