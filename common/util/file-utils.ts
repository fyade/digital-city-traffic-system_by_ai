import * as fs from "node:fs";

/**
 * 获取某文件夹下所有文件
 * @param directoryPath
 * @param ifIncludeSubFolder
 */
export function getAllFiles(
  directoryPath: string,
  {
    ifIncludeSubFolder = true,
  }: {
    ifIncludeSubFolder?: boolean;
  } = {},
) {
  const ret: string[] = [];
  _(directoryPath);
  return ret;

  function _(directoryPath: string) {
    const files: string[] = fs.readdirSync(directoryPath);
    if (files.length > 0) {
      for (const path of files) {
        if (path.includes(".")) {
          ret.push(`${directoryPath}/${path}`);
        } else if (ifIncludeSubFolder) {
          _(`${directoryPath}/${path}`);
        }
      }
    }
  }
}
