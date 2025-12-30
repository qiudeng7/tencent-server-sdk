import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * @group Subnet APIs
 * CreateSubnet API 请求参数
 */
interface CreateSubnetParams {
  /** VPC实例ID。可通过DescribeVpcs接口返回值中的VpcId获取 */
  VpcId: string
  /** 子网名称，最大长度不能超过60个字节 */
  SubnetName: string
  /** 子网网段，在VPC网段内，必须是VPC网段的子集。子网网段必须在VPC网段内，且与VPC内其他子网网段不重叠 */
  CidrBlock: string
  /** 可用区，形如：ap-guangzhou-1 */
  Zone?: string
  /** 是否开启组播。true: 开启, false: 不开启 */
  EnableMulticast?: boolean
  /** 指定绑定的标签列表 */
  Tags?: Array<{ Key: string; Value: string }>
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
 * CreateSubnet API 响应数据
 */
interface CreateSubnetResponseData {
  /** 子网对象 */
  Subnet: Subnet
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 创建子网
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 子网参数
 * @returns 包含 Subnet 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { createSubnet } from '@qiudeng/tencent-cloud-sdk'
 *
 * const subnet = await createSubnet(credential, {
 *   VpcId: 'vpc-xxxx',
 *   SubnetName: 'MySubnet',
 *   CidrBlock: '10.0.1.0/24',
 *   Zone: 'ap-guangzhou-2'
 * })
 * console.log('子网 ID:', subnet.Subnet.SubnetId)
 * ```
 *
 * @example
 * ```ts
 * // 创建开启组播的子网
 * const subnet = await createSubnet(credential, {
 *   VpcId: 'vpc-xxxx',
 *   SubnetName: 'MulticastSubnet',
 *   CidrBlock: '10.0.2.0/24',
 *   Zone: 'ap-guangzhou-3',
 *   EnableMulticast: true,
 *   Tags: [
 *     { Key: 'Environment', Value: 'production' }
 *   ]
 * })
 * ```
 */
export async function createSubnet(
  credential: TencentCloudCredential,
  params: CreateSubnetParams,
): Promise<{ Subnet: Subnet; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 CreateSubnet API
  const result = await request<
    CreateSubnetParams,
    CreateSubnetResponseData
  >({
    service: 'vpc',
    version: '2017-03-12',
    action: 'CreateSubnet',
    payload: params,
    endpoint: 'vpc.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    Subnet: result.Response.Subnet,
    RequestId: result.Response.RequestId,
  }
}
