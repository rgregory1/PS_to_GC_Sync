function addRemoveStudents() {

  console.time('add remove')
  // get logFile setup
  let curDate = getCurrentDate()
  // let curDate = '2021-10-07'
  
  let logFileId = getLogFileId(curDate)
  let logFile = SpreadsheetApp.openById(logFileId)

  // create GC enroll list of objects
  let deltaDataRaw = logFile.getSheetByName('Delta').getDataRange().getValues()
  let headers = deltaDataRaw.shift(0)

  console.log(headers)

  let deltaObjList = []
  let finalData = []

  let report = ''

  deltaDataRaw.forEach(line => {

    let addList = []
    let dropList = []

    if(line[2]){
      addList = line[2].split(',')
    } 

    if(line[3]){
      dropList = line[3].split(',')
    }

    let lineObj = {
      courseId: line[0],
      status: line[1],
      add: addList,
      drop: dropList,
      nochange: line[4],
      changes: ''
    }

    deltaObjList.push(lineObj)
  })

  deltaObjList.forEach(gcClass => {
    if(gcClass.add.length > 0){
      gcClass.add.forEach(student => {
        // enrollAStudent(gcClass.courseId,student,report)
        // gcClass.changes += 'A'
        let addResult = enrollAStudent(gcClass.courseId,student,report)
        gcClass.changes += addResult

      })
      // gcClass.changes += 'A'
    }
    if(gcClass.drop.length > 0){
      gcClass.drop.forEach(student => {
        // dropAStudent(gcClass.courseId,student,report)
        // gcClass.changes += 'D'
        let dropResult = dropAStudent(gcClass.courseId,student,report)
        gcClass.changes += dropResult
      })
      // gcClass.changes += 'D'
    }
  })

  deltaObjList.forEach(gcClass => {
    finalData.push([gcClass.courseId, gcClass.status,gcClass.add.toString(),gcClass.drop.toString(),gcClass.nochange,gcClass.changes])
  })

  headers.push('Changes')
  finalData.unshift(headers)

  Logger.log(finalData)

  let deltaSheet = logFile.getSheetByName('Delta')
  deltaSheet.getRange(1,1,finalData.length, finalData[0].length).setValues(finalData)

  styleDeltaSheet(deltaSheet)

  Logger.log(report)

  console.timeEnd('add remove')



}
