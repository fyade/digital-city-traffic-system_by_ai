import * as fs from 'node:fs';
import * as path from 'node:path';
import { regularUtils } from '@dcts/common';

const dirIfExist = new Map<string, boolean>();

/**
 * 保存文件
 * @param directoryPath
 * @param fileName
 * @param fileBuffer
 * @param a
 */
export function saveFile(directoryPath: string, fileName: string, fileBuffer,
                         {
                           a = '',
                         }: {
                           a?: string
                         } = {},
) {
  if (!dirIfExist.get(directoryPath)) {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
    }
    dirIfExist.set(directoryPath, true);
  }
  let uploadPath = directoryPath;
  if (a) {
    const strings = regularUtils.splitStrByLine(a);
    for (const string of strings) {
      uploadPath += `/${string}/`;
      if (!dirIfExist.get(uploadPath)) {
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath);
        }
        dirIfExist.set(uploadPath, true);
      }
    }
  }
  const filePath = path.join(uploadPath, fileName);
  fs.writeFileSync(filePath, fileBuffer);
}
