/*
 This is the main Web-Application for USERs with a GET and a POST Handler.
*/

var SPREADSHEET_ID = '12Eyw9hqDAccZXakakLbQmjhMfKh2228dck5P6kmhYqk';
var SCRIPT_SALT = 'MyRandom';

function _hashString(string) 
{
    string = SCRIPT_SALT + string; // CHANGE MyRandom for each deployment
    var hash = 0, i, chr;
    for (i = 0; i < string.length; i++)
    {
      chr   = string.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
  
    return hash; // Integer
}

function doGet(request)
{        
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID) // The  Booking spreadsheet. 
  var sheet = ss.getSheetByName("Appointments")
  
  var row = request.parameter.row;
  var col = request.parameter.col;
  var date  = request.parameter.date;  // ISO date format
  
  Logger.log( "doGet(): " + row + ", " + col )
    
  if(request.parameter.cancel !== undefined) // handle a cancel request ?row=6&col=9&date=ISO&name=Hugo&cancel=hash
  {
    var range = sheet.getRange(row, col)
    var verify = request.parameter.name + request.parameter.row + request.parameter.col + request.parameter.date;
    
    // we could verify if the date is in the past!
    
    if ( _hashString(verify) == parseInt(request.parameter.cancel)) // #reservieren
    { 
      range.setFontLine("line-through"); // OR .setValue(""); //.setBackground("#4C4C4C").setFontColor("white")
      var html = '<body><p style="font-family:Arial"><b>Storniert!</b></p></body>'
      return HtmlService.createHtmlOutput( html )
    }
    
    var html = '<body><p style="font-family:Arial"><b>Storno-Code falsch!</b></p></body>'
    return HtmlService.createHtmlOutput( html )
  }  // >>>>>>>>>>>>>>>>>>>>>>>>>>> RETURN cancel appointment >>>>>>>>>>>>>>>>>>>>>>>>>>>
        
  //Put the values in the template.
  var template = HtmlService.createTemplateFromFile('booking.html')
  template.this_url = ScriptApp.getService().getUrl( )
  template.date = date // the rw date
  template.email = ""
  template.row = row
  template.col = col
    
  return template.evaluate().setTitle('Reservieren');
}

function doPost(request){
  Logger.log( "doPost()" )
    
  try{    
    //Get values from form
    var date = request.parameter.date; // Only really use these two rows
    var row = request.parameter.row
    var col = request.parameter.col
    var email = request.parameter.email
    
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID); // The  Booking spreadsheet. 
    var ss_name = ss.getName();
    var sheet= ss.getSheetByName("Appointments");
    
    // Allow name or email or pseudonym as valid input
    var rx = new RegExp("[-A-Za-z0-9@._ ]{8,}");
    if(false == rx.test(email))
    {
      var html = '<body><p style="font-family:Arial"><b>Bitte mindestens 8 Zeichen, eine Email oder einen Namen eingeben!</b></p></body>'
      return HtmlService.createHtmlOutput( html )
    }  // >>>>>>>>>>>>>>>>>>>>>>>>>>> RETURN error name >>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    Logger.log( "range: " + row + ", " + col )
    var range = sheet.getRange(row, col)
    
    var is_empty = range.getValue()
    if ( is_empty.indexOf("#") != -1) // #reservieren
    { 
      range.setValue(email); //.setBackground("#4C4C4C").setFontColor("white")

      // Create Thank you! Web Page.
      var template = HtmlService.createTemplateFromFile('thank_you.html')
      template.msg  = ''
      template.email = email;
      template.date = date;
      
      // Google Calendar Link
      var dt = new Date(date);      
      var sd = date.replace(/[^0-9TZ]/g, '').substring(0,15)+"Z"
      dt.setHours(dt.getHours() + 3);
      var ed = dt.toISOString().replace(/[^0-9TZ]/g, '').substring(0,15)+"Z"
      template.google_date = sd+"/"+ed
      template.header = "Reserviert"
      var return_url = ss.getUrl() 
      template.return_url = return_url
      
      // Create cancel Link: GET: 
      var hash = _hashString(email + row + col + date);
      template.cancel_params = encodeURI("name=" + email + "&row=" +  row + "&col=" + col + "&date=" + date + "&cancel=" + hash);
      template.this_url = ScriptApp.getService().getUrl();

      return template.evaluate().setTitle('Danke');
      
    }
    else // someone reserved this time while open
    {
      var html = '<body><p style="font-family:Arial"><b>Weggeschnappt! Der Termin ist schon reserviert!</b></p></body>'
      return HtmlService.createHtmlOutput( html )
    }
  }
  catch(e)
  {
    var html = '<body><p style="font-family:Arial"><b>Line:</b>' + e.lineNumber + " " + e.stack + "<br/>" + e + "</p></body>"
    return HtmlService.createHtmlOutput( html )
  }
}

function getCSS(){
  var template = HtmlService.createTemplateFromFile('css.html')
  return template.getRawContent() 
}

