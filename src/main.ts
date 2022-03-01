import {
  App,
} from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import {
  DevopsStack,
} from './devops-stack';

dotenv.config();

const app = new App();
console.log({
  account: process.env.CDK_DEPLOY_ACCOUNT,
  region: process.env.CDK_DEPLOY_REGION,
});
new DevopsStack(app, 'DevopsStack', {
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION,
  },
});
app.synth();