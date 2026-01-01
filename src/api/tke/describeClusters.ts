import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * DescribeClusters API 请求参数
 */
interface DescribeClustersParams {
  /** 集群ID列表 */
  ClusterIds?: string[]
  /** 偏移量 */
  Offset?: number
  /** 返回数量，默认为20，最大值为100 */
  Limit?: number
  /** 过滤条件 */
  Filters?: Array<{
    /** 过滤器名称 */
    Name: string
    /** 过滤器值列表 */
    Values: string[]
  }>
}

/**
 * 标签
 */
interface Tag {
  /** 标签键 */
  Key: string
  /** 标签值 */
  Value: string
}

/**
 * 集群信息
 */
interface Cluster {
  /** 集群ID */
  ClusterId: string
  /** 集群名称 */
  ClusterName: string
  /** 集群描述 */
  ClusterDescription?: string
  /** 集群类型 */
  ClusterType?: string
  /** 集群版本 */
  ClusterVersion?: string
  /** 集群地域 */
  Region?: string
  /** 集群CIDR */
  ClusterCidr?: string
  /** 集群状态 */
  ClusterState?: string
  /** 创建时间 */
  CreatedTime?: string
  /** VPC ID */
  VpcId?: string
  /** 子网ID列表 */
  SubnetIds?: string[]
  /** 集群标签 */
  TagSet?: Tag[]
  /** 集群节点数量 */
  ClusterNodeCount?: number
  /** 集群总核数 */
  ClusterTotalCpu?: number
  /** 集群总内存 */
  ClusterTotalMem?: number
  /** 集群可用核数 */
  ClusterUsedCpu?: number
  /** 集群可用内存 */
  ClusterUsedMem?: number
}

/**
 * DescribeClusters API 响应数据
 */
interface DescribeClustersResponseData {
  /** 总数 */
  TotalCount?: number
  /** 集群列表 */
  Clusters?: Cluster[]
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 查询TKE集群列表
 *
 * @group TKE Cluster APIs
 * @param credential - 腾讯云密钥凭证
 * @param params - 查询参数
 * @returns 包含 TotalCount、Clusters 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { describeClusters } from '@qiudeng/tencent-cloud-sdk'
 *
 * // 查询所有集群
 * const { TotalCount, Clusters } = await describeClusters(credential, {
 *   Limit: 10,
 *   Offset: 0
 * })
 * console.log('集群总数:', TotalCount)
 * console.log('集群列表:', Clusters)
 * ```
 *
 * @example
 * ```ts
 * // 根据集群ID查询
 * const { Clusters } = await describeClusters(credential, {
 *   ClusterIds: ['cls-xxxxx', 'cls-yyyyy']
 * })
 * ```
 *
 * @example
 * ```ts
 * // 使用过滤器查询
 * const { Clusters } = await describeClusters(credential, {
 *   Filters: [
 *     {
 *       Name: 'ClusterType',
 *       Values: ['MANAGED_CLUSTER']
 *     }
 *   ],
 *   Limit: 20
 * })
 * ```
 */
export async function describeClusters(
  credential: TencentCloudCredential,
  params: Omit<DescribeClustersParams, 'ClusterIds'> & { ClusterIds?: string[] } = {},
): Promise<{ TotalCount?: number; Clusters?: Cluster[]; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 DescribeClusters API
  const result = await request<
    DescribeClustersParams,
    DescribeClustersResponseData
  >({
    service: 'tke',
    version: '2018-05-25',
    action: 'DescribeClusters',
    payload: params,
    endpoint: 'tke.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    TotalCount: result.Response.TotalCount,
    Clusters: result.Response.Clusters,
    RequestId: result.Response.RequestId,
  }
}
