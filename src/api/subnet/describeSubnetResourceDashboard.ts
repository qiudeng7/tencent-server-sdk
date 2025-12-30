import type { TencentCloudCredential } from '#src/request'

/**
 * @group Subnet APIs
 * 查看子网资源信息
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 查询参数
 * @returns 包含资源统计和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { describeSubnetResourceDashboard } from '@qiudeng/tencent-cloud-sdk'
 *
 * const result = await describeSubnetResourceDashboard(credential, {
 *   SubnetIds: ['subnet-xxxx']
 * })
 * console.log('资源统计:', result.DataSet)
 * ```
 */
export async function describeSubnetResourceDashboard(
  credential: TencentCloudCredential,
  params: {
    /** 子网实例ID数组 */
    SubnetIds?: string[]
  } = {},
): Promise<any> {
  const { createRequest } = await import('#src/request')

  const request = createRequest(credential)

  const result = await request<
    typeof params,
    any
  >({
    service: 'vpc',
    version: '2017-03-12',
    action: 'DescribeSubnetResourceDashboard',
    payload: params,
    endpoint: 'vpc.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    ...result.Response,
    RequestId: result.Response.RequestId,
  }
}
