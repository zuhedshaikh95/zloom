export class CustomException extends Error {
  status: number | undefined;

  constructor(message: string, status: number | undefined = 500) {
    super(message);
    this.status = status;
  }
}
