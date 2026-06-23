# Yuan 個人網站

這是 [yuan-tw.net](https://yuan-tw.net/) 的靜態個人網站，用來整理 Yuan 的自我介紹、核心能力、工作經歷、代表專案、社群活動、適合聯絡情境與公開聯絡方式。

## 技術棧

- 純靜態 HTML / CSS / JavaScript
- 無 JavaScript 框架
- 無建置流程
- 無外部 CDN 依賴

## 本機檢視

網站使用 `/assets/...`、`/data/...` 等絕對路徑，建議用本機 HTTP server 檢視：

```bash
python3 -m http.server 8080
```

然後開啟 `http://localhost:8080/`。

## 主要檔案

- `index.html`：首頁與結構化資料
- `assets/css/site.css`：網站樣式與 RWD
- `assets/js/site.js`：讀取 JSON 並渲染工作經歷、代表專案案例、活動經歷與展開互動
- `data/experiences.json`：前端實際讀取的經歷資料與代表專案案例資料
- `llms.txt`：AI 與自動化工具友善摘要
- `robots.txt`：搜尋引擎爬蟲設定
- `sitemap.xml`：網站地圖
- `scripts/validate-site.js`：無依賴的靜態資料與網站一致性檢查
- `PROJECT.md`：專案架構、資料流與維護說明
- `AGENTS.md`：AI agent 與維護者工作規範

## 驗證方式

目前沒有建置流程。修改後至少應執行：

```bash
node scripts/validate-site.js
python3 -m json.tool data/experiences.json
python3 -m xml.etree.ElementTree sitemap.xml
```

若要用瀏覽器確認版面，可再啟動本機靜態伺服器：

```bash
python3 -m http.server 8080
```

並用瀏覽器確認首頁、CSS、JS、圖片、`data/experiences.json`、`llms.txt`、`robots.txt`、`sitemap.xml` 都能正常載入。
