import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * DescribeClusterStatus API 请求参数
 */
interface DescribeClusterStatusParams {
  /** 集群ID列表 */
  ClusterIds: string[]
}

/**
 * 集群状态
 */
interface ClusterStatus {
  /** 集群ID */
  ClusterId: string
  /** 集群状态 */
  ClusterState?: string
  /** 集群状态名称 */
  ClusterStateName?: string
  /** 集群创建任务ID */
  TaskId?: string
}

/**
 * DescribeClusterStatus API 响应数据
 */
interface DescribeClusterStatusResponseData {
  /** 集群状态列表 */
  ClusterStatusSet?: ClusterStatus[]
  /** 总数 */
  TotalCount?: number
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 查看集群状态列表
 *
 * @group TKE Cluster APIs
 * @param credential - 腾讯云密钥凭证
 * @param params - 查询参数
 * @returns 包含 ClusterStatusSet、TotalCount 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { describeClusterStatus } from '@qiudeng/tencent-cloud-sdk'
 *
 * // 查询集群状态
 * const { ClusterStatusSet, TotalCount } = await describeClusterStatus(credential, {
 *   ClusterIds: ['cls-xxxxx', 'cls-yyyyy']
 * })
 * console.log('集群状态:', ClusterStatusSet)
 * ```
 *
 * @example
 * ```ts
 * // 查询单个集群状态
 * const { ClusterStatusSet } = await describeClusterStatus(credential, {
 *   ClusterIds: ['cls-xxxxx']
 * })
 *
 * if (ClusterStatusSet && ClusterStatusSet.length > 0) {
 *   const status = ClusterStatusSet[0]
 *   console.log('集群ID:', status.ClusterId)
 *   console.log('集群状态:', status.ClusterState)
 *   console.log('集群状态名称:', status.ClusterStateName)
 *   console.log('任务ID:', status.TaskId)
 * }
 * ```
 */
export async function describeClusterStatus(
  credential: TencentCloudCredential,
  params: DescribeClusterStatusParams,
): Promise<{ ClusterStatusSet?: ClusterStatus[]; TotalCount?: number; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 DescribeClusterStatus API
  const result = await request<
    DescribeClusterStatusParams,
    DescribeClusterStatusResponseData
  >({
    service: 'tke',
    version: '2018-05-25',
    action: 'DescribeClusterStatus',
    payload: params,
    endpoint: 'tke.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    ClusterStatusSet: result.Response.ClusterStatusSet,
    TotalCount: result.Response.TotalCount,
    RequestId: result.Response.RequestId,
  }
}
