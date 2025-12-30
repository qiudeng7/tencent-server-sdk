import type { TencentCloudCredential } from '../utils/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * DeleteCommand API 请求参数
 */
interface DeleteCommandParams {
  /** 待删除的命令 ID */
  CommandId: string
}

/**
 * DeleteCommand API 响应数据（空对象，仅包含 RequestId）
 */
interface DeleteCommandResponseData {
  // 此接口响应数据为空，只有 RequestId
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 删除 TAT 命令
 *
 * 注意：如果命令与执行器关联，则无法被删除。
 *
 * @param credential - 腾讯云密钥凭证
 * @param commandId - 待删除的命令 ID
 * @returns 包含 RequestId 的对象
 *
 * @example
 * ```ts
 * import { deleteCommand } from '@/server/tencentServer/tat/deleteCommand'
 * import { getCredentials } from '#server/tencentServer/utils/getCredentials'
 *
 * const credential = getCredentials(env)
 * const { RequestId } = await deleteCommand(credential, 'cmd-7efujjs6')
 * console.log('请求 ID:', RequestId)
 * ```
 */
export async function deleteCommand(
  credential: TencentCloudCredential,
  commandId: string,
): Promise<{ RequestId: string }> {
  const { createRequest } = await import('../utils/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 DeleteCommand API
  const result = await request<DeleteCommandParams, DeleteCommandResponseData>({
    service: 'tat',
    version: '2020-10-28',
    action: 'DeleteCommand',
    payload: {
      CommandId: commandId,
    },
    endpoint: 'tat.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    RequestId: result.Response.RequestId,
  }
}
