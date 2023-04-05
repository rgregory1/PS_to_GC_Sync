// clasp test

// list of files for import
const TSVList = [
  ['schedule_middle_school.tsv', 'MS_enroll'],
  ['schedule_high_school.tsv', 'HS_enroll'],
]

  // ['sections_high_school.tsv', 'HS_sec']
    // ['sections_middle_school.tsv', 'MS_sec'],





function createLogFileForDay() {
  
  // get current date to tie all files together
  let curDate = getCurrentDate()

  // ------------------ create log file for rest of process --------------//
  // create name for spreadsheet
  let logFileName = curDate + '-logs'

  let newFile = DriveApp.getFileById('1wibrNiFDrEuiDS1D7_p813iZItmXUResT-nI2f4M5Co').makeCopy(logFileName,DailyLogsFolder)
  let logFileId = newFile.getId()
  console.log(logFileId)
  const logFile = SpreadsheetApp.openById(logFileId)

  // ------------------ find and import all new files -----------------//
 TSVList.forEach(report => {
   importCSVFromGoogleDrive(curDate + '-' + report[0],report[1],logFileId)
 })
 
  let psEnrollmentSheets = ['MS_enroll','HS_enroll']
  
  psEnrollmentSheets.forEach(sheet => {
    getListOfSections(sheet)
  })
  

}















