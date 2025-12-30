import type { TencentCloudCredential } from '#src/request'

/**
 * @group Subnet APIs
 * 释放IPv6子网段
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 释放参数
 * @returns 包含 RequestId 的对象
 *
 * @example
 * ```ts
 * import { unassignIpv6SubnetCidrBlock } from '@qiudeng/tencent-cloud-sdk'
 *
 * const result = await unassignIpv6SubnetCidrBlock(credential, {
 *   SubnetId: 'subnet-xxxx',
 *   Ipv6CidrBlock: '3402:4e00:20:1200::/64'
 * })
 * console.log('释放成功，Request ID:', result.RequestId)
 * ```
 */
export async function unassignIpv6SubnetCidrBlock(
  credential: TencentCloudCredential,
  params: {
    /** 子网实例ID */
    SubnetId: string
    /** IPv6 CIDR网段 */
    Ipv6CidrBlock: string
  },
): Promise<{ RequestId: string }> {
  const { createRequest } = await import('#src/request')

  const request = createRequest(credential)

  const result = await request<
    typeof params,
    {}
  >({
    service: 'vpc',
    version: '2017-03-12',
    action: 'UnassignIpv6SubnetCidrBlock',
    payload: params,
    endpoint: 'vpc.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    RequestId: result.Response.RequestId,
  }
}
