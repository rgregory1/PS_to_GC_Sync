




function filterCheck(){

  let listFake = ['d:1234', 'd:1234', '','','d:1234','Exclude','','d:1234','d:1234']

  listFake = listFake.filter(c => c !== '' && c !== 'Exclude')

  Logger.log(listFake)

}



function checkAlias(){

  let courseId = '381200229942'
  let alias = Classroom.Courses.Aliases.list(courseId)

  console.log(alias.aliases[0].alias)
  console.log(alias.aliases[1].alias)
  console.log(alias.aliases[2].alias)
}

function removeAlias(){
  let courseId = '381203423287'
  let alias = Classroom.Courses.Aliases.remove(courseId,'d:37411')
  
}


function setOneAlias(){
  var alias = { 
      // 'alias': 'd:'+ line[1].toString()
      'alias': 'd:37410'

    }
    try { 
      var course_alias = Classroom.Courses.Aliases.create(resource={'alias': 'd:37410'}, courseId='227583433696');
      Logger.log('%s successfully added as an alias!', course_alias.alias)
    } catch (err) {
      Logger.log("Request to add alias %s failed.", alias.alias)
    }
}


function getOneCourse(){
  var course = Classroom.Courses.get('227583433696')

  console.log(course)
}


