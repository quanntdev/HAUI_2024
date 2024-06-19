import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LangMiddleware } from '../middlewares/langMiddleware.middleware';

export const BodyWithMiddleware = createParamDecorator(
   async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    LangMiddleware()(request, null, () => {});
    return request.body;
  },
);
