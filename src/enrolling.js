function enrollAStudent(courseId,userID,report){

  let result = 'E'
  // let courseId = 'd:this_is_my_alias'
  let student = {
      userId: userID
  }

  try { 
    let newStudent = Classroom.Courses.Students.create(student, courseId);
    Logger.log(`${student.userId} successfully added as a student!`)
    result = 'A'
  } catch (err) {
    Logger.log(`Request to add student ${student.userId} failed.`)
    Logger.log(err)
    // Logger.log(typeof err)

    // add error to error report
    report += `Request to add student ${student.userId} failed.\n`
    let errorString = err
    report += errorString.toString() + '\n'

  }
  
  return result
}

function dropAStudent(courseId,userID,report){

  let result = 'E'
  
  // let courseId = 'd:37036'
  // let userID = '27lathropd@mvsdschools.org'

  try { 
    let newStudent = Classroom.Courses.Students.remove(courseId, userID)
    // let newStudent = Classroom.Courses.Students.Delete(student, courseId);
    Logger.log(`${userID} successfully removed as a student!`)
    result = 'D'
  } catch (err) {
    Logger.log(`Request to remove student ${userID} failed.`)
    Logger.log(err)

    // // add error to error report
    // report += 'Request to remove student ' + userId + 'failed.\n'
    // let errorString = err
    // report += errorString + '\n'
  }

  return result
}






//https://developers.google.com/classroom/reference/rest/v1/courses.students/delete#http-request