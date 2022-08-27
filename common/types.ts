export type changedUser = {
  username: string;
  name:
    | {
        didChange: boolean;
        newValue: string;
        oldValue: string;
      }
    | undefined;
  biography:
    | {
        didChange: boolean;
        newValue: string;
        oldValue: string;
      }
    | undefined;
  avatar:
    | {
        didChange: boolean;
        newValue: string;
        oldValue: string;
      }
    | undefined;
  isPrivate:
    | {
        didChange: boolean;
        newValue: string;
        oldValue: string;
      }
    | undefined;
  followedByCount:
    | {
        didChange: boolean;
        newValue: string;
        oldValue: string;
      }
    | undefined;
  followingCount:
    | {
        didChange: boolean;
        newValue: string;
        oldValue: string;
      }
    | undefined;
  postsCount:
    | {
        didChange: boolean;
        newValue: string;
        oldValue: string;
      }
    | undefined;
  timestamp: number;
  id: string;
};

export type getUser = Promise<{
  username: string;
  data: changedUser[];
  following: string[];
}>;

export interface NotificationSettings {
  [key: string]: boolean;
  newAccountNameChange: boolean;
  newPosts: boolean;
  newFollowers: boolean;
  startedFollowingNewUsers: boolean;
  newBiography: boolean;
  newAvatar: boolean;
  newAccountPrivacyChange: boolean;
}
export interface USER {
  avatar: string;
  name: string;
  password: string;
  username: string;
  email: string;
  gender: string;
  emailVerified: boolean;
  instagramVerified: boolean;
  media: any[];
  followLimit: number;
  followingCount: number;
  following: { instagramUser: INSTAGRAM_USER; timestamp: string }[];
  followingHistory: { instagramUser: INSTAGRAM_USER; timestamp: string }[];
  isBanned: boolean;
  banReason: string;
  reports: REPORT[];
  instagramProfile: INSTAGRAM_USER;
  isAdmin: ADMIN;
  isOwner: OWNER;
  notifyEmail: boolean;
  notifications: NotificationSettings;
  timestamp: string;
}

export interface INSTAGRAM_USER {
  name: string;
  username: string;
  biography:     { recent: boolean; text: string; externalUrls: string[]; timestamp: string }[];
  avatars: { url: string; recent: boolean; timestamp: string }[];
  isPrivate: boolean;
  media: { type: {[key: string]: any; type: string; url: string; timestamp: string }}[];
  postsCount: number;
  followingCount: number;
  followedByCount: number;
  isBanned: boolean;
  isCollect: boolean;
  recentlyAdded: boolean;
  followedBy: { user: USER; timestamp: string }[];
}

export interface REPORT {
  userInfo: USER;
  reason: string;
  description: string;
  accountReported: INSTAGRAM_USER;
  accountReportedUsername: string;
  readStatus: boolean;
  timestamp: string;
}

export interface ADMIN {
  userInfo: USER;
  isAdmin: boolean;
  adminPermissions: {
    banUser: boolean;
    unbanUser: boolean;
    banInstagramUser: boolean;
    unbanInstagramUser: boolean;
  };
}
export interface OWNER {
  userInfo: USER;
  isAdmin: boolean;
  isOwner: boolean;
  ownerPermissions: {
    changeSelfUsername: boolean;
    deleteUser: boolean;
    deleteInstagramUser: boolean;
    deleteInstagramUserMedia: boolean;
  };
}
