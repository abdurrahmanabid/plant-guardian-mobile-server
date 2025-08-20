// global.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    PORT:number,
    SALT:string,
    PREDICT_SITE:string
    // Add any other environment variables you're using here
  }
}
