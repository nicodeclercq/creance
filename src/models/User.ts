export type User = {
  _id: string;
  name: string;
  avatar?: string;
  share: {
    adults: number;
    children: number;
  };
  updatedAt: Date;
};
