# 糖尿病衛教課程報名表

GitHub Pages 提供報名表畫面；Google Apps Script 接收表單資料，並寫入 Google 試算表、把檢驗報告或轉介單存入 Google Drive。醫院圖片已嵌入 `index.html`。

## 不用終端機的設定方式

### 1. 在 Apps Script 放入後端程式

1. 前往 [script.google.com](https://script.google.com/) 建立新專案。
2. 開啟 GitHub 的 [`Code.gs`](https://github.com/mattsue1003/diabetes-education-registration-2026/blob/main/Code.gs)，按 **Raw**，複製全部內容，貼到 Apps Script 的 `Code.gs`。
3. 在左側按「＋」→「HTML」，檔名輸入 `index`。這個檔案只為符合專案結構；實際報名頁由 GitHub Pages 提供。
4. 按左側齒輪「專案設定」，勾選「在編輯器中顯示 `appsscript.json` 資訊清單檔案」。把 GitHub [`appsscript.json`](https://github.com/mattsue1003/diabetes-education-registration-2026/blob/main/appsscript.json) 的內容複製進去。
5. 儲存專案。

### 2. 初始化試算表和上傳資料夾

在函式選單選 `setup`，按「執行」，依 Google 畫面授權。程式會建立「糖尿病衛教課程報名資料」試算表，以及「衛教報名123_上傳檔案」資料夾。

### 3. 部署 Apps Script 後端

1. 按「部署」→「新增部署作業」，類型選「網頁應用程式」。
2. 執行身分選「我」。要讓一般報名者填表，存取對象需允許未登入使用者；如果帳號沒有這個選項，可能受到 Google Workspace 管理員限制。
3. 部署後複製 Apps Script 網址，確認結尾為 `/exec`。

### 4. 把後端網址填入 GitHub 網頁

1. 在 GitHub 開啟 [`index.html`](https://github.com/mattsue1003/diabetes-education-registration-2026/blob/main/index.html)，按鉛筆編輯。
2. 搜尋 `PASTE_APPS_SCRIPT_EXEC_URL_HERE`，將它替換成剛才的 `/exec` 網址，保留前後單引號。
3. 按「Commit changes」。

### 5. 開啟 GitHub Pages

1. 在儲存庫按「Settings」→「Pages」。
2. 「Build and deployment」選「Deploy from a branch」，分支選 `main`，資料夾選 `/(root)`，按「Save」。
3. 等 Pages 完成發布後，在同一個 Pages 設定頁點「Visit site」取得報名表網址。GitHub Pages 的網站公開可瀏覽。

### 6. 試送一筆虛構資料

用虛構姓名、測試電話和非真實文件送出，確認成功訊息出現、資料寫入試算表、檔案進入上傳資料夾，再提供網址給報名者。

## 後續修改

- 改網頁：在 GitHub 編輯 `index.html` 並提交，Pages 會自動更新。
- 改後端：在 GitHub 編輯 `Code.gs` 後，將內容複製回 Apps Script、儲存，再到「部署」→「管理部署作業」更新版本。

## 個資提醒

此儲存庫與 GitHub Pages 網站都是公開的；請勿將報名者資料、檢驗報告、轉介單、試算表匯出檔或其他個資放進 GitHub。報名資料由 Apps Script 寫入部署者的試算表與 Drive 資料夾；請維持它們為私人，不要開啟公開共用。任何取得報名頁網址的人都可嘗試送件，程式會限制手機格式、檔案類型與 10 MB 檔案大小。
