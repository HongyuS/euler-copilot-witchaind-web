import { useAppStore } from '@/store';

export function downloadFun(url: string) {
  const appStore = useAppStore();
  const { parentToken } = storeToRefs(appStore);
  fetch(url, {
    headers: {
      Authorization: parentToken.value
        ? `Bearer ${parentToken.value}`
        : `Bearer 99db1ba8eb0c9bb67e3e45dccfac8e60`, // 添加 Authorization 头
    },
  })
    .then((response) => {
      // 提取 Content-Disposition 头部
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = 'default-filename';

      // 解析文件名（处理编码及格式）
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = decodeURIComponent(fileNameMatch[1].replace(/"/g, ''));
        }
      }
      return response.blob().then((blob) => ({ blob, fileName }));
    })
    .then(({ blob, fileName }) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      a.style.display = 'none';
      a.click();
      URL.revokeObjectURL(a.href);
    })
    .catch((error) => console.error('下载失败:', error));
}
