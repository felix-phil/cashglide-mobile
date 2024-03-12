export interface IAuthState {
  status: "authenticated" | "unauthenticated" | "loading";
  token?: string;
  refreshToken?: string;
  id?: string;
  registrationCompleted?: boolean;
  primaryIdentifier?: string;
  username?: string;
  tokenExpiry?: String;
  refreshTokenExpiry?: String;
  onboardingPassed: boolean;
  pinExists: boolean;
}
export interface IFormState {
  [key: string]: { [key: string]: any };
}
