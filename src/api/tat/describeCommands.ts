import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * @group TAT APIs
 * DescribeCommands API 请求参数
 */
interface DescribeCommandsParams {
  /** 命令 ID 列表，每次请求的上限为100。参数不支持同时指定 CommandIds 和 Filters */
  CommandIds?: string[]
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
 * 命令详情
 */
interface Command {
  /** 命令 ID */
  CommandId: string
  /** 命令名称 */
  CommandName: string
  /** 命令描述 */
  Description: string
  /** 格式化描述 */
  FormattedDescription: string
  /** 创建者，TAT 代表公共命令，USER 代表由用户创建的命令 */
  CreatedBy: 'TAT' | 'USER'
  /** Base64编码后的命令内容 */
  Content: string
  /** 命令类型，SHELL、POWERSHELL 或 BAT */
  CommandType: 'SHELL' | 'POWERSHELL' | 'BAT'
  /** 命令执行路径 */
  WorkingDirectory: string
  /** 命令超时时间 */
  Timeout: number
  /** 是否启用自定义参数功能 */
  EnableParameter: boolean
  /** 自定义参数的默认取值，JSON 字符串 */
  DefaultParameters: string
  /** 自定义参数数组 */
  DefaultParameterConfs: any[]
  /** 场景列表 */
  Scenes: any[]
  /** 执行命令的用户名称 */
  Username: string
  /** 标签列表 */
  Tags: Array<{ Key: string; Value: string }>
  /** 创建时间 */
  CreatedTime: string
  /** 更新时间 */
  UpdatedTime: string
  /** 日志上传的 COS bucket 地址 */
  OutputCOSBucketUrl?: string
  /** 日志在 COS bucket 中的目录 */
  OutputCOSKeyPrefix?: string
}

/**
 * DescribeCommands API 响应数据
 */
interface DescribeCommandsResponseData {
  /** 符合条件的命令总数 */
  TotalCount: number
  /** 命令详情列表 */
  CommandSet: Command[]
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 查询 TAT 命令详情
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 查询参数
 * @returns 包含 CommandSet、TotalCount 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { describeCommands } from '@/server/tencentServer/tat/describeCommands'
 * import { getCredentials } from '#server/tencentServer/utils/getCredentials'
 *
 * const credential = getCredentials(env)
 * const { CommandSet, TotalCount, RequestId } = await describeCommands(credential, {
 *   Limit: 10,
 *   Offset: 0
 * })
 * console.log('命令列表:', CommandSet)
 * console.log('总数:', TotalCount)
 * ```
 *
 * @example
 * ```ts
 * // 按命令 ID 查询
 * const { CommandSet } = await describeCommands(credential, {
 *   CommandIds: ['cmd-dvstpcyy', 'cmd-hb2q34lk']
 * })
 * ```
 *
 * @example
 * ```ts
 * // 使用过滤器查询
 * const { CommandSet } = await describeCommands(credential, {
 *   Filters: [
 *     {
 *       Name: 'command-name',
 *       Values: ['first-command', 'second-command']
 *     }
 *   ],
 *   Limit: 20
 * })
 * ```
 */
export async function describeCommands(
  credential: TencentCloudCredential,
  params: DescribeCommandsParams = {},
): Promise<{ CommandSet: Command[]; TotalCount: number; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 DescribeCommands API
  const result = await request<
    DescribeCommandsParams,
    DescribeCommandsResponseData
  >({
    service: 'tat',
    version: '2020-10-28',
    action: 'DescribeCommands',
    payload: params,
    endpoint: 'tat.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    CommandSet: result.Response.CommandSet,
    TotalCount: result.Response.TotalCount,
    RequestId: result.Response.RequestId,
  }
}
