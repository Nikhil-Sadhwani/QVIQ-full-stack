export {};

declare global {
  namespace ReactJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      REACT_APP_LINK_URL: string;
      REACT_APP_BASE_URL: string;
      REACT_APP_FIREBASE_API_KEY: string;
      REACT_APP_FIREBASE_AUTH_DOMAIN: string;
      REACT_APP_FIREBASE_PROJECT_ID: string;
      REACT_APP_FIREBASE_STORAGE_BUCKET: string;
      REACT_APP_FIREBASE_MESSAGING_SENDER_ID: string;
      REACT_APP_FIREBASE_APP_ID: string;
      REACT_APP_FIREBASE_Measurement_ID: string;
    }
  }
}
