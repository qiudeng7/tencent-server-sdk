/**
 * Kubernetes 相关的腾讯云服务器创建功能
 *
 * 提供基于默认配置的 K8s 服务器创建功能，会自动合并默认配置和用户配置
 */

export { createK8sServers } from './createServers'
export type { CreateK8sServersParams, CreateK8sServersResult } from './createServers'
