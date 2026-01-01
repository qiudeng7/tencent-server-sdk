import type { TencentCloudCredential } from '#src/request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * DescribeExistedInstances API 请求参数
 */
interface DescribeExistedInstancesParams {
  /** 节点所在的地域 */
  Region: string
  /** 节点所在的可用区列表 */
  ZoneIds?: string[]
  /** 节点实例ID列表 */
  InstanceIds?: string[]
  /** 节点实例名称 */
  InstanceName?: string
  /** 节点机型列表 */
  InstanceTypes?: string[]
  /** 过滤条件列表 */
  Filters?: Array<{
    /** 过滤器名称 */
    Name: string
    /** 过滤器值列表 */
    Values: string[]
  }>
  /** 偏移量，默认为0 */
  Offset?: number
  /** 返回数量，默认为20，最大值为100 */
  Limit?: number
  /** VPC ID列表 */
  VpcIds?: string[]
  /** 子网ID列表 */
  SubnetIds?: string[]
}

/**
 * 已存在的实例信息
 */
interface ExistedInstance {
  /** 节点实例ID */
  InstanceId: string
  /** 节点实例名称 */
  InstanceName?: string
  /** 节点所在可用区 */
  Zone?: string
  /** 节点所属VPC ID */
  VpcId?: string
  /** 节点所属子网ID */
  SubnetId?: string
  /** 节点机型 */
  InstanceType?: string
  /** 节点CPU核数 */
  Cpu?: number
  /** 节点内存容量，单位：GB */
  Memory?: number
  /** 节点操作系统名称 */
  OsName?: string
  /** 节点操作系统镜像ID */
  ImageId?: string
  /** 节点状态 */
  InstanceState?: string
  /** 节点创建时间 */
  CreatedTime?: string
  /** 节点计费类型 */
  InstanceChargeType?: string
  /** 节点公网IP */
  PublicIpAddresses?: string[]
  /** 节点内网IP */
  PrivateIpAddresses?: string[]
  /** 节点是否为GPU节点 */
  IsGpu?: boolean
  /** 节点GPU类型 */
  GpuType?: string
  /** 节点GPU数量 */
  GpuCount?: number
}

/**
 * DescribeExistedInstances API 响应数据
 */
interface DescribeExistedInstancesResponseData {
  /** 总数 */
  TotalCount?: number
  /** 已存在实例列表 */
  ExistedInstanceSet?: ExistedInstance[]
}

// ============================================================================
// 函数实现
// ============================================================================

/**
 * 查询已经存在的节点
 *
 * @group TKE Node APIs
 * @param credential - 腾讯云密钥凭证
 * @param params - 查询参数
 * @returns 包含 TotalCount、ExistedInstanceSet 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { describeExistedInstances } from '@qiudeng/tencent-cloud-sdk'
 *
 * // 查询已存在的实例
 * const { TotalCount, ExistedInstanceSet } = await describeExistedInstances(credential, {
 *   Region: 'ap-guangzhou',
 *   Limit: 10,
 *   Offset: 0
 * })
 * console.log('实例总数:', TotalCount)
 * console.log('实例列表:', ExistedInstanceSet)
 * ```
 *
 * @example
 * ```ts
 * // 根据实例ID查询
 * const { ExistedInstanceSet } = await describeExistedInstances(credential, {
 *   Region: 'ap-guangzhou',
 *   InstanceIds: ['ins-xxxxx', 'ins-yyyyy']
 * })
 * ```
 *
 * @example
 * ```ts
 * // 查询特定可用区的实例
 * const { ExistedInstanceSet } = await describeExistedInstances(credential, {
 *   Region: 'ap-guangzhou',
 *   ZoneIds: ['ap-guangzhou-3', 'ap-guangzhou-4'],
 *   Limit: 20
 * })
 * ```
 *
 * @example
 * ```ts
 * // 查询特定VPC和子网的实例
 * const { ExistedInstanceSet } = await describeExistedInstances(credential, {
 *   Region: 'ap-guangzhou',
 *   VpcIds: ['vpc-xxxxx'],
 *   SubnetIds: ['subnet-xxxxx']
 * })
 * ```
 */
export async function describeExistedInstances(
  credential: TencentCloudCredential,
  params: Omit<DescribeExistedInstancesParams, 'InstanceIds'> & { InstanceIds?: string[] },
): Promise<{ TotalCount?: number; ExistedInstanceSet?: ExistedInstance[]; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 调用 DescribeExistedInstances API
  const result = await request<
    DescribeExistedInstancesParams,
    DescribeExistedInstancesResponseData
  >({
    service: 'tke',
    version: '2018-05-25',
    action: 'DescribeExistedInstances',
    payload: params,
    endpoint: 'tke.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    TotalCount: result.Response.TotalCount,
    ExistedInstanceSet: result.Response.ExistedInstanceSet,
    RequestId: result.Response.RequestId,
  }
}
