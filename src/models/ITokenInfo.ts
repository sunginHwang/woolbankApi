export type AuthType = 'user' | 'share' | 'none';
export interface ITokenInfo {
  userId: number;
  authType: AuthType;
  iat: number;
  exp: number;
}
