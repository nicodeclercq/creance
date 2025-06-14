export type User = {
  _id: string;
  name: string;
  avatar: string;
  share: {
    adult: number;
    children: number;
  };
  updatedAt: Date;
};
