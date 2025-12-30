import type { TencentCloudCredential } from '#src/request'

/**
 * @group Subnet APIs
 * 预判是否可建默认子网
 *
 * @param credential - 腾讯云密钥凭证
 * @param vpcId - VPC实例ID
 * @returns 包含 CanCreate 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { checkDefaultSubnet } from '@qiudeng/tencent-cloud-sdk'
 *
 * const result = await checkDefaultSubnet(credential, 'vpc-xxxx')
 * if (result.CanCreate) {
 *   console.log('可以创建默认子网')
 * } else {
 *   console.log('不能创建默认子网')
 * }
 * ```
 */
export async function checkDefaultSubnet(
  credential: TencentCloudCredential,
  vpcId: string,
): Promise<{ CanCreate: boolean; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  const request = createRequest(credential)

  const result = await request<
    { VpcId: string },
    { CanCreate: boolean }
  >({
    service: 'vpc',
    version: '2017-03-12',
    action: 'CheckDefaultSubnet',
    payload: { VpcId: vpcId },
    endpoint: 'vpc.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    CanCreate: result.Response.CanCreate,
    RequestId: result.Response.RequestId,
  }
}
