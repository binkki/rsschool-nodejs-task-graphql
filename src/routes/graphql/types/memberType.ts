import { GraphQLObjectType, GraphQLNonNull, GraphQLFloat, GraphQLInt } from "graphql";
import { MemberTypeId } from "./memberTypeId.js";


export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});
