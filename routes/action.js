const express = require("express"),
  router = express.Router(),
  googleSheetUI = require("../constants/googleSheetUI"),
  formatInputData = require("../utils/formatInputData"),
  generatePDF = require("../utils/generatePDF"),
  google = require("../modules/google");

router.use(express.json());

router.post("/", async (req, res) => {
  try {
    const { row: rowNumber, authToken: scriptAppAuthToken } = req.body;

    const { data } = await google.getSheetRange({
      spreadsheetId: googleSheetUI.id,
      range: `Inspections!${rowNumber}:${rowNumber}`,
    });
    const rowData = data.values[0];

    const formattedData = await formatInputData(rowData);

    await generatePDF({
      body: formattedData,
      rowNumber,
      scriptAppAuthToken,
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
