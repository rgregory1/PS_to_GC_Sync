const ss = SpreadsheetApp.getActiveSpreadsheet();
const PS_GC_Sync = DriveApp.getFolderById('1RIZmSGbRRmUXhDbRdBoYoPd1H62BIZve')
const DailyLogsFolder = DriveApp.getFolderById('17mRW-66hNiT1MdaMPa12wt6VXux_AeqC')
const LogTemplate = '1wibrNiFDrEuiDS1D7_p813iZItmXUResT-nI2f4M5Co'
const Settings = ss.getSheetByName('settings')
const ID2Alias = ss.getSheetByName('ID2Alias')

function onOpen(){
  let ui = SpreadsheetApp.getUi()
  ui.createMenu('Manual Buttons')
    .addItem('1 Start Log','createLogFileForDay')
    .addItem('2 List GC Course','listGCCourses')
    .addItem('3 Get GC Students','getGCStudentEnrollment')
    .addItem('4 Get Delta','getAddDropList')
    .addItem('5 Add Drop','addRemoveStudents')
    .addToUi()
}


function listGCCourses() {

  console.time('get google classroom courses')
  
   // get logFile setup
  let curDate = getCurrentDate()
  let logFileId = getLogFileId(curDate)
  let logFile = SpreadsheetApp.openById(logFileId)

  // var sh = ss.getSheetByName('LISTS');

  let gcCourses = logFile.getSheetByName('GC_Courses') || logFile.insertSheet('GC_Courses')

  let pageCount = 0
  let pageToken = null

  var optionalArgs = {
    pageSize: 200,
    // courseStates: ['ACTIVE','PROVISIONED'],
    courseStates: ['ACTIVE'],
    pageToken: pageToken
  };
  var courseList=[
    [
      'Name',
      'Id',
      'Section',
      'State',
      'Last Updated',
      'OwnerId',
    ]
  ]

  while(true){

    optionalArgs.pageToken = pageToken

    var response = Classroom.Courses.list(optionalArgs);
    // console.log(response)
    var courses = response.courses;

    // test if courses returns something, if not skip adding to list
    if (courses){

      console.log(courses.length)
      
      

      courses.forEach(course => {
        
        

        courseList.push(
          [
            course.name,
            course.id,
            course.section,
            course.courseState,
            course.updateTime,
            course.ownerId,
          ]
        )
      })
    }
    pageToken = response.nextPageToken

    if(!pageToken){
      break
    }

    pageCount += 1
    console.log(pageCount)
    // if(pageCount == 2){
    //   break
    // }

  } 

  // update for year
  courseList = courseList.filter( c => c[4] > '2022-05-01')
  // courseList = courseList.filter( c => c[4] > '2022-07-01')

  let idMatch = ID2Alias.getDataRange().getValues()

  courseList.forEach((line,i) => {

    let found = 0
    let thisAlias

    idMatch.forEach(idLine =>{
      if(line[1] == idLine[0] && idLine[2] == ''){
        found = 1
        thisAlias = idLine[1]
        
      } else if(line[1] == idLine[0] && idLine[2] !== ''){
        found = 2
      } 
    })

    if(found == 1){
      line.push(thisAlias)
    } else if(found == 2){
      line.push('Exclude')
    } else{
      line.push('')
    }
    
    
  })


  // add alias header
  courseList[0][6] = 'Alias'

  gcCourses.getRange(1, 1, courseList.length, courseList[0].length).setValues(courseList);
  // gcCourses.insertColumns(1)
  // gcCourses.getRange(1,1).setValue('Processed')

  
  console.timeEnd('get google classroom courses')
}




function getGCStudentEnrollment(){
  console.time('get student enrollments')

  // get logFile setup
  let curDate = getCurrentDate()
  let logFileId = getLogFileId(curDate)
  let logFile = SpreadsheetApp.openById(logFileId)


  let listData = logFile.getSheetByName('GC_Courses').getDataRange().getValues()
  
  listData = listData.filter( c => c[6] !== '' && c[6] !== 'Exclude')

  // console.log(listData)
 
  listData.forEach(student =>{
    let studentList = getAllStudents(student[6])
    console.log(studentList)
    student.push(studentList)
  })

  let gcEnrollment = logFile.insertSheet('GC_enroll_File')
  gcEnrollment.getRange(1,1,listData.length, listData[0].length).setValues(listData)

  console.timeEnd('get student enrollments')
}



function getAllStudents(classID){
  // classID = 'd:37181'
  console.log(classID) // uncommented for troubleshooting

  if(classID == 'Alias'){
    return ''
  }

  let pageToken = null
  let finalStudentList = []

  var optionalArgs = {
    pageToken: pageToken,
    pageSize: 50
  };

  do {
    let response = Classroom.Courses.Students.list(classID, optionalArgs)

    // console.log(response.students[0].courseId)
    // console.log(response.students[0].userId)    

    // console.log(rawStudents)
    // if(response){
    if(response.students){

      // console.log(response.nextPageToken)
      optionalArgs.pageToken = response.nextPageToken

      let students = response.students.map(function (student){
        return[
          // student.profile.emailAddress.toLowerCase()
          student.profile.emailAddress
        ]
      })

      students = students.flat()
      
      // remove undefined
      students = students.filter(s => s !== undefined)

      // remove staff emails by filtering those with 2 numbers at the front
      students = students.filter(s => parseInt(s.toString().substring(0, 2)))

      let lowerStudents = students.map(element => {
        return element.toLowerCase()
      })

      finalStudentList.push(...lowerStudents)
      
    }
    else {
      console.log('No Students')
      return ''
    }
  }while(optionalArgs.pageToken)

  finalStudentList.sort()
  finalStudentList = finalStudentList.toString()

  return finalStudentList
}




// function getStudents(classID){
//   // let classID = '320854311476'

//   if(classID == 'Alias'){
//     return ''
//   }

//   let rawStudents = Classroom.Courses.Students.list(classID).students

//   // console.log(rawStudents)
//   if(rawStudents){
//     let students = rawStudents.map(function (student){
//       return[
//         student.profile.emailAddress.toLowerCase()
//       ]
//     })

//     // remove staff emails by filtering those with 2 numbers at the front
//     students = students.filter(s => parseInt(s.toString().substring(0, 2)))

//     students = students.flat().toString()
//     // console.log('final students: ',students)
//     return students
//   }
//   else {
//     return 'No Students'
//   }
// }




