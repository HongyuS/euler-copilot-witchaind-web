import defaultSettings from '@/settings';
import { ThemeEnum } from '@/enums/ThemeEnum';
import Color from 'color';

type SettingsValue = boolean | string;

export const useSettingsStore = defineStore('setting', () => {
  // 是否固定头部
  const fixedHeader = useStorage<boolean>('fixedHeader', defaultSettings.fixedHeader);
  // 主题颜色
  const themeColor = useStorage<string>('themeColor', defaultSettings.themeColor);

  // 是否开启水印
  const watermarkEnabled = useStorage<boolean>(
    'watermarkEnabled',
    defaultSettings.watermarkEnabled
  );

  const settingsMap: Record<string, Ref<SettingsValue>> = {
    fixedHeader,
    watermarkEnabled
  };

  function changeSetting({ key, value }: { key: string; value: SettingsValue }) {
    const setting = settingsMap[key];
    if (setting) {
      setting.value = value;
    }
  }

  /**
   * 切换主题颜色
   *
   * @param color 主题颜色
   *
   */
  function changeThemeColor(color: string) {
    themeColor.value = color;
  }

  return {
    fixedHeader,
    themeColor,
    watermarkEnabled,
    changeSetting,
    changeThemeColor
  };
});
