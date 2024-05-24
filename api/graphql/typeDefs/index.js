import { mergeTypeDefs } from "@graphql-tools/merge";

import postTypeDef from "./post.typeDef.js";
import userTypeDef from "./user.typeDef.js";
import commentTypeDef from "./comment.typeDef.js";

const mergedTypeDefs = mergeTypeDefs([
  postTypeDef,
  userTypeDef,
  commentTypeDef,
]);

export default mergedTypeDefs;
