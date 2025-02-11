export function bytesToSize(bytes: number) {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed() + " " + sizes[i];
}

export function isMaxMemoryOut(bytes: number, moreNum: number) {
  let flag = false;
  if (Number((bytes / 1024 / 1024 / 1024).toFixed(3)) >= moreNum) {
    flag = true;
  }

  return flag;
}
