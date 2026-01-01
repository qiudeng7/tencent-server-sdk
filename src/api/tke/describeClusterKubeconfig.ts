import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * DescribeClusterKubeconfig API 请求参数
 */
interface DescribeClusterKubeconfigParams {
  /** 集群ID */
  ClusterId: string
  /** 是否是外网访问（true：外网访问，false：内网访问） */
  IsExtranet?: boolean
}

/**
 * DescribeClusterKubeconfig API 响应数据
 */
interface DescribeClusterKubeconfigResponseData {
  /** kubeconfig文件内容 */
  Kubeconfig?: string
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 获取集群kubeconfig文件
 *
 * @group TKE Cluster APIs
 * @param credential - 腾讯云密钥凭证
 * @param params - 查询参数
 * @returns 包含 Kubeconfig 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { describeClusterKubeconfig } from '@qiudeng/tencent-cloud-sdk'
 *
 * // 获取集群内网kubeconfig
 * const { Kubeconfig } = await describeClusterKubeconfig(credential, {
 *   ClusterId: 'cls-xxxxx'
 * })
 * console.log('Kubeconfig内容:', Kubeconfig)
 *
 * // 保存到文件
 * import { writeFile } from 'fs/promises'
 * await writeFile('./kubeconfig', Kubeconfig || '', { mode: 0o600 })
 * ```
 *
 * @example
 * ```ts
 * // 获取集群外网kubeconfig
 * const { Kubeconfig } = await describeClusterKubeconfig(credential, {
 *   ClusterId: 'cls-xxxxx',
 *   IsExtranet: true
 * })
 * console.log('外网Kubeconfig内容:', Kubeconfig)
 * ```
 */
export async function describeClusterKubeconfig(
  credential: TencentCloudCredential,
  params: DescribeClusterKubeconfigParams,
): Promise<{ Kubeconfig?: string; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 DescribeClusterKubeconfig API
  const result = await request<
    DescribeClusterKubeconfigParams,
    DescribeClusterKubeconfigResponseData
  >({
    service: 'tke',
    version: '2018-05-25',
    action: 'DescribeClusterKubeconfig',
    payload: params,
    endpoint: 'tke.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    Kubeconfig: result.Response.Kubeconfig,
    RequestId: result.Response.RequestId,
  }
}
