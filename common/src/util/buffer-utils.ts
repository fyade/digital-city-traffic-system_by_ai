import { isBrowser } from './base.js';

/**
 * 字符串转 Buffer
 */
export const fromString = (() => {
  if (isBrowser) {
    return (str: string, encoding: 'utf8' | 'base64' | 'hex' | 'ascii' = 'utf8'): Buffer | Uint8Array => {
      if (encoding === 'utf8' || encoding === 'ascii') {
        return new TextEncoder().encode(str);
      } else if (encoding === 'base64') {
        const binaryString = atob(str);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      } else if (encoding === 'hex') {
        const bytes = new Uint8Array(str.length / 2);
        for (let i = 0; i < str.length; i += 2) {
          bytes[i / 2] = parseInt(str.substring(i, i + 2), 16);
        }
        return bytes;
      } else {
        throw new Error(`Unsupported encoding in browser: ${encoding}`);
      }
    };
  } else {
    return (str: string, encoding: 'utf8' | 'base64' | 'hex' | 'ascii' = 'utf8'): Buffer | Uint8Array => {
      return Buffer.from(str, encoding);
    };
  }
})();

/**
 * Buffer 转字符串
 */
export const toString = (() => {
  if (isBrowser) {
    return (buffer: Buffer | Uint8Array, encoding: 'utf8' | 'base64' | 'hex' | 'ascii' = 'utf8'): string => {
      if (encoding === 'utf8' || encoding === 'ascii') {
        return new TextDecoder().decode(buffer);
      } else if (encoding === 'base64') {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.length;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      } else if (encoding === 'hex') {
        return Array.from(buffer)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      } else {
        throw new Error(`Unsupported encoding in browser: ${encoding}`);
      }
    };
  } else {
    return (buffer: Buffer | Uint8Array, encoding: 'utf8' | 'base64' | 'hex' | 'ascii' = 'utf8'): string => {
      if (Buffer.isBuffer(buffer)) {
        return buffer.toString(encoding);
      } else {
        return Buffer.from(buffer).toString(encoding);
      }
    };
  }
})();

/**
 * arrayBuffer 转 base64url
 */
export const arrayBufferToBase64url = (() => {
  if (isBrowser) {
    return (buffer: ArrayBuffer): string => {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);
      return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };
  } else {
    return (buffer: ArrayBuffer): string => {
      const base64 = Buffer.from(buffer).toString('base64');
      return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };
  }
})();

/**
 * base64url 转 arrayBuffer
 */
export const base64urlToArrayBuffer = (() => {
  if (isBrowser) {
    return (base64url: string): ArrayBuffer => {
      const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4 ? '='.repeat(4 - (base64.length % 4)) : '';
      const binary = atob(base64 + pad);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes.buffer;
    };
  } else {
    return (base64url: string): ArrayBuffer => {
      const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4 ? '='.repeat(4 - (base64.length % 4)) : '';
      const buf = Buffer.from(base64 + pad, 'base64');
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    };
  }
})();
