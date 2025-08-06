/**
 * 读取上传的JSON文件内容
 * @param file
 * @returns 解析后的JSON数据（自动推断类型或可指定泛型）
 * @throws 当文件无效或JSON解析失败时抛出错误
 */
export async function readJsonFile<T = unknown>(file: File): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (!file) {
      return alert('No file selected');
    }

    // 2. 验证文件类型（宽松校验）
    const isJsonFile = (
        file.type === 'application/json' ||
        file.name.endsWith('.json') ||
        file.type.startsWith('text/') // 兼容某些浏览器可能不返回准确的JSON类型
    );
    if (!isJsonFile) {
      return alert('Please upload a JSON file');
    }

    // 3. 创建文件阅读器
    const reader = new FileReader();

    // 4. 处理读取完成事件
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result !== 'string') {
          return alert('File content is not text');
        }
        const parsedData = JSON.parse(result) as T;
        resolve(parsedData);
      } catch (err) {
        return alert(`Failed to parse JSON: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    // 5. 处理错误事件
    reader.onerror = () => {
      return alert(`File read error: ${reader.error?.message || 'Unknown error'}`);
    };

    // 6. 开始读取
    reader.readAsText(file);
  });
}

export class RucanDto {
  allRoads!: {
    "osm_id": string
    "name": string | null
    "highway": string | null
    "motorcar": string | null
    "way": string
  }[]
  allNodes!: {
    "id": string
    "lon": number
    "lat": number
    "tags": null
  }[]
  relation!: {
    "id": string
    "nodes": string[]
    "tags": number
  }[]
  startPoint!: {
    "lon": number
    "lat": number
  }
  endPoint!: {
    "lon": number
    "lat": number
  }
  startTime!: number
}

export class ChucanDto {
  roads!: {
    "osm_id": string
    "way": string
  }[]
  nodes!: {
    "id": string,
    "lon": number,
    "lat": number,
    "time": [number, number]
  }[]
}
