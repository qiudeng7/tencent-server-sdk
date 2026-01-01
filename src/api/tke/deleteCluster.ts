import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * DeleteCluster API 请求参数
 */
interface DeleteClusterParams {
  /** 集群ID */
  ClusterId: string
  /** 集群实例删除时的保留策略，保留所有云资源、只销毁实例 */
  ResourceDelete?: boolean
}

/**
 * DeleteCluster API 响应数据
 */
interface DeleteClusterResponseData {
  /** 任务ID */
  JobId?: string
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 删除集群
 *
 * @group TKE Cluster APIs
 * @param credential - 腾讯云密钥凭证
 * @param params - 删除参数
 * @returns 包含 JobId 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { deleteCluster } from '@qiudeng/tencent-cloud-sdk'
 *
 * // 删除集群
 * const { JobId } = await deleteCluster(credential, {
 *   ClusterId: 'cls-xxxxx'
 * })
 * console.log('任务ID:', JobId)
 * ```
 *
 * @example
 * ```ts
 * // 删除集群但保留云资源
 * const { JobId } = await deleteCluster(credential, {
 *   ClusterId: 'cls-xxxxx',
 *   ResourceDelete: true
 * })
 * ```
 */
export async function deleteCluster(
  credential: TencentCloudCredential,
  params: DeleteClusterParams,
): Promise<{ JobId?: string; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 DeleteCluster API
  const result = await request<
    DeleteClusterParams,
    DeleteClusterResponseData
  >({
    service: 'tke',
    version: '2018-05-25',
    action: 'DeleteCluster',
    payload: params,
    endpoint: 'tke.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    JobId: result.Response.JobId,
    RequestId: result.Response.RequestId,
  }
}
