const CONFIG = {
  folderName: '衛教報名123_上傳檔案',
  spreadsheetName: '糖尿病衛教課程報名資料',
  sheetName: '報名資料',
  maxFileBytes: 10 * 1024 * 1024 // Apps Script 表單附件上限：10 MB
};

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('糖尿病衛教課程報名表')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** 首次部署前執行一次，建立資料夾與試算表。 */
function setup() {
  const folder = getOrCreateFolder_(CONFIG.folderName);
  let spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  let spreadsheet;
  if (spreadsheetId) {
    try { spreadsheet = SpreadsheetApp.openById(spreadsheetId); } catch (e) { spreadsheet = null; }
  }
  if (!spreadsheet) {
    spreadsheet = SpreadsheetApp.create(CONFIG.spreadsheetName);
    PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', spreadsheet.getId());
  }
  let sheet = spreadsheet.getSheetByName(CONFIG.sheetName);
  if (!sheet) sheet = spreadsheet.insertSheet(CONFIG.sheetName);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['送出時間', '姓名', '聯絡電話', '檔案連結']);
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('yyyy/mm/dd hh:mm:ss');
  }
  const defaultSheet = spreadsheet.getSheetByName('工作表1');
  if (defaultSheet && defaultSheet.getSheetId() !== sheet.getSheetId() && defaultSheet.getLastRow() === 0) spreadsheet.deleteSheet(defaultSheet);
  return { spreadsheetUrl: spreadsheet.getUrl(), folderUrl: folder.getUrl() };
}

function submitRegistration(form) {
  if (!form || !String(form.name || '').trim()) throw new Error('請填寫姓名。');
  const name = String(form.name).trim();
  const phone = String(form.phone || '').trim();
  if (!/^09\d{8}$/.test(phone)) throw new Error('聯絡電話請輸入 10 碼手機號碼（09 開頭）。');
  if (form.consent !== true) throw new Error('請先勾選同意個資蒐集告知。');
  if (!form.file || !form.file.data || !form.file.name || !form.file.mimeType) throw new Error('請上傳檢驗報告或轉介單。');

  const mime = String(form.file.mimeType).toLowerCase();
  if (!(mime === 'application/pdf' || mime.startsWith('image/'))) throw new Error('檔案格式限照片或 PDF。');
  const bytes = Utilities.base64Decode(form.file.data);
  if (bytes.length > CONFIG.maxFileBytes) throw new Error('檔案大小不可超過 10 MB。');

  const folder = getOrCreateFolder_(CONFIG.folderName);
  const safeName = name.replace(/[\\/:*?"<>|]/g, '_');
  const date = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Asia/Taipei', 'yyyyMMdd');
  const originalName = String(form.file.name).replace(/[\\/:*?"<>|]/g, '_');
  const file = folder.createFile(Utilities.newBlob(bytes, mime, safeName + '_' + date + '_' + originalName));

  const props = PropertiesService.getScriptProperties();
  let spreadsheetId = props.getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) {
    setup();
    spreadsheetId = props.getProperty('SPREADSHEET_ID');
  }
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  let sheet = spreadsheet.getSheetByName(CONFIG.sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.sheetName);
    sheet.appendRow(['送出時間', '姓名', '聯絡電話', '檔案連結']);
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([new Date(), name, phone, file.getUrl()]);
  return { ok: true, message: '報名資料已送出，謝謝！' };
}

function getOrCreateFolder_(name) {
  const folders = DriveApp.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(name);
}
