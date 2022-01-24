import { inject, injectable } from "tsyringe";

import { OperationType } from "../../entities/Statement";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ sender_id, to_id, amount, description }: ICreateTransferDTO) {
    const senderUser = await this.usersRepository.findById(sender_id);
    const toUser = await this.usersRepository.findById(to_id);

    if (!senderUser) {
      throw new CreateTransferError.SenderNotFound();
    }

    if (!toUser) {
      throw new CreateTransferError.ToNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (balance < amount) {
      throw new CreateTransferError.InsufficientFunds();
    }

    await this.statementsRepository.create({
      user_id: sender_id,
      type: OperationType.WITHDRAW,
      amount: amount,
      description,
    });


    const transferOperation = await this.statementsRepository.create({
      user_id: to_id,
      sender_id,
      amount,
      description,
      type: OperationType.TRANSFER 
    });
 
    return transferOperation;
  }
}
