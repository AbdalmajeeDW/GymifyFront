export interface ApiResponse<T> {
  success: boolean;
  response: T;
  message?: string;

}



