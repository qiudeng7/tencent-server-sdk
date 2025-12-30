import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * @group TAT APIs
 * DescribeInvocationTasks API 请求参数
 */
interface DescribeInvocationTasksParams {
  /** 执行任务 ID 列表，每次请求的上限为100。参数不支持同时指定 InvocationTaskIds 和 Filters */
  InvocationTaskIds?: string[]
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
  /** 是否隐藏输出，默认 true */
  HideOutput?: boolean
}

/**
 * 命令文档
 */
interface CommandDocument {
  /** Base64 编码后的命令内容 */
  Content: string
  /** 命令类型 */
  CommandType: string
  /** 命令超时时间 */
  Timeout: number
  /** 执行命令的用户名称 */
  Username: string
  /** 命令执行路径 */
  WorkingDirectory: string
  /** 日志上传的 COS bucket 地址 */
  OutputCOSBucketUrl: string
  /** 日志在 COS bucket 中的目录 */
  OutputCOSKeyPrefix: string
}

/**
 * 任务执行结果
 */
interface TaskResult {
  /** 命令执行退出码 */
  ExitCode: number
  /** Base64 编码后的命令输出 */
  Output: string
  /** 丢弃的字节数 */
  Dropped: number
  /** COS 上传错误信息 */
  OutputUploadCOSErrorInfo: string
  /** 日志在 COS 中的 URL */
  OutputUrl: string
  /** 命令执行开始时间 */
  ExecStartTime: string
  /** 命令执行结束时间 */
  ExecEndTime: string
}

/**
 * 执行任务详情
 */
interface InvocationTask {
  /** 命令 ID */
  CommandId: string
  /** 命令文档 */
  CommandDocument: CommandDocument
  /** 执行活动 ID */
  InvocationId: string
  /** 执行任务 ID */
  InvocationTaskId: string
  /** 任务状态，如 PENDING、RUNNING、SUCCESS、FAILED、TIMEOUT、CANCELLED */
  TaskStatus: string
  /** 实例 ID */
  InstanceId: string
  /** 任务执行结果 */
  TaskResult: TaskResult
  /** 错误信息 */
  ErrorInfo: string
  /** 执行来源 */
  InvocationSource: string
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
 * DescribeInvocationTasks API 响应数据
 */
interface DescribeInvocationTasksResponseData {
  /** 符合条件的执行任务总数 */
  TotalCount: number
  /** 执行任务列表 */
  InvocationTaskSet: InvocationTask[]
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 查询 TAT 执行任务详情
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 查询参数
 * @returns 包含 InvocationTaskSet、TotalCount 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { describeInvocationTasks } from '@/server/tencentServer/tat/describeInvocationTasks'
 * import { getCredentials } from '#server/tencentServer/utils/getCredentials'
 *
 * const credential = getCredentials(env)
 * const { InvocationTaskSet, TotalCount, RequestId } = await describeInvocationTasks(credential, {
 *   Limit: 10,
 *   Offset: 0,
 *   HideOutput: false
 * })
 * console.log('执行任务列表:', InvocationTaskSet)
 * console.log('总数:', TotalCount)
 * ```
 *
 * @example
 * ```ts
 * // 按执行活动 ID 查询所有执行任务详情
 * const { InvocationTaskSet } = await describeInvocationTasks(credential, {
 *   Filters: [
 *     {
 *       Name: 'invocation-id',
 *       Values: ['inv-1vll7hda']
 *     }
 *   ],
 *   Limit: 10,
 *   HideOutput: false
 * })
 * ```
 *
 * @example
 * ```ts
 * // 按实例 ID 查询执行任务
 * const { InvocationTaskSet } = await describeInvocationTasks(credential, {
 *   Filters: [
 *     {
 *       Name: 'instance-id',
 *       Values: ['ins-zj0f57ew']
 *     }
 *   ]
 * })
 * ```
 */
export async function describeInvocationTasks(
  credential: TencentCloudCredential,
  params: DescribeInvocationTasksParams = {},
): Promise<{ InvocationTaskSet: InvocationTask[]; TotalCount: number; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 DescribeInvocationTasks API
  const result = await request<
    DescribeInvocationTasksParams,
    DescribeInvocationTasksResponseData
  >({
    service: 'tat',
    version: '2020-10-28',
    action: 'DescribeInvocationTasks',
    payload: params,
    endpoint: 'tat.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    InvocationTaskSet: result.Response.InvocationTaskSet,
    TotalCount: result.Response.TotalCount,
    RequestId: result.Response.RequestId,
  }
}
