import { UserRepository } from '@/repositories/users-repository'
import { hash } from 'bcrypt'
import { UserAlreadyExistError } from './errors/user-already-exist-error'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.userRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new UserAlreadyExistError()
    }

    const user = await this.userRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
