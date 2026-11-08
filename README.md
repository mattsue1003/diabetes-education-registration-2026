# 糖尿病衛教課程報名表

Google Apps Script 網頁應用程式，使用 Google 試算表記錄報名資料，並將上傳檔案放入 Google Drive 資料夾。醫院照片已嵌入 `index.html`，不需額外設定圖片網址。

## 專案檔案

- `Code.gs`：表單後端、資料驗證、Google 試算表與 Drive 存檔。
- `index.html`：報名表網頁與內嵌醫院照片。
- `appsscript.json`：Apps Script 專案設定。

## 建立及部署

### 1. 建立 Apps Script 專案

1. 到 [script.google.com](https://script.google.com/) 建立「新專案」。
2. 專案設定齒輪 → 勾選「在編輯器中顯示 appsscript.json 資訊清單檔案」。
3. 複製專案設定中的「指令碼 ID」。

### 2. 建立 GitHub 儲存庫

1. 到 GitHub 按右上角 `+` → `New repository`。
2. 本專案儲存庫名稱為 `diabetes-education-registration-2026`。此儲存庫設為 Public，因此公開內容僅放程式碼與網站圖片。
3. 按 `Add file` → `Upload files`，上傳本專案的 `Code.gs`、`index.html`、`appsscript.json` 與 `README.md`，按 `Commit changes`。

### 3. 連結本機資料夾與 Apps Script

需先安裝 Node.js，再開啟終端機執行：

```bash
npm install -g @google/clasp
clasp login
```

將 GitHub 儲存庫複製到電腦：

```bash
git clone https://github.com/mattsue1003/diabetes-education-registration-2026.git
cd diabetes-education-registration
```

在專案根目錄新增 `.clasp.json`，填入剛才複製的 Apps Script 指令碼 ID：

```json
{
  "scriptId": "貼上你的 Apps Script 指令碼 ID",
  "rootDir": "."
}
```

`.clasp.json` 是本機連線設定，不要上傳到 GitHub。接著把程式推送至 Apps Script：

```bash
clasp push
```

### 4. 初始化資料表與資料夾

1. 在 Apps Script 編輯器選取 `setup` 函式並按「執行」。
2. 依畫面授權 Google 試算表與 Google 雲端硬碟存取權。
3. 程式會建立「糖尿病衛教課程報名資料」試算表，以及「衛教報名123_上傳檔案」資料夾。

### 5. 部署網頁應用程式

1. Apps Script 右上角按「部署」→「新增部署作業」。
2. 類型選「網頁應用程式」。
3. 「執行身分」選「我」；「誰可以存取」依招生對象選擇。若要讓一般民眾填寫，需選擇允許的外部存取範圍。
4. 按「部署」，複製產生的網頁應用程式網址。

## 更新程式

先從 GitHub 拉取最新版本，再推送到 Apps Script：

```bash
git pull
clasp push
```

若更新已部署網站的程式碼，回 Apps Script「部署」→「管理部署作業」→編輯現有部署，選擇「新增版本」並部署。若只是 `clasp push`，已發布的版本不一定會自動更新。

## 隱私提醒

報名資料含聯絡電話及檢驗報告／轉介單。此儲存庫為公開，請勿提交任何報名者資料、上傳檔案、試算表匯出資料或 `.clasp.json`。Apps Script 執行後，報名資料存入部署者的 Google 試算表和雲端硬碟。表單頁使用 `google.script.run`，因此請以 Apps Script 網頁應用程式網址提供填寫；GitHub Pages 只會顯示靜態頁面，無法執行目前的送件與 Drive 上傳功能。
