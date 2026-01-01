import { describe, it, expect } from 'vitest'
import dotenv from 'dotenv'
import type { TencentCloudCredential } from '#src/types'
import { createSimpleCluster } from '#src/cluster/createSimpleCluster'
import { deleteSimpleCluster } from '#src/cluster/deleteSimpleCluster'
import { deleteCluster } from '#src/api/tke/deleteCluster'
import { deleteVpc } from '#src/api/vpc/deleteVpc'
import { deleteSubnet } from '#src/api/subnet/deleteSubnet'

// Load environment variables
dotenv.config()

// Get credentials from environment variables
const credential: TencentCloudCredential = {
  secretId: process.env.SecretId || '',
  secretKey: process.env.SecretKey || '',
}

// Validate environment variables
if (!credential.secretId || !credential.secretKey) {
  throw new Error('Missing SecretId or SecretKey in environment variables')
}

describe('createSimpleCluster', () => {
  it('should create a minimal TKE cluster with VPC and subnet', { timeout: 300000 }, async () => {
    // Generate unique cluster name
    const clusterName = `tencent-cloud-sdk-test-cluster-${Date.now()}`

    // Create cluster
    const result = await createSimpleCluster(credential, {
      clusterName,
      zone: 'ap-nanjing-1',
    })

    // Validate result
    expect(result).toBeDefined()
    expect(result.ClusterId).toBeDefined()
    expect(result.ClusterId).toMatch(/^cls-/)
    expect(result.VpcId).toBeDefined()
    expect(result.VpcId).toMatch(/^vpc-/)
    expect(result.SubnetId).toBeDefined()
    expect(result.SubnetId).toMatch(/^subnet-/)
    expect(result.RequestId).toBeDefined()

    console.log('\n=== Cluster Created Successfully ===')
    console.log('Cluster ID:', result.ClusterId)
    console.log('VPC ID:', result.VpcId)
    console.log('Subnet ID:', result.SubnetId)
    console.log('Request ID:', result.RequestId)

    // Clean up resources after test
    // Note: In production, you may want to keep these resources for debugging
    console.log('\n=== Cleaning Up Resources ===')

    // 1. Delete cluster
    try {
      const deleteClusterResult = await deleteCluster(credential, {
        ClusterId: result.ClusterId,
      })
      console.log('Cluster deletion task submitted:', deleteClusterResult.JobId)
      expect(deleteClusterResult.JobId).toBeDefined()
    } catch (error) {
      console.error('Failed to delete cluster:', error)
    }

    // 2. Delete subnet
    try {
      const deleteSubnetResult = await deleteSubnet(credential, {
        SubnetId: result.SubnetId,
      })
      console.log('Subnet deleted successfully:', deleteSubnetResult.RequestId)
      expect(deleteSubnetResult.RequestId).toBeDefined()
    } catch (error) {
      console.error('Failed to delete subnet:', error)
    }

    // 3. Delete VPC
    try {
      const deleteVpcResult = await deleteVpc(credential, {
        VpcId: result.VpcId,
      })
      console.log('VPC deleted successfully:', deleteVpcResult.RequestId)
      expect(deleteVpcResult.RequestId).toBeDefined()
    } catch (error) {
      console.error('Failed to delete VPC:', error)
    }

    console.log('\n=== Cleanup Complete ===')
  })

  it('should create a cluster with custom parameters', { timeout: 300000 }, async () => {
    const result = await createSimpleCluster(credential, {
      clusterName: `tencent-cloud-sdk-custom-test-${Date.now()}`,
      zone: 'ap-nanjing-2',
      vpcCidr: '10.1.0.0/16',
      subnetCidr: '10.1.1.0/24',
      clusterCidr: '172.17.0.0/16',
    })

    expect(result.ClusterId).toBeDefined()
    expect(result.VpcId).toBeDefined()
    expect(result.SubnetId).toBeDefined()

    console.log('\n=== Custom Parameter Cluster Created Successfully ===')
    console.log('Cluster ID:', result.ClusterId)

    // Clean up resources
    try {
      await deleteCluster(credential, { ClusterId: result.ClusterId })
      await deleteSubnet(credential, { SubnetId: result.SubnetId })
      await deleteVpc(credential, { VpcId: result.VpcId })
      console.log('Cleanup complete')
    } catch (error) {
      console.error('Cleanup failed:', error)
    }
  })

  it('should delete a cluster with VPC and subnet using deleteSimpleCluster', { timeout: 300000 }, async () => {
    // 1. Create a cluster first
    const clusterName = `tencent-cloud-sdk-test-delete-${Date.now()}`
    const createResult = await createSimpleCluster(credential, {
      clusterName,
      zone: 'ap-nanjing-1',
    })

    expect(createResult.ClusterId).toBeDefined()
    expect(createResult.VpcId).toBeDefined()
    expect(createResult.SubnetId).toBeDefined()

    console.log('\n=== Cluster Created for Deletion Test ===')
    console.log('Cluster ID:', createResult.ClusterId)
    console.log('VPC ID:', createResult.VpcId)
    console.log('Subnet ID:', createResult.SubnetId)

    // 2. Delete the cluster using deleteSimpleCluster
    const deleteResult = await deleteSimpleCluster(credential, {
      clusterId: createResult.ClusterId,
      vpcId: createResult.VpcId,
      subnetId: createResult.SubnetId,
      region: 'ap-nanjing',
    })

    expect(deleteResult.SubnetRequestId).toBeDefined()
    expect(deleteResult.VpcRequestId).toBeDefined()

    console.log('\n=== Cluster Deleted Successfully ===')
    console.log('Cluster deletion Job ID:', deleteResult.ClusterJobId || 'N/A')
    console.log('Subnet deletion Request ID:', deleteResult.SubnetRequestId)
    console.log('VPC deletion Request ID:', deleteResult.VpcRequestId)
  })
})
