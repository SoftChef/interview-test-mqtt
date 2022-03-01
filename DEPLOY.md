## Requirements

1. CDK CLI https://github.com/aws/aws-cdk
2. Projen CLI (or use npx) https://github.com/projen/projen

## Prepare

```
yarn install
```

## Deploy DevOps environment

```
cdk deploy --profile your-aws-profile
```

## Deploy MQTT Broker Stack

cdk deploy DevopsStack/MqttBrokerApplication/MqttBrokerStack --profile your-aws-profile