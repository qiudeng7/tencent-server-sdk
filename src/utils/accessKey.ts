/**
 * 腾讯云 API 密钥配置
 *
 * 安全提示:
 * 1. 不要将密钥提交到 Git 仓库
 * 2. 通过环境变量注入密钥
 */

/**
 * 腾讯云密钥凭证
 */
export interface TencentCloudCredential {
  /** 密钥 ID */
  secretId: string
  /** 密钥 Key */
  secretKey: string
}
