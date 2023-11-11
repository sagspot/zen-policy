import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient, Role } from '@prisma/client';
import { enhance } from '@zenstackhq/runtime';
import express, { Request, Response } from 'express';
import morgan from 'morgan';

export const prisma = new PrismaClient({
  errorFormat: 'pretty',
  // log: ['info', 'error', 'warn'],
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.disable('x-powered-by');

const getSessionUser = async (req: Request) => {
  const id = req.headers['x-user-id'];

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { id: parseInt(id as string) },
      select: { id: true, role: true },
    });

    return user;
  } catch (error) {
    return undefined;
  }
};

export const getEnhancedPrisma = async (req: Request) =>
  enhance(
    prisma,
    { user: await getSessionUser(req) },
    { logPrismaQuery: true }
  );

app.get('/api/health', (_, res) => res.sendStatus(200));

export interface CustomReq extends Request {
  user?: { id: number; role: Role };
}

app.use(async (req: CustomReq, res, next) => {
  try {
    const user = await getSessionUser(req);
    if (!user) throw new Error('Access denied');
    req.user = user;
    next();
  } catch (error: any) {
    res
      .status(401)
      .json({ message: 'Access denied. Missing or invalid credentials' });
  }
});

//   User routes
app.get('/api/users', async (req, res) => {
  try {
    const enhancedPrisma = await getEnhancedPrisma(req);
    const users = await enhancedPrisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/users/:id', async (req, res) => {
  try {
    const enhancedPrisma = await getEnhancedPrisma(req);

    await enhancedPrisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
      select: { id: true },
    });

    res.json({ message: 'Update successful' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Error handling
interface ErrorWithStatus extends Error {
  status?: number;
}

app.use((_req, _res, next) => {
  const error: ErrorWithStatus = new Error('Invalid or missing route');
  error.status = 404;
  next(error);
});

app.use((error: ErrorWithStatus, _req: Request, res: Response) =>
  res.status(error.status || 500).json({ message: error.message })
);

const PORT = process.env.PORT || 5000;

(() => {
  try {
    app.listen(PORT, () =>
      console.log(`[🚀]: server listening on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error(`[error 💥]:  ${error}`);
    process.exit(1);
  }
})();
