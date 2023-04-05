function importCSVFromGoogleDrive(tsvName,sheetName,logFileId) {

  var file = DriveApp.getFilesByName(tsvName).next();
  var csvData = Utilities.parseCsv(file.getBlob().getDataAsString(),'\t');
  let logFile = SpreadsheetApp.openById(logFileId)
  logFile.insertSheet(sheetName)
  var sheet = logFile.getSheetByName(sheetName)
  sheet.getRange(1, 1, csvData.length, csvData[0].length).setValues(csvData);
}

