export interface BannerItem {
  id: number;
  title: string;
  subTitle: string;
  paragraph: string;
  enableButtons: boolean;
  numberOfButtons: 1 | 2;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
  desktopImage: File | null;
  mobileImage: File | null;
}

export interface Album {
  id: number;
  imageUrl: string;
  title: string;
  images?: string[];
}

export interface NewsPoster {
  id: number;
  imageUrl: string;
  title: string;
  date: string;
  content?: string;
  images?: string[];
}
