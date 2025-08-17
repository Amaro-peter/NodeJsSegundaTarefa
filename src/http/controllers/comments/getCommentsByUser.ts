import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { PrismaCommentsRepository } from '@/repositories/prisma/prisma-comments-repository';
import { GetCommentsByUserUseCase } from '@/use-cases/comments/get-comments-by-user-use-case';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

export async function getCommentsByUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getCommentsByUserParamsSchema = z.object({
    userId: z.string().uuid(),
  });

  const { userId } = getCommentsByUserParamsSchema.parse(request.params);

  try {
    const commentsRepository = new PrismaCommentsRepository();
    const getCommentsByUserUseCase = new GetCommentsByUserUseCase(
      commentsRepository
    );

    const { comments } = await getCommentsByUserUseCase.execute({ userId });

    return reply.status(200).send(comments);
  } catch (err) {
    if(err instanceof ResourceNotFoundError) {
        return reply.status(404).send({ message: err.message ?? 'Recurso não encontrado.' });
    }

    throw err;
  }
}