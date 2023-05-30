declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production';

      // 邮箱相关
      EMAIL_ACCOUNT?: string;
      EMAIL_AUTHORIZATION_CODE?: string;
      MAILBOX?: string;
    }
  }
}

export {};
