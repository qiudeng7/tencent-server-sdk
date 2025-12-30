import type { TencentCloudCredential } from '#src/request'
import { runInstances } from '#src/api/instance/runInstances'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * K8s 服务器的默认配置
 * 从 src/k8s/createServerRef.js 中的 payload 提取
 */
interface DefaultK8sServerConfig {
  /** 实例计费类型 */
  InstanceChargeType: string
  /** 实例所在位置 */
  Placement: {
    /** 可用区 */
    Zone: string
  }
  /** 实例机型 */
  InstanceType: string
  /** 镜像 ID */
  ImageId: string
  /** 系统盘配置 */
  SystemDisk: {
    /** 系统盘类型 */
    DiskType: string
    /** 系统盘大小（GB） */
    DiskSize: number
  }
  /** 实例名称 */
  InstanceName: string
  /** 登录设置 */
  LoginSettings: {
    /** 登录密码 */
    Password: string
  }
  /** 主机名 */
  HostName: string
  /** 用户数据（base64 编码） */
  UserData: string
  /** 是否只预检请求 */
  DryRun: boolean
}

/**
 * 创建 K8s 服务器的用户配置
 * 允许覆盖默认配置的部分字段
 */
export interface CreateK8sServersParams {
  /** 覆盖默认配置 */
  override?: Partial<DefaultK8sServerConfig>
  /** 购买实例数量，默认为 1 */
  InstanceCount?: number
  /** 可用区，默认为 ap-nanjing-1 */
  Zone?: string
  /** 实例名称，会自动追加随机后缀 */
  InstanceName?: string
  /** 主机名，会自动追加随机后缀 */
  HostName?: string
  /** 登录密码 */
  Password?: string
  /** 其他 runInstances 支持的参数 */
  [key: string]: any
}

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
 * 从 src/k8s/createServerRef.js 提取
 */
const DEFAULT_K8S_SERVER_CONFIG: DefaultK8sServerConfig = {
  InstanceChargeType: 'SPOTPAID',
  Placement: {
    Zone: 'ap-nanjing-1'
  },
  InstanceType: 'SA9.MEDIUM4',
  ImageId: 'img-mmytdhbn',
  SystemDisk: {
    DiskType: 'CLOUD_BSSD',
    DiskSize: 20
  },
  InstanceName: '@qiudeng/tencent-server-sdk-for-k8s-',
  LoginSettings: {
    Password: '123456@ABC'
  },
  HostName: 'tencent-server-sdk-for-k8s',
  UserData: 'TXlVc2VyRGF0YQo=', // base64 编码的 "MyUserData"
  DryRun: false
}

/**
 * 生成随机后缀
 */
function generateSuffix(): string {
  return Math.random().toString(36).substring(2, 8)
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 创建 K8s 服务器实例
 *
 * 使用默认配置创建腾讯云服务器，同时允许用户覆盖部分配置
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 创建参数
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
 *   override: {
 *     InstanceType: 'S5.LARGE4',
 *     SystemDisk: { DiskType: 'CLOUD_PREMIUM', DiskSize: 50 }
 *   },
 *   InstanceCount: 2,
 *   Zone: 'ap-guangzhou-2'
 * })
 * ```
 *
 * @example
 * ```ts
 * // 使用自定义密码和实例名
 * const result = await createK8sServers(credential, {
 *   Password: 'YourSecurePassword123!',
 *   InstanceName: 'my-k8s-node',
 *   HostName: 'k8s-node'
 * })
 * ```
 *
 * @example
 * ```ts
 * // 完全自定义配置
 * const result = await createK8sServers(credential, {
 *   override: {
 *     InstanceChargeType: 'POSTPAID_BY_HOUR',
 *     ImageId: 'img-xxxxxxxx'
 *   },
 *   // 还可以添加其他 runInstances 支持的参数
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
  params: CreateK8sServersParams = {},
): Promise<CreateK8sServersResult> {
  const {
    override = {},
    InstanceCount = 1,
    Zone,
    InstanceName,
    HostName,
    Password,
    ...otherParams
  } = params

  // 合并默认配置和用户覆盖配置
  let config: DefaultK8sServerConfig = {
    ...DEFAULT_K8S_SERVER_CONFIG,
    ...override
  }

  // 如果用户指定了 Zone，覆盖默认值
  if (Zone) {
    config = {
      ...config,
      Placement: {
        ...config.Placement,
        Zone
      }
    }
  }

  // 如果用户指定了 InstanceName，添加随机后缀
  if (InstanceName) {
    config = {
      ...config,
      InstanceName: `${InstanceName}-${generateSuffix()}`
    }
  }

  // 如果用户指定了 HostName，添加随机后缀
  if (HostName) {
    config = {
      ...config,
      HostName: `${HostName}-${generateSuffix()}`
    }
  }

  // 如果用户指定了 Password，覆盖默认值
  if (Password) {
    config = {
      ...config,
      LoginSettings: {
        ...config.LoginSettings,
        Password
      }
    }
  }

  // 准备最终的请求参数
  const finalParams = {
    ...config,
    InstanceCount,
    ...otherParams
  }

  // 调用 runInstances API
  return await runInstances(credential, finalParams as any)
}
