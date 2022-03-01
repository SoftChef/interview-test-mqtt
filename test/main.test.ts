import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as dotenv from 'dotenv';
import { MqttBrokerStack } from '../src/mqtt-broker-stack';

dotenv.config();

test('Snapshot', () => {
  const app = new App();
  const stack = new MqttBrokerStack(app, 'test', {
    env: {
      account: process.env.CDK_DEPLOY_ACCOUNT,
      region: process.env.CDK_DEPLOY_REGION,
    },
  });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});