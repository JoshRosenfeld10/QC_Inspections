const express = require("express"),
  axios = require("axios"),
  { buffer } = require("node:stream/consumers"),
  google = require("../modules/google"),
  googleSheetUI = require("../constants/googleSheetUI"),
  router = express.Router();

router.use(express.json());

/**
   * Sample Request Body
   * {
    "document": {
        "id": "fc20792c-8cfc-40da-9e58-2fa2cb95b31a",
        "created_at": "2024-07-30T18:30:19.581+02:00",
        "document_template_id": "604c5114-c884-4078-94ab-e8c72f4256af",
        "meta": "{\"_filename\":\"ULGE217 - ULGE217 Graphic Approval -  - 7/30/2024\",\"gDriveFolderId\":\"1llU0p3NPLRSjMsfjCzWR7pZzpq-BjP9F\"}",
        "payload": null,
        "status": "success",
        "updated_at": "2024-07-30T18:30:24.663+02:00",
        "xml_data": null,
        "app_id": "38f04de5-4f6f-4bf6-afe4-5df564a04729",
        "download_url": "https://pdfmonkey-store.s3.eu-west-3.amazonaws.com/production/backend/document/fc20792c-8cfc-40da-9e58-2fa2cb95b31a/ULGE217%20-%20ULGE217%20Graphic%20Approval%20-%20-%207-30-2024.pdf?response-content-disposition=attachment&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA2DEHCSJKRKT25747%2F20240730%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Date=20240730T163038Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=383b20969ba8d667fbbbc6bb4ac4323c9bcc15573b38a97f4dd46c62fd08737c",
        "checksum": "SzSr66TnhiUnxUuDVyNmwbjB4gbxNysw",
        "failure_cause": null,
        "filename": "ULGE217 - ULGE217 Graphic Approval - - 7-30-2024.pdf",
        "preview_url": "https://preview.pdfmonkey.io/pdf/web/viewer.html?file=https%3A%2F%2Fpreview.pdfmonkey.io%2Fdocument-render%2Ffc20792c-8cfc-40da-9e58-2fa2cb95b31a%2FSzSr66TnhiUnxUuDVyNmwbjB4gbxNysw",
        "public_share_link": null
    }
}
   */
router.post("/", async (req, res) => {
  try {
    const { download_url: downloadUrl, filename } = req.body.document;
    let { gDriveFolderId, rowNumber } = JSON.parse(req.body.document.meta);

    // Download stream of PDF
    await axios({
      url: downloadUrl,
      method: "GET",
      responseType: "stream",
    }).then(async (response) => {
      const fileBuffer = await buffer(response.data);

      const data = await google.createFile({
        driveId: gDriveFolderId,
        fileName: filename,
        fileBuffer,
      });

      console.log(
        `${filename} uploaded to Google Drive (Folder ID: ${gDriveFolderId})`
      );

      const { id: fileId } = data.data;

      await google.batchUpdate({
        spreadsheetId: googleSheetUI.id,
        data: [
          // Set PDF Generated to true
          {
            range: `Inspections!B${rowNumber}:B${rowNumber}`,
            majorDimension: "ROWS",
            values: [[true]],
          },
          // Insert PDF sharing link
          {
            range: `Inspections!E${rowNumber}:E${rowNumber}`,
            majorDimension: "ROWS",
            values: [[`https://drive.google.com/file/d/${fileId}/view`]],
          },
        ],
      });

      console.log(`Status changed to PDF Generated on row ${rowNumber}`);
    });

    // // Set status to "PDF Created"
    // await google.updateRange({
    //   spreadsheetId: googleSheetUI.id,
    //   range: `Inspections!B${rowNumber}:B${rowNumber}`,
    //   values: [[true]],
    // });

    // console.log(`Status changed to PDF Generated on row ${rowNumber}`);

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
