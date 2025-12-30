import type { TencentCloudCredential } from '#src/request'

/**
 * 分配IPv6子网段
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 分配参数
 * @returns 包含 Ipv6CidrBlock 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { assignIpv6SubnetCidrBlock } from '@qiudeng/tencent-cloud-sdk'
 *
 * const result = await assignIpv6SubnetCidrBlock(credential, {
 *   SubnetId: 'subnet-xxxx',
 *   Ipv6CidrBlock: '3402:4e00:20:1200::/64'
 * })
 * console.log('IPv6 CIDR:', result.Ipv6CidrBlock)
 * ```
 */
export async function assignIpv6SubnetCidrBlock(
  credential: TencentCloudCredential,
  params: {
    /** 子网实例ID */
    SubnetId: string
    /** IPv6 CIDR网段 */
    Ipv6CidrBlock: string
  },
): Promise<{ Ipv6CidrBlock: string; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  const request = createRequest(credential)

  const result = await request<
    typeof params,
    { Ipv6CidrBlock: string }
  >({
    service: 'vpc',
    version: '2017-03-12',
    action: 'AssignIpv6SubnetCidrBlock',
    payload: params,
    endpoint: 'vpc.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    Ipv6CidrBlock: result.Response.Ipv6CidrBlock,
    RequestId: result.Response.RequestId,
  }
}
