export type Bj = {
  name: string;
  bgColor: string;
  textColor: string;
  youtubeHandle: string;
  youtubeId: string;
  bjId: string;
  noticeBoard: string;
  private?: boolean;
  banner: string;
};

export type Channel = {
  name: string;
  textColor: string;
  youtubeHandle: string;
  youtubeId: string;
};

export type Notice = {
  no: string;
  title: string;
  date: Date;
  summary: string;
};

export type Video = {
  type: string;
  title: string;
  thumbnail: string;
  date: Date;
  url: string;
  mobileUrl?: string;
  uploader: Bj | Channel;
};

export type Post = {
  bbs_no: number;
  user_id: string;
  reg_date: string;
  title_no: number;
  title_name: string;
  content: string | { summary: string };
};
