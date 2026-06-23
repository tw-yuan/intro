# AGENTS.md

本檔案提供 AI agent 與維護者在本 repo 工作時的專案規範。

## 專案概況

這是 Yuan 的個人網站，部署為純靜態網站。主要目標是：

- 現代、淺色、簡潔的個人 profile
- 行動裝置與桌面裝置都能良好閱讀
- 搜尋引擎、AI crawler、一般自動化工具都容易理解
- 不引入不必要的建置流程或前端框架

## 技術與部署

- 技術棧：HTML、CSS、少量 JavaScript 與靜態設定檔
- 目前沒有 `package.json`、Makefile、Dockerfile 或 CI 設定
- 預設部署方式是將 repo 內容作為靜態檔案發布
- 不需要 npm install、npm build 或前端 bundler

## 重要檔案

- `index.html`：唯一主要頁面，包含語意 HTML、SEO metadata、Open Graph、JSON-LD
- `assets/css/site.css`：所有網站樣式與 RWD 規則
- `assets/js/site.js`：讀取 `data/experiences.json`，渲染工作經歷、活動經歷與展開互動
- `data/experiences.json`：前端使用的經歷資料來源
- `llms.txt`：給 AI 與自動化工具讀取的純文字摘要
- `robots.txt`：crawler policy
- `sitemap.xml`：站點索引
- `scripts/validate-site.js`：無依賴的靜態資料與網站一致性檢查
- `PROJECT.md`：完整專案文件

## 編輯原則

- 維持純靜態架構；除非需求明確，否則不要引入框架、編譯器或 package manager。
- 經歷資料以 `data/experiences.json` 為唯一資料來源。目前分類為學歷、獎項證照與榮譽、工作經歷、比賽經歷、課程與訓練、專案、演講、社群與研討會參與。
- `data/experiences.json` 是公開資料，不要保留 `source_text`、整理過程備註或不適合公開履歷的原始口語內容。
- 重要摘要、metadata、JSON-LD 與 `llms.txt` 仍需維持可讀，不要只依賴 JavaScript。
- 優先使用語意元素，例如 `header`、`main`、`section`、`article`、`footer`、`address`。
- 保持 heading hierarchy 清楚：一個 `h1`，主要段落使用 `h2`，卡片或項目使用 `h3`。
- 外部連結應使用描述性文字，必要時加上 `rel="noopener noreferrer"`。
- 個人身份、工作經歷、社群角色等公開資訊若有更新，要同步更新 `index.html`、`llms.txt`、`PROJECT.md`，必要時更新 `sitemap.xml` 的 `lastmod`。
- 若新增環境需求、部署步驟或驗證方式，必須同步更新 `README.md` 和 `PROJECT.md`。

## 設計原則

- 使用淺色系、留白、清楚層級與高可讀對比。
- 不使用大量動畫、厚重陰影、大面積漸層或會干擾閱讀的裝飾。
- RWD 採 mobile-first；手機版需保持完整內容，不應隱藏重要資訊。
- 卡片與 UI 元件的圓角維持在 8px 左右。
- 避免只靠 icon 傳達資訊；文字內容必須可讀。

## AI / SEO 可讀性

- 維持 `llms.txt` 為簡潔、準確、純文字格式。
- JSON-LD 應保持有效 JSON，不要使用註解或 trailing comma。
- 搜尋引擎相關資料包括 title、description、canonical、Open Graph、sitemap、robots。
- 若新增頁面，應同步加入 `sitemap.xml` 並確認連結可被一般 crawler 讀取。

## 驗證方式

目前沒有建置流程。修改後至少執行：

```bash
node scripts/validate-site.js
python3 -m json.tool data/experiences.json
python3 -m xml.etree.ElementTree sitemap.xml
```

若需要瀏覽器手動確認，可再執行：

```bash
python3 -m http.server 8080
```

並確認：

- `/` 可正常載入
- `/assets/css/site.css` 可正常載入
- `/assets/js/site.js` 可正常載入
- `/data/experiences.json` 可正常載入
- `/images/avatar2.png` 可正常載入
- `/llms.txt` 可正常載入
- `/robots.txt` 可正常載入
- `/sitemap.xml` 可正常載入
- 手機寬度與桌面寬度都沒有文字重疊或水平捲動問題

## Git 規範

- 使用 Conventional Commits，例如 `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`。
- 每個 commit 聚焦一件事。
- 不要把內容更新、樣式重構與資產清理混在同一個 commit，除非變更非常小且不可分割。
