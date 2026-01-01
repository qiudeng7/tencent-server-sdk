import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 集群类型
 */
type ClusterType = 'MANAGED_CLUSTER' | 'INDEPENDENT_CLUSTER'

/**
 * 集群容器网络类型
 */
type ClusterCIDRType = 'CIDR' | 'VPC-CNI' | 'VPC-CNI-AC'

/**
 * 容器网络插件
 */
type NetworkPlugin = 'VXLAN' | 'VPC-CNI' | 'GLOBAL-VPC'

/**
 * 容器网络 IP 丢失策略
 */
type IPvsStrategy = 'CLUSTER_IP' | 'LVS_IP'

/**
 * 集群认证方式
 */
type ClusterAuthType = 'NONE' | 'CBR' | 'AAD'

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
 * 集群高级设置
 */
interface ClusterAdvancedSettings {
  /** 是否开启IPVS */
  IPvs?: boolean
  /** 是否开启as-network */
  AsNetwork?: boolean
  /** 容器网络IP丢失策略 */
  ContainerNetworkType?: 'ALL' | 'NONE'
  /** 集群QPS限额 */
  QPSBase?: number
  /** 开启CPU CFS配额 */
  CpuCfsQuota?: boolean
  /** 开启事件持久化 */
  EventPersistEnable?: boolean
  /** 开启审计日志 */
  AuditEnable?: boolean
}

/**
 * 节点自定义参数
 */
interface InstanceExtraArgs {
  /** 节点自定义启动参数 */
  ExtraArgs?: string[]
}

/**
 * 节点网络配置
 */
interface InstanceNetworkSettings {
  /** 节点是否作为网关 */
  NodeGateway?: boolean
}

/**
 * CreateCluster API 请求参数
 */
interface CreateClusterParams {
  /** 集群名称 */
  ClusterName: string
  /** 集群类型 */
  ClusterType?: ClusterType
  /** 集群容器网络类型 */
  ClusterCIDRType?: ClusterCIDRType
  /** 容器网络插件 */
  NetworkPlugin?: NetworkPlugin
  /** 容器网络网段 */
  ClusterCidr?: string
  /** VPC网络名称 */
  VpcId?: string
  /** 集群描述 */
  ClusterDesc?: string
  /** 集群加密类型 */
  ClusterAuthType?: ClusterAuthType
  /** 集群所属子网 */
  SubnetIds?: string[]
  /** 集群所属项目ID */
  ProjectId?: number
  /** 集群标签 */
  Tags?: Tag[]
  /** 集群高级设置 */
  ClusterAdvancedSettings?: ClusterAdvancedSettings
  /** 节点自定义参数 */
  InstanceAdvancedSettings?: InstanceExtraArgs
  /** 节点网络配置 */
  NodeAdvancedSettings?: InstanceNetworkSettings
  /** 集群kube代理模式 */
  KubeProxyMode?: 'iptables' | 'ipvs'
  /** 容器网络IP丢失策略 */
  IPvsStrategy?: IPvsStrategy
  /** 开启节点自动打标签（子网） */
  AutoLaunchSubnets?: string[]
  /** 是否为托管集群 */
  ManagedCluster?: boolean
  /** 是否为独立集群 */
  IndependentCluster?: boolean
  /** 是否为超级节点 */
  SuperCluster?: boolean
  /** 是否开启边缘容器 */
  EdgeCluster?: boolean
  /** 是否为边缘托管集群 */
  EdgeManagedCluster?: boolean
}

/**
 * 集群信息
 */
interface Cluster {
  /** 集群ID */
  ClusterId: string
  /** 集群名称 */
  ClusterName: string
  /** 集群描述 */
  ClusterDescription?: string
  /** 集群类型 */
  ClusterType?: string
  /** 集群版本 */
  ClusterVersion?: string
  /** 集群地域 */
  Region?: string
  /** 集群CIDR */
  ClusterCidr?: string
  /** 集群状态 */
  ClusterState?: string
  /** 创建时间 */
  CreatedTime?: string
  /** 集群标签 */
  TagSet?: Tag[]
}

/**
 * CreateCluster API 响应数据
 */
interface CreateClusterResponseData {
  /** 集群ID */
  ClusterId: string
  /** 集群信息 */
  Cluster?: Cluster
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 创建集群
 *
 * @group TKE Cluster APIs
 * @param credential - 腾讯云密钥凭证
 * @param params - 集群配置参数
 * @returns 包含 ClusterId、Cluster 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { createCluster } from '@qiudeng/tencent-cloud-sdk'
 *
 * // 创建托管集群
 * const { ClusterId, Cluster } = await createCluster(credential, {
 *   ClusterName: 'my-cluster',
 *   ClusterType: 'MANAGED_CLUSTER',
 *   VpcId: 'vpc-xxxxx',
 *   SubnetIds: ['subnet-xxxxx']
 * })
 * console.log('集群ID:', ClusterId)
 * ```
 *
 * @example
 * ```ts
 * // 创建独立集群
 * const { ClusterId } = await createCluster(credential, {
 *   ClusterName: 'my-independent-cluster',
 *   ClusterType: 'INDEPENDENT_CLUSTER',
 *   ClusterCIDRType: 'VPC-CNI',
 *   VpcId: 'vpc-xxxxx',
 *   SubnetIds: ['subnet-xxxxx'],
 *   ClusterAdvancedSettings: {
 *     IPvs: true,
 *     QPSBase: 100
 *   }
 * })
 * ```
 */
export async function createCluster(
  credential: TencentCloudCredential,
  params: CreateClusterParams,
): Promise<{ ClusterId: string; Cluster?: Cluster; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 CreateCluster API
  const result = await request<
    CreateClusterParams,
    CreateClusterResponseData
  >({
    service: 'tke',
    version: '2018-05-25',
    action: 'CreateCluster',
    payload: params,
    endpoint: 'tke.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    ClusterId: result.Response.ClusterId,
    Cluster: result.Response.Cluster,
    RequestId: result.Response.RequestId,
  }
}
