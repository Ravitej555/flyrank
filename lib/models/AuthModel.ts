import { UserProfile, getCurrentUser, loginUser, loginAsDemo, logoutUser } from '../services/authService';

export class AuthModel {
  static getSession(): UserProfile | null {
    return getCurrentUser();
  }

  static login(email: string, name?: string): UserProfile {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    return loginUser(trimmed, name);
  }

  static loginDemo(): UserProfile {
    return loginAsDemo();
  }

  static logout(): void {
    logoutUser();
  }
}
