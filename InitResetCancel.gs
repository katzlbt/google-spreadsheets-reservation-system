/*
 This is the script for the ADMINISTRATOR of the spreadsheet

1. Write "RESET" or "CANCEL" in a cell of your CONTROL_COLUMN
2. RUN create_hyperlinks() with the run button above
3. a rectangular region beside "RESET" in the control-column will 
   be OVERWRITTEN with hyperlinks to reserve those slots
*/

// define the control column and number of weeks
var CONTROL_COLUMN = 1; // contains "RESET" or "CANCEL" at 1st row of block
var LAST_CONTROL_ROW = 87;

// define the range of cells containing the reservation links
// var START_ROW = ; defined by keyword in CONTROL_COLUMN
var START_COL = 3; 
var N_ROWS = 22;   // 22 reservable slots
var N_COLS = 7;    // 7 days in the week

function create_hyperlinks()
{
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName("Appointments")
    
  var resetColumn = sheet.getRange(1, 1, LAST_CONTROL_ROW);
  var resetValues = resetColumn.getValues()
  
  for(var i=0; i<LAST_CONTROL_ROW; i++)
  {
    if(resetValues[i] == "RESET")
      _reset_week(sheet, i+1, START_COL, N_ROWS, N_COLS, 1);
    
    if(resetValues[i] == "CANCEL")
      _reset_week(sheet, i+1, START_COL, N_ROWS, N_COLS, 2);
  }
}

// fill a rectangular range with hyperlinks for reservation
function _reset_week(sheet, srow, scol, nrow, ncol, mode)  // mode==1 RESET refill all, mode == 2 CANCEL refill empty cells
{
  var this_app_url = 'https://script.google.com/macros/s/AKfycbxrysxajTPTdSl_T3uA1Mc4GhFbkDRYwMYzemOHbiryOvJAnrY/exec'
  var week_range = sheet.getRange(srow, scol, nrow, ncol);
  var values = week_range.getValues();
  
  for (var col=0; col<ncol; col++)
  {
    var rcol = scol + col; // from origin of spreadsheet
    var date_range = sheet.getRange(3, rcol);
    var date = date_range.getValue();
    var rdatetime = new Date(date);
    
    for (var row=0; row<nrow; row++)
    {
      var rrow = srow + row; // from origin of spreadsheet
      var times_range = sheet.getRange(srow + row, 2)
      var time = times_range.getValue()
      
      if(mode == 2 && values[row][col] && values[row][col] != "reservieren #") // skip all non-empty cells
        continue;
      
      var rtime = new Date(time)
      rdatetime.setHours(rtime.getHours());
      rdatetime.setMinutes(rtime.getMinutes());
      
      var query= "?row=" + rrow +"&col=" + rcol + "&date=" + rdatetime.toISOString(); // + "&times=" + time +"&tutor=" + tutor
      
      values[row][col] = '=HYPERLINK("' + this_app_url + query + '"; "reservieren #")'; // .setBackground("white")
    }
  }
  
  week_range.setValues(values);
  sheet.getRange(srow, 1).setValue("DONE");
}