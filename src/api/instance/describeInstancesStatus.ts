import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * DescribeInstancesStatus API 请求参数
 */
interface DescribeInstancesStatusParams {
  /** 按照一个或多个实例ID查询，例如：["ins-r8hr2upy", "ins-5d8a23rs"]，每次请求的上限为100 */
  InstanceIds?: string[]
  /** 偏移量，默认为0 */
  Offset?: number
  /** 返回数量，默认为20，最大值为100 */
  Limit?: number
}

/**
 * 实例状态信息
 */
interface InstanceStatus {
  /** 实例 ID */
  InstanceId: string
  /** 实例状态，如 PENDING、LAUNCH_FAILED、RUNNING、STOPPED、STARTING、STOPPING、REBOOTING、SHUTDOWN、TERMINATING */
  InstanceState: string
}

/**
 * DescribeInstancesStatus API 响应数据
 */
interface DescribeInstancesStatusResponseData {
  /** 符合条件的实例状态数量 */
  TotalCount: number
  /** 实例状态列表 */
  InstanceStatusSet: InstanceStatus[]
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 查询云服务器实例状态列表
 *
 * @group Instance APIs
 * @param credential - 腾讯云密钥凭证
 * @param params - 查询参数
 * @returns 包含 InstanceStatusSet、TotalCount 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { describeInstancesStatus } from '@/server/tencentServer/describeInstancesStatus'
 * import { getCredentials } from '#server/tencentServer/utils/getCredentials'
 *
 * const credential = getCredentials(env)
 * const { InstanceStatusSet, TotalCount, RequestId } = await describeInstancesStatus(credential, {
 *   Limit: 20,
 *   Offset: 0
 * })
 * console.log('实例状态列表:', InstanceStatusSet)
 * console.log('总数:', TotalCount)
 * ```
 *
 * @example
 * ```ts
 * // 查询特定实例的状态
 * const { InstanceStatusSet } = await describeInstancesStatus(credential, {
 *   InstanceIds: ['ins-r8hr2upy', 'ins-5d8a23rs']
 * })
 * InstanceStatusSet.forEach(status => {
 *   console.log(`${status.InstanceId}: ${status.InstanceState}`)
 * })
 * ```
 */
export async function describeInstancesStatus(
  credential: TencentCloudCredential,
  params: DescribeInstancesStatusParams = {}
): Promise<{ InstanceStatusSet: InstanceStatus[]; TotalCount: number; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 DescribeInstancesStatus API
  const result = await request<
    DescribeInstancesStatusParams,
    DescribeInstancesStatusResponseData
  >({
    service: 'cvm',
    version: '2017-03-12',
    action: 'DescribeInstancesStatus',
    payload: params,
    endpoint: 'cvm.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    InstanceStatusSet: result.Response.InstanceStatusSet,
    TotalCount: result.Response.TotalCount,
    RequestId: result.Response.RequestId,
  }
}
