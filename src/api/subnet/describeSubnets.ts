import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 过滤器对象
 */
interface Filter {
  /** 过滤器名称 */
  Name: string
  /** 过滤器值列表 */
  Values: string[]
}

/**
 * 子网对象
 */
interface Subnet {
  /** 子网实例ID */
  SubnetId: string
  /** 子网名称 */
  SubnetName: string
  /** VPC实例ID */
  VpcId: string
  /** CIDR网段 */
  CidrBlock: string
  /** IPv6 CIDR 网段 */
  Ipv6CidrBlock?: string
  /** 可用区 */
  Zone: string
  /** 是否默认子网 */
  IsDefault: boolean
  /** 是否开启组播 */
  EnableMulticast: boolean
  /** 是否开启DHCP */
  EnableDhcp?: boolean
  /** 路由表ID */
  RouteTableId?: string
  /** 创建时间 */
  CreatedTime: string
  /** 可用IP数 */
  AvailableIpAddressCount: number
  /** 总IP数 */
  TotalIpAddressCount: number
  /** 标签列表 */
  TagSet?: Array<{ Key: string; Value: string }>
}

/**
 * DescribeSubnets API 请求参数
 */
interface DescribeSubnetsParams {
  /** 子网实例ID数组 */
  SubnetIds?: string[]
  /** VPC实例ID数组 */
  VpcIds?: string[]
  /** 过滤器列表 */
  Filters?: Filter[]
  /** 偏移量 */
  Offset?: number
  /** 返回数量，默认为20，最大值为100 */
  Limit?: number
}

/**
 * DescribeSubnets API 响应数据
 */
interface DescribeSubnetsResponseData {
  /** 符合条件的对象数 */
  TotalCount: number
  /** 子网对象列表 */
  SubnetSet: Subnet[]
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 查询子网列表
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 查询参数
 * @returns 包含 SubnetSet、TotalCount 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { describeSubnets } from '@qiudeng/tencent-cloud-sdk'
 *
 * // 查询所有子网
 * const { SubnetSet, TotalCount } = await describeSubnets(credential)
 * ```
 *
 * @example
 * ```ts
 * // 按子网ID查询
 * const { SubnetSet } = await describeSubnets(credential, {
 *   SubnetIds: ['subnet-xxxx', 'subnet-yyyy']
 * })
 * ```
 *
 * @example
 * ```ts
 * // 按VPC ID查询
 * const { SubnetSet } = await describeSubnets(credential, {
 *   VpcIds: ['vpc-xxxx']
 * })
 * ```
 *
 * @example
 * ```ts
 * // 使用过滤器查询
 * const { SubnetSet } = await describeSubnets(credential, {
 *   Filters: [
 *     { Name: 'subnet-name', Values: ['MySubnet'] }
 *   ],
 *   Limit: 10
 * })
 * ```
 */
export async function describeSubnets(
  credential: TencentCloudCredential,
  params: DescribeSubnetsParams = {},
): Promise<{ SubnetSet: Subnet[]; TotalCount: number; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  const request = createRequest(credential)

  const result = await request<
    DescribeSubnetsParams,
    DescribeSubnetsResponseData
  >({
    service: 'vpc',
    version: '2017-03-12',
    action: 'DescribeSubnets',
    payload: params,
    endpoint: 'vpc.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    SubnetSet: result.Response.SubnetSet,
    TotalCount: result.Response.TotalCount,
    RequestId: result.Response.RequestId,
  }
}
