# @qiudeng/tencent-cloud-sdk

Tencent Cloud API SDK for CVM instances and TAT commands.

## Features

- CVM Instance Management
  - Describe instances
  - Describe instance status
  - Terminate instances
  - Run instances by launch template
- TAT (TencentAutomationTools) Command Management
  - Create/Delete commands
  - Invoke commands
  - Describe invocations and tasks

## Installation

```bash
npm install @qiudeng/tencent-cloud-sdk
# or
pnpm add @qiudeng/tencent-cloud-sdk
```

## Usage

```typescript
import { describeInstances, type TencentCloudCredential } from '@qiudeng/tencent-cloud-sdk'

const credential: TencentCloudCredential = {
  secretId: process.env.TENCENT_SECRET_ID!,
  secretKey: process.env.TENCENT_SECRET_KEY!,
}

const instances = await describeInstances(credential, {
  Limit: 10,
  Offset: 0,
})
```

## License

MIT
