function getUserDataWithId(userId) {
  // var userId = '109859049233455654657';
  var user = AdminDirectory.Users.get(userId);
  // Logger.log('User data:\n %s', JSON.stringify(user, null, 2));
  // console.log(user.id)
  // console.log(user.primaryEmail)
  return [user.primaryEmail,user.orgUnitPath]
}

function getAllEmailsFromId(){
  let matches =[]
  let lists = ss.getSheetByName('listOfIds').getDataRange().getValues().flat()
  console.log(lists)

  lists.forEach(line => {
    let info = getUserDataWithId(line)
    matches.push([line,info[0].toLowerCase(),info[1].toLowerCase()])
  })

  ss.getSheetByName('listOfIds').getRange(1,1,matches.length, 3).setValues(matches)
}

/**
 * return id of log file with todays data
 * @param {string} curDate  current date from getCurrentDate function
 * @return {string}         id of logfile for today
 */
function getLogFileId(curDate){

  let fileFinder = DriveApp.getFilesByName(curDate + '-logs')

  while(fileFinder.hasNext()){
    let logFileDriveApp = fileFinder.next()
    Logger.log(logFileDriveApp.getId())
    return logFileDriveApp.getId()
  }

}

/**
 * get current date as strong for matching files together
 * @return {string}     current date as string
 */
function getCurrentDate(){
  
  var curDate = Utilities.formatDate(new Date(), "EST","YYYY-MM-dd")

  console.log(curDate)

  return curDate
}

/**
 *  console logs a block of highlighted cells
 */
function getHighlightedData(){
  let data = ss.getActiveSheet().getActiveRange().getValues()

  console.log(data)
}

/**
 * styles delta sheet for easy reading
 */
function styleDeltaSheet(sheet) {
  sheet.setFrozenRows(1)
  
  let lastRow = sheet.getLastRow()
  let lastCol = sheet.getLastColumn()

  let data = sheet.getRange(2,1,lastRow-1, lastCol)

  data.sort(2)

  data.sort(3)

  data.sort(4)
}






function createTestClass() {
  let crs = Classroom.newCourse();
  crs.name = "Another Class"
  crs.ownerId = "russell.gregory@mvsdschools.org"

  Classroom.Courses.create(crs)

}



function courseUpdate() {
  var courseId = '63220293038';
  var course = Classroom.Courses.get(courseId);
  course.section = 'Period 3';
  course.room = '302';
  var course = Classroom.Courses.update(course, courseId);
  Logger.log('Course "%s" updated.', course.name);
}

function filterTest(){
  let trialList = [
    '23smithj@school.org',
    '23johnsonj@school.org',
    '23olearyj@school.org',
    'john.jones@school.org',
    '23calahanj@school.org',
    ]


  trialList = trialList.filter(s => parseInt(s.substring(0, 2)))

  console.log(trialList)
}


function getSheetLink(){
  let ssUrl = ss.getUrl()
  let settingsID = ss.getSheetByName('settings').getSheetId()

  console.log(ssUrl)
  console.log(settingsID)

  // https://docs.google.com/spreadsheets/d/13Umdl7CFYRRlC3UvEC4tDjDYx-heWkD4sd4JiyC1yX0/edit

  // 484755947

  // https://docs.google.com/spreadsheets/d/13Umdl7CFYRRlC3UvEC4tDjDYx-heWkD4sd4JiyC1yX0/edit#gid=484755947
}

const removeExcludedStudents = () => {

  // get logFile setup
  let curDate = getCurrentDate()
  // let curDate = '2021-10-07'
  let logFileId = getLogFileId(curDate)
  let logFile = SpreadsheetApp.openById(logFileId)

  const studentSheet = ss.getSheetByName('students').getDataRange().getValues()
  studentSheet.shift()

  let excludedStudents = []

  studentSheet.forEach( line => {
    if (line[1] == 'x'){
      excludedStudents.push(line[0])
    }
  })

  console.log('Excluded Students: ',excludedStudents)

  let deltaList = logFile.getSheetByName('Delta').getDataRange().getValues()

  deltaList.forEach( (line,lineNumber) => {

    // if there are students to be added
    if (line[2] !== ''){

      // turn string into array
      let addList = line[2].split(',')
      
      excludedStudents.forEach( exclude => {
        addList = addList.filter(item => item !== exclude)
      })

      deltaList[lineNumber][2] = addList.join(",")
    }
  })

  console.log(deltaList) 

  let delta = logFile.getSheetByName('Delta')

  delta.getRange(1,1, deltaList.length, deltaList[0].length).setValues(deltaList)
}

function createTeacherForCourse(){
  
  // let courseId = 'd:this_is_my_alias'
  let teacher = {
      userId: 'russell.gregory@mvsdschools.org'
  }

  try { 
    let newStudent = Classroom.Courses.Teachers.create(teacher,'d:37070' );
    // let newStudent = Classroom.Courses.Students.Delete(student, courseId);
    Logger.log(`${teacher.userId} successfully added as a teacher!`)
  } catch (err) {
    Logger.log(`Request to add teacher ${teacher.userId} failed.`)
    Logger.log(err)
  }
}



function fixClass(){

  

  let addList = [
          ]

    // console.log(string.split(','))

  addList.forEach(student => {
    enrollAStudent('d:37442',student)
  })

  // droplist.forEach(student => {
  //   dropAStudent('d:37442',student)
  // })
}


function seeClassEnrollment(){
  console.log(getAllStudents('d:37442'))
}


// /**
//  * dummy function to help my menu open
//  */
// function dummyToGetPermission(){
//   let someThing = DriveApp.getFolderById('1RIZmSGbRRmUXhDbRdBoYoPd1H62BIZve')
//   let dummySS = SpreadsheetApp.getActiveSpreadsheet()
// }






