const urls = (() => {
  const baseUrl = "https://coggle.it/api/1";

  return {
    folders: `${baseUrl}/folders`,
    diagramsOfFolder(id: string) {
      return `${baseUrl}/diagrams?folder=${id}`;
    },
    nodesOfDiagram(id: string) {
      return `${baseUrl}/diagrams/${id}/nodes`;
    },
  };
})();

interface IEntity extends Record<string, any> {
  _id: string;
}

export async function fetchAllUserDiagrams() {
  const folders = await fetchAllUserFolders();

  const diagrams = (
    await Promise.all(
      folders.map((node) => fetchDiagramsOfFolder(getEntityId(node)))
    )
  ).flat();

  return (
    await Promise.all(
      diagrams.map((node) => fetchNodesOfDiagram(getEntityId(node)))
    )
  ).flat();
}

function fetchAllUserFolders() {
  return fetchEntities(urls.folders);
}

function fetchDiagramsOfFolder(id: string) {
  return fetchEntities(urls.diagramsOfFolder(id));
}

export function fetchNodesOfDiagram(id: string) {
  return fetchEntities(urls.nodesOfDiagram(id));
}

function fetchEntities(url: string): Promise<IEntity[]> {
  const options = { credentials: "include" } as const;

  return fetch(url, options)
    .then((response) => response.json())
    .catch(() => alert("Ошибка по пути: " + url));
}

function getEntityId(entity: IEntity): string {
  const key = "_id";

  if (key in entity) {
    return String(entity[key]);
  }

  throw new Error(`В сущности не найдено поле ${key}`);
}
