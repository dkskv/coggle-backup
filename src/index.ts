import { fetchAllNodes } from "./CoggleApi";
import download from "./download";
import generateBackupName from "./generateBackupName";

async function backup() {
  const nodes = await fetchAllNodes();

  alert("Количество загруженных диаграмм: " + nodes.length);

  const fileName = generateBackupName() + ".json";

  download(JSON.stringify(nodes), fileName);
}

const btn = document.createElement("button");
document.body.append(btn);

const updateBtn = (loading: boolean) => {
  btn.innerHTML = loading ? "Загрузка..." : "Загрузить все диаграммы в JSON";
};

updateBtn(false);

btn.onclick = () => {
  updateBtn(true);

  backup().finally(() => {
    updateBtn(false);
  });
};
