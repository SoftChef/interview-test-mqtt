import {
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import {
  CfnConnection,
} from 'aws-cdk-lib/aws-codestarconnections';
import {
  PolicyStatement,
} from 'aws-cdk-lib/aws-iam';
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from 'aws-cdk-lib/pipelines';
import {
  Construct,
} from 'constructs';
import {
  MqttBrokerApplication,
} from './mqtt-broker-application';

export class DevopsStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);
    const connection = new CfnConnection(this, 'GitHubConnection', {
      connectionName: 'GitHub',
      providerType: 'GitHub',
    });
    const pipeline = new CodePipeline(this, 'Pipeline', {
      codeBuildDefaults: {
        rolePolicy: [
          new PolicyStatement({
            actions: [
              'sts:AssumeRole',
            ],
            resources: [
              'arn:aws:iam::*:role/cdk-hnb659fds-lookup-role-*',
            ],
          }),
        ],
      },
      dockerEnabledForSynth: true,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection(process.env.GITHUB_REPOSITORY!, process.env.GITHUB_BRANCH_NAME!, {
          connectionArn: connection.attrConnectionArn,
          triggerOnPush: true,
        }),
        commands: [
          'yarn global add aws-cdk',
          'yarn add projen',
          'npx projen',
          'npx projen build',
          'cdk synth',
        ],
        primaryOutputDirectory: 'cdk.out',
      }),
    });
    pipeline.addStage(
      new MqttBrokerApplication(this, 'MqttBrokerApplication', {
        env: {
          account: process.env.CDK_DEPLOY_ACCOUNT,
          region: process.env.CDK_DEPLOY_REGION,
        },
      }),
    );
    connection.applyRemovalPolicy(RemovalPolicy.DESTROY);
  }
}