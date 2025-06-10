/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_MICROSOFT_CLIENT_ID: string;
  readonly VITE_AGORA_APP_ID: string;
  readonly VITE_ENABLE_OAUTH: string;
  readonly VITE_ENABLE_VIDEO_CALLS: string;
  readonly VITE_ENABLE_PAYMENTS: string;
  readonly VITE_DEBUG_MODE: string;
  readonly VITE_MOCK_AUTH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
