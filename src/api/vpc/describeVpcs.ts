import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * @group VPC APIs
 * 过滤器对象
 */
interface Filter {
  /** 过滤器名称 */
  Name: string
  /** 过滤器值列表 */
  Values: string[]
}

/**
 * 标签对象
 */
interface Tag {
  /** 标签键 */
  Key: string
  /** 标签值 */
  Value: string
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
 * DescribeVpcs API 请求参数
 */
interface DescribeVpcsParams {
  /** VPC实例ID数组。每次请求的实例的上限为100 */
  VpcIds?: string[]
  /** 过滤器列表 */
  Filters?: Filter[]
  /** 偏移量，默认为0 */
  Offset?: number
  /** 返回数量，默认为20，最大值为100 */
  Limit?: number
}

/**
 * DescribeVpcs API 响应数据
 */
interface DescribeVpcsResponseData {
  /** 符合条件的对象数 */
  TotalCount: number
  /** VPC对象列表 */
  VpcSet: Vpc[]
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 查询私有网络（VPC）列表
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 查询参数
 * @returns 包含 VpcSet、TotalCount 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { describeVpcs } from '@qiudeng/tencent-cloud-sdk'
 *
 * // 查询所有VPC
 * const { VpcSet, TotalCount } = await describeVpcs(credential)
 * console.log('VPC列表:', VpcSet)
 * console.log('总数:', TotalCount)
 * ```
 *
 * @example
 * ```ts
 * // 按VPC ID查询
 * const { VpcSet } = await describeVpcs(credential, {
 *   VpcIds: ['vpc-f49l6u0z', 'vpc-3ptx9s8b']
 * })
 * ```
 *
 * @example
 * ```ts
 * // 使用过滤器查询
 * const { VpcSet } = await describeVpcs(credential, {
 *   Filters: [
 *     {
 *       Name: 'vpc-name',
 *       Values: ['MyVPC']
 *     },
 *     {
 *       Name: 'is-default',
 *       Values: ['false']
 *     }
 *   ],
 *   Limit: 10
 * })
 * ```
 *
 * @example
 * ```ts
 * // 按CIDR过滤
 * const { VpcSet } = await describeVpcs(credential, {
 *   Filters: [
 *     {
 *       Name: 'cidr-block',
 *       Values: ['10.0.0.0/16', '192.168.0.0/16']
 *     }
 *   ]
 * })
 * ```
 *
 * @example
 * ```ts
 * // 按标签过滤
 * const { VpcSet } = await describeVpcs(credential, {
 *   Filters: [
 *     {
 *       Name: 'tag:city',
 *       Values: ['shanghai']
 *     }
 *   ]
 * })
 * ```
 */
export async function describeVpcs(
  credential: TencentCloudCredential,
  params: DescribeVpcsParams = {},
): Promise<{ VpcSet: Vpc[]; TotalCount: number; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 DescribeVpcs API
  const result = await request<
    DescribeVpcsParams,
    DescribeVpcsResponseData
  >({
    service: 'vpc',
    version: '2017-03-12',
    action: 'DescribeVpcs',
    payload: params,
    endpoint: 'vpc.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    VpcSet: result.Response.VpcSet,
    TotalCount: result.Response.TotalCount,
    RequestId: result.Response.RequestId,
  }
}
