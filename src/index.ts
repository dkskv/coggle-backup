import { fetchAllNodes, fetchNodesOfDiagram } from "./CoggleApi";
import download from "./download";
import generateBackupName from "./generateBackupName";

const handleBackupButtonClick = (
  { currentTarget }: MouseEvent,
  backup: () => Promise<void>
) => {
  if (!(currentTarget instanceof HTMLButtonElement)) {
    return;
  }

  const defaultHtml = currentTarget.innerHTML;

  currentTarget.disabled = true;
  currentTarget.innerHTML = "Загрузка...";

  backup().finally(() => {
    currentTarget.disabled = false;
    currentTarget.innerHTML = defaultHtml;
  });
};

document.getElementById("backup-current")?.addEventListener("click", (e) => {
  handleBackupButtonClick(e, async () => {
    const path = window.location.pathname.split("/");
    path.shift();

    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    if (!tab.url) {
      alert("У расширения нет доступа к url текущей вкладки");
      return;
    }

    const match = tab.url.match(/.*\/diagram\/(.*?)\//);

    if (!match) {
      alert("Сначала откройте диаграмму. В URL не найден id диаграммы");

      return;
    }

    const nodes = await fetchNodesOfDiagram(match[1]);

    const fileName = generateBackupName() + ".json";

    download(JSON.stringify(nodes), fileName);
  });
});

document.getElementById("backup-all")?.addEventListener("click", (e) => {
  handleBackupButtonClick(e, async () => {
    const nodes = await fetchAllNodes();

    alert("Количество загруженных диаграмм: " + nodes.length);

    const fileName = generateBackupName() + ".json";

    download(JSON.stringify(nodes), fileName);
  });
});
