import type { TencentCloudCredential } from '../utils/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * DescribeInstances API 请求参数
 */
interface DescribeInstancesParams {
  /** 按照一个或多个实例ID查询，例如：["ins-r8hr2upy"]，每次请求的上限为100 */
  InstanceIds?: string[]
  /** 过滤器列表，每次请求的上限为10，Filter.Values的上限为5 */
  Filters?: Array<{
    /** 过滤器名称 */
    Name: string
    /** 过滤器值列表 */
    Values: string[]
  }>
  /** 偏移量，默认为0 */
  Offset?: number
  /** 返回数量，默认为20，最大值为100 */
  Limit?: number
}

/**
 * 实例详细信息（简化版，仅包含常用字段）
 */
interface Instance {
  /** 实例 ID */
  InstanceId: string
  /** 实例名称 */
  InstanceName: string
  /** 实例状态，如 PENDING、LAUNCH_FAILED、RUNNING、STOPPED、STARTING、STOPPING、REBOOTING、SHUTDOWN、TERMINATING */
  InstanceState: string
  /** 实例计费类型，如 PREPAID、POSTPAID_BY_HOUR、CDHPAID */
  InstanceChargeType: string
  /** 实例机型 */
  InstanceType: string
  /** CPU 核数 */
  CPU: number
  /** 内存容量（GB） */
  Memory: number
  /** 镜像 ID */
  ImageId: string
  /** 创建时间 */
  CreatedTime: string
  /** 到期时间 */
  ExpiredTime: string
  /** 最新的操作名称 */
  LatestOperation: string
  /** 最新的操作状态 */
  LatestOperationState: string
}

/**
 * DescribeInstances API 响应数据
 */
interface DescribeInstancesResponseData {
  /** 符合条件的实例数量 */
  TotalCount: number
  /** 实例详细信息列表 */
  InstanceSet: Instance[]
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 查询云服务器实例列表
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 查询参数
 * @returns 包含 InstanceSet、TotalCount 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { describeInstances } from '@/server/tencentServer/describeInstances'
 * import { getCredentials } from '#server/tencentServer/utils/getCredentials'
 *
 * const credential = getCredentials(env)
 * const { InstanceSet, TotalCount, RequestId } = await describeInstances(credential, {
 *   Limit: 10,
 *   Offset: 0
 * })
 * console.log('实例列表:', InstanceSet)
 * console.log('总数:', TotalCount)
 * ```
 *
 * @example
 * ```ts
 * // 按实例 ID 查询
 * const { InstanceSet } = await describeInstances(credential, {
 *   InstanceIds: ['ins-r8hr2upy', 'ins-5d8a23rs']
 * })
 * ```
 *
 * @example
 * ```ts
 * // 使用过滤器查询特定可用区的实例
 * const { InstanceSet } = await describeInstances(credential, {
 *   Filters: [
 *     {
 *       Name: 'zone',
 *       Values: ['ap-guangzhou-3', 'ap-guangzhou-4']
 *     }
 *   ],
 *   Limit: 20
 * })
 * ```
 */
export async function describeInstances(
  credential: TencentCloudCredential,
  params: Omit<DescribeInstancesParams, 'InstanceIds'> & { InstanceIds?: string[] } = {}
): Promise<{ InstanceSet: Instance[]; TotalCount: number; RequestId: string }> {
  const { createRequest } = await import('../utils/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 DescribeInstances API
  const result = await request<
    DescribeInstancesParams,
    DescribeInstancesResponseData
  >({
    service: 'cvm',
    version: '2017-03-12',
    action: 'DescribeInstances',
    payload: params,
    endpoint: 'cvm.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    InstanceSet: result.Response.InstanceSet,
    TotalCount: result.Response.TotalCount,
    RequestId: result.Response.RequestId,
  }
}
