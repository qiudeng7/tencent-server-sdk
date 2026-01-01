import type { TencentCloudCredential } from '#src/types'
import { createCluster } from '#src/api/tke/createCluster'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 创建简单集群的参数
 */
export interface CreateSimpleClusterParams {
  /** 集群名称 */
  clusterName?: string
  /** 可用区 */
  zone?: string
  /** VPC CIDR */
  vpcCidr?: string
  /** 子网 CIDR */
  subnetCidr?: string
  /** 集群容器网络 CIDR */
  clusterCidr?: string
}

/**
 * 创建简单集群的结果
 */
export interface CreateSimpleClusterResult {
  /** 集群ID */
  ClusterId: string
  /** VPC ID */
  VpcId: string
  /** 子网 ID */
  SubnetId: string
  /** 请求ID */
  RequestId: string
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 创建一个最小化的、最便宜的 TKE 集群
 *
 * 此函数会自动创建所需的 VPC 和子网资源，然后创建一个托管集群。
 * 所有资源的命名都采用 "tencent-cloud-sdk-test" 风格，方便识别和清理。
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 集群配置参数
 * @returns 包含 ClusterId、VpcId、SubnetId 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { createSimpleCluster } from '#src/cluster/createSimpleCluster'
 *
 * const result = await createSimpleCluster(credential, {
 *   clusterName: 'my-test-cluster'
 * })
 *
 * console.log('集群ID:', result.ClusterId)
 * console.log('VPC ID:', result.VpcId)
 * console.log('子网 ID:', result.SubnetId)
 * ```
 */
export async function createSimpleCluster(
  credential: TencentCloudCredential,
  params: CreateSimpleClusterParams = {},
): Promise<CreateSimpleClusterResult> {
  const {
    clusterName = 'tencent-cloud-sdk-test-cluster',
    zone = 'ap-nanjing-1',
    vpcCidr = '10.0.0.0/16',
    subnetCidr = '10.0.1.0/24',
    clusterCidr = '172.16.0.0/16',
  } = params

  // 从 zone 提取 region (例如: ap-nanjing-1 -> ap-nanjing)
  const region = zone.split('-').slice(0, 2).join('-')

  // 获取 request 函数
  const { createRequest } = await import('#src/request')
  const request = createRequest(credential)

  // 1. 创建 VPC - 使用与子网相同的 region
  const vpcResponse = await request({
    service: 'vpc',
    version: '2017-03-12',
    action: 'CreateVpc',
    payload: {
      VpcName: `tencent-cloud-sdk-test-vpc-${Date.now()}`,
      CidrBlock: vpcCidr,
    },
    endpoint: 'vpc.tencentcloudapi.com',
    region: region,
  })

  const vpcId = vpcResponse.Response.Vpc.VpcId
  console.log(`VPC created successfully: ${vpcId}`)

  // 2. 创建子网 - 使用与 zone 匹配的 region
  const subnetResponse = await request({
    service: 'vpc',
    version: '2017-03-12',
    action: 'CreateSubnet',
    payload: {
      VpcId: vpcId,
      SubnetName: `tencent-cloud-sdk-test-subnet-${Date.now()}`,
      CidrBlock: subnetCidr,
      Zone: zone,
    },
    endpoint: 'vpc.tencentcloudapi.com',
    region: region,
  })

  const subnetId = subnetResponse.Response.Subnet.SubnetId
  console.log(`Subnet created successfully: ${subnetId}`)

  // 3. 创建 TKE 集群（托管集群，最便宜的选项）
  const clusterResult = await createCluster(credential, {
    ClusterType: 'MANAGED_CLUSTER',
    ClusterBasicSettings: {
      ClusterName: clusterName,
      VpcId: vpcId,
      SubnetId: subnetId,
      ClusterDescription: 'Created by tencent-cloud-sdk test',
    },
    ClusterCIDRSettings: {
      ClusterCIDR: clusterCidr,
    },
  } as any)

  const clusterId = clusterResult.ClusterId
  console.log(`Cluster created successfully: ${clusterId}`)

  return {
    ClusterId: clusterId,
    VpcId: vpcId,
    SubnetId: subnetId,
    RequestId: clusterResult.RequestId,
  }
}
