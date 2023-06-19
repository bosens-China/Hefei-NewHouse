declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // 邮箱相关
      EMAIL_ACCOUNT?: string;
      EMAIL_AUTHORIZATION_CODE?: string;
    }
  }
}

export {};
