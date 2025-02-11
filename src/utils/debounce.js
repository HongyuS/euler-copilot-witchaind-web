// 防抖
export function debounce(func, wait = 1000) {
  let timeout = null;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
