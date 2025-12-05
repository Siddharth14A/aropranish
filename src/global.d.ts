export {};

declare global {
  interface Window {
    currentUserId?: string; // UUID string
  }
}
