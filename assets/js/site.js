const DATA_URL = "/data/experiences.json";

const fallbackData = {
  settings: {
    community_expand_label: "展開更多",
    community_collapse_label: "收合",
  },
  categories: [
    { key: "education", label: "學歷", sort_order: 10 },
    { key: "honor", label: "獎項、證照與榮譽", sort_order: 20 },
    { key: "work", label: "工作經歷", sort_order: 30 },
    { key: "competition", label: "比賽經歷", sort_order: 40 },
    { key: "training", label: "課程與訓練", sort_order: 50 },
    { key: "project", label: "專案", sort_order: 60 },
    { key: "talk", label: "演講", sort_order: 70 },
    { key: "community", label: "社群與研討會參與", sort_order: 80 },
  ],
  experiences: [
    {
      section: "work",
      title: "NCSE Network",
      role: "Founder",
      date_label: "2022/06 ~ present",
      description: "從零建置並維護 NCSE Network 的運算、網路與服務基礎架構。",
      sort_order: 3003,
    },
    {
      section: "work",
      title: "諾科雲有限公司",
      role: "Network Engineer",
      date_label: "2025/10 ~ present",
      description: "協助網路服務專案、資料統整、架構改善與故障排查。",
      sort_order: 3006,
    },
    {
      section: "project",
      title: "LearnAI - 多使用者 AI 學習輔助平台",
      url: "https://github.com/tw-yuan/niu-code-1142-project",
      case_rank: 1,
      case_study: {
        problem: "學習者需要能把課程資料、文件與提問流程集中在同一個 AI 輔助環境。",
        role: "負責規劃產品流程、前後端整合、AI 功能串接與資料處理流程。",
        stack: "AI application, RAG, document processing, web application",
        outcome: "將 AI 問答、文件理解與多使用者學習情境整理成可操作的平台型專案。",
      },
      is_featured: true,
      featured_rank: 1,
      sort_order: 6028,
    },
    {
      section: "project",
      title: "bgpq3 Web API",
      url: "https://github.com/tw-yuan/bgpq3-web-api",
      case_rank: 2,
      case_study: {
        problem: "網路維運工具若只能在命令列使用，不利於串接內部系統或自動化流程。",
        role: "把 bgpq3 工具服務化，設計 API 介面供其他流程呼叫。",
        stack: "BGP tooling, Web API, network automation",
        outcome: "讓路由與 prefix-list 產生流程能以 API 方式被重複使用。",
      },
      is_featured: true,
      featured_rank: 2,
      sort_order: 6034,
    },
    {
      section: "talk",
      title: "SITCON 學生計算機年會一小時玩程式",
      role: "總總召、總召、助教",
      is_featured: true,
      featured_rank: 1,
      sort_order: 440,
    },
    {
      section: "competition",
      title: "SCINT 北臺灣學生資訊社群聯合程式競賽",
      role: "總召",
      is_featured: true,
      featured_rank: 2,
      sort_order: 420,
    },
    {
      section: "talk",
      title: "AIS3 幹部訓練 2025",
      role: "講師",
      date_label: "2025",
      is_featured: true,
      featured_rank: 3,
      sort_order: 450,
    },
  ],
};

function byNumber(field) {
  return (a, b) => Number(a[field] || 0) - Number(b[field] || 0);
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function appendText(parent, text) {
  parent.appendChild(document.createTextNode(text));
}

function makeActivityLabel(item) {
  const details = [item.date_label, item.role].filter(Boolean).join(" · ");
  return details ? `${item.title} — ${details}` : item.title;
}

function makeCategoryItem(item, index) {
  const li = document.createElement("li");
  if (index >= 3) {
    li.className = "fade-preview-item";
  }
  appendText(li, makeActivityLabel(item));
  if (item.url) {
    appendText(li, " ");
    const link = document.createElement("a");
    link.href = item.url;
    link.rel = "noopener noreferrer";
    link.className = "item-link";
    appendText(link, "查看連結");
    li.appendChild(link);
  }
  return li;
}

function appendDefinition(parent, term, description) {
  const row = document.createElement("div");
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  appendText(dt, term);
  appendText(dd, description);
  row.append(dt, dd);
  parent.appendChild(row);
}

function renderProjectCases(items, settings) {
  const container = document.querySelector("#project-case-list");
  if (!container) return;

  const limit = Number(settings.featured_project_count || 4);
  const projects = items
    .filter((item) => item.section === "project" && item.case_study)
    .sort(byNumber("case_rank"))
    .slice(0, limit);

  if (projects.length === 0) return;

  clearElement(container);
  projects.forEach((item) => {
    const article = document.createElement("article");
    article.className = "case-card";

    const header = document.createElement("div");
    header.className = "case-card-header";
    const label = document.createElement("p");
    label.className = "card-label";
    appendText(label, item.case_study.stack || "Project");
    const title = document.createElement("h3");
    appendText(title, item.title);
    header.append(label, title);

    const points = document.createElement("dl");
    points.className = "case-points";
    appendDefinition(points, "問題", item.case_study.problem || "");
    appendDefinition(points, "角色", item.case_study.role || "");
    appendDefinition(points, "技術", item.case_study.stack || "");
    appendDefinition(points, "成果", item.case_study.outcome || "");

    article.append(header, points);
    if (item.url) {
      const link = document.createElement("a");
      link.className = "text-link";
      link.href = item.url;
      link.rel = "noopener noreferrer";
      appendText(link, "查看專案");
      article.appendChild(link);
    }
    container.appendChild(article);
  });
}

function renderWork(items) {
  const list = document.querySelector("#work-list");
  if (!list) return;

  clearElement(list);
  items
    .filter((item) => item.section === "work")
    .sort(byNumber("sort_order"))
    .forEach((item) => {
      const li = document.createElement("li");

      const meta = document.createElement("div");
      meta.className = "timeline-meta";
      appendText(meta, item.date_label || "");

      const body = document.createElement("div");
      const title = document.createElement("h3");
      appendText(title, item.title);
      const role = document.createElement("p");
      role.className = "role";
      appendText(role, item.role || "");
      const description = document.createElement("p");
      appendText(description, item.description || "");

      body.append(title, role, description);
      li.append(meta, body);
      list.appendChild(li);
    });
}

function renderCategoryItems(list, items) {
  clearElement(list);
  items.forEach((item, index) => {
    list.appendChild(makeCategoryItem(item, index));
  });
}

function renderCategories(items, categories, settings) {
  const container = document.querySelector("#category-list");
  if (!container) return;
  clearElement(container);

  const expandLabel = settings.community_expand_label || "展開更多";
  const collapseLabel = settings.community_collapse_label || "收合";
  const orderedCategories = (categories || [])
    .filter((category) => category.key !== "work")
    .sort(byNumber("sort_order"));

  orderedCategories.forEach((category) => {
    const categoryItems = items
      .filter((item) => item.section === category.key)
      .sort(byNumber("sort_order"));
    const section = document.createElement("section");
    section.className = "category-panel";
    section.dataset.expanded = "false";
    section.setAttribute("aria-labelledby", `${category.key}-title`);

    const title = document.createElement("h3");
    title.id = `${category.key}-title`;
    appendText(title, category.label);

    const list = document.createElement("ul");
    list.className = "activity-list compact-list";
    list.id = `${category.key}-items`;

    if (categoryItems.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      appendText(empty, "資料整理中。");
      section.append(title, empty);
      container.appendChild(section);
      return;
    }

    let expanded = false;
    const featured = categoryItems
      .filter((item) => item.is_featured)
      .sort(byNumber("featured_rank"));
    const collapsedItems = featured.length > 0 ? featured : categoryItems.slice(0, 3);
    const update = () => {
      section.dataset.expanded = String(expanded);
      renderCategoryItems(list, expanded ? categoryItems : collapsedItems);
      if (toggle) {
        toggle.setAttribute("aria-expanded", String(expanded));
        toggle.textContent = expanded
          ? `${collapseLabel}${category.label}`
          : `${expandLabel}${category.label}`;
      }
    };

    const toggle = document.createElement("button");
    toggle.className = "expand-button";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", list.id);
    toggle.addEventListener("click", () => {
      expanded = !expanded;
      update();
    });

    section.append(title, list);
    if (categoryItems.length > collapsedItems.length) {
      section.classList.add("is-collapsible");
      section.appendChild(toggle);
    }
    container.appendChild(section);
    update();
  });

  if (orderedCategories.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    appendText(empty, "經歷資料整理中。");
    container.appendChild(empty);
  }
}

async function loadData() {
  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Unable to load ${DATA_URL}: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(error);
    return fallbackData;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const data = await loadData();
  renderWork(data.experiences || []);
  renderProjectCases(data.experiences || [], data.settings || {});
  renderCategories(data.experiences || [], data.categories || [], data.settings || {});
});
