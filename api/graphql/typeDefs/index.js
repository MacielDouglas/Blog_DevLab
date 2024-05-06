import { mergeTypeDefs } from "@graphql-tools/merge";

import postTypeDef from "./post.typeDef.js";
import userTypeDef from "./user.typeDef.js";

const mergedTypeDefs = mergeTypeDefs([postTypeDef, userTypeDef]);

export default mergedTypeDefs;
