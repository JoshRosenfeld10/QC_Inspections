const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  port: process.env.PORT,
  pdfMonkeyToken: process.env.PDFMONKEY_ACCESS_TOKEN,
  googleAuth: {
    type: "authorized_user",
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  },
  appsScriptUrl: process.env.APPS_SCRIPT_URL,
};
