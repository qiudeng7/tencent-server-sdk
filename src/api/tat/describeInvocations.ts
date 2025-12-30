import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * @group TAT APIs
 * DescribeInvocations API 请求参数
 */
interface DescribeInvocationsParams {
  /** 执行活动 ID 列表，每次请求的上限为100。参数不支持同时指定 InvocationIds 和 Filters */
  InvocationIds?: string[]
  /** 过滤条件列表，每次请求的 Filters 上限为10，Filter.Values 的上限为5 */
  Filters?: Array<{
    /** 过滤器名称 */
    Name: string
    /** 过滤器值列表 */
    Values: string[]
  }>
  /** 返回数量，默认为20，最大值为100 */
  Limit?: number
  /** 偏移量，默认为0 */
  Offset?: number
}

/**
 * 执行任务基本信息
 */
interface InvocationTaskBasicInfo {
  /** 执行任务 ID */
  InvocationTaskId: string
  /** 任务状态 */
  TaskStatus: string
  /** 实例 ID */
  InstanceId: string
}

/**
 * 执行活动详情
 */
interface Invocation {
  /** 命令 ID */
  CommandId: string
  /** Base64 编码后的命令内容 */
  CommandContent: string
  /** 命令类型 */
  CommandType: string
  /** 命令超时时间 */
  Timeout: number
  /** 执行来源 */
  InvocationSource: string
  /** 命令执行路径 */
  WorkingDirectory: string
  /** 执行活动 ID */
  InvocationId: string
  /** 实例类型，CVM 或 LIGHTHOUSE */
  InstanceKind: 'CVM' | 'LIGHTHOUSE'
  /** 执行活动状态 */
  InvocationStatus: string
  /** 命令描述 */
  Description: string
  /** 自定义参数 */
  Parameters: string
  /** 默认参数 */
  DefaultParameters: string
  /** 执行命令的用户名称 */
  Username: string
  /** 日志在 COS bucket 中的目录 */
  OutputCOSKeyPrefix: string
  /** 日志上传的 COS bucket 地址 */
  OutputCOSBucketUrl: string
  /** 执行任务基本信息列表 */
  InvocationTaskBasicInfoSet: InvocationTaskBasicInfo[]
  /** 开始时间 */
  StartTime: string
  /** 结束时间 */
  EndTime: string
  /** 创建时间 */
  CreatedTime: string
  /** 更新时间 */
  UpdatedTime: string
}

/**
 * DescribeInvocations API 响应数据
 */
interface DescribeInvocationsResponseData {
  /** 符合条件的执行活动总数 */
  TotalCount: number
  /** 执行活动列表 */
  InvocationSet: Invocation[]
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 查询 TAT 执行活动详情
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 查询参数
 * @returns 包含 InvocationSet、TotalCount 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { describeInvocations } from '@/server/tencentServer/tat/describeInvocations'
 * import { getCredentials } from '#server/tencentServer/utils/getCredentials'
 *
 * const credential = getCredentials(env)
 * const { InvocationSet, TotalCount, RequestId } = await describeInvocations(credential, {
 *   Limit: 10,
 *   Offset: 0
 * })
 * console.log('执行活动列表:', InvocationSet)
 * console.log('总数:', TotalCount)
 * ```
 *
 * @example
 * ```ts
 * // 按执行活动 ID 查询
 * const { InvocationSet } = await describeInvocations(credential, {
 *   InvocationIds: ['inv-q4zp60g0']
 * })
 * ```
 *
 * @example
 * ```ts
 * // 使用过滤器查询
 * const { InvocationSet } = await describeInvocations(credential, {
 *   Filters: [
 *     {
 *       Name: 'command-id',
 *       Values: ['cmd-9dxzty3m']
 *     }
 *   ],
 *   Limit: 20
 * })
 * ```
 */
export async function describeInvocations(
  credential: TencentCloudCredential,
  params: DescribeInvocationsParams = {},
): Promise<{ InvocationSet: Invocation[]; TotalCount: number; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 DescribeInvocations API
  const result = await request<
    DescribeInvocationsParams,
    DescribeInvocationsResponseData
  >({
    service: 'tat',
    version: '2020-10-28',
    action: 'DescribeInvocations',
    payload: params,
    endpoint: 'tat.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    InvocationSet: result.Response.InvocationSet,
    TotalCount: result.Response.TotalCount,
    RequestId: result.Response.RequestId,
  }
}
