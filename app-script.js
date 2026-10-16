// Handle GET requests (Read Data - remains the same)
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var jsonArray = [];

  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[i][j];
    }
    jsonArray.push(obj);
  }

  return ContentService.createTextOutput(JSON.stringify(jsonArray)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

// Handle POST requests (Insert OR Update Data)
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var payload = JSON.parse(e.postData.contents);
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // ACTION 1: UPDATE AN EXISTING ROW
    if (payload.action === "update") {
      var targetId = payload.id;
      if (!targetId) throw new Error("Missing 'id' for update action.");

      // Search for the ID in the first column (Column A)
      var idColumnValues = sheet
        .getRange(2, 1, sheet.getLastRow() - 1, 1)
        .getValues();
      var targetRowIndex = -1;

      for (var i = 0; i < idColumnValues.length; i++) {
        if (idColumnValues[i][0].toString() === targetId.toString()) {
          targetRowIndex = i + 2; // +2 offsets zero-index and the header row
          break;
        }
      }

      if (targetRowIndex === -1)
        throw new Error("ID not found in the spreadsheet.");

      // Update individual cells dynamically based on matching payload keys
      headers.forEach(function (header, colIndex) {
        if (payload.data[header] !== undefined) {
          sheet
            .getRange(targetRowIndex, colIndex + 1)
            .setValue(payload.data[header]);
        }
      });

      return ContentService.createTextOutput(
        JSON.stringify({ status: "success", message: "Row updated." }),
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // ACTION 2: INSERT A NEW ROW (Default behavior)
    else {
      var rowData = payload.data || payload; // Handles nested data objects gracefully

      // Automatically generate a simple timestamp-based ID if 'id' is empty/omitted
      if (!rowData.id) {
        rowData.id = "ID-" + new Date().getTime();
      }

      var newRow = headers.map(function (header) {
        return rowData[header] !== undefined ? rowData[header] : "";
      });

      sheet.appendRow(newRow);
      return ContentService.createTextOutput(
        JSON.stringify({
          status: "success",
          message: "Row inserted.",
          id: rowData.id,
        }),
      ).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
