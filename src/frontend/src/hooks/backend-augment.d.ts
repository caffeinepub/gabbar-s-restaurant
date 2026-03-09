// Augments backendInterface and Backend class to include the access control
// initializer method injected by the authorization Motoko mixin at runtime.
import "../backend";

declare module "../backend" {
  interface backendInterface {
    _initializeAccessControlWithSecret(adminToken: string): Promise<void>;
  }
  interface Backend {
    _initializeAccessControlWithSecret(adminToken: string): Promise<void>;
  }
}
