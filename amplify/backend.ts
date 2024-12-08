import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { RemovalPolicy } from "aws-cdk-lib";

defineBackend({
  auth,
  data,
  storage,
});
