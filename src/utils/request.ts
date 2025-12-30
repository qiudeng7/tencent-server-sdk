/**
 * 腾讯云 API 请求封装
 * 文档: https://cloud.tencent.com/document/api/213/15692
 */

import { sign } from './sign'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 腾讯云永久密钥凭证
 */
interface TencentCloudCredential {
  /** 密钥 ID，从腾讯云控制台获取 */
  secretId: string
  /** 密钥 Key，从腾讯云控制台获取 */
  secretKey: string
}

/**
 * 腾讯云 API 请求配置
 * @template P - 请求参数类型
 */
interface TencentCloudRequestConfig<P = Record<string, any>> {
  /** API 服务名称，如 cvm、cbs、vpc 等 */
  service: string
  /** API 版本号，如 2017-03-12 */
  version: string
  /** 接口名称，如 DescribeInstances、RunInstances 等 */
  action: string
  /** 请求参数对象 */
  payload?: P
  /** API 请求端点，如 cvm.tencentcloudapi.com */
  endpoint?: string
  /** 地域，如 ap-nanjing、ap-guangzhou 等 */
  region?: string
}

/**
 * 腾讯云 API 响应
 * @template T - 响应数据类型
 */
interface TencentCloudResponse<T = any> {
  Response: {
    /** 请求 ID */
    RequestId: string
    /** 错误信息（请求失败时存在） */
    Error?: {
      Code: string
      Message: string
    }
    [key: string]: any
  } & T
}

/**
 * 腾讯云请求函数类型
 * @template P - 请求参数类型
 * @template R - 响应数据类型
 */
type TencentCloudRequestFunction = <
  P = Record<string, any>,
  R = any
>(
  config: TencentCloudRequestConfig<P>
) => Promise<TencentCloudResponse<R>>

// ============================================================================
// 请求函数工厂
// ============================================================================

/**
 * 创建腾讯云 API 请求函数
 * 
 * 通过传入凭证，返回一个已配置好的请求函数，后续调用无需再传递凭证
 * 
 * @param credential - 腾讯云密钥凭证
 * @returns 配置好的请求函数
 * 
 * @example
 * ```ts
 * import { createRequest } from '@/server/tencentServer/utils/request'
 * import { getCredentials } from '#server/tencentServer/utils/getCredentials'
 *
 * // 定义类型
 * interface DescribeInstancesParams {
 *   Limit: number
 *   Offset: number
 * }
 *
 * interface InstanceSet {
 *   InstanceId: string
 *   InstanceName: string
 * }
 *
 * interface DescribeInstancesResponse {
 *   InstanceSet: InstanceSet[]
 *   TotalCount: number
 * }
 *
 * // 在应用初始化时创建请求函数
 * const request = createRequest(getCredentials(env))
 *
 * // 后续使用时获得完整的类型提示
 * const result = await request<DescribeInstancesParams, DescribeInstancesResponse>({
 *   service: 'cvm',
 *   version: '2017-03-12',
 *   action: 'DescribeInstances',
 *   payload: { Limit: 10, Offset: 0 }
 * })
 *
 * // result.Response.InstanceSet 的类型为 InstanceSet[]
 * // result.Response.TotalCount 的类型为 number
 * ```
 */
export function createRequest(
  credential: TencentCloudCredential
): TencentCloudRequestFunction {
  return async function request<P = Record<string, any>, R = any>(
    config: TencentCloudRequestConfig<P>
  ): Promise<TencentCloudResponse<R>> {
    const {
      service,
      version,
      action,
      payload = {} as P,
      endpoint = 'cvm.tencentcloudapi.com',
      region = 'ap-nanjing',
    } = config

    const timestamp = Math.floor(Date.now() / 1000)
    const body = JSON.stringify(payload)

    // 计算签名
    const authorization = sign({
      secretID: credential.secretId,
      secretKey: credential.secretKey,
      endpoint,
      service,
      region,
      action,
      version,
      timestamp,
      payload: payload as object,
      method: 'POST'
    })

    // 构造请求头
    const headers: Record<string, string> = {
      'Authorization': authorization,
      'Content-Type': 'application/json; charset=utf-8',
      'Host': endpoint,
      'X-TC-Action': action,
      'X-TC-Timestamp': timestamp.toString(),
      'X-TC-Version': version,
      'X-TC-Region': region,
    }

    // 发起请求
    const url = `https://${endpoint}/`
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    })

    const result: TencentCloudResponse<R> = await response.json()

    // 检查错误
    if (result.Response.Error) {
      throw new Error(
        `TencentCloud API Error [${result.Response.Error.Code}]: ${result.Response.Error.Message}`
      )
    }

    return result
  }
}

// ============================================================================
// 导出类型
// ============================================================================

export type { 
  TencentCloudCredential, 
  TencentCloudRequestConfig, 
  TencentCloudResponse,
  TencentCloudRequestFunction 
}
