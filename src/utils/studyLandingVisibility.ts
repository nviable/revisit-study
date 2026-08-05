import { GlobalConfig } from '../parser/types';

/**
 * When true, studies marked `test: true` remain visible on the landing page.
 * Playwright sets VITE_SHOW_TEST_STUDIES so e2e can open demo/example studies.
 */
export function shouldShowTestStudiesOnLanding(): boolean {
  return import.meta.env.VITE_SHOW_TEST_STUDIES === 'true';
}

/**
 * Determines whether a study should appear on the landing page.
 * Studies marked `test: true` in global.json are admin-only in production,
 * unless showTestStudies is enabled (e.g. Playwright).
 * On cloud storage, non-admins also need dataSharingEnabled.
 */
export function isStudyVisibleOnLanding({
  configName,
  globalConfig,
  isAdmin,
  dataSharingEnabled,
  isCloudStorage,
  showTestStudies = false,
}: {
  configName: string;
  globalConfig: GlobalConfig;
  isAdmin: boolean;
  dataSharingEnabled?: boolean;
  isCloudStorage: boolean;
  showTestStudies?: boolean;
}): boolean {
  const isTestConfig = !!globalConfig.configs[configName]?.test;
  if (isTestConfig && !isAdmin && !showTestStudies) {
    return false;
  }

  if (isAdmin) {
    return true;
  }

  if (isCloudStorage) {
    return !!dataSharingEnabled;
  }

  return true;
}
