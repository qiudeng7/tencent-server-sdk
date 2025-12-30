import type { TencentCloudCredential } from '#src/request'
import { runInstances } from '#src/api/instance/runInstances'

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Default K8s server configuration
 * Extracted from src/k8s/createServerRef.js
 */
interface DefaultK8sServerConfig {
  /** Instance charge type */
  InstanceChargeType: string
  /** Instance placement */
  Placement: {
    /** Availability zone */
    Zone: string
  }
  /** Instance type */
  InstanceType: string
  /** Image ID */
  ImageId: string
  /** System disk configuration */
  SystemDisk: {
    /** Disk type */
    DiskType: string
    /** Disk size in GB */
    DiskSize: number
  }
  /** Instance name */
  InstanceName: string
  /** Login settings */
  LoginSettings: {
    /** Login password */
    Password: string
  }
  /** Host name */
  HostName: string
  /** User data (base64 encoded) */
  UserData: string
  /** Dry run flag */
  DryRun: boolean
}

/**
 * Create K8s servers user parameters
 * Allow overriding parts of the default configuration
 */
export interface CreateK8sServersParams {
  /** Override default configuration */
  override?: Partial<DefaultK8sServerConfig>
  /** Number of instances to create, default 1 */
  InstanceCount?: number
  /** Availability zone, default ap-nanjing-1 */
  Zone?: string
  /** Instance name, will append random suffix */
  InstanceName?: string
  /** Host name, will append random suffix */
  HostName?: string
  /** Login password */
  Password?: string
  /** Other runInstances parameters */
  [key: string]: any
}

/**
 * Create K8s servers result
 */
export interface CreateK8sServersResult {
  /** Instance ID list */
  InstanceIdSet: string[]
  /** Request ID */
  RequestId: string
}

// ============================================================================
// Default Configuration
// ============================================================================

/**
 * Default K8s server configuration
 * Extracted from src/k8s/createServerRef.js
 */
const DEFAULT_K8S_SERVER_CONFIG: DefaultK8sServerConfig = {
  InstanceChargeType: 'SPOTPAID',
  Placement: {
    Zone: 'ap-nanjing-1'
  },
  InstanceType: 'SA9.MEDIUM4',
  ImageId: 'img-mmytdhbn',
  SystemDisk: {
    DiskType: 'CLOUD_BSSD',
    DiskSize: 20
  },
  InstanceName: '@qiudeng/tencent-server-sdk-for-k8s-',
  LoginSettings: {
    Password: '123456@ABC'
  },
  HostName: 'tencent-server-sdk-for-k8s',
  UserData: 'TXlVc2VyRGF0YQo=', // base64 encoded "MyUserData"
  DryRun: false
}

/**
 * Generate random suffix
 */
function generateSuffix(): string {
  return Math.random().toString(36).substring(2, 8)
}

// ============================================================================
// Function Implementation
// ============================================================================

/**
 * Create K8s server instances
 *
 * Create Tencent Cloud servers with default configuration,
 * allow users to override parts of the configuration
 *
 * @param credential - Tencent Cloud credential
 * @param params - Creation parameters
 * @returns Object containing instance ID list and request ID
 *
 * @example
 * ```ts
 * import { createK8sServers } from '@qiudeng/tencent-cloud-sdk/k8s'
 *
 * // Create with default configuration
 * const result = await createK8sServers(credential, {
 *   InstanceCount: 3
 * })
 * console.log('Created instances:', result.InstanceIdSet)
 * ```
 *
 * @example
 * ```ts
 * // Override some configurations
 * const result = await createK8sServers(credential, {
 *   override: {
 *     InstanceType: 'S5.LARGE4',
 *     SystemDisk: { DiskType: 'CLOUD_PREMIUM', DiskSize: 50 }
 *   },
 *   InstanceCount: 2,
 *   Zone: 'ap-guangzhou-2'
 * })
 * ```
 *
 * @example
 * ```ts
 * // Use custom password and instance name
 * const result = await createK8sServers(credential, {
 *   Password: 'YourSecurePassword123!',
 *   InstanceName: 'my-k8s-node',
 *   HostName: 'k8s-node'
 * })
 * ```
 *
 * @example
 * ```ts
 * // Fully customized configuration
 * const result = await createK8sServers(credential, {
 *   override: {
 *     InstanceChargeType: 'POSTPAID_BY_HOUR',
 *     ImageId: 'img-xxxxxxxx'
 *   },
 *   // Can also add other runInstances parameters
 *   VirtualPrivateCloud: {
 *     VpcId: 'vpc-xxxx',
 *     SubnetId: 'subnet-xxxx'
 *   },
 *   SecurityGroupIds: ['sg-xxxx'],
 *   InstanceCount: 1
 * })
 * ```
 */
export async function createK8sServers(
  credential: TencentCloudCredential,
  params: CreateK8sServersParams = {},
): Promise<CreateK8sServersResult> {
  const {
    override = {},
    InstanceCount = 1,
    Zone,
    InstanceName,
    HostName,
    Password,
    ...otherParams
  } = params

  // Merge default configuration with user override
  let config: DefaultK8sServerConfig = {
    ...DEFAULT_K8S_SERVER_CONFIG,
    ...override
  }

  // Override Zone if user specified
  if (Zone) {
    config = {
      ...config,
      Placement: {
        ...config.Placement,
        Zone
      }
    }
  }

  // Append random suffix to InstanceName if user specified
  if (InstanceName) {
    config = {
      ...config,
      InstanceName: `${InstanceName}-${generateSuffix()}`
    }
  }

  // Append random suffix to HostName if user specified
  if (HostName) {
    config = {
      ...config,
      HostName: `${HostName}-${generateSuffix()}`
    }
  }

  // Override Password if user specified
  if (Password) {
    config = {
      ...config,
      LoginSettings: {
        ...config.LoginSettings,
        Password
      }
    }
  }

  // Prepare final request parameters
  const finalParams = {
    ...config,
    InstanceCount,
    ...otherParams
  }

  // Call runInstances API
  return await runInstances(credential, finalParams as any)
}
