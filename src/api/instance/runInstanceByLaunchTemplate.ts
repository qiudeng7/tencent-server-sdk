import type { TencentCloudCredential } from '#src/request'

// prepareScript这样导入进来就是字符串
// 参考 https://cn.vite.dev/guide/assets#importing-asset-as-string
import prepareScript from '../../../prepare.sh?raw'


/**
 * RunInstances API 请求参数（通过启动模板创建实例）
 */
interface RunInstancesByTemplateParams {
  /** 购买实例数量，默认值：1，取值范围：[1, 500] */
  InstanceCount: number,
  /** 自定义数据，是一个base64格式的shell脚本，创建服务器的时候自动执行，参考 https://cloud.tencent.com/document/product/213/17525 */
  UserData: string,
  /** 启动模板配置 */
  LaunchTemplate: {
    /** 启动模板 ID */
    LaunchTemplateId: string
  }
}

/**
 * RunInstances API 响应数据
 */
interface RunInstancesByTemplateResponseData {
  /** 实例 ID 列表 */
  InstanceIdSet: string[],
  RequestId: string
}

/**
 * 通过启动模板创建云服务器实例
 *
 * @param credential - 腾讯云密钥凭证
 * @param templateID - 启动模板 ID，默认 lt-0frkuglo
 * @param instanceCount - 购买实例数量，默认 1
 * @returns 包含 InstanceIdSet 和 RequestId 的对象
 *
 * @example
 * ```ts
 * import { createServerByLaunchTemplate } from '@/server/tencentServer/createServerByLaunchTemplate'
 * import { getCredentials } from '#server/tencentServer/utils/getCredentials'
 *
 * const credential = getCredentials(env)
 * const { InstanceIdSet, RequestId } = await createServerByLaunchTemplate(credential, 'lt-0frkuglo')
 * console.log('实例 IDs:', InstanceIdSet)
 * console.log('请求 ID:', RequestId)
 * ```
 */
/**
 * 通过启动模板创建实例
 *
 * @deprecated 请使用 {@link runInstances} 替代。此接口已废弃，将在未来版本中移除。
 */
export async function RunInstancesByLaunchTemplate(
  credential: TencentCloudCredential,
  templateID: string = 'lt-0frkuglo',
  instanceCount: number = 1,
): Promise<{ InstanceIdSet: string[]; RequestId: string }> {
  const { createRequest } = await import('#src/request')

  // 创建请求函数
  const request = createRequest(credential)

  // 将 prepareScript 进行 base64 编码
  const userDataBase64 = btoa(prepareScript)

  // 调用 RunInstances API
  const result = await request<
    RunInstancesByTemplateParams,
    RunInstancesByTemplateResponseData
  >({
    service: 'cvm',
    version: '2017-03-12',
    action: 'RunInstances',
    payload: {
      InstanceCount: instanceCount,
      UserData: userDataBase64,
      LaunchTemplate: {
        LaunchTemplateId: templateID,
      },
    },
    endpoint: 'cvm.tencentcloudapi.com',
    region: 'ap-nanjing',
  })

  return {
    InstanceIdSet: result.Response.InstanceIdSet,
    RequestId: result.Response.RequestId,
  }
}