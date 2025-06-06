const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode:  "sandbox",
  client_id: "AQT5Fu2WUZJAcFMekSLTFUfgSVhinGIk62Wpkbruv6Odr5jSQ22VzucfGxZbcXdzifM4ayCJ3-2NUnWC",
  client_secret: "ELrLjZpGjMEKxwqsRmljkxD2oWXZ1_eBSpUUjxc8pSmVdL1qA-Zon0H_I8UzuPbtJZEgeV5LvzUfzeyN",
});

module.exports = paypal;