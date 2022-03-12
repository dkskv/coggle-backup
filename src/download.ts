export default function download(data: string, name: string, type?: string) {
    const file = new Blob([data], { type });
  
    const a = document.createElement("a");
    const url = URL.createObjectURL(file);
  
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
  
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }
  