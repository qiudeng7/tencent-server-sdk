import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * DescribeClusterSecurity API 请求参数
 */
interface DescribeClusterSecurityParams {
  /** 集群ID */
  ClusterId: string
}

/**
 * 认证信息
 */
interface ClusterCredential {
  /** 集群ID */
  ClusterId: string
  /** 集群名称 */
  ClusterName?: string
  /** 集群描述 */
  ClusterDescription?: string
  /** 集群证书 */
  ClusterCert?: string
  /** 集群Endpoint */
  ClusterEndpoint?: string
  /** 集群外部Endpoint */
  ClusterExternalEndpoint?: string
  /** 集群CA证书 */
  ClusterCACert?: string
  /** 域名 */
  Domain?: string
  /** 用户名 */
  Username?: string
  /** 密码 */
  Password?: string
  /** 认证类型 */
  ClusterType?: string
  /** 集群版本 */
  ClusterVersion?: string
  /** 集群状态 */
  ClusterState?: string
  /** 集群CIDR */
  ClusterCidr?: string
}

/**
 * DescribeClusterSecurity API 响应数据
 */
interface DescribeClusterSecurityResponseData {
  /** 集群认证信息 */
  ClusterCredential?: ClusterCredential
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 集群的密钥信息
 *
 * @group TKE Cluster APIs
 * @param credential - 腾讯云密钥凭证
 * @param params - 查询参数
 * @returns 包含 ClusterCredential 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { describeClusterSecurity } from '@qiudeng/tencent-cloud-sdk'
 *
 * // 查询集群密钥信息
 * const { ClusterCredential } = await describeClusterSecurity(credential, {
 *   ClusterId: 'cls-xxxxx'
 * })
 *
 * if (ClusterCredential) {
 *   console.log('集群ID:', ClusterCredential.ClusterId)
 *   console.log('集群名称:', ClusterCredential.ClusterName)
 *   console.log('集群证书:', ClusterCredential.ClusterCert)
 *   console.log('集群CA证书:', ClusterCredential.ClusterCACert)
 *   console.log('集群Endpoint:', ClusterCredential.ClusterEndpoint)
 *   console.log('集群外部Endpoint:', ClusterCredential.ClusterExternalEndpoint)
 * }
 * ```
 */
export async function describeClusterSecurity(
  credential: TencentCloudCredential,
  params: DescribeClusterSecurityParams,
): Promise<{ ClusterCredential?: ClusterCredential; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 DescribeClusterSecurity API
  const result = await request<
    DescribeClusterSecurityParams,
    DescribeClusterSecurityResponseData
  >({
    service: 'tke',
    version: '2018-05-25',
    action: 'DescribeClusterSecurity',
    payload: params,
    endpoint: 'tke.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    ClusterCredential: result.Response.ClusterCredential,
    RequestId: result.Response.RequestId,
  }
}
