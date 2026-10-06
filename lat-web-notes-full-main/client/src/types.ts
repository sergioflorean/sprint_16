export type CurrentUser = {
  userId: string;
  email: string;
  name: string;
};

export type Note = {
  _id: string;
  title: string;
  body: string;
  owner: string;
  createdAt: string;
};
