# 糖尿病衛教課程報名表

本專案由 GitHub 保存程式碼，Google Apps Script 執行報名頁、寫入試算表並將上傳檔案存進 Google Drive。醫院照片已嵌入 `index.html`。

## 部署步驟

### 1. 建立 Apps Script 專案

1. 前往 [script.google.com](https://script.google.com/) 建立「新專案」。
2. 在「專案設定」開啟「在編輯器中顯示 `appsscript.json` 資訊清單檔案」。
3. 複製專案的「指令碼 ID」。

### 2. 下載 GitHub 專案並安裝 clasp

在已安裝 Node.js 的電腦開啟終端機：

```bash
git clone https://github.com/mattsue1003/diabetes-education-registration-2026.git
cd diabetes-education-registration-2026
npm install -g @google/clasp
clasp login
```

### 3. 連結並推送到 Apps Script

在專案根目錄新增 `.clasp.json`，填入你的指令碼 ID：

```json
{
  "scriptId": "貼上你的 Apps Script 指令碼 ID",
  "rootDir": "."
}
```

接著執行：

```bash
clasp push
```

`.clasp.json` 是本機連線設定，已列入 `.gitignore`，不要上傳到 GitHub。

### 4. 建立試算表與雲端資料夾

在 Apps Script 編輯器選取 `setup` 函式並按「執行」，依畫面授權。程式會建立「糖尿病衛教課程報名資料」試算表，以及「衛教報名123_上傳檔案」資料夾。

### 5. 部署可填寫的表單

1. 在 Apps Script 選「部署」→「新增部署作業」，類型選「網頁應用程式」。
2. 「執行身分」選「我」。
3. 按「部署」，依招生對象設定存取範圍，再複製 Apps Script 提供的網頁應用程式網址。正式表單網址會以 `/exec` 結尾。
4. 先用虛構資料測試送件；確認資料進入試算表及 Drive 後，再提供給報名者。

GitHub 儲存庫網址是程式碼位置，不是報名表網址。此頁使用 `google.script.run`，需由 Apps Script 網頁應用程式提供；GitHub Pages 不會執行目前的送件及檔案上傳功能。

## 更新程式

在專案資料夾執行：

```bash
git pull
clasp push
```

要更新已發布的網頁，回 Apps Script「部署」→「管理部署作業」→編輯部署，選擇新增版本並部署。

## 隱私

儲存庫是公開的，只放程式碼和網站圖片。請勿提交報名者姓名、電話、檢驗報告、轉介單、試算表匯出資料或 `.clasp.json`。報名資料由 Apps Script 寫入部署者的 Google 試算表和雲端硬碟；請勿將試算表或上傳資料夾設為公開共用。
