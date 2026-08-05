import { GlobalConfig } from '../parser/types';

/**
 * Determines whether a study should appear on the landing page.
 * Studies marked `test: true` in global.json are admin-only.
 * On cloud storage, non-admins also need dataSharingEnabled.
 */
export function isStudyVisibleOnLanding({
  configName,
  globalConfig,
  isAdmin,
  dataSharingEnabled,
  isCloudStorage,
}: {
  configName: string;
  globalConfig: GlobalConfig;
  isAdmin: boolean;
  dataSharingEnabled?: boolean;
  isCloudStorage: boolean;
}): boolean {
  const isTestConfig = !!globalConfig.configs[configName]?.test;
  if (isTestConfig && !isAdmin) {
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
