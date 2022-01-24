import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateTransferError {
  export class SenderNotFound extends AppError {
    constructor() {
      super('Sender not found', 404);
    }
  
  }
  export class ToNotFound extends AppError {
    constructor() {
      super('Receiver not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds to complete transfer', 400);
    }
  }
}
