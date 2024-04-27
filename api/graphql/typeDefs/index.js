import { mergeTypeDefs } from "@graphql-tools/merge";

import postTypeDef from "./post.typeDef.js";

const mergedTypeDefs = mergeTypeDefs([postTypeDef]);

export default mergedTypeDefs;
