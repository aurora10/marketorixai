// src/types/gtag.d.ts

declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
  }
}

// This export is necessary to make the file a module
export {};

