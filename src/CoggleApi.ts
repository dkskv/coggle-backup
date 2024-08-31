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

export async function fetchAllNodes() {
  const folders = await fetchFolders();

  const diagrams = (
    await fetchAll(fetchDiagramsOfFolder, folders.map(getEntityId))
  ).flat();

  return (
    await fetchAll(fetchNodesOfDiagram, diagrams.map(getEntityId))
  ).flat();
}

function fetchAll<T, U>(fetcher: (a: T) => Promise<U>, items: T[]) {
  return Promise.all(items.map(fetcher));
}

function fetchFolders() {
  return fetchFrom(urls.folders);
}

function fetchDiagramsOfFolder(id: string) {
  return fetchFrom(urls.diagramsOfFolder(id));
}

export function fetchNodesOfDiagram(id: string) {
  return fetchFrom(urls.nodesOfDiagram(id));
}

function fetchFrom(url: string) {
  const options = { credentials: "include" } as const;

  return fetch(url, options)
    .then((response) => response.json())
    .catch(() => alert("Ошибка по пути: " + url));
}

function getEntityId(node: Record<string, string>): string {
  const key = "_id";

  if (key in node) {
    return String(node[key]);
  }

  throw new Error(`В сущности не найдено поле ${key}`);
}
