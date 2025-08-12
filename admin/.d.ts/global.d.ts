declare global {
  interface Window {
    showOpenFilePicker: ({multiple}: { multiple: boolean }) => Promise<FileSystemFileHandle[]>;
    CESIUM_BASE_URL: string;
  }
}

export {}
