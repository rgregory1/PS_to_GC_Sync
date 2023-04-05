/**
 * Updates the section and room of Google Classroom. 
 */
function addAlias(course_id='345780785192') {
  var alias = { 
    'alias': 'd:third_alias'
  }
  try { 
    var course_alias = Classroom.Courses.Aliases.create(resource=alias, courseId=course_id);
    Logger.log('%s successfully added as an alias!', course_alias.alias)
  } catch (err) {
    Logger.log("Request to add alias %s failed.", alias.alias)
  }
}

function getAlias(classID){
  
  let alias = Classroom.Courses.Aliases.list(classID)

  // console.log(alias.aliases)

}

function getMyAlias(classID='526389048917'){
  let alias = Classroom.Courses.Aliases.list(classID)

  console.log(alias.aliases)
}


function getAliasFromList(){

  let activeRow = ss.getActiveSheet().getActiveRange().getRow();
  let activeColumn = ss.getActiveSheet().getActiveRange().getColumn();
  let lastColumn = ss.getActiveSheet().getLastColumn()
  let scope = 400

  console.log('active row: ',activeRow)
  console.log('last column: ',lastColumn)

  let courseIds = ss.getActiveSheet().getRange(activeRow,activeColumn, scope, 1).getValues().flat()
  let aliasList = []
  courseIds.forEach( courseId =>{
    if(courseId !== ''){
        // console.log('Course ID: ',courseId)
        let courseAlias = ['','']
        
        let alias = Classroom.Courses.Aliases.list(courseId)
        // console.log('alias result: ',alias.aliases)

        if(typeof alias.aliases === 'undefined'){
          console.log('undefined')
        } else if(alias.aliases.length == 2){
          courseAlias = [alias.aliases[0].alias,alias.aliases[1].alias]
        } else {
          courseAlias = [alias.aliases[0].alias,'']
        }
        // console.log(courseAlias)
        aliasList.push(courseAlias)
    }
  })
  
  
  console.log(aliasList)

  ss.getActiveSheet().getRange(activeRow,2,aliasList.length, 2).setValues(aliasList)

  ss.getActiveSheet().setActiveSelection('A1:A10')

}



function createAliasesFromList(){
  
  let data = ss.getSheetByName('ID2Alias').getRange(2,1,162,2).getValues()

  data.forEach( line => {

    var alias = { 
      // 'alias': 'd:'+ line[1].toString()
      'alias': line[1].toString()

    }
    try { 
      var course_alias = Classroom.Courses.Aliases.create(resource=alias, courseId=line[0].toString());
      Logger.log('%s successfully added as an alias!', course_alias.alias)
    } catch (err) {
      Logger.log("Request to add alias %s failed.", alias.alias)
    }
  })
}


