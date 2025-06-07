import { createSchema, createYoga } from 'graphql-yoga';
import { db } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { chatEmitter } from '@/lib/chatEmitter';

const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    firstName: String
    lastName: String
    email: String
  }

  type Message {
    id: ID!
    senderId: ID!
    recipientId: ID!
    content: String!
    createdAt: String!
  }

  type Query {
    conversations: [User!]!
    messages(withUserId: ID!): [Message!]!
    searchUsers(term: String!): [User!]!
  }

  type Mutation {
    sendMessage(recipientId: ID!, content: String!): Message!
    deleteConversation(withUserId: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    conversations: async (_: unknown, __: unknown, ctx: { userId: string }) => {
      const { userId } = ctx;
      const users = await db.user.findMany({
        where: {
          OR: [
            { sentMessages: { some: { recipientId: userId, deletedForSender: false } } },
            { receivedMessages: { some: { senderId: userId, deletedForRecipient: false } } },
          ],
        },
        select: { id: true, firstName: true, lastName: true, email: true },
      });
      return users.filter((u) => u.id !== userId);
    },
    messages: async (
      _: unknown,
      { withUserId }: { withUserId: string },
      ctx: { userId: string },
    ) => {
      const { userId } = ctx;
      return db.message.findMany({
        where: {
          OR: [
            { senderId: userId, recipientId: withUserId, deletedForSender: false },
            { senderId: withUserId, recipientId: userId, deletedForRecipient: false },
          ],
        },
        orderBy: { createdAt: 'asc' },
      });
    },
    searchUsers: async (_: unknown, { term }: { term: string }, ctx: { userId: string }) => {
      const { userId } = ctx;
      return db.user.findMany({
        where: {
          id: { not: userId },
          OR: [
            { firstName: { contains: term, mode: 'insensitive' } },
            { lastName: { contains: term, mode: 'insensitive' } },
            { email: { contains: term, mode: 'insensitive' } },
          ],
        },
        take: 10,
        select: { id: true, firstName: true, lastName: true, email: true },
      });
    },
  },
  Mutation: {
    sendMessage: async (
      _: unknown,
      { recipientId, content }: { recipientId: string; content: string },
      ctx: { userId: string },
    ) => {
      const { userId } = ctx;
      const message = await db.message.create({
        data: { senderId: userId, recipientId, content },
      });
      chatEmitter.emit('message', message);
      return message;
    },
    deleteConversation: async (
      _: unknown,
      { withUserId }: { withUserId: string },
      ctx: { userId: string },
    ) => {
      const { userId } = ctx;
      await db.message.updateMany({
        where: { senderId: userId, recipientId: withUserId },
        data: { deletedForSender: true },
      });
      await db.message.updateMany({
        where: { senderId: withUserId, recipientId: userId },
        data: { deletedForRecipient: true },
      });
      return true;
    },
  },
};

const schema = createSchema({ typeDefs, resolvers });

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Request, Response, Headers },
  async context() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error('Unauthorized');
    return { userId: session.user.id };
  },
});

export const GET = yoga;
export const POST = yoga;
