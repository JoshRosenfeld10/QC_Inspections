const googleSheetUI = require("../constants/googleSheetUI"),
  getDataURI = require("./getDataURI");

const formatInputData = async (rowData) => {
  let data = {
    questions: [],
  };

  const indices = googleSheetUI.indices;
  const totalQuestions = rowData[indices.totalQuestions];

  data["inspection_name"] = rowData[indices.inspectionName] || "";
  data["inspection_type"] = rowData[indices.inspectionType] || "";
  data["site"] = rowData[indices.site] || "";
  data["job_number"] = rowData[indices.jobNumber] || "";
  data["notes"] = rowData[indices.notes] || "";
  data["kit_part_number"] = rowData[indices.kitPartNumber] || "";
  data["serial_sequence_number"] = rowData[indices.serialSeqNumber] || "";
  data["total_score"] = rowData[indices.totalScorePercentage] || "";
  data["inspection_result"] =
    rowData[indices.inspectionResult].toLowerCase() || "";
  data["submitted_by"] = rowData[indices.submittedBy] || "";
  data["submission_date"] = rowData[indices.submissionDate] || "";
  data["gdrive_folder_id"] = rowData[indices.gDriveFolderId] || "";
  data["file_name"] = rowData[indices.fileName] || "";

  for (let i = 0; i < totalQuestions; i++) {
    let question = {};

    const imagePath = rowData[indices.question1 + 5 * i + 3] || "";

    question["question"] = rowData[indices.question1 + 5 * i] || "";
    question["answer"] = rowData[indices.question1 + 5 * i + 1] || "";
    question["score"] = rowData[indices.question1 + 5 * i + 2] || "";
    question["image"] = imagePath === "" ? "" : await getDataURI(imagePath);

    data.questions.push(question);
  }

  return data;
};

module.exports = formatInputData;
