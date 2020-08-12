export class ApiError extends Error {
  status: number;
  error: string;
  messages: string[];

  constructor(status: number, error: string, ...messages: string[]) {
    super(error);
    this.status = status;
    this.error = error;
    this.messages = messages;
  }
}
