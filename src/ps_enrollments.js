// const psSheet = ss.getSheetByName('PS_enrollments')


/**
 * gather list of all courses and students
 */
function getListOfSections(thisSheet) {

  // get logFile setup
  let curDate = getCurrentDate()
  let logFileId = getLogFileId(curDate)
  let logFile = SpreadsheetApp.openById(logFileId)
  // get all section data
  let data = logFile.getSheetByName(thisSheet).getDataRange().getValues()

  // // get all section data
  // let data = psSheet.getDataRange().getValues()

  // remove classes that don't save grades
  data = data.filter(line => line[14] == 0 && line[15] == 0)

  // gather just the section number
  let allCourses = data.map(line => {
    return line[9]
  })

  console.log('allCourses length: ', allCourses.length)
  // console.log(allCourses)

  // create set leaving only one instance of each
  let uniqueCourse = [...new Set(allCourses)]

  console.log('unique courses length: ', uniqueCourse.length)
  // console.log(uniqueCourse)

  // create objects with course number and current students

  let currenEnrollmentData = []

  uniqueCourse.forEach(course => {

    
    let selectStudents = data.filter(function (student){
      return student[9] == course
    })

   let info = {
      course: course, 
    }

    
  
   let emails = []
   
   selectStudents.forEach(studentInfo => {
     emails.push(studentInfo[11].toLowerCase())
     })

    info.students = emails

    //  console.log(info)
    currenEnrollmentData.push([info.course,info.students.join()])

  })

  console.log(currenEnrollmentData.length)
  console.log(currenEnrollmentData)

  let msEnrollObjSheet = logFile.getSheetByName('PS_enroll_File') || logFile.insertSheet('PS_enroll_File')

  let lastRow = msEnrollObjSheet.getLastRow()


  msEnrollObjSheet.getRange(lastRow+1,1,currenEnrollmentData.length,currenEnrollmentData[0].length).setValues(currenEnrollmentData)
  
}
























