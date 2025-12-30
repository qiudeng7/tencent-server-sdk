import type { TencentCloudCredential } from '#src/request'
import { runInstances } from '#src/api/instance/runInstances'
import type { RunInstancesParams } from '#src/api/instance/runInstances'

// prepareScript这样导入进来就是字符串
// 参考 https://cn.vite.dev/guide/assets#importing-asset-as-string
import prepareScript from '../../prepare.sh?raw'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 创建 K8s 服务器的参数
 * 直接使用 runInstances 的参数类型，会自动与默认配置合并
 */
export type CreateK8sServersParams = RunInstancesParams

/**
 * 创建 K8s 服务器的结果
 */
export interface CreateK8sServersResult {
  /** 实例 ID 列表 */
  InstanceIdSet: string[]
  /** 请求 ID */
  RequestId: string
}

// ============================================================================
// 默认配置
// ============================================================================

/**
 * 默认的 K8s 服务器配置
 * 从 src/k8s/createServerRef.js 中的 payload 提取
 */
const DEFAULT_K8S_SERVER_CONFIG = {
  /** 实例计费类型 */
  InstanceChargeType: 'SPOTPAID',
  /** 实例所在位置 */
  Placement: {
    /** 可用区 */
    Zone: 'ap-nanjing-1'
  },
  /** 实例机型 */
  InstanceType: 'SA9.MEDIUM4',
  /** 镜像 ID */
  ImageId: 'img-mmytdhbn',
  /** 系统盘配置 */
  SystemDisk: {
    /** 系统盘类型 */
    DiskType: 'CLOUD_BSSD',
    /** 系统盘大小（GB） */
    DiskSize: 20
  },
  /** 实例名称 */
  InstanceName: '@qiudeng/tencent-server-sdk-for-k8s-',
  /** 登录设置 */
  LoginSettings: {
    /** 登录密码 */
    Password: '123456@ABC'
  },
  /** 主机名 */
  HostName: 'tencent-server-sdk-for-k8s',
  /** 用户数据（base64 编码的 prepare.sh） */
  UserData: btoa(prepareScript),
  /** 是否只预检请求 */
  DryRun: false
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 创建 K8s 服务器实例
 *
 * 使用默认配置创建腾讯云服务器，同时允许用户通过传入 runInstances 参数覆盖默认配置
 * 
 * 默认配置是创建最便宜的竞价式服务器，并自动安装docker, kubelet,kubectl等，暂时并没有支持动态查询最便宜的服务器。
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 创建参数（与 runInstances 参数格式相同，会与默认配置合并）
 * @returns 包含实例 ID 列表和请求 ID 的对象
 *
 * @example
 * ```ts
 * import { createK8sServers } from '@qiudeng/tencent-cloud-sdk/k8s'
 *
 * // 使用默认配置创建
 * const result = await createK8sServers(credential, {
 *   InstanceCount: 3
 * })
 * console.log('创建的实例:', result.InstanceIdSet)
 * ```
 *
 * @example
 * ```ts
 * // 覆盖部分配置
 * const result = await createK8sServers(credential, {
 *   InstanceType: 'S5.LARGE4',
 *   SystemDisk: { DiskType: 'CLOUD_PREMIUM', DiskSize: 50 },
 *   InstanceCount: 2,
 *   Placement: { Zone: 'ap-guangzhou-2' }
 * })
 * ```
 *
 * @example
 * ```ts
 * // 使用自定义密码和实例名
 * const result = await createK8sServers(credential, {
 *   LoginSettings: { Password: 'YourSecurePassword123!' },
 *   InstanceName: 'my-k8s-node',
 *   HostName: 'k8s-node'
 * })
 * ```
 *
 * @example
 * ```ts
 * // 完全自定义配置
 * const result = await createK8sServers(credential, {
 *   InstanceChargeType: 'POSTPAID_BY_HOUR',
 *   ImageId: 'img-xxxxxxxx',
 *   VirtualPrivateCloud: {
 *     VpcId: 'vpc-xxxx',
 *     SubnetId: 'subnet-xxxx'
 *   },
 *   SecurityGroupIds: ['sg-xxxx'],
 *   InstanceCount: 1
 * })
 * ```
 */
export async function createK8sServers(
  credential: TencentCloudCredential,
  params: CreateK8sServersParams = {} as any,
): Promise<CreateK8sServersResult> {
  // 合并默认配置和用户配置
  const mergedParams = {
    ...DEFAULT_K8S_SERVER_CONFIG,
    ...params
  } as RunInstancesParams

  // 调用 runInstances API
  return await runInstances(credential, mergedParams)
}
