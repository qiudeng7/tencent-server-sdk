import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * @group TAT APIs
 * RunCommand API 请求参数
 */
interface RunCommandParams {
  /** Base64编码后的命令内容，长度不可超过64KB */
  Content: string
  /** 待执行命令的实例ID列表，上限200。支持 CVM 和 LIGHTHOUSE */
  InstanceIds: string[]
  /** 命令名称，仅支持中文、英文、数字、下划线、分隔符"-"、小数点，最大长度60字节 */
  CommandName?: string
  /** 命令描述，不超过120字符 */
  Description?: string
  /** 命令类型，目前支持取值：SHELL、POWERSHELL，默认 SHELL */
  CommandType?: 'SHELL' | 'POWERSHELL'
  /** 命令执行路径，SHELL 默认 /root，POWERSHELL 默认 C:\Program Files\qcloud\tat_agent\workdir */
  WorkingDirectory?: string
  /** 命令超时时间，默认60秒，取值范围[1, 86400] */
  Timeout?: number
  /** 是否保存命令，默认 false */
  SaveCommand?: boolean
  /** 是否启用自定义参数功能，默认 false */
  EnableParameter?: boolean
  /** 自定义参数的默认取值，JSON 字符串 */
  DefaultParameters?: string
  /** Command 的自定义参数，JSON 字符串 */
  Parameters?: string
  /** 在 CVM 或 Lighthouse 实例中执行命令的用户名称 */
  Username?: string
}

/**
 * RunCommand API 响应数据
 */
interface RunCommandResponseData {
  /** 命令 ID */
  CommandId: string
  /** 执行活动 ID */
  InvocationId: string
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 在实例上执行 TAT 命令
 *
 * 注意：
 * - 如果指定实例未安装 agent，或 agent 不在线，返回失败
 * - 如果命令类型与 agent 运行环境不符，返回失败
 * - 指定的实例需要处于 VPC 网络
 * - 指定的实例需要处于 RUNNING 状态
 * - 不可同时指定 CVM 和 Lighthouse
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 命令执行参数
 * @returns 包含 CommandId、InvocationId 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { invokeCommand } from '@/server/tencentServer/tat/invokeCommand'
 * import { getCredentials } from '#server/tencentServer/utils/getCredentials'
 *
 * const credential = getCredentials(env)
 * const { CommandId, InvocationId, RequestId } = await invokeCommand(credential, {
 *   Content: btoa('ls -la'),
 *   InstanceIds: ['ins-zj0f57ew', 'ins-zj0f57ex'],
 *   CommandName: 'run-command',
 *   Description: 'List files',
 *   CommandType: 'SHELL',
 *   WorkingDirectory: '/root',
 *   Timeout: 60
 * })
 * console.log('命令 ID:', CommandId)
 * console.log('执行活动 ID:', InvocationId)
 * ```
 *
 * @example
 * ```ts
 * // 使用自定义参数执行命令
 * const { InvocationId } = await invokeCommand(credential, {
 *   Content: btoa('echo {{varA}} && echo {{varB}}'),
 *   InstanceIds: ['ins-zj0f57ew'],
 *   EnableParameter: true,
 *   Parameters: JSON.stringify({ varA: 'value1', varB: 'value2' })
 * })
 * ```
 *
 * @example
 * ```ts
 * // 执行并保存命令
 * const { CommandId } = await invokeCommand(credential, {
 *   Content: btoa('pwd'),
 *   InstanceIds: ['ins-zj0f57ew'],
 *   CommandName: 'my-command',
 *   SaveCommand: true
 * })
 * ```
 */
export async function invokeCommand(
  credential: TencentCloudCredential,
  params: RunCommandParams,
): Promise<{ CommandId: string; InvocationId: string; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 RunCommand API
  const result = await request<
    RunCommandParams,
    RunCommandResponseData
  >({
    service: 'tat',
    version: '2020-10-28',
    action: 'RunCommand',
    payload: params,
    endpoint: 'tat.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    CommandId: result.Response.CommandId,
    InvocationId: result.Response.InvocationId,
    RequestId: result.Response.RequestId,
  }
}
