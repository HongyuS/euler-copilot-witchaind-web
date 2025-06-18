import type { App } from 'vue';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';

const store = createPinia();
store.use(piniaPersist);

// 全局注册 store
export function setupStore(app: App<Element>) {
  app.use(store);
}

export * from './modules/app';
export * from './modules/permission';
export * from './modules/settings';
export { store };
