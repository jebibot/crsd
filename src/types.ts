export type Bj = {
  name: string;
  bgColor: string;
  textColor: string;
  youtubeHandle: string;
  youtubeId: string;
  bjId: string;
  noticeBoard: string;
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
