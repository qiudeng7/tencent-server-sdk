import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 删除私有网络（VPC）
 *
 * @param credential - 腾讯云密钥凭证
 * @param vpcId - VPC实例ID
 * @returns 包含 RequestId 的对象
 *
 * @example
 * ```ts
 * import { deleteVpc } from '@qiudeng/tencent-cloud-sdk'
 *
 * const result = await deleteVpc(credential, 'vpc-3ptx9s8b')
 * console.log('删除成功，Request ID:', result.RequestId)
 * ```
 *
 * @warning
 * 删除私有网络是不可逆的操作，请谨慎处理。
 * 删除前请确保 VPC 内已经没有相关资源，例如云服务器、云数据库、NoSQL、VPN网关、专线网关、负载均衡、对等连接等。
 */
export async function deleteVpc(
  credential: TencentCloudCredential,
  vpcId: string,
): Promise<{ RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 DeleteVpc API
  const result = await request<
    { VpcId: string },
    {}
  >({
    service: 'vpc',
    version: '2017-03-12',
    action: 'DeleteVpc',
    payload: {
      VpcId: vpcId,
    },
    endpoint: 'vpc.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    RequestId: result.Response.RequestId,
  }
}
