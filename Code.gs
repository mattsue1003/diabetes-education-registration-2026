const CONFIG = {
  folderName: '衛教報名123_上傳檔案',
  spreadsheetName: '糖尿病衛教課程報名資料',
  sheetName: '報名資料',
  maxFileBytes: 10 * 1024 * 1024
};

const RESPONSE_CHANNEL = 'diabetes-registration-response';

/** GET 用來確認後端網址已部署；表單由 GitHub Pages 提供。 */
function doGet() {
  return HtmlService.createHtmlOutput(
    '<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><body>糖尿病衛教報名後端已部署。請從正式報名頁送出資料。</body></html>'
  );
}

/** 接收 GitHub Pages 表單的 application/x-www-form-urlencoded POST。 */
function doPost(e) {
  try {
    const encodedPayload = e && e.parameter && e.parameter.payload;
    if (!encodedPayload) throw new Error('missing payload');
    const form = JSON.parse(encodedPayload);
    validateForm_(form);

    const folder = getOrCreateFolder_(CONFIG.folderName);
    const bytes = Utilities.base64Decode(form.file.data);
    if (bytes.length > CONFIG.maxFileBytes) throw new Error('file too large');

    const safeName = form.name.trim().replace(/[\\/:*?"<>|]/g, '_');
    const safeOriginal = String(form.file.name || 'upload').replace(/[\\/:*?"<>|]/g, '_').slice(0, 150);
    const date = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyyMMdd');
    const blob = Utilities.newBlob(bytes, form.file.mimeType, safeName + '_' + date + '_' + safeOriginal);
    const driveFile = folder.createFile(blob);

    const spreadsheet = getOrCreateSpreadsheet_();
    const sheet = getOrCreateSheet_(spreadsheet);
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      sheet.appendRow([new Date(), form.name.trim(), form.phone.trim(), driveFile.getUrl()]);
    } finally {
      lock.releaseLock();
    }

    return responsePage_(true, '報名資料已送出，謝謝！');
  } catch (error) {
    return responsePage_(false, '資料送出失敗，請稍後再試或聯絡課程承辦人。');
  }
}

function validateForm_(form) {
  if (!form || typeof form !== 'object') throw new Error('invalid form');
  if (String(form.website || '').trim()) throw new Error('spam');
  if (!String(form.name || '').trim() || String(form.name).trim().length > 50) throw new Error('invalid name');
  if (!/^09\d{8}$/.test(String(form.phone || '').trim())) throw new Error('invalid phone');
  if (form.consent !== true) throw new Error('consent required');
  if (!form.file || !form.file.name || !form.file.data || !form.file.mimeType) throw new Error('file required');

  const mime = String(form.file.mimeType).toLowerCase();
  if (!(mime === 'application/pdf' || (mime.startsWith('image/') && mime !== 'image/svg+xml'))) {
    throw new Error('unsupported file type');
  }
  if (Utilities.base64Decode(form.file.data).length > CONFIG.maxFileBytes) throw new Error('file too large');
}

function responsePage_(ok, message) {
  const result = JSON.stringify({ channel: RESPONSE_CHANNEL, ok: Boolean(ok), message: message })
    .replace(/</g, '\\u003c');
  const html = '<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><body>' +
    '<script>window.parent.postMessage(' + result + ', "*");</script>' +
    '<p>' + message + '</p></body></html>';
  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** 手動執行一次，先建立試算表及上傳資料夾。 */
function setup() {
  getOrCreateFolder_(CONFIG.folderName);
  getOrCreateSheet_(getOrCreateSpreadsheet_());
  return '設定完成';
}

function getOrCreateSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('SPREADSHEET_ID');
  if (id) {
    try { return SpreadsheetApp.openById(id); } catch (error) { /* create a replacement below */ }
  }
  const spreadsheet = SpreadsheetApp.create(CONFIG.spreadsheetName);
  props.setProperty('SPREADSHEET_ID', spreadsheet.getId());
  return spreadsheet;
}

function getOrCreateSheet_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(CONFIG.sheetName);
  if (!sheet) sheet = spreadsheet.insertSheet(CONFIG.sheetName);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['送出時間', '姓名', '聯絡電話', '檔案連結']);
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('yyyy/mm/dd hh:mm:ss');
  }
  return sheet;
}

function getOrCreateFolder_(name) {
  const folders = DriveApp.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(name);
}
