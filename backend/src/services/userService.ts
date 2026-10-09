import { FullUserData, UserProfile } from '../types/index.js';
import { USERS_STORE } from '../data/users.js';
import { saveUserToDb } from '../db.js';

let activeUserId: string = 'user-history';

export class UserService {
  static getActiveUserId(): string {
    return activeUserId;
  }

  static setActiveUserId(id: string): boolean {
    if (USERS_STORE[id]) {
      activeUserId = id;
      return true;
    }
    return false;
  }

  static getAllUsers(): UserProfile[] {
    return Object.values(USERS_STORE).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      major: u.major,
      avatarInitials: u.avatarInitials,
      isNewUser: u.isNewUser,
      overallMastery: u.overallMastery,
      estimatedTheta: u.estimatedTheta,
      standardError: u.standardError,
      itemsAnswered: u.itemsAnswered,
      reliabilityScore: u.reliabilityScore,
      statusSummary: u.statusSummary,
      thetaVector: u.thetaVector || []
    }));
  }

  static getUser(id?: string): FullUserData {
    const targetId = id || activeUserId;
    const user = USERS_STORE[targetId];
    if (!user) {
      return USERS_STORE['user-history'];
    }
    return user;
  }

  static async saveUser(user: FullUserData, password?: string): Promise<void> {
    USERS_STORE[user.id] = user;
    await saveUserToDb(user, password);
  }
}
