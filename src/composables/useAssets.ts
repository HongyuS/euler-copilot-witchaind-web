/**
 * 静态资源处理组合式函数
 */
import { resolveAssetUrl } from '@/utils';

export function useAssets() {
  /**
   * 解析静态资源 URL
   * @param assetPath 静态资源路径
   * @returns 处理后的完整 URL
   */
  const resolveAsset = (assetPath: string): string => {
    return resolveAssetUrl(assetPath);
  };

  /**
   * 批量解析静态资源 URL
   * @param assetPaths 静态资源路径数组
   * @returns 处理后的完整 URL 数组
   */
  const resolveAssets = (assetPaths: string[]): string[] => {
    return assetPaths.map(path => resolveAssetUrl(path));
  };

  /**
   * 获取图片 URL
   * @param imagePath 图片路径
   * @returns 处理后的图片 URL
   */
  const getImageUrl = (imagePath: string): string => {
    return resolveAssetUrl(`/assets/images/${imagePath}`);
  };

  /**
   * 获取 SVG 图标 URL
   * @param iconPath SVG 图标路径
   * @returns 处理后的图标 URL
   */
  const getSvgUrl = (iconPath: string): string => {
    return resolveAssetUrl(`/assets/svg/${iconPath}`);
  };

  return {
    resolveAsset,
    resolveAssets,
    getImageUrl,
    getSvgUrl
  };
}
