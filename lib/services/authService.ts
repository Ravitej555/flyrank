export interface UserProfile {
  id: string;
  email: string;
  name: string;
  isGuest: boolean;
  avatarUrl?: string;
}

const AUTH_STORAGE_KEY = 'flyrank_auth_user_v1';

export const DEMO_USER: UserProfile = {
  id: 'usr_demo_101',
  email: 'traveler@flyrank.ai',
  name: 'Alex Traveler',
  isGuest: false,
};

export function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function loginUser(email: string, name?: string): UserProfile {
  const profile: UserProfile = {
    id: `usr_${Date.now()}`,
    email: email.trim().toLowerCase(),
    name: name?.trim() || email.split('@')[0],
    isGuest: false,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
  }
  return profile;
}

export function loginAsDemo(): UserProfile {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USER));
  }
  return DEMO_USER;
}

export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}
