import postResolver from "./post.resolver.js";
import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./user.resolver.js";
import commentResolver from "./comment.resolver.js";

const mergedResolvers = mergeResolvers([
  postResolver,
  userResolver,
  commentResolver,
]);

export default mergedResolvers;
