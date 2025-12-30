import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * @group VPC APIs
 * 标签对象
 */
interface Tag {
  /** 标签键 */
  Key: string
  /** 标签值 */
  Value: string
}

/**
 * CreateVpc API 请求参数
 */
interface CreateVpcParams {
  /** VPC名称，最大长度不能超过60个字节 */
  VpcName: string
  /** VPC的CIDR，仅能在10.0.0.0/12、172.16.0.0/12、192.168.0.0/16这三个内网网段内 */
  CidrBlock: string
  /** 是否开启组播。true: 开启, false: 不开启 */
  EnableMulticast?: string
  /** DNS地址，最多支持4个 */
  DnsServers?: string[]
  /** DHCP使用的域名 */
  DomainName?: string
  /** 指定绑定的标签列表 */
  Tags?: Tag[]
}

/**
 * IPv6 CIDR 信息
 */
interface IPv6CidrBlock {
  /** IPv6 CIDR 地址 */
  IPv6CidrBlock: string
  /** 运营商类型 */
  ISPType: string
}

/**
 * 辅助 CIDR 信息
 */
interface AssistantCidr {
  /** CIDR 网段 */
  CidrBlock: string
  /** 辅助类型 */
  AssistantType: number
  /** 子网列表 */
  SubnetSet?: any[]
}

/**
 * VPC 对象
 */
interface Vpc {
  /** VPC实例ID */
  VpcId: string
  /** VPC名称 */
  VpcName: string
  /** IPv4 CIDR 网段 */
  CidrBlock: string
  /** IPv6 CIDR 网段 */
  Ipv6CidrBlock?: string
  /** IPv6 CIDR 集合 */
  Ipv6CidrBlockSet?: IPv6CidrBlock[]
  /** 是否默认VPC */
  IsDefault: boolean
  /** 是否开启组播 */
  EnableMulticast: boolean
  /** 是否开启DHCP */
  EnableDhcp: boolean
  /** DHCP选项ID */
  DhcpOptionsId?: string
  /** DNS服务器列表 */
  DnsServerSet?: string[]
  /** DHCP域名 */
  DomainName?: string
  /** 创建时间 */
  CreatedTime: string
  /** 标签列表 */
  TagSet?: Tag[]
  /** 辅助CIDR列表 */
  AssistantCidrSet?: AssistantCidr[]
}

/**
 * CreateVpc API 响应数据
 */
interface CreateVpcResponseData {
  /** VPC对象 */
  Vpc: Vpc
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 创建私有网络（VPC）
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - VPC参数
 * @returns 包含 Vpc 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { createVpc } from '@qiudeng/tencent-cloud-sdk'
 *
 * const vpc = await createVpc(credential, {
 *   VpcName: 'MyVPC',
 *   CidrBlock: '10.8.0.0/16',
 *   EnableMulticast: 'false'
 * })
 * console.log('VPC ID:', vpc.Vpc.VpcId)
 * ```
 *
 * @example
 * ```ts
 * // 创建带标签的VPC
 * const vpc = await createVpc(credential, {
 *   VpcName: 'ProductionVPC',
 *   CidrBlock: '172.16.0.0/16',
 *   Tags: [
 *     { Key: 'Environment', Value: 'production' },
 *     { Key: 'City', Value: 'shanghai' }
 *   ]
 * })
 * ```
 */
export async function createVpc(
  credential: TencentCloudCredential,
  params: CreateVpcParams,
): Promise<{ Vpc: Vpc; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 CreateVpc API
  const result = await request<
    CreateVpcParams,
    CreateVpcResponseData
  >({
    service: 'vpc',
    version: '2017-03-12',
    action: 'CreateVpc',
    payload: params,
    endpoint: 'vpc.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    Vpc: result.Response.Vpc,
    RequestId: result.Response.RequestId,
  }
}
