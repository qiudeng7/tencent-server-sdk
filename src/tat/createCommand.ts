import type { TencentCloudCredential } from '../utils/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * CreateCommand API 请求参数
 */
interface CreateCommandParams {
  /** 命令名称，仅支持中文、英文、数字、下划线、分隔符"-"、小数点，最大长度60字节 */
  CommandName: string
  /** Base64编码后的命令内容，长度不可超过64KB */
  Content: string
  /** 命令描述，不超过120字符 */
  Description?: string
  /** 命令类型，目前支持取值：SHELL、POWERSHELL，默认 SHELL */
  CommandType?: 'SHELL' | 'POWERSHELL'
  /** 命令执行路径，SHELL 默认 /root，POWERSHELL 默认 C:\Program Files\qcloud\tat_agent\workdir */
  WorkingDirectory?: string
  /** 命令超时时间，默认60秒，取值范围[1, 86400] */
  Timeout?: number
  /** 是否启用自定义参数功能，默认 false */
  EnableParameter?: boolean
  /** 自定义参数的默认取值，JSON 字符串，如 {"varA": "222"} */
  DefaultParameters?: string
  /** 在 CVM 或 Lighthouse 实例中执行命令的用户名称 */
  Username?: string
}

/**
 * CreateCommand API 响应数据
 */
interface CreateCommandResponseData {
  /** 命令 ID */
  CommandId: string
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 创建 TAT 命令
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 命令参数
 * @returns 包含 CommandId 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { createCommand } from '@/server/tencentServer/tat/createCommand'
 * import { getCredentials } from '#server/tencentServer/utils/getCredentials'
 *
 * const credential = getCredentials(env)
 * const { CommandId, RequestId } = await createCommand(credential, {
 *   CommandName: 'hello-command',
 *   Content: btoa('ls -la'),
 *   Description: 'List all files',
 *   CommandType: 'SHELL',
 *   WorkingDirectory: '/root',
 *   Timeout: 60
 * })
 * console.log('命令 ID:', CommandId)
 * ```
 *
 * @example
 * ```ts
 * // 创建启用自定义参数的命令
 * const { CommandId } = await createCommand(credential, {
 *   CommandName: 'deploy-command',
 *   Content: btoa('echo {{varA}} && echo {{varB}}'),
 *   Description: 'Deploy application',
 *   EnableParameter: true,
 *   DefaultParameters: JSON.stringify({ varA: 'value1', varB: 'value2' })
 * })
 * ```
 */
export async function createCommand(
  credential: TencentCloudCredential,
  params: CreateCommandParams,
): Promise<{ CommandId: string; RequestId: string }> {
  const { createRequest } = await import('../utils/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 CreateCommand API
  const result = await request<
    CreateCommandParams,
    CreateCommandResponseData
  >({
    service: 'tat',
    version: '2020-10-28',
    action: 'CreateCommand',
    payload: params,
    endpoint: 'tat.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    CommandId: result.Response.CommandId,
    RequestId: result.Response.RequestId,
  }
}
