const constants = require("../constants/constants");

const sendEmailRequest = async ({ email, fileLink, scriptAppAuthToken }) => {
  const options = {
    method: "GET",
    muteHttpExceptions: true,
    headers: {
      Authorization: `Bearer ${scriptAppAuthToken}`,
    },
  };

  await fetch(
    `${constants.appsScriptUrl}?emailType=auditor_email&userEmail=${email}&fileLink=${fileLink}`,
    options
  );
};

module.exports = sendEmailRequest;
