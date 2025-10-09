import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { StaticGuard } from '../../guard/static.guard';
import { Response, Request } from 'express';
import { serverConfig } from '@dcts/config';
import { createReadStream, statSync } from 'node:fs';

@Controller(serverConfig.currentConfig().staticRoot)
@UseGuards(StaticGuard)
export class StaticController {
  @Get('{/*filename}')
  async static(@Param('filename') filename: string[], @Res() res: Response, @Req() req: Request) {
    const filepath = serverConfig.currentConfig().file.uploadPath + '/' + filename.join('/');

    const ext = filepath.split('.').pop().toLowerCase();
    const mimeType = this.getMimeType(ext);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', 'inline');

    if (this.isVideoFile(ext)) {
      await this.handleVideoRequest(filepath, req, res);
    } else {
      createReadStream(filepath).pipe(res);
    }
  }

  private async handleVideoRequest(filepath: string, req: Request, res: Response) {
    try {
      const stat = statSync(filepath);
      const fileSize = stat.size;

      // 设置支持范围请求的头
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'no-cache');

      const range = req.headers.range;

      if (!range) {
        // 如果没有范围请求，返回整个文件
        res.setHeader('Content-Length', fileSize);
        createReadStream(filepath).pipe(res);
        return;
      }

      // 解析范围请求
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      // 验证范围有效性
      if (start >= fileSize || end >= fileSize) {
        res.setHeader('Content-Range', `bytes */${fileSize}`);
        return res.status(416).send('Requested range not satisfiable');
      }

      const chunksize = end - start + 1;

      // 设置范围响应头
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Length': chunksize,
      });

      // 创建文件流并返回指定范围
      const fileStream = createReadStream(filepath, {
        start,
        end,
        highWaterMark: 64 * 1024, // 64KB chunks for better performance
      });

      fileStream.pipe(res);

      // 处理流错误
      fileStream.on('error', (error) => {
        if (!res.headersSent) {
          res.status(500).send('Error reading file');
        }
      });
    } catch (error) {
      if (!res.headersSent) {
        res.status(500).send('Error processing video request');
      }
    }
  }

  private getMimeType(ext: string): string {
    const mimeTypes = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      pdf: 'application/pdf',
      mp4: 'video/mp4',
      webm: 'video/webm',
      ogg: 'video/ogg',
      mov: 'video/quicktime',
      avi: 'video/x-msvideo',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  private isVideoFile(ext: string): boolean {
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
    return videoExtensions.includes(ext);
  }
}
