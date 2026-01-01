// ============================================================================
// K8s Helpers
// ============================================================================
// TODO: Implement k8s helpers
// export { createK8sServers } from '#src/k8s'
// export type { CreateK8sServersParams, CreateK8sServersResult } from '#src/k8s'

// ============================================================================
// Cluster Helpers
// ============================================================================

export { createSimpleCluster } from '#src/cluster/createSimpleCluster'
export { deleteSimpleCluster } from '#src/cluster/deleteSimpleCluster'
export type { CreateSimpleClusterParams, CreateSimpleClusterResult } from '#src/cluster/createSimpleCluster'
export type { DeleteSimpleClusterParams, DeleteSimpleClusterResult } from '#src/cluster/deleteSimpleCluster'

// ============================================================================
// Instance APIs
// ============================================================================

export { describeInstances } from '#src/api/instance/describeInstances'
export { describeInstancesStatus } from '#src/api/instance/describeInstancesStatus'
export { terminateInstances } from '#src/api/instance/terminateInstances'
export { RunInstancesByLaunchTemplate } from '#src/api/instance/runInstanceByLaunchTemplate'
export { runInstances } from '#src/api/instance/runInstances'

// ============================================================================
// TAT APIs
// ============================================================================

export { createCommand } from '#src/api/tat/createCommand'
export { deleteCommand } from '#src/api/tat/deleteCommand'
export { describeCommands } from '#src/api/tat/describeCommands'
export { describeInvocations } from '#src/api/tat/describeInvocations'
export { describeInvocationTasks } from '#src/api/tat/describeInvocationTasks'
export { invokeCommand } from '#src/api/tat/invokeCommand'

// ============================================================================
// VPC APIs
// ============================================================================

export { createVpc } from '#src/api/vpc/createVpc'
export { deleteVpc } from '#src/api/vpc/deleteVpc'
export { describeVpcs } from '#src/api/vpc/describeVpcs'

// ============================================================================
// Subnet APIs
// ============================================================================

export { createSubnet } from '#src/api/subnet/createSubnet'
export { createSubnets } from '#src/api/subnet/createSubnets'
export { deleteSubnet } from '#src/api/subnet/deleteSubnet'
export { describeSubnets } from '#src/api/subnet/describeSubnets'
export { modifySubnetAttribute } from '#src/api/subnet/modifySubnetAttribute'
export { assignIpv6SubnetCidrBlock } from '#src/api/subnet/assignIpv6SubnetCidrBlock'
export { unassignIpv6SubnetCidrBlock } from '#src/api/subnet/unassignIpv6SubnetCidrBlock'
export { checkDefaultSubnet } from '#src/api/subnet/checkDefaultSubnet'
export { describeSubnetResourceDashboard } from '#src/api/subnet/describeSubnetResourceDashboard'

// ============================================================================
// TKE Cluster APIs
// ============================================================================

export { createCluster } from '#src/api/tke/createCluster'
export { deleteCluster } from '#src/api/tke/deleteCluster'
export { describeClusters } from '#src/api/tke/describeClusters'
export { describeClusterStatus } from '#src/api/tke/describeClusterStatus'
export { describeClusterSecurity } from '#src/api/tke/describeClusterSecurity'
export { describeClusterKubeconfig } from '#src/api/tke/describeClusterKubeconfig'

// ============================================================================
// TKE Node APIs
// ============================================================================

export { createClusterInstances } from '#src/api/tke/createClusterInstances'
export { deleteClusterInstances } from '#src/api/tke/deleteClusterInstances'
export { describeClusterInstances } from '#src/api/tke/describeClusterInstances'
export { describeExistedInstances } from '#src/api/tke/describeExistedInstances'
export { addExistedInstances } from '#src/api/tke/addExistedInstances'

// ============================================================================
// Types
// ============================================================================

export type { TencentCloudCredential } from '#src/types'

