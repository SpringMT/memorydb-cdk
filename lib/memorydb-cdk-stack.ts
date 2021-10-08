import * as cdk from '@aws-cdk/core';
import * as memorydb from '@aws-cdk/aws-memorydb'
import * as ec2 from '@aws-cdk/aws-ec2'

export class MemorydbCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'memorydb-vpc', {
      subnetConfiguration: [
         {
           cidrMask: 24,
           name: 'memorydbClient',
           subnetType: ec2.SubnetType.PUBLIC,
         },
         {
           cidrMask: 28,
           name: 'memorydb',
           subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
         }
      ]
    })
    const memoryDBGroup = new ec2.SecurityGroup(this, 'MemoryDB',{
      vpc,
    })
    const db = new memorydb.CfnCluster(this, "memorydb", {
      clusterName: "memorydbTest",
      numShards: 2,
      securityGroupIds: [memoryDBGroup.securityGroupId],
      subnetGroupName: 'memorydb'
    })
  }
}
