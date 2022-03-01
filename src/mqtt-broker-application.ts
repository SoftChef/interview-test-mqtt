import {
  Stage,
  StageProps,
} from 'aws-cdk-lib';
import {
  Construct,
} from 'constructs';
import {
  MqttBrokerStack,
} from './mqtt-broker-stack';

export class MqttBrokerApplication extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    new MqttBrokerStack(this, 'MqttBrokerStack', {
      stackName: 'MqttBrokerStack',
      env: {
        account: process.env.CDK_DEPLOY_ACCOUNT,
        region: process.env.CDK_DEPLOY_REGION,
      },
      terminationProtection: false,
    });
  }
}