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
  following: string[]
}>;