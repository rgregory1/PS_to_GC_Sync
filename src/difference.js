function getAddDropList(){
  // get logFile setup
  let curDate = getCurrentDate()
  // let curDate = '2021-10-07'
  let logFileId = getLogFileId(curDate)
  let logFile = SpreadsheetApp.openById(logFileId)

  // create GC enroll list of objects
  let gcEnrollRaw = logFile.getSheetByName('GC_enroll_file').getDataRange().getValues()
  gcEnrollRaw.shift()

  let gcEnroll = []

  gcEnrollRaw.forEach(line => {

    gcEnroll.push(
      {
        name: line[0],
        alias: line[6],
        students: line[7].split(',')
        }
      )
  })

  // create PS enroll list of objects
  let psEnrollRaw = logFile.getSheetByName('PS_enroll_file').getDataRange().getValues()

  let psEnroll = []

  psEnrollRaw.forEach(line => {

    psEnroll.push(
      {
        alias: 'd:' + line[0],
        students: line[1].split(',')
        }
      )
  })

  

  let deltaList = [
        [
        'Class Name',
        'Status',
        'Added',
        'Removed',
        'No Change'
        ]
      ]

  psEnroll.forEach( powerClass => {

    // try to match PS class in GC list
    let result = gcEnroll.find( googClass => googClass.alias == powerClass.alias )

    // console.log(result)

    
    if(result){
      console.log(`found ${result.name}`)

      let classChanges = getDelta(result.students, powerClass.students)

      console.log(classChanges)

      deltaList.push(
        [
          result.alias,
          'Found',
          classChanges.added.toString(),
          classChanges.deleted.toString(),
          'No Change: ' + classChanges.noChange.length
        ]
      )





    } else {
      deltaList.push([powerClass.alias, 'not found','','',''])
    }

  })

  

  let delta = logFile.getSheetByName('Delta') || logFile.insertSheet('Delta')

  delta.getRange(1,1, deltaList.length, deltaList[0].length).setValues(deltaList)

  styleDeltaSheet(delta)

  removeExcludedStudents()

  // create line to delta sheet
  let logFileUrl = logFile.getUrl()
  let deltaSheetID = delta.getSheetId()

  let deltaSheetLink = logFileUrl + '#gid=' + deltaSheetID

  let body = `\nA new set of changes will be applied to your domain's Google Classroom, check them out. ${deltaSheetLink}`

  MailApp.sendEmail(
    'russell.gregory@mvsdschools.org',
    'New changes to google classrooms',
    body
  )

  
}







/**
 * @param {object[]} remoteRoster old array of objects
 * @param {object[]} currentRoster new array of objects
 * @param {object} An object with changes
 */
function getDelta(remoteRoster, currentRoster)  {
    var delta = {
        added: [],
        deleted: [],
        noChange: []
    };
    
    remoteRoster.forEach(oldname => {
      if(!currentRoster.includes(oldname)){
        delta.deleted.push(oldname)
      }else{
        delta.noChange.push(oldname)
      }
    })

    currentRoster.forEach(newName => {
      if(!remoteRoster.includes(newName)){
        delta.added.push(newName)
      }
    })


    return delta;
}


let oldStudents = ['Jane','Jeff','John','Sue']
let currentStudents = ['Jane','Jeff','John','Robert']

function tryThis(oldStudents){
  var delta = getDelta(oldStudents, currentStudents);
  console.log(delta)
}









