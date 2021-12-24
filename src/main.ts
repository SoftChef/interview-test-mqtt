import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Instance, InstanceClass, InstanceSize, InstanceType, MachineImage, Peer, Port, SecurityGroup, UserData, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class SoftChefInterviewTestMqttStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);
    const vpc = Vpc.fromLookup(this, 'Vpc', {
      isDefault: true,
    });
    const securityGroup = new SecurityGroup(this, 'MqttBrokerSecurityGroup', {
      vpc: vpc,
      allowAllOutbound: true,
    });
    // securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(22), 'SSH');
    securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(1883), 'MQTT Broker');
    const installMqttBroker: UserData = UserData.forLinux();
    installMqttBroker.addCommands('sudo apt-get update -y');
    installMqttBroker.addCommands('sudo apt-get install mosquitto -y');
    installMqttBroker.addCommands('sudo systemctl start mosquitto');
    const mqttBrokerInstance = new Instance(this, 'MqttServer', {
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      vpc: vpc,
      machineImage: MachineImage.genericLinux({
        'ap-northeast-1': 'ami-0822295a729d2a28e',
      }),
      securityGroup: securityGroup,
      userData: installMqttBroker,
      keyName: 'InterviewTestMqtt',
    });
    mqttBrokerInstance.applyRemovalPolicy(RemovalPolicy.DESTROY);
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new SoftChefInterviewTestMqttStack(app, 'SoftChefInterviewTestMqtt', { env: devEnv });

app.synth();