import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 批量创建子网的参数
 */
interface SubnetInput {
  /** 子网名称 */
  SubnetName: string
  /** CIDR网段 */
  CidrBlock: string
  /** 可用区 */
  Zone?: string
}

/**
 * CreateSubnets API 请求参数
 */
interface CreateSubnetsParams {
  /** VPC实例ID */
  VpcId: string
  /** 子网信息数组 */
  Subnets: SubnetInput[]
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
  /** 可用区 */
  Zone: string
  /** 是否默认子网 */
  IsDefault: boolean
  /** 创建时间 */
  CreatedTime: string
}

/**
 * CreateSubnets API 响应数据
 */
interface CreateSubnetsResponseData {
  /** 子网对象集合 */
  SubnetSet: Subnet[]
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 批量创建子网
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 批量创建参数
 * @returns 包含 SubnetSet 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { createSubnets } from '@qiudeng/tencent-cloud-sdk'
 *
 * const result = await createSubnets(credential, {
 *   VpcId: 'vpc-xxxx',
 *   Subnets: [
 *     { SubnetName: 'Subnet1', CidrBlock: '10.0.1.0/24', Zone: 'ap-guangzhou-2' },
 *     { SubnetName: 'Subnet2', CidrBlock: '10.0.2.0/24', Zone: 'ap-guangzhou-3' }
 *   ]
 * })
 * console.log('创建的子网:', result.SubnetSet)
 * ```
 */
export async function createSubnets(
  credential: TencentCloudCredential,
  params: CreateSubnetsParams,
): Promise<{ SubnetSet: Subnet[]; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  const request = createRequest(credential)

  const result = await request<
    CreateSubnetsParams,
    CreateSubnetsResponseData
  >({
    service: 'vpc',
    version: '2017-03-12',
    action: 'CreateSubnets',
    payload: params,
    endpoint: 'vpc.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    SubnetSet: result.Response.SubnetSet,
    RequestId: result.Response.RequestId,
  }
}
