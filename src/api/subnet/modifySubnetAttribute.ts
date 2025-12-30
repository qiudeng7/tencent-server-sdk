import type { TencentCloudCredential } from '#src/request'

/**
 * 修改子网属性
 *
 * @param credential - 腾讯云密钥凭证
 * @param params - 修改参数
 * @returns 包含 RequestId 的对象
 *
 * @example
 * ```ts
 * import { modifySubnetAttribute } from '@qiudeng/tencent-cloud-sdk'
 *
 * const result = await modifySubnetAttribute(credential, {
 *   SubnetId: 'subnet-xxxx',
 *   SubnetName: 'NewSubnetName'
 * })
 * ```
 */
export async function modifySubnetAttribute(
  credential: TencentCloudCredential,
  params: {
    /** 子网实例ID */
    SubnetId: string
    /** 子网名称 */
    SubnetName: string
    /** 是否开启组播 */
    EnableMulticast?: boolean
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
    action: 'ModifySubnetAttribute',
    payload: params,
    endpoint: 'vpc.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    RequestId: result.Response.RequestId,
  }
}
