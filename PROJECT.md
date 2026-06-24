# Yuan 個人網站專案文件

## 專案目的與背景

本專案是 Yuan 的個人網站，正式網址為 `https://yuan-tw.net/`。網站目標是提供一個現代、簡潔、可維護的個人 profile，整理 Yuan 的公開資訊：

- 自我介紹
- 技術能力
- 工作經歷
- 專案與活動經歷
- 社群與教育推廣參與
- 主要連結
- 聯絡方式
- AI 與搜尋引擎可讀資料

網站需要讓人類訪客可以快速理解 Yuan 的背景、網路與 AI 應用能力，也要讓搜尋引擎、AI crawler、自動化索引工具能直接讀取結構化且可信的資訊。

## 系統架構

這是一個純靜態網站，不依賴後端服務、資料庫或前端框架。

```text
Visitor / Crawler
       |
       v
Static hosting for yuan-tw.net
       |
       +-- index.html
       +-- assets/css/site.css
       +-- assets/js/site.js
       +-- data/experiences.json
       +-- file/cv-zh.md
       +-- file/cv-zh.pdf
       +-- file/cv-en.md
       +-- file/cv-en.pdf
       +-- images/avatar2.png
       +-- llms.txt
       +-- robots.txt
       +-- sitemap.xml
       +-- scripts/validate-site.js
```

## 技術棧與選型原因

### HTML

首頁以單一 `index.html` 呈現。使用語意化 HTML 是為了：

- 降低維護成本
- 提升可存取性
- 讓搜尋引擎與 AI 工具能直接解析內容
- 避免重要內容被 JavaScript 動態產生而影響索引

### CSS

樣式集中於 `assets/css/site.css`。不使用 Bootstrap、Tailwind 或其他 CSS 框架，是因為目前需求足以用少量原生 CSS 完成，並可避免：

- 額外下載成本
- CDN 依賴
- 未使用樣式累積
- 不必要的建置流程

### JavaScript

`assets/js/site.js` 負責讀取 `data/experiences.json`，並渲染工作經歷與經歷總覽。經歷總覽會依分類顯示學歷、獎項證照與榮譽、比賽經歷、課程與訓練、專案、演講、社群與研討會參與；每個分類預設顯示精選或前三筆資料，使用者可按「展開更多某分類」查看該分類完整清單。

這個選型保留純靜態部署，同時讓經歷資料與頁面結構分離。首頁仍保留自我介紹、技術能力、工作經歷與經歷總覽精選項目的靜態 fallback，避免重要資訊只存在 JavaScript 渲染結果中。

### 經歷資料

經歷資料放在 `data/experiences.json`。資料包含：

- 工作經歷
- 學歷
- 獎項、證照與榮譽
- 比賽經歷
- 課程與訓練
- 專案
- 演講
- 社群與研討會參與
- 分類與排序
- 是否為精選項目
- 未展開時是否顯示
- 展開區塊設定文字

### JSON-LD

`index.html` 內含 Schema.org JSON-LD，包含：

- `WebSite`
- `ProfilePage`
- `Person`

這些資料協助搜尋引擎與知識圖譜工具理解網站主體、人物資訊、社群連結與專長。

### llms.txt

`llms.txt` 是給 AI 與自動化工具讀取的純文字摘要，列出網站主體、專長、經歷、公開連結與維護說明。

### CV 檔案

`file/cv-zh.md` 與 `file/cv-en.md` 是 ATS 友善履歷的主要維護來源，分別提供台灣正體中文與英文版本。`file/cv-zh.pdf` 與 `file/cv-en.pdf` 由 Markdown 產生，採單欄、標準履歷區塊、可選取文字與可用 `pdftotext` 抽取的 PDF 格式。

PDF 不使用圖片化輸出，也避免雙欄、表格或裝飾排版，原因是 ATS 與一般履歷系統通常以線性純文字方式解析 PDF。更新 PDF 時應確認抽出的文字順序與 Markdown 內容一致，尤其是 email、URL、技能關鍵字、`workflow`、`prefix-list` 與中文詞彙是否正確。

## 資料流說明

本專案沒有動態資料流。所有公開內容都直接寫在靜態檔案中。

```text
Maintainer edits source files
       |
       v
Commit to git
       |
       v
Static hosting serves files
       |
       +-- Browser renders index.html, site.css, and site.js
       +-- site.js reads data/experiences.json
       +-- Search engines read metadata, JSON-LD, robots.txt, sitemap.xml
       +-- AI tools read index.html and llms.txt
       +-- CV files are served as static Markdown and PDF files under /file/
```

## API 端點清單

本專案沒有 API。

公開靜態端點如下：

| 路徑 | 用途 |
| --- | --- |
| `/` | 個人網站首頁 |
| `/index.html` | 首頁原始 HTML |
| `/assets/css/site.css` | 網站樣式 |
| `/assets/js/site.js` | 經歷資料渲染與展開互動 |
| `/data/experiences.json` | 前端讀取的經歷資料 |
| `/file/cv-zh.md` | 台灣正體中文 ATS 友善 CV Markdown |
| `/file/cv-zh.pdf` | 台灣正體中文 ATS 友善 CV PDF |
| `/file/cv-en.md` | 英文 ATS 友善 CV Markdown |
| `/file/cv-en.pdf` | 英文 ATS 友善 CV PDF |
| `/images/avatar2.png` | 個人照片與社群分享圖 |
| `/favicon.ico` | 網站圖示 |
| `/llms.txt` | AI 與自動化工具摘要 |
| `/robots.txt` | 搜尋引擎爬蟲規則 |
| `/sitemap.xml` | 網站地圖 |

## 部署方式與環境需求

網站可部署到任何支援靜態檔案的環境，例如：

- GitHub Pages
- Cloudflare Pages
- Netlify
- Nginx
- Apache
- 物件儲存搭配 CDN

目前沒有建置步驟。部署時直接發布 repo 中的靜態檔案即可。

本機檢視方式：

```bash
python3 -m http.server 8080
```

開啟 `http://localhost:8080/`。

靜態驗證方式：

```bash
node scripts/validate-site.js
python3 -m json.tool data/experiences.json
python3 -m xml.etree.ElementTree sitemap.xml
```

CV PDF 重新產生與 ATS 文字抽取檢查：

```bash
cat > /tmp/nohyphen.tex <<'EOF'
\usepackage[none]{hyphenat}
\usepackage{ragged2e}
\RaggedRight
\sloppy
EOF

pandoc file/cv-zh.md --from markdown --pdf-engine=xelatex --metadata title="Yuan CV" -V papersize=a4 -V geometry:margin=13mm -V mainfont="DejaVu Sans" -V CJKmainfont="Noto Sans CJK TC" -V monofont="DejaVu Sans Mono" -V mainfontoptions="Ligatures=NoCommon" -V colorlinks=false -H /tmp/nohyphen.tex -o file/cv-zh.pdf
pandoc file/cv-en.md --from markdown --pdf-engine=xelatex --metadata title="Yuan CV" -V papersize=a4 -V geometry:margin=13mm -V mainfont="DejaVu Sans" -V CJKmainfont="Noto Sans CJK TC" -V monofont="DejaVu Sans Mono" -V mainfontoptions="Ligatures=NoCommon" -V colorlinks=false -H /tmp/nohyphen.tex -o file/cv-en.pdf

pdftotext -layout file/cv-zh.pdf /tmp/cv-zh.txt
pdftotext -layout file/cv-en.pdf /tmp/cv-en.txt
```

## 重要設計決策與原因

### 維持純靜態

個人網站目前是單頁 profile，內容更新頻率低，不需要資料庫或後端。純靜態架構能降低攻擊面、維護成本與部署複雜度。

### 移除前端框架依賴

舊版頁面曾依賴 Bootstrap 與 Font Awesome CDN。新版移除外部 CDN，使用原生 CSS 與文字連結，原因是：

- 首屏載入更穩定
- 降低第三方服務依賴
- 更容易被離線檢視與鏡像
- 減少未使用 CSS/JS

### 經歷資料改由 JSON 維護

工作經歷與其他經歷改由 `data/experiences.json` 維護，讓前端呈現與資料內容分離。這能支援「分類預設顯示精選項目，展開後看完整清單」的互動方式。

為了避免資料只存在 JavaScript 渲染結果中，重要摘要仍同步維護於 `index.html`、`llms.txt` 與 JSON-LD。`index.html` 內保留可直接讀取的自我介紹、技術能力、工作經歷與經歷總覽精選項目。

### 公開資料清理

`data/experiences.json` 是公開資料，不能保留整理過程中的原始口語註記或內部備註。若從 CSV 或其他來源整理資料，應在匯入後移除 `source_text` 等非公開欄位，只保留網站需要渲染的正式欄位。

### 加入 llms.txt

AI crawler 不一定能有效判讀完整頁面版型，因此新增 `llms.txt` 作為簡短可信的網站摘要。這不是取代 HTML，而是提供另一個更直接的入口。

### 維護 ATS 友善 CV

CV 採 Markdown 作為主要來源，再輸出 PDF。Markdown 保留一欄式線性內容，PDF 也避免雙欄與表格，讓 ATS、純文字抽取工具與人工複製貼上都能依序讀到姓名、聯絡方式、摘要、技能、工作經歷、專案、學歷、獎項、訓練、演講與社群經歷。

PDF 使用 XeLaTeX 產生，搭配 `DejaVu Sans`、`Noto Sans CJK TC` 與關閉常見 ligature / hyphenation 的 LaTeX header，原因是部分 HTML-to-PDF 工具雖然能產生可選取 PDF，但抽出的中文可能變成 CJK 相容部件，英文也可能出現 `fi` / `fl` ligature，對 ATS 不友善。

### 分類經歷預設精選項目

經歷項目很多，直接全部展開會降低掃讀效率。新版設計依 `categories` 產生分類區塊，每類預設顯示 `show_when_collapsed=true` 的精選項目；若該分類沒有指定收合項目，則顯示精選或前三筆，並用「展開更多某分類」讓訪客查看完整清單。收合狀態不使用固定高度裁切，避免手機版長文字與展開按鈕重疊。

## 已知限制與待處理事項

- 目前沒有 HTML validator 或 Lighthouse CI；已有 `scripts/validate-site.js` 做基本資料與一致性檢查。
- 目前沒有圖片壓縮流程，`images/avatar2.png` 可視需求另行壓縮或產生 WebP/AVIF。
- 友情連結與活動經歷需要定期人工維護。
- `data/experiences.json` 目前需人工維護，後續可視需要加入管理介面、CSV 轉檔腳本或更完整的 schema 驗證。
- CV PDF 目前由本機工具手動產生，需安裝 `pandoc`、`xelatex`、Noto CJK 字型與 `pdftotext`；目前沒有 CI 自動產 PDF 或自動比對抽取文字。
- 若未來新增文章、專案集或多頁內容，可再評估是否導入 Astro 等靜態網站產生器。
- 若部署環境有安全 header 需求，需在 hosting 平台或伺服器設定中處理。

## 維護檢查清單

修改公開資料時，請同步確認：

- `index.html` 內容與 metadata 是否一致
- JSON-LD 是否仍為合法 JSON
- `data/experiences.json` 是否仍為合法 JSON
- `scripts/validate-site.js` 是否通過
- `llms.txt` 是否需要更新
- `file/cv-zh.md`、`file/cv-en.md` 與對應 PDF 是否需要同步更新
- CV PDF 是否可用 `pdftotext` 抽出正確文字與順序
- `PROJECT.md` 是否需要更新
- `sitemap.xml` 的 `lastmod` 是否需要更新
- 手機與桌面版面是否仍可讀
