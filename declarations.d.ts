// This file manually defines the 'process' global for TypeScript validation.
// This ensures "process.env.API_KEY" and "process.cwd()" work in both
// client-side files (checked by tsc) and vite config (running in Node).

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY?: string;
    [key: string]: string | undefined;
  }
}
