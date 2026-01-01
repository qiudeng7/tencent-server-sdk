import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * DeleteClusterInstances API 请求参数
 */
interface DeleteClusterInstancesParams {
  /** 集群ID */
  ClusterId: string
  /** 节点实例ID列表 */
  InstanceIds: string[]
  /** 是否删除节点对应的CVM实例 */
  InstanceDelete?: boolean
  /** 是否强制删除节点 */
  Force?: boolean
}

/**
 * DeleteClusterInstances API 响应数据
 */
interface DeleteClusterInstancesResponseData {
  /** 任务ID */
  JobId?: string
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 删除集群中的节点
 *
 * @group TKE Node APIs
 * @param credential - 腾讯云密钥凭证
 * @param params - 删除参数
 * @returns 包含 JobId 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { deleteClusterInstances } from '@qiudeng/tencent-cloud-sdk'
 *
 * // 从集群中删除节点（保留CVM实例）
 * const { JobId } = await deleteClusterInstances(credential, {
 *   ClusterId: 'cls-xxxxx',
 *   InstanceIds: ['ins-xxxxx', 'ins-yyyyy'],
 *   InstanceDelete: false
 * })
 * console.log('任务ID:', JobId)
 * ```
 *
 * @example
 * ```ts
 * // 从集群中删除节点并同时删除CVM实例
 * const { JobId } = await deleteClusterInstances(credential, {
 *   ClusterId: 'cls-xxxxx',
 *   InstanceIds: ['ins-xxxxx'],
 *   InstanceDelete: true
 * })
 * ```
 *
 * @example
 * ```ts
 * // 强制删除节点
 * const { JobId } = await deleteClusterInstances(credential, {
 *   ClusterId: 'cls-xxxxx',
 *   InstanceIds: ['ins-xxxxx'],
 *   InstanceDelete: true,
 *   Force: true
 * })
 * ```
 */
export async function deleteClusterInstances(
  credential: TencentCloudCredential,
  params: DeleteClusterInstancesParams,
): Promise<{ JobId?: string; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 DeleteClusterInstances API
  const result = await request<
    DeleteClusterInstancesParams,
    DeleteClusterInstancesResponseData
  >({
    service: 'tke',
    version: '2018-05-25',
    action: 'DeleteClusterInstances',
    payload: params,
    endpoint: 'tke.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    JobId: result.Response.JobId,
    RequestId: result.Response.RequestId,
  }
}
