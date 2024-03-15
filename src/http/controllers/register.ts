import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistError } from '@/services/errors/user-already-exist-error'
import { RegisterUseCase } from '@/services/register'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const registerBodySchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string().min(6),
})

export const register = async (
  request: FastifyRequest,
  response: FastifyReply,
) => {
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const userRepository = new PrismaUsersRepository()
    const userService = new RegisterUseCase(userRepository)

    await userService.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistError)
      return response.status(409).send({ message: err.message })

    throw err
  }

  return response.status(201).send()
}
