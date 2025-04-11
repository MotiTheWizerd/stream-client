// Auto-generated test users based on Prisma schema

interface User {
  id: string;
  username?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  lastActive?: Date;
}

export const testUsers: User[] = [
  { id: "c84a269e-a5ea-40f5-9e26-7e9b5e0794b5" , username : "user 1"},
  { id: "121e5205-b149-429c-88c6-117063c836e9",  username : "user 2"}, 
  { id: "66bf5a52-3dc2-43d0-96ae-a663eac27cfa",  username : "user 3"}
];
