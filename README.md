# google-spreadsheets-reservation-system
A Google spreadsheet for managing COVID-19 access/overcrowding restrictions for small sport clubs. It can be filled with links to call a Google app-script webserver that adds or removes reservations to the sheet. It seems that the execution of the script requires a login of the user with a Google Account.

This script relies on your users to be honest and enter their own name. Data protection prevents Google to pass user identifiable data to the spreadshhet, even though the user has to be logged in.

TODO: Add a simple password to the form to prevent any user with a Google-Account to make a "fun" reservation. Otherwise the sheet is only proteccted by whoever has the link.

The script is set up to use the standard Template from the "Personal" section - select the “Schedule” template. Then use Tools and Scripteditor and add the files in this project. Change the constants in the 2 scripts. Rename the sheet to "Appointments". Write RESET in Column A at 8:00 and run the InitResetCancel.gs script's create_hyperlinks(). Then publish as web-application. See original blog for more hints on install and permissions.

This script was created for managing COVID-19 access/overcrowding restrictions for small outdoor sport clubs. The original idea is from: http://collaborative-tools-project.blogspot.com/2014/02/a-simple-example-booking-project-in.html 

Please observe the quotas for free use: https://developers.google.com/apps-script/guides/services/quotas
