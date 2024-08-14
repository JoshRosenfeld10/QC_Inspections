const { google: client } = require("googleapis"),
  constants = require("../constants/constants"),
  { Readable } = require("stream");

const google = () => {
  const createDriveClient = () => {
    return client.drive({
      version: "v3",
      auth: client.auth.fromJSON(constants.googleAuth),
    });
  };

  const createSheetsClient = () => {
    return client.sheets({
      version: "v4",
      auth: client.auth.fromJSON(constants.googleAuth),
    });
  };

  return {
    createDriveClient: async () => {
      return createDriveClient();
    },

    createSheetsClient: async () => {
      return createSheetsClient();
    },

    // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get
    getSheet: async ({ spreadsheetId }) => {
      return await createSheetsClient().spreadsheets.get({
        spreadsheetId,
      });
    },

    // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get
    getSheetRange: async ({ spreadsheetId, range }) => {
      return await createSheetsClient().spreadsheets.values.get({
        spreadsheetId,
        range,
      });
    },

    // https://developers.google.com/drive/api/reference/rest/v3/files/create
    createFile: async ({ driveId, fileName, fileBuffer }) => {
      return await createDriveClient().files.create({
        requestBody: {
          name: fileName,
          // driveId: "0AAXE2qCY0-BEUk9PVA",
          parents: [driveId],
        },
        media: {
          body: Readable.from(fileBuffer),
          mimeType: "application/pdf",
        },
        fields: "id",
        supportsAllDrives: true,
      });
    },

    // https://developers.google.com/drive/api/reference/rest/v3/files/get
    getFile: async ({ fileId }) => {
      return await createDriveClient().files.get({
        fileId,
        supportsAllDrives: true,
        fields: "*",
        includePermissionsForView: "published",
      });
    },

    // https://developers.google.com/drive/api/reference/rest/v3/permissions/list
    getFilePermissions: async ({ fileId }) => {
      return await createDriveClient().permissions.list({
        fileId,
        supportsAllDrives: true,
        includePermissionsForView: "published",
        fields: "*",
      });
    },

    // https://developers.google.com/drive/api/reference/rest/v3/permissions/create
    insertVisibleToAnyonePermission: async ({ fileId }) => {
      return await createDriveClient().permissions.create({
        fileId,
        requestBody: {
          type: "anyone",
          role: "reader",
        },
        supportsAllDrives: true,
      });
    },

    // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update
    updateRange: async ({ spreadsheetId, range, values }) => {
      return await createSheetsClient().spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          range,
          majorDimension: "ROWS",
          values, // 2D array; each inner array represents a major dimension (row)
        },
      });
    },

    /**
     * data: [
     *    {
     *      range: ...,
     *      majorDimension: "ROWS",
     *      values: [
     *        {
     *          ...
     *        },
     *      ]
     *    },
     * ]
     */
    batchUpdate: async ({ spreadsheetId, data }) => {
      return await createSheetsClient().spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: "USER_ENTERED",
          data, // array of ValueRanges
        },
      });
    },
  };
};

module.exports = google();
