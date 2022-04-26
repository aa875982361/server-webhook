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
    // 执行到目录下
    const cdCommand = `cd ${projectPath}`
    const cdRes = await execShell(cdCommand)
    if(cdRes.error){
        console.error(`执行命令失败，具体错误`, cdRes.error)
        res.statusCode = 500
        res.data = "处理命令失败 cd"
        return res
    }
    const restartCommand = `./start.sh ${projectName}`
    const restartCommandRes = await execShell(restartCommand)
    if(restartCommandRes.error){
        console.error(`执行命令失败，具体错误`, restartCommandRes.error)
        res.statusCode = 500
        res.data = "处理命令失败 start"
        return res
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
        exec(command, options, (error, stdout, stderr) => {
            resolve({
                error: error?.message || "",
                stderr: stderr.toString(),
                stdout: stdout.toString()
            })
        })
    })
}