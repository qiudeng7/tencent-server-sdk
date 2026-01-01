import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 节点高级设置
 */
interface InstanceAdvancedSettings {
  /** 节点自定义启动参数 */
  ExtraArgs?: string[]
  /** 节点是否作为网关 */
  NodeGateway?: boolean
  /** 数据盘挂载点 */
  MountTarget?: string
  /** Docker数据盘挂载点 */
  DockerDataDir?: string
  /** 节点是否加入魔库 */
  UserScript?: string
}

/**
 * 标签
 */
interface Tag {
  /** 标签键 */
  Key: string
  /** 标签值 */
  Value: string
}

/**
 * 节点网络配置
 */
interface InstanceNetworkSettings {
  /** 节点是否作为网关 */
  NodeGateway?: boolean
}

/**
 * AddExistedInstances API 请求参数
 */
interface AddExistedInstancesParams {
  /** 集群ID */
  ClusterId: string
  /** 节点实例ID列表 */
  InstanceIds: string[]
  /** 节点实例操作类型（加入集群） */
  OperationType?: 'Add' | 'Remove'
  /** 节点所属的节点池ID */
  NodePoolId?: string
  /** 节点高级设置 */
  InstanceAdvancedSettings?: InstanceAdvancedSettings
  /** 节点自定义参数 */
  NodeAdvancedSettings?: InstanceNetworkSettings
  /** 节点标签 */
  Tags?: Tag[]
  /** 是否跳过实例检查 */
  SkipCheck?: boolean
  /** 是否重置节点 */
  Reset?: boolean
}

/**
 * AddExistedInstances API 响应数据
 */
interface AddExistedInstancesResponseData {
  /** 任务ID */
  JobId?: string
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 添加已经存在的实例到集群
 *
 * @group TKE Node APIs
 * @param credential - 腾讯云密钥凭证
 * @param params - 添加参数
 * @returns 包含 JobId 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { addExistedInstances } from '@qiudeng/tencent-cloud-sdk'
 *
 * // 添加已存在的实例到集群
 * const { JobId } = await addExistedInstances(credential, {
 *   ClusterId: 'cls-xxxxx',
 *   InstanceIds: ['ins-xxxxx', 'ins-yyyyy']
 * })
 * console.log('任务ID:', JobId)
 * ```
 *
 * @example
 * ```ts
 * // 添加已存在的实例到集群并指定节点池
 * const { JobId } = await addExistedInstances(credential, {
 *   ClusterId: 'cls-xxxxx',
 *   InstanceIds: ['ins-xxxxx'],
 *   NodePoolId: 'np-xxxxx',
 *   Reset: true
 * })
 * ```
 *
 * @example
 * ```ts
 * // 添加已存在的实例到集群并配置高级设置
 * const { JobId } = await addExistedInstances(credential, {
 *   ClusterId: 'cls-xxxxx',
 *   InstanceIds: ['ins-xxxxx'],
 *   InstanceAdvancedSettings: {
 *     DockerDataDir: '/data/docker',
 *     UserScript: '#!/bin/bash\necho "Hello from user script"'
 *   },
 *   Tags: [
 *     { Key: 'Environment', Value: 'production' },
 *     { Key: 'Role', Value: 'worker' }
 *   ]
 * })
 * ```
 */
export async function addExistedInstances(
  credential: TencentCloudCredential,
  params: AddExistedInstancesParams,
): Promise<{ JobId?: string; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 AddExistedInstances API
  const result = await request<
    AddExistedInstancesParams,
    AddExistedInstancesResponseData
  >({
    service: 'tke',
    version: '2018-05-25',
    action: 'AddExistedInstances',
    payload: params,
    endpoint: 'tke.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    JobId: result.Response.JobId,
    RequestId: result.Response.RequestId,
  }
}
