import { exec, ExecOptions } from "child_process";

/**
 * 处理结果
 */
export interface HandleResult {
    statusCode: number,
    data: any
}
/**
 * 命令行运行结果
 */
interface CommandResult {
    error: string,
    stdout: string,
    stderr: string
}
/**
 * 调用webhook的方法
 * @param projectPath 项目名
 * @returns 返回状态
 */
export async function handleWebHook(projectPath: string, projectName?: string): Promise<HandleResult> {
    console.log("projectPath", projectPath);
    let res = {
        statusCode: 200,
        data: "重启成功"
    }
    try {
        // 执行到目录下
        const cdCommand = `cd ${projectPath}`
        /** 拉取最新代码 */
        const gitPullCommand = `${cdCommand} && git pull`
        await execShellAndHandleError(gitPullCommand, "拉取最新代码失败", 3)
    
        /** 启动项目 */
        const restartCommand = `${cdCommand} && ./start.sh ${projectName}`
        await execShellAndHandleError(restartCommand, "启动命令运行失败")
    } catch (error: any) {
        res.statusCode = 500
        res.data = error
    }
    return res
}

/**
 * 执行脚本并处理错误
 * @param command 
 * @param options 
 */
async function execShellAndHandleError(command: string, errString: string, retryNum:number = 0, options?: ExecOptions): Promise<HandleResult> {
    let res = {
        statusCode: 200,
        data: "success"
    }
    const gitPullCommandRes = await execShell(command, options)
    if(gitPullCommandRes.error){
        console.error(`执行命令失败，具体错误`, gitPullCommandRes.error)
        if(retryNum > 0){
            console.log("重试命令", command);
            return execShellAndHandleError(command, errString, retryNum--, options)
        }
        throw errString
    }
    return res
}

/**
 * 执行命令行
 * @param command 命令行
 * @param options 参数
 * @returns 
 */
function execShell(command: string, options?: ExecOptions): Promise<CommandResult> {
    return new Promise((resolve, reject) => {
        console.log("运行命令", command);
        
        exec(command, options, (error, stdout, stderr) => {
            console.log("命令的运行结果为", command, stdout, stderr)
            resolve({
                error: error?.message || "",
                stderr: stderr.toString(),
                stdout: stdout.toString()
            })
        })
    })
}