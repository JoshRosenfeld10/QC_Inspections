const imgToBase64 = require("image-to-base64");

const getDataURI = async (imagePath) => {
  const URL = `https://www.appsheet.com/template/gettablefileurl?appName=QCInspectionsPort-714141104&tableName=Inspections&fileName=${imagePath}`;

  try {
    const res = await imgToBase64(URL);
    return "data:image/png;base64," + res;
  } catch (error) {
    console.error(error);
    return "";
  }
};

module.exports = getDataURI;
