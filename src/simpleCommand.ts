import type { TencentCloudCredential } from './utils/request'

// ============================================================================
// Types
// ============================================================================

/**
 * 命令执行参数
 */
export interface ExecuteCommandParams {
  /** 实例 ID 列表 */
  instanceIds: string[]
  /** 命令内容（会自动进行 base64 编码） */
  content: string
  /** 命令名称 */
  commandName?: string
  /** 工作目录，默认 /root */
  workingDirectory?: string
  /** 超时时间（秒），默认 60 */
  timeout?: number
  /** 是否保存命令，默认 false */
  saveCommand?: boolean
}

/**
 * 执行结果
 */
export interface ExecutionResult {
  /** 调用 ID */
  invocationId: string
  /** 命令 ID */
  commandId: string
}

/**
 * 等待完成选项
 */
export interface WaitForCompletionOptions {
  /** 轮询间隔（毫秒），默认 2000 */
  pollInterval?: number
  /** 最大等待时间（毫秒），默认 300000（5 分钟） */
  maxWaitTime?: number
}

/**
 * 命令执行结果
 */
export interface CommandResult {
  /** 执行状态 */
  status: 'SUCCESS' | 'FAILED' | 'TIMEOUT'
  /** 命令输出（已解码） */
  output: string
  /** 退出码 */
  exitCode: number
}

/**
 * 任务状态
 */
export interface TaskStatus {
  /** 实例 ID */
  instanceId: string
  /** 任务状态 */
  status: string
  /** 命令输出（如果已完成） */
  output?: string
  /** 退出码（如果已完成） */
  exitCode?: number
}

/**
 * 调用状态
 */
export interface InvocationStatus {
  /** 调用状态 */
  status: string
  /** 任务列表 */
  tasks: TaskStatus[]
}

// ============================================================================
// Utility functions
// ============================================================================

/**
 * Base64 编码字符串
 */
function base64Encode(str: string): string {
  if (typeof btoa !== 'undefined') {
    return btoa(str)
  }
  // Node.js 环境
  return Buffer.from(str).toString('base64')
}

/**
 * Base64 解码字符串
 */
function base64Decode(str: string): string {
  if (typeof atob !== 'undefined') {
    return atob(str)
  }
  // Node.js 环境
  return Buffer.from(str, 'base64').toString()
}

/**
 * 延迟函数
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ============================================================================
// Exported functions
// ============================================================================

/**
 * 在实例上执行命令并返回调用 ID
 *
 * @param credential - 腾讯云凭证
 * @param params - 执行参数
 * @returns 包含 invocationId 和 commandId 的对象
 *
 * @example
 * ```ts
 * const { invocationId } = await executeCommand(credential, {
 *   instanceIds: ['ins-xxx'],
 *   content: 'ls -la',
 *   commandName: 'list-files',
 *   timeout: 60
 * })
 * ```
 */
export async function executeCommand(
  credential: TencentCloudCredential,
  params: ExecuteCommandParams,
): Promise<ExecutionResult> {
  const { invokeCommand } = await import('./tat/invokeCommand')

  const result = await invokeCommand(credential, {
    Content: base64Encode(params.content),
    InstanceIds: params.instanceIds,
    CommandName: params.commandName,
    WorkingDirectory: params.workingDirectory || '/root',
    Timeout: params.timeout || 60,
    SaveCommand: params.saveCommand || false,
    CommandType: 'SHELL',
  })

  return {
    invocationId: result.InvocationId,
    commandId: result.CommandId,
  }
}

/**
 * 获取命令执行状态（不等待，立即返回当前状态）
 *
 * @param credential - 腾讯云凭证
 * @param invocationId - 调用 ID
 * @returns 执行状态
 *
 * @example
 * ```ts
 * const status = await getInvocationStatus(credential, 'inv-xxx')
 * console.log(status.tasks)
 * ```
 */
export async function getInvocationStatus(
  credential: TencentCloudCredential,
  invocationId: string,
): Promise<InvocationStatus> {
  const { describeInvocations } = await import('./tat/describeInvocations')
  const { describeInvocationTasks } = await import('./tat/describeInvocationTasks')

  // Query invocation
  const { InvocationSet } = await describeInvocations(credential, {
    InvocationIds: [invocationId],
  })

  if (!InvocationSet || InvocationSet.length === 0) {
    throw new Error(`调用 ${invocationId} 不存在`)
  }

  const invocation = InvocationSet[0]

  // 查询调用任务
  const { InvocationTaskSet } = await describeInvocationTasks(credential, {
    Filters: [{ Name: 'invocation-id', Values: [invocationId] }],
    HideOutput: false,
  })

  // 解析任务状态
  const tasks: TaskStatus[] = (InvocationTaskSet || []).map(task => ({
    instanceId: task.InstanceId,
    status: task.TaskStatus,
    output: task.TaskResult?.Output ? base64Decode(task.TaskResult.Output) : undefined,
    exitCode: task.TaskResult?.ExitCode,
  }))

  return {
    status: invocation.InvocationStatus,
    tasks,
  }
}

/**
 * 等待命令执行完成（轮询直到完成或超时）
 *
 * @param credential - 腾讯云凭证
 * @param invocationId - 调用 ID
 * @param options - 等待选项
 * @returns 命令执行结果
 *
 * @example
 * ```ts
 * const result = await waitForCompletion(credential, 'inv-xxx', {
 *   pollInterval: 2000,
 *   maxWaitTime: 300000
 * })
 * console.log(result.output)
 * ```
 */
export async function waitForCompletion(
  credential: TencentCloudCredential,
  invocationId: string,
  options: WaitForCompletionOptions = {},
): Promise<CommandResult> {
  const pollInterval = options.pollInterval || 2000
  const maxWaitTime = options.maxWaitTime || 300000
  const startTime = Date.now()

  while (Date.now() - startTime < maxWaitTime) {
    const status = await getInvocationStatus(credential, invocationId)

    // 检查是否所有任务都已完成
    const allFinished = status.tasks.every(
      task => ['SUCCESS', 'FAILED', 'TIMEOUT', 'CANCELLED'].includes(task.status)
    )

    if (allFinished) {
      // 检查是否有失败的任务
      const failedTask = status.tasks.find(
        task => task.status === 'FAILED' || task.status === 'TIMEOUT'
      )

      if (failedTask) {
        return {
          status: failedTask.status as 'FAILED' | 'TIMEOUT',
          output: failedTask.output || '',
          exitCode: failedTask.exitCode || -1,
        }
      }

      // 所有任务成功
      const firstTask = status.tasks[0]
      return {
        status: 'SUCCESS',
        output: firstTask?.output || '',
        exitCode: firstTask?.exitCode || 0,
      }
    }

    // 等待下一次轮询
    await delay(pollInterval)
  }

  // 超时
  return {
    status: 'TIMEOUT',
    output: '',
    exitCode: -1,
  }
}
