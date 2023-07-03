export interface UserData {
  name: string;
  profile: string;
}

export interface ChatData {
  userData: UserData;
  videoNickname: string;
  content: string;
  time: string;
  id: string;
}
