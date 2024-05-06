import postResolver from "./post.resolver.js";
import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./user.resolver.js";

const mergedResolvers = mergeResolvers([postResolver, userResolver]);

export default mergedResolvers;
