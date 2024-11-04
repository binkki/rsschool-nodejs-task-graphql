import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from "graphql";
import { MemberType } from "./types/memberType.js";
import { PostType } from "./types/postType.js";
import { ProfileType } from "./types/profileType.js";
import { UserType } from "./types/userType.js";
import { UUIDType } from "./types/uuid.js";
import { MemberTypeId } from "./types/memberTypeId.js";

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
});
