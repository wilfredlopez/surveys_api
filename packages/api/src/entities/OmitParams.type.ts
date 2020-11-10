export type OmitParams<T extends {}> = Omit<
  T,
  "id" | "_id" | "createdAt" | "updatedAt"
>;
