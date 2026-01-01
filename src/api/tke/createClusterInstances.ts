import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 实例计费类型
 */
type InstanceChargeType = 'PREPAID' | 'POSTPAID_BY_HOUR'

/**
 * 数据盘配置
 */
interface DataDisk {
  /** 数据盘类型 */
  DiskType: 'CLOUD_BASIC' | 'CLOUD_PREMIUM' | 'CLOUD_SSD' | 'CLOUD_BSSD'
  /** 数据盘大小，单位：GB */
  DiskSize: number
  /** 文件系统类型 */
  FsType?: string
  /** 是否加密 */
  Encrypt?: boolean
  /** 加密密钥ID */
  KmsKeyId?: string
}

/**
 * 实例增强服务
 */
interface EnhancedService {
  /** 云监控服务 */
  MonitorService?: {
    /** 是否开启云监控服务 */
    Enabled: boolean
  }
  /** 云安全服务 */
  SecurityService?: {
    /** 是否开启云安全服务 */
    Enabled: boolean
  }
}

/**
 * 实例登录设置
 */
interface LoginSettings {
  /** 实例登录密码 */
  Password?: string
  /** 密钥对ID */
  KeyIds?: string[]
  /** 保持镜像的原始登录设置 */
  KeepImageLogin?: boolean
}

/**
 * 公网带宽相关信息设置
 */
interface InternetAccessible {
  /** 公网出带宽上限，单位：Mbps */
  InternetMaxBandwidthOut?: number
  /** 公网入带宽上限，单位：Mbps */
  InternetMaxBandwidthIn?: number
  /** 网络计费类型 */
  InternetChargeType?: 'TRAFFIC_POSTPAID_BY_HOUR' | 'BANDWIDTH_POSTPAID_BY_HOUR' | 'BANDWIDTH_PREPAID'
  /** 是否分配公网IP */
  PublicIpAssigned?: boolean
}

/**
 * 实例所在的节点池
 */
interface NodePoolInfo {
  /** 节点池ID */
  NodePoolId?: string
}

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
 * CreateClusterInstances API 请求参数
 */
interface CreateClusterInstancesParams {
  /** 集群ID */
  ClusterId: string
  /** 节点所在的地域 */
  Region: string
  /** 节点所在的可用区 */
  Zone: string
  /** 节点机器机型 */
  InstanceType: string
  /** 系统盘ID */
  ImageId: string
  /** 系统盘类型 */
  SystemDiskType?: 'CLOUD_BASIC' | 'CLOUD_PREMIUM' | 'CLOUD_SSD' | 'CLOUD_BSSD'
  /** 系统盘大小，单位：GB */
  SystemDiskSize?: number
  /** 购买节点数量 */
  InstanceCount?: number
  /** 节点计费类型 */
  InstanceChargeType?: InstanceChargeType
  /** 节点数据盘配置 */
  DataDisks?: DataDisk[]
  /** 节点带宽配置 */
  InternetAccessible?: InternetAccessible
  /** 节点登录设置 */
  LoginSettings?: LoginSettings
  /** 节点增强服务 */
  EnhancedService?: EnhancedService
  /** 节点所属子网 */
  SubnetId?: string
  /** 节点所属的节点池 */
  NodePoolInfo?: NodePoolInfo
  /** 节点高级设置 */
  InstanceAdvancedSettings?: InstanceAdvancedSettings
  /** 节点所属项目ID */
  ProjectId?: number
  /** 节点标签 */
  Tags?: Tag[]
  /** 节点自定义参数 */
  NodeAdvancedSettings?: InstanceNetworkSettings
  /** 节点名称 */
  InstanceName?: string
  /** 节点是否为GPU */
  IsGpu?: boolean
  /** 节点GPU类型 */
  GpuType?: string
  /** 节点GPU驱动版本 */
  GpuDriver?: string
  /** 节点GPU数量 */
  GpuCount?: number
}

/**
 * CreateClusterInstances API 响应数据
 */
interface CreateClusterInstancesResponseData {
  /** 节点实例ID列表 */
  InstanceIdSet?: string[]
  /** 任务ID */
  JobId?: string
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 扩展集群节点
 *
 * @group TKE Node APIs
 * @param credential - 腾讯云密钥凭证
 * @param params - 节点配置参数
 * @returns 包含 InstanceIdSet、JobId 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { createClusterInstances } from '@qiudeng/tencent-cloud-sdk'
 *
 * // 扩展集群节点
 * const { InstanceIdSet, JobId } = await createClusterInstances(credential, {
 *   ClusterId: 'cls-xxxxx',
 *   Region: 'ap-guangzhou',
 *   Zone: 'ap-guangzhou-3',
 *   InstanceType: 'S5.LARGE4',
 *   ImageId: 'img-pmqg1cw7',
 *   InstanceCount: 2,
 *   SystemDiskType: 'CLOUD_PREMIUM',
 *   SystemDiskSize: 50
 * })
 * console.log('节点实例IDs:', InstanceIdSet)
 * console.log('任务ID:', JobId)
 * ```
 *
 * @example
 * ```ts
 * // 扩展集群节点并配置数据盘和网络
 * const { InstanceIdSet } = await createClusterInstances(credential, {
 *   ClusterId: 'cls-xxxxx',
 *   Region: 'ap-guangzhou',
 *   Zone: 'ap-guangzhou-3',
 *   InstanceType: 'S5.LARGE4',
 *   ImageId: 'img-pmqg1cw7',
 *   InstanceCount: 1,
 *   SystemDiskType: 'CLOUD_SSD',
 *   SystemDiskSize: 50,
 *   DataDisks: [
 *     { DiskType: 'CLOUD_SSD', DiskSize: 100 }
 *   ],
 *   InternetAccessible: {
 *     InternetChargeType: 'TRAFFIC_POSTPAID_BY_HOUR',
 *     InternetMaxBandwidthOut: 10,
 *     PublicIpAssigned: true
 *   },
 *   LoginSettings: {
 *     Password: 'YourPassword123!'
 *   }
 * })
 * ```
 */
export async function createClusterInstances(
  credential: TencentCloudCredential,
  params: CreateClusterInstancesParams,
): Promise<{ InstanceIdSet?: string[]; JobId?: string; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 CreateClusterInstances API
  const result = await request<
    CreateClusterInstancesParams,
    CreateClusterInstancesResponseData
  >({
    service: 'tke',
    version: '2018-05-25',
    action: 'CreateClusterInstances',
    payload: params,
    endpoint: 'tke.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    InstanceIdSet: result.Response.InstanceIdSet,
    JobId: result.Response.JobId,
    RequestId: result.Response.RequestId,
  }
}
