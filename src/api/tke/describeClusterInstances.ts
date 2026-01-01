import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * DescribeClusterInstances API 请求参数
 */
interface DescribeClusterInstancesParams {
  /** 集群ID */
  ClusterId: string
  /** 偏移量，默认为0 */
  Offset?: number
  /** 返回数量，默认为20，最大值为100 */
  Limit?: number
  /** 节点实例ID列表 */
  InstanceIds?: string[]
  /** 节点状态 */
  NodeState?: string
  /** 节点名称 */
  NodeName?: string
  /** 节点所属的节点池ID */
  NodePoolId?: string
}

/**
 * 节点信息
 */
interface NodeInstance {
  /** 节点实例ID */
  InstanceId: string
  /** 节点名称 */
  NodeName?: string
  /** 节点状态 */
  NodeState?: string
  /** 节点所属集群ID */
  ClusterId?: string
  /** 节点所属的节点池ID */
  NodePoolId?: string
  /** 节点所在可用区 */
  Zone?: string
  /** 节点所属子网ID */
  SubnetId?: string
  /** 节点所属VPC ID */
  VpcId?: string
  /** 节点机型 */
  InstanceType?: string
  /** 节点CPU核数 */
  Cpu?: number
  /** 节点内存容量，单位：GB */
  Memory?: number
  /** 节点操作系统名称 */
  OsName?: string
  /** 节点操作系统镜像 */
  ImageId?: string
  /** 节点创建时间 */
  CreatedTime?: string
  /** 节点标签 */
  Labels?: Record<string, string>
  /** 节点污点 */
  Taints?: Array<{
    /** 污点键 */
    Key?: string
    /** 污点值 */
    Value?: string
    /** 污点效果 */
    Effect?: string
  }>
  /** 节点是否可用 */
  NodeReady?: boolean
  /** 节点是否为控制节点 */
  Master?: boolean
  /** 节点容器运行时版本 */
  ContainerRuntimeVersion?: string
  /** 节点kubelet版本 */
  KubeletVersion?: string
  /** 节点操作系统类型 */
  OSType?: string
}

/**
 * DescribeClusterInstances API 响应数据
 */
interface DescribeClusterInstancesResponseData {
  /** 总数 */
  TotalCount?: number
  /** 节点列表 */
  NodeInstanceSet?: NodeInstance[]
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 查询集群节点信息
 *
 * @group TKE Node APIs
 * @param credential - 腾讯云密钥凭证
 * @param params - 查询参数
 * @returns 包含 TotalCount、NodeInstanceSet 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { describeClusterInstances } from '@qiudeng/tencent-cloud-sdk'
 *
 * // 查询集群所有节点
 * const { TotalCount, NodeInstanceSet } = await describeClusterInstances(credential, {
 *   ClusterId: 'cls-xxxxx',
 *   Limit: 10,
 *   Offset: 0
 * })
 * console.log('节点总数:', TotalCount)
 * console.log('节点列表:', NodeInstanceSet)
 * ```
 *
 * @example
 * ```ts
 * // 根据节点ID查询
 * const { NodeInstanceSet } = await describeClusterInstances(credential, {
 *   ClusterId: 'cls-xxxxx',
 *   InstanceIds: ['ins-xxxxx', 'ins-yyyyy']
 * })
 * ```
 *
 * @example
 * ```ts
 * // 查询特定状态的节点
 * const { NodeInstanceSet } = await describeClusterInstances(credential, {
 *   ClusterId: 'cls-xxxxx',
 *   NodeState: 'Running',
 *   Limit: 20
 * })
 * ```
 *
 * @example
 * ```ts
 * // 查询特定节点池的节点
 * const { NodeInstanceSet } = await describeClusterInstances(credential, {
 *   ClusterId: 'cls-xxxxx',
 *   NodePoolId: 'np-xxxxx'
 * })
 * ```
 */
export async function describeClusterInstances(
  credential: TencentCloudCredential,
  params: Omit<DescribeClusterInstancesParams, 'InstanceIds'> & { InstanceIds?: string[] },
): Promise<{ TotalCount?: number; NodeInstanceSet?: NodeInstance[]; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 DescribeClusterInstances API
  const result = await request<
    DescribeClusterInstancesParams,
    DescribeClusterInstancesResponseData
  >({
    service: 'tke',
    version: '2018-05-25',
    action: 'DescribeClusterInstances',
    payload: params,
    endpoint: 'tke.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    TotalCount: result.Response.TotalCount,
    NodeInstanceSet: result.Response.NodeInstanceSet,
    RequestId: result.Response.RequestId,
  }
}
