// In-memory session store for cross-page document passing

let activeSessionFile: File | null = null;

export const FileSession = {
  setFile: (file: File | null) => {
    activeSessionFile = file;
  },
  getFile: (): File | null => {
    return activeSessionFile;
  },
  consumeFile: (): File | null => {
    const f = activeSessionFile;
    return f;
  },
  clearFile: () => {
    activeSessionFile = null;
  },
};
