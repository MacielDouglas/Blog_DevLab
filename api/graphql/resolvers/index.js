import postResolver from "./post.resolver.js";
import { mergeResolvers } from "@graphql-tools/merge";

const mergedResolvers = mergeResolvers([postResolver]);

export default mergedResolvers;
