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
        data: "success"
    }
    try {
        // 执行到目录下
        const cdCommand = `cd ${projectPath}`
        await execShellAndHandleError(cdCommand)
        // 查看当前位置
        await execShellAndHandleError("pwd")
        /** 拉取最新代码 */
        const gitPullCommand = `git fetch ssh`
        await execShellAndHandleError(gitPullCommand)
    
        /** 启动项目 */
        const restartCommand = `./start.sh ${projectName}`
        await execShellAndHandleError(restartCommand)
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
async function execShellAndHandleError(command: string, options?: ExecOptions): Promise<HandleResult> {
    let res = {
        statusCode: 200,
        data: "success"
    }
    const gitPullCommandRes = await execShell(command, options)
    if(gitPullCommandRes.error){
        console.error(`执行命令失败，具体错误`, gitPullCommandRes.error)
        throw `处理命令失败 ${command}`
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
        console.log("运行命令");
        
        exec(command, options, (error, stdout, stderr) => {
            resolve({
                error: error?.message || "",
                stderr: stderr.toString(),
                stdout: stdout.toString()
            })
        })
    })
}