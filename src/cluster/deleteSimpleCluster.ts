import type { TencentCloudCredential } from '#src/types'
import { deleteCluster } from '#src/api/tke/deleteCluster'
import { deleteVpc } from '#src/api/vpc/deleteVpc'
import { deleteSubnet } from '#src/api/subnet/deleteSubnet'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 删除简单集群的参数
 */
export interface DeleteSimpleClusterParams {
  /** 集群ID */
  clusterId: string
  /** VPC ID */
  vpcId: string
  /** 子网 ID */
  subnetId: string
  /** 区域 */
  region?: string
}

/**
 * 删除简单集群的结果
 */
export interface DeleteSimpleClusterResult {
  /** 集群删除任务ID */
  ClusterJobId?: string
  /** 子网删除请求ID */
  SubnetRequestId: string
  /** VPC删除请求ID */
  VpcRequestId: string
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 删除一个由 createSimpleCluster 创建的 TKE 集群及其相关资源
 *
 * 此函数会按顺序删除集群、子网和 VPC 资源。
 * 注意：删除集群是异步操作，返回 JobId，可以通过 DescribeClusterTasks 查询任务状态。
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 集群相关资源ID
 * @returns 包含 ClusterJobId、SubnetRequestId 和 VpcRequestId 的对象
 *
 * @example
 * ```ts
 * import { deleteSimpleCluster } from '#src/cluster/deleteSimpleCluster'
 *
 * const result = await deleteSimpleCluster(credential, {
 *   clusterId: 'cls-xxxxx',
 *   vpcId: 'vpc-xxxxx',
 *   subnetId: 'subnet-xxxxx',
 *   region: 'ap-nanjing',
 * })
 *
 * console.log('集群删除任务ID:', result.ClusterJobId)
 * console.log('子网删除请求ID:', result.SubnetRequestId)
 * console.log('VPC删除请求ID:', result.VpcRequestId)
 * ```
 */
export async function deleteSimpleCluster(
  credential: TencentCloudCredential,
  params: DeleteSimpleClusterParams,
): Promise<DeleteSimpleClusterResult> {
  const { clusterId, vpcId, subnetId, region = 'ap-nanjing' } = params

  console.log(`Starting deletion of cluster ${clusterId}...`)

  // 1. 删除集群（异步操作）
  let clusterJobId: string | undefined
  try {
    const clusterResult = await deleteCluster(credential, {
      ClusterId: clusterId,
      InstanceDeleteMode: 'terminate', // 必需参数，终止实例（terminate 或 retain）
    } as any)
    clusterJobId = clusterResult.JobId
    console.log(`Cluster deletion task submitted: ${clusterJobId}`)
  } catch (error) {
    console.error('Failed to delete cluster:', error)
    throw error
  }

  // 2. 等待一段时间让集群删除操作进行
  // 注意：集群删除是异步的，这里等待一段时间后尝试删除子网和VPC
  // 如果删除失败，可能需要手动重试或等待更长时间
  console.log('Waiting 30 seconds for cluster deletion to progress...')
  await new Promise((resolve) => setTimeout(resolve, 30000))

  // 3. 删除子网
  let subnetRequestId: string
  try {
    const subnetResult = await deleteSubnet(credential, subnetId)
    subnetRequestId = subnetResult.RequestId
    console.log(`Subnet deleted successfully: ${subnetId}`)
  } catch (error) {
    console.error('Failed to delete subnet:', error)
    throw error
  }

  // 4. 删除 VPC
  let vpcRequestId: string
  try {
    const vpcResult = await deleteVpc(credential, vpcId)
    vpcRequestId = vpcResult.RequestId
    console.log(`VPC deleted successfully: ${vpcId}`)
  } catch (error) {
    console.error('Failed to delete VPC:', error)
    throw error
  }

  return {
    ClusterJobId: clusterJobId,
    SubnetRequestId: subnetRequestId,
    VpcRequestId: vpcRequestId,
  }
}
