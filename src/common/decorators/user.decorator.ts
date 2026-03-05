import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (!req) return undefined;
    const user = req.user;
    if (!user) return undefined;

    if (data) {
      if (user[data] !== undefined) return user[data];

      if (['id', 'userId', 'sub'].includes(data)) {
        return user.id || user.userId || user.sub;
      }
    }

    return data ? user[data] : user;
  },
);
