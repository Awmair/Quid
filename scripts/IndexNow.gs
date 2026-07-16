const QUID_INDEXNOW = Object.freeze({
  endpoint: 'https://api.indexnow.org/indexnow',
  host: 'get-quid.site',
  key: '1fec5dc5cd739ab1a89a3915fca326df',
  keyLocation: 'https://get-quid.site/1fec5dc5cd739ab1a89a3915fca326df.txt',
  sheetName: 'IndexNow',
});

function setupQuidIndexNow() {
  const workbook = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = workbook.getSheetByName(QUID_INDEXNOW.sheetName);
  if (!sheet) sheet = workbook.insertSheet(QUID_INDEXNOW.sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1).setValue('IndexNow URL Notifications');
    sheet.getRange(2, 1).setValue('Notify participating search engines when Quid pages are added, meaningfully updated, redirected, or deleted.');
    sheet.getRange(4, 1, 1, 6).setValues([[
      'URL', 'Action', 'Status', 'HTTP', 'Detail', 'Submitted At',
    ]]);
    sheet.setFrozenRows(4);
  }

  const hasTrigger = ScriptApp.getProjectTriggers()
    .some((trigger) => trigger.getHandlerFunction() === 'processQuidIndexNowQueue');
  if (!hasTrigger) {
    ScriptApp.newTrigger('processQuidIndexNowQueue')
      .timeBased()
      .everyHours(1)
      .create();
  }

  queueQuidIndexNowUrls([
    'https://get-quid.site/resources/senior-living-admissions-automation-software/',
  ]);
}

function queueQuidIndexNowUrls(urls) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(QUID_INDEXNOW.sheetName);
  if (!sheet) throw new Error('Run setupQuidIndexNow first.');

  const existing = sheet.getLastRow() > 4
    ? new Set(sheet.getRange(5, 1, sheet.getLastRow() - 4, 1).getValues().flat())
    : new Set();
  const rows = [...new Set(urls)]
    .filter((url) => isValidQuidIndexNowUrl_(url) && !existing.has(url))
    .map((url) => [url, 'Submit', 'Queued', '', '', '']);
  if (rows.length) sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 6).setValues(rows);
}

function processQuidIndexNowQueue() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(QUID_INDEXNOW.sheetName);
  if (!sheet || sheet.getLastRow() < 5) return;

  const range = sheet.getRange(5, 1, sheet.getLastRow() - 4, 6);
  const rows = range.getValues();
  const pending = [];

  rows.forEach((row, index) => {
    if (row[1] === 'Submit' && row[2] !== 'Complete' && isValidQuidIndexNowUrl_(row[0])) {
      pending.push({ row: index, url: row[0] });
    }
  });
  if (!pending.length) return;

  const urlList = [...new Set(pending.map((item) => item.url))].slice(0, 10000);
  const response = UrlFetchApp.fetch(QUID_INDEXNOW.endpoint, {
    method: 'post',
    contentType: 'application/json; charset=utf-8',
    payload: JSON.stringify({
      host: QUID_INDEXNOW.host,
      key: QUID_INDEXNOW.key,
      keyLocation: QUID_INDEXNOW.keyLocation,
      urlList,
    }),
    muteHttpExceptions: true,
  });

  const code = response.getResponseCode();
  const accepted = code === 200 || code === 202;
  const submittedAt = new Date();
  const detail = response.getContentText().slice(0, 500) || (accepted ? 'Accepted by IndexNow' : 'Submission failed');

  pending.forEach((item) => {
    if (!urlList.includes(item.url)) return;
    rows[item.row][2] = accepted ? 'Complete' : 'Error';
    rows[item.row][3] = code;
    rows[item.row][4] = detail;
    rows[item.row][5] = submittedAt;
  });
  range.setValues(rows);
}

function isValidQuidIndexNowUrl_(value) {
  return typeof value === 'string'
    && /^https:\/\/get-quid\.site\/[^#]*$/.test(value);
}
