// global.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    PORT:number
    // Add any other environment variables you're using here
  }
}
