export interface WithTimeStampsServer {
  createdAt?: Date
  updatedAt?: Date
}

export interface WithTimeStamps {
  createdAt?: string | undefined
  updatedAt?: string | undefined
}
export interface WithIdClient {
  id: string
}
