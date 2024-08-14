const constants = require("../constants/constants"),
  pdfMonkey = require("../constants/pdfMonkey");

const generatePDF = async ({ body, rowNumber, scriptAppAuthToken }) => {
  try {
    await fetch("https://api.pdfmonkey.io/api/v1/documents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${constants.pdfMonkeyToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        document: {
          document_template_id: pdfMonkey.qc_inspection_report_template_id,
          status: "pending",
          payload: body,
          meta: {
            _filename: body["file_name"],
            gDriveFolderId: body["gdrive_folder_id"],
            rowNumber,
            userEmail: body["submitted_by"],
            scriptAppAuthToken,
          },
        },
      }),
    });

    console.log(`QC Inspection Report PDF generated successfully.`);
  } catch (error) {
    console.error(error);
  }
};

module.exports = generatePDF;
