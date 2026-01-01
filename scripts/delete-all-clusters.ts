import dotenv from 'dotenv'
import type { TencentCloudCredential } from '#src/types'
import { describeClusters } from '#src/api/tke/describeClusters'
import { deleteCluster } from '#src/api/tke/deleteCluster'

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

async function main() {
  console.log('Querying all clusters...\n')

  // Query all clusters
  const result = await describeClusters(credential)

  console.log(`Found ${result.TotalCount} clusters:\n`)

  if (result.TotalCount === 0) {
    console.log('No clusters found. Exiting.')
    return
  }

  // Display cluster information
  for (const cluster of result.Clusters) {
    console.log('----------------------------------------')
    console.log(`Cluster ID: ${cluster.ClusterId}`)
    console.log(`Cluster Name: ${cluster.ClusterName}`)
    console.log(`Cluster Description: ${cluster.ClusterDescription || 'N/A'}`)
    console.log(`Cluster Type: ${cluster.ClusterType || 'N/A'}`)
    console.log(`Cluster Version: ${cluster.ClusterVersion || 'N/A'}`)
    console.log(`VPC ID: ${cluster.VpcId || 'N/A'}`)
    console.log(`Subnet ID: ${cluster.SubnetId || 'N/A'}`)
    console.log(`Cluster State: ${cluster.ClusterState || 'N/A'}`)
    console.log(`Region: ${cluster.Region || 'N/A'}`)
    console.log(`Created Time: ${cluster.CreatedTime || 'N/A'}`)
    console.log('----------------------------------------\n')
  }

  // Ask for confirmation
  console.log(`\n⚠️  WARNING: You are about to delete ${result.TotalCount} cluster(s)!`)
  console.log('This action cannot be undone.\n')

  // Delete clusters
  console.log('Starting deletion process...\n')

  for (const cluster of result.Clusters) {
    try {
      console.log(`Deleting cluster ${cluster.ClusterId} (${cluster.ClusterName})...`)

      const deleteResult = await deleteCluster(credential, {
        ClusterId: cluster.ClusterId,
        InstanceDeleteMode: 'terminate',
      } as any)

      console.log(`✓ Cluster deletion task submitted: ${deleteResult.JobId || 'N/A'}`)
      console.log(`  Request ID: ${deleteResult.RequestId}\n`)

      // Wait a bit between deletions to avoid API rate limiting
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.error(`✗ Failed to delete cluster ${cluster.ClusterId}:`, error)
      console.log()
    }
  }

  console.log('\n========================================')
  console.log('Deletion process completed!')
  console.log('Note: Cluster deletion is an asynchronous operation.')
  console.log('Please check the Tencent Cloud console to verify deletion status.')
  console.log('========================================')
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
