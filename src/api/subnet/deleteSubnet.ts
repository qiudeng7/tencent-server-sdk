import type { TencentCloudCredential } from '#src/request'

/**
 * 删除子网
 *
 * @param credential - 腾讯云密钥凭证
 * @param subnetId - 子网实例ID
 * @returns 包含 RequestId 的对象
 *
 * @example
 * ```ts
 * import { deleteSubnet } from '@qiudeng/tencent-cloud-sdk'
 *
 * const result = await deleteSubnet(credential, 'subnet-xxxx')
 * console.log('删除成功，Request ID:', result.RequestId)
 * ```
 *
 * @warning
 * 删除子网前，请确保子网内没有云资源，例如云服务器、负载均衡、云数据库等。
 */
export async function deleteSubnet(
  credential: TencentCloudCredential,
  subnetId: string,
): Promise<{ RequestId: string }> {
  const { createRequest } = await import('#src/request')

  const request = createRequest(credential)

  const result = await request<
    { SubnetId: string },
    {}
  >({
    service: 'vpc',
    version: '2017-03-12',
    action: 'DeleteSubnet',
    payload: { SubnetId: subnetId },
    endpoint: 'vpc.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    RequestId: result.Response.RequestId,
  }
}
