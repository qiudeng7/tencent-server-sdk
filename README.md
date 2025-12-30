# @qiudeng/tencent-cloud-sdk

专为 Kubernetes 自动化设计的腾讯云 API SDK，提供简洁的 TypeScript 接口用于管理 CVM 实例、TAT 命令、VPC 网络等资源。

**在线文档**: https://qiudeng7.github.io/tencent-server-sdk/

## 特性

### 🚀 K8s 辅助功能
- **createK8sServers** - 一键创建 K8s 节点服务器
  - 内置最经济的竞价实例配置
  - 自动安装 Docker、kubelet、kubectl
  - 支持用户自定义配置覆盖

### 💻 CVM 实例管理
- **describeInstances** - 查询实例列表
- **describeInstancesStatus** - 查询实例状态
- **terminateInstances** - 销毁实例
- **runInstances** - 创建实例（推荐）

### 🔧 TAT 命令管理
- **createCommand** - 创建命令
- **deleteCommand** - 删除命令
- **describeCommands** - 查询命令
- **invokeCommand** - 执行命令
- **describeInvocations** - 查询执行活动
- **describeInvocationTasks** - 查询执行任务

### 🌐 VPC & 子网管理
- **createVpc** / **deleteVpc** / **describeVpcs** - VPC 管理
- **createSubnet** / **deleteSubnet** / **describeSubnets** - 子网管理
- **modifySubnetAttribute** - 修改子网属性
- IPv6 子网段分配与释放
- 默认子网可用性检查

## 安装

```bash
npm install @qiudeng/tencent-cloud-sdk
# 或
pnpm add @qiudeng/tencent-cloud-sdk
```

## 快速开始

### 基础使用 - 查询实例

```typescript
import { describeInstances, type TencentCloudCredential } from '@qiudeng/tencent-cloud-sdk'

const credential: TencentCloudCredential = {
  secretId: process.env.TENCENT_SECRET_ID!,
  secretKey: process.env.TENCENT_SECRET_KEY!,
}

// 查询实例列表
const { InstanceSet, TotalCount } = await describeInstances(credential, {
  Limit: 10,
  Offset: 0,
})
console.log(`共有 ${TotalCount} 个实例`)
```

### K8s 节点创建（推荐）

```typescript
import { createK8sServers } from '@qiudeng/tencent-cloud-sdk'

// 使用默认配置创建 K8s 节点
// - 竞价实例（最经济）
// - 自动安装 Docker + k8s 组件
// - 分配公网 IP
const { InstanceIdSet } = await createK8sServers(credential, {
  InstanceCount: 3,
})
console.log(`已创建 K8s 节点: ${InstanceIdSet.join(', ')}`)
```

### 自定义配置

```typescript
// 覆盖默认配置
await createK8sServers(credential, {
  InstanceType: 'S5.LARGE4',           // 自定义机型
  SystemDisk: {
    DiskType: 'CLOUD_PREMIUM',
    DiskSize: 50,
  },
  InstanceCount: 2,
  Placement: { Zone: 'ap-guangzhou-2' } // 指定可用区
})
```

### TAT 命令执行

```typescript
import { createCommand, invokeCommand } from '@qiudeng/tencent-cloud-sdk'

// 创建命令
const { CommandId } = await createCommand(credential, {
  CommandName: 'update-k8s',
  Content: btoa('apt update && apt upgrade -y'),
  CommandType: 'SHELL',
  Timeout: 300,
})

// 在指定实例上执行
const { InvocationId } = await invokeCommand(credential, {
  CommandId,
  InstanceIds: ['ins-xxxxx'],
})
```

### VPC & 子网管理

```typescript
import { createVpc, createSubnet } from '@qiudeng/tencent-cloud-sdk'

// 创建 VPC
const { Vpc } = await createVpc(credential, {
  VpcName: 'my-k8s-vpc',
  CidrBlock: '10.0.0.0/16',
})

// 创建子网
const { Subnet } = await createSubnet(credential, {
  VpcId: Vpc.VpcId,
  SubnetName: 'k8s-node-subnet',
  CidrBlock: '10.0.1.0/24',
  Zone: 'ap-guangzhou-2',
})
```

## 运行环境要求

- **Node.js**: >= 18.0.0
- **仅支持服务端运行**（依赖 Node.js 的 `crypto` 模块）

## 开发

```bash
# 安装依赖
pnpm install

# 构建
pnpm build

# 生成文档
pnpm run docs

# 类型检查
pnpm exec tsc --noEmit
```

## 许可证

MIT
