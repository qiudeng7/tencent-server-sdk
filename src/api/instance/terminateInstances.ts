import type { TencentCloudCredential } from '#src/request'


/**
 * TerminateInstances API 请求参数
 */
interface TerminateInstancesParams {
  /** 一个或多个待操作的实例ID */
  InstanceIds: string[]
  /** 释放实例挂载的包年包月数据盘 */
  ReleasePrepaidDataDisks?: boolean
}

/**
 * TerminateInstances API 响应数据
 */
interface TerminateInstancesResponseData {
  RequestId: string
}

/**
 * 退还（删除）云服务器实例
 *
 * @group Instance APIs
 * @param credential - 腾讯云密钥凭证
 * @param instanceIds - 一个或多个待操作的实例ID
 * @param releasePrepaidDataDisks - 是否释放包年包月数据盘，默认 false
 * @returns 包含 RequestId 的对象
 *
 * @example
 * ```ts
 * import { terminateInstances } from '@/server/tencentServer/terminateInstances'
 * import { getCredentials } from '#server/tencentServer/utils/getCredentials'
 *
 * const credential = getCredentials(env)
 * const { RequestId } = await terminateInstances(
 *   credential,
 *   ['ins-3jaw1j8m'],
 *   false
 * )
 * console.log('请求 ID:', RequestId)
 * ```
 */
export async function terminateInstances(
  credential: TencentCloudCredential,
  instanceIds: string[],
  releasePrepaidDataDisks: boolean = false,
): Promise<{ RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 TerminateInstances API
  const result = await request<
    TerminateInstancesParams,
    TerminateInstancesResponseData
  >({
    service: 'cvm',
    version: '2017-03-12',
    action: 'TerminateInstances',
    payload: {
      InstanceIds: instanceIds,
      ReleasePrepaidDataDisks: releasePrepaidDataDisks,
    },
    endpoint: 'cvm.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    RequestId: result.Response.RequestId,
  }
}
