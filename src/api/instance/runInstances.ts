import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 实例计费类型
 */
type InstanceChargeType = 'PREPAID' | 'POSTPAID_BY_HOUR' | 'CDHPAID' | 'SPOTPAID' | 'CDCPAID'

/**
 * 预付费（包年包月）相关参数
 */
interface InstanceChargePrepaid {
  /** 购买实例时长，单位：月 */
  Period: number
  /** 自动续费标识。NOTIFY_AND_AUTO_RENEW：通知过期且自动续费，NOTIFY_AND_MANUAL_RENEW：通知过期不自动续费，DISABLE_NOTIFY_AND_MANUAL_RENEW：不通知过期不自动续费 */
  RenewFlag?: 'NOTIFY_AND_AUTO_RENEW' | 'NOTIFY_AND_MANUAL_RENEW' | 'DISABLE_NOTIFY_AND_MANUAL_RENEW'
}

/**
 * 实例所在的位置
 */
interface Placement {
  /** 可用区，形如：ap-guangzhou-2 */
  Zone?: string
  /** 项目ID，默认为0 */
  ProjectId?: number
  /** 专用宿主机ID列表 */
  HostIds?: string[]
}

/**
 * 系统盘配置
 */
interface SystemDisk {
  /** 系统盘类型，CLOUD_BASIC：本地硬盘，CLOUD_PREMIUM：高性能云硬盘，CLOUD_SSD：SSD云硬盘，CLOUD_BSSD：增强型SSD云硬盘 */
  DiskType: 'CLOUD_BASIC' | 'CLOUD_PREMIUM' | 'CLOUD_SSD' | 'CLOUD_BSSD'
  /** 系统盘大小，单位：GB */
  DiskSize: number
}

/**
 * 数据盘配置
 */
interface DataDisk {
  /** 数据盘类型 */
  DiskType: 'CLOUD_BASIC' | 'CLOUD_PREMIUM' | 'CLOUD_SSD' | 'CLOUD_BSSD' | 'LOCAL_BASIC' | 'LOCAL_SSD'
  /** 数据盘大小，单位：GB */
  DiskSize: number
  /** 快照ID，如果使用快照创建数据盘，需指定快照ID */
  SnapshotId?: string
  /** 是否加密 */
  Encrypt?: boolean
  /** 加密密钥ID */
  KmsKeyId?: string
}

/**
 * 私有网络相关信息配置
 */
interface VirtualPrivateCloud {
  /** 私有网络ID */
  VpcId?: string
  /** 子网ID */
  SubnetId?: string
  /** 私有网络IP列表，与 InstanceCount 必须一致 */
  PrivateIpAddresses?: string[]
}

/**
 * 公网带宽相关信息设置
 */
interface InternetAccessible {
  /** 公网出带宽上限，单位：Mbps */
  InternetMaxBandwidthOut?: number
  /** 公网入带宽上限，单位：Mbps */
  InternetMaxBandwidthIn?: number
  /** 网络计费类型，TRAFFIC_POSTPAID_BY_HOUR：按流量按小时后付费，BANDWIDTH_POSTPAID_BY_HOUR：按带宽按小时后付费，BANDWIDTH_PREPAID：包年包月带宽 */
  InternetChargeType?: 'TRAFFIC_POSTPAID_BY_HOUR' | 'BANDWIDTH_POSTPAID_BY_HOUR' | 'BANDWIDTH_PREPAID'
  /** 是否分配公网IP */
  PublicIpAssigned?: boolean
  /** 带宽包ID */
  BandwidthPackageId?: string
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
 * 增强服务
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
 * 标签
 */
interface Tag {
  /** 标签键 */
  Key: string
  /** 标签值 */
  Value: string
}

/**
 * 标签规范
 */
interface TagSpecification {
  /** 资源类型，instance：实例，disk：云盘 */
  ResourceType: 'instance' | 'disk'
  /** 标签列表 */
  Tags?: Tag[]
}

/**
 * 定时任务
 */
interface ActionTimer {
  /** 定时任务类型，目前仅支持：TERMINATE_INSTANCE：定时销毁实例 */
  Action?: 'TERMINATE_INSTANCE'
  /** 执行时间，格式：yyyy-MM-dd HH:mm:ss */
  ExecuteTime?: string
}

/**
 * RunInstances API 请求参数
 */
interface RunInstancesParams {
  /** 实例计费类型 */
  InstanceChargeType?: InstanceChargeType
  /** 预付费（包年包月）相关参数设置 */
  InstanceChargePrepaid?: InstanceChargePrepaid
  /** 实例所在的位置 */
  Placement?: Placement
  /** 实例机型 */
  InstanceType?: string
  /** 镜像ID */
  ImageId: string
  /** 系统盘配置 */
  SystemDisk?: SystemDisk
  /** 数据盘配置 */
  DataDisks?: DataDisk[]
  /** 私有网络相关信息配置 */
  VirtualPrivateCloud?: VirtualPrivateCloud
  /** 公网带宽相关信息设置 */
  InternetAccessible?: InternetAccessible
  /** 购买实例数量 */
  InstanceCount?: number
  /** 实例显示名称 */
  InstanceName?: string
  /** 实例登录设置 */
  LoginSettings?: LoginSettings
  /** 实例所属安全组 */
  SecurityGroupIds?: string[]
  /** 增强服务 */
  EnhancedService?: EnhancedService
  /** 实例主机名 */
  HostName?: string
  /** 定时任务 */
  ActionTimer?: ActionTimer
  /** 标签描述列表 */
  TagSpecification?: TagSpecification[]
  /** 客户端token */
  ClientToken?: string
  /** 用户数据 */
  UserData?: string
  /** 是否只预检此次请求 */
  DryRun?: boolean
  /** CAM角色名称 */
  CamRoleName?: string
  /** 是否禁止通过API删除实例 */
  DisableApiTermination?: boolean
  /** 是否开启巨型帧 */
  EnableJumboFrame?: boolean
}

/**
 * RunInstances API 响应数据
 */
interface RunInstancesResponseData {
  /** 实例ID列表 */
  InstanceIdSet: string[]
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 创建一个或多个指定配置的实例
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 实例配置参数
 * @returns 包含 InstanceIdSet 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { runInstances } from '@qiudeng/tencent-cloud-sdk'
 *
 * // 最简单的创建方式：只指定可用区和镜像
 * const result = await runInstances(credential, {
 *   Placement: { Zone: 'ap-guangzhou-2' },
 *   ImageId: 'img-pmqg1cw7'
 * })
 * console.log('实例 IDs:', result.InstanceIdSet)
 * ```
 *
 * @example
 * ```ts
 * // 按小时后付费实例
 * const result = await runInstances(credential, {
 *   Placement: { Zone: 'ap-guangzhou-2' },
 *   ImageId: 'img-pmqg1cw7',
 *   InstanceType: 'S5.LARGE4',
 *   SystemDisk: { DiskType: 'CLOUD_PREMIUM', DiskSize: 50 },
 *   InstanceCount: 1,
 *   InstanceName: 'MyInstance',
 *   LoginSettings: { Password: 'YourPassword123!' },
 *   InternetAccessible: {
 *     InternetChargeType: 'TRAFFIC_POSTPAID_BY_HOUR',
 *     InternetMaxBandwidthOut: 10,
 *     PublicIpAssigned: true
 *   },
 *   EnhancedService: {
 *     MonitorService: { Enabled: true },
 *     SecurityService: { Enabled: true }
 *   }
 * })
 * ```
 *
 * @example
 * ```ts
 * // 包年包月实例
 * const result = await runInstances(credential, {
 *   Placement: { Zone: 'ap-guangzhou-2' },
 *   ImageId: 'img-pmqg1cw7',
 *   InstanceType: 'S5.16XLARGE256',
 *   InstanceChargeType: 'PREPAID',
 *   InstanceChargePrepaid: {
 *     Period: 1,
 *     RenewFlag: 'NOTIFY_AND_AUTO_RENEW'
 *   },
 *   SystemDisk: { DiskType: 'CLOUD_PREMIUM', DiskSize: 50 },
 *   DataDisks: [
 *     { DiskType: 'CLOUD_PREMIUM', DiskSize: 100 }
 *   ]
 * })
 * ```
 *
 * @example
 * ```ts
 * // 使用私有网络
 * const result = await runInstances(credential, {
 *   Placement: { Zone: 'ap-guangzhou-2' },
 *   ImageId: 'img-pmqg1cw7',
 *   InstanceType: 'S5.LARGE4',
 *   VirtualPrivateCloud: {
 *     VpcId: 'vpc-xxxx',
 *     SubnetId: 'subnet-xxxx'
 *   }
 * })
 * ```
 *
 * @example
 * ```ts
 * // 批量创建实例并指定私有网络IP
 * const result = await runInstances(credential, {
 *   Placement: { Zone: 'ap-guangzhou-2' },
 *   ImageId: 'img-dkwyg6sr',
 *   InstanceType: 'S5.16XLARGE256',
 *   InstanceCount: 2,
 *   VirtualPrivateCloud: {
 *     VpcId: 'vpc-xxxx',
 *     SubnetId: 'subnet-xxxx',
 *     PrivateIpAddresses: ['10.0.0.18', '10.0.0.19']
 *   }
 * })
 * ```
 */
export async function runInstances(
  credential: TencentCloudCredential,
  params: RunInstancesParams,
): Promise<{ InstanceIdSet: string[]; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 RunInstances API
  const result = await request<
    RunInstancesParams,
    RunInstancesResponseData
  >({
    service: 'cvm',
    version: '2017-03-12',
    action: 'RunInstances',
    payload: params,
    endpoint: 'cvm.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    InstanceIdSet: result.Response.InstanceIdSet,
    RequestId: result.Response.RequestId,
  }
}
