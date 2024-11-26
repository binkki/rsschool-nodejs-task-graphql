import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from "graphql";
import { MemberType } from "./types/memberType.js";
import { PostType } from "./types/postType.js";
import { ProfileType } from "./types/profileType.js";
import { UserType } from "./types/userType.js";
import { UUIDType } from "./types/uuid.js";
import { MemberTypeId } from "./types/memberTypeId.js";
import { CreateUserInput, CreateProfileInput, CreatePostInput, ChangePostInput, ChangeProfileInput, ChangeUserInput } from "./types/inputType.js";

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuerry',
    fields: {
      memberTypes: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
        resolve: async (parent, args, context) => 
          await context.prisma.memberType.findMany(),
      },
      memberType: {
        type: MemberType,
        args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
        resolve: async (parent, { id }, context) => 
          await context.prisma.memberType.findUnique({ where: { id } }),
      },
      users: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
        resolve: async (parent, args, context) =>
          await context.prisma.user.findMany(),
      },
      user: {
        type: UserType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (parent, { id }, context) => 
          await context.prisma.user.findUnique({ where: { id } }),
      },
      posts: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
        resolve: async (parent, args, context) =>
          await context.prisma.post.findMany(),
      },
      post: {
        type: PostType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (parent, { id }, context) => 
          await context.prisma.post.findUnique({ where: { id } }),
      },
      profiles: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
        resolve: async (parent, args, context) =>
          await context.prisma.profile.findMany(),
      },
      profile: {
        type: ProfileType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (parent, { id }, context) =>
          await context.prisma.profile.findUnique({ where: { id } }),
      },
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: {
        type: new GraphQLNonNull(UserType),
        args: {
          dto: { type: new GraphQLNonNull(CreateUserInput) },
        },
        resolve: async (_parent, { dto }, context) => 
          await context.prisma.user.create({
            data: {
              name: dto.name,
              balance: dto.balance,
            }
          }),
      },
      changeUser: {
        type: new GraphQLNonNull(UserType),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeUserInput) },
        },
        resolve: async (_parent, { id, dto }, context) =>
          await context.prisma.user.update({
            where: { id },
            data: dto,
          }),
      },
      deleteUser: {
        type: GraphQLString,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_parent, { id }, context) => {
          await context.prisma.user.delete({ where: { id } });
          return `User with ID ${id} removed successfully`;
        },
      },
      createPost: {
        type: new GraphQLNonNull(PostType),
        args: {
          dto: { type: new GraphQLNonNull(CreatePostInput) },
        },
        resolve: async (_parent, { dto }, context) => 
          await context.prisma.post.create({ 
            data: {
              title: dto.title,
              content: dto.content,
              authorId: dto.authorId,
            }
          }),
      },
      changePost: {
        type: PostType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangePostInput) },
        },
        resolve: async (_parent, { id, dto }, context) =>
          await context.prisma.post.update({
            where: { id },
            data: dto,
          }),
      },
      deletePost: {
        type: GraphQLString,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_parent, { id }, context) => {
          await context.prisma.post.delete({ where: { id } });
          return `Post with ID ${id} removed successfully`;
        },
      },
      createProfile: {
        type: new GraphQLNonNull(ProfileType),
        args: {
          dto: { type: new GraphQLNonNull(CreateProfileInput) },
        },
        resolve: async (_parent, { dto }, context) =>
          await context.prisma.profile.create({
            data: {
              isMale: dto.isMale,
              yearOfBirth: dto.yearOfBirth,
              userId: dto.userId,
              memberTypeId: dto.memberTypeId,
            }
          }),
      },
      changeProfile: {
        type: new GraphQLNonNull(ProfileType),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeProfileInput) },
        },
        resolve: async (_parent, { id, dto }, context) =>
          await context.prisma.profile.update({
            where: { id },
            data: dto,
          }),
      },
      deleteProfile: {
        type: GraphQLString,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_parent, { id }, context) => {
          await context.prisma.profile.delete({ where: { id } });
          return `Profile with ID ${id} removed successfully`;
        },
      },
      subscribeTo: {
        type: GraphQLString,
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_parent, { userId, authorId }, context) => {
          await context.prisma.subscribersOnAuthors.create({
            data: {
              subscriberId: userId,
              authorId: authorId,
            },
          });
  
          return `Successfully subscribed to user with ID ${authorId}.`;
        },
      },
  
      unsubscribeFrom: {
        type: GraphQLString,
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_parent, { userId, authorId }, context) => {
          await context.prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: userId,
                authorId: authorId,
              },
            },
          });
          return `Successfully unsubscribed from user with ID ${authorId}.`;
        },
      },
    }
  }),
});
