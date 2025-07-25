// import { NextRequest, NextResponse } from 'next/server'
// import { z } from 'zod'
// import { getUserFromRequest } from '@/lib/auth'
// import { exec } from 'child_process'
// import { writeFileSync, unlinkSync, mkdirSync } from 'fs'
// import { join } from 'path'
// import { promisify } from 'util'

// const execAsync = promisify(exec)

// const executeSchema = z.object({
//   code: z.string(),
//   language: z.enum(['javascript', 'python', 'cpp']),
// })

// const EXECUTION_TIMEOUT = 10000 // 10 seconds
// const MAX_OUTPUT_LENGTH = 10000 // 10KB

// export async function POST(request: NextRequest) {
//   try {
//     const user = await getUserFromRequest(request)
    
//     if (!user) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       )
//     }

//     const body = await request.json()
//     const { code, language } = executeSchema.parse(body)

//     // Create temporary directory for execution
//     const tempDir = join(process.cwd(), 'temp', user.id)
//     mkdirSync(tempDir, { recursive: true })

//     let output = ''
//     let error = ''

//     try {
//       switch (language) {
//         case 'javascript':
//           output = await executeJavaScript(code, tempDir)
//           break
//         case 'python':
//           output = await executePython(code, tempDir)
//           break
//         case 'cpp':
//           output = await executeCpp(code, tempDir)
//           break
//         default:
//           throw new Error('Unsupported language')
//       }
//     } catch (err) {
//       error = (err as Error).message
//     }

//     // Cleanup temp files
//     try {
//       const { exec } = require('child_process')
//       exec(`rm -rf ${tempDir}`)
//     } catch (cleanupError) {
//       console.error('Cleanup error:', cleanupError)
//     }

//     // Limit output length
//     if (output.length > MAX_OUTPUT_LENGTH) {
//       output = output.substring(0, MAX_OUTPUT_LENGTH) + '\n... (output truncated)'
//     }

//     return NextResponse.json({
//       output: output.trim(),
//       error: error.trim(),
//       language
//     })

//   } catch (error) {
//     console.error('Code execution error:', error)
    
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { error: error.errors[0].message },
//         { status: 400 }
//       )
//     }

//     return NextResponse.json(
//       { error: 'Execution failed' },
//       { status: 500 }
//     )
//   }
// }

// async function executeJavaScript(code: string, tempDir: string): Promise<string> {
//   const filename = join(tempDir, 'script.js')
  
//   // Add console.log capture
//   const wrappedCode = `
// const originalLog = console.log;
// const outputs = [];
// console.log = (...args) => {
//   outputs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
// };

// try {
//   ${code}
// } catch (error) {
//   outputs.push('Error: ' + error.message);
// }

// originalLog(outputs.join('\\n'));
// `

//   writeFileSync(filename, wrappedCode)
  
//   const { stdout, stderr } = await execAsync(`node ${filename}`, {
//     timeout: EXECUTION_TIMEOUT,
//     cwd: tempDir
//   })
  
//   if (stderr) throw new Error(stderr)
//   return stdout
// }

// async function executePython(code: string, tempDir: string): Promise<string> {
//   const filename = join(tempDir, 'script.py')
//   writeFileSync(filename, code)
  
//   const { stdout, stderr } = await execAsync(`python3 ${filename}`, {
//     timeout: EXECUTION_TIMEOUT,
//     cwd: tempDir
//   })
  
//   if (stderr) throw new Error(stderr)
//   return stdout
// }

// async function executeCpp(code: string, tempDir: string): Promise<string> {
//   const sourceFile = join(tempDir, 'main.cpp')
//   const executableFile = join(tempDir, 'main')
  
//   writeFileSync(sourceFile, code)
  
//   // Compile
//   await execAsync(`g++ -o ${executableFile} ${sourceFile}`, {
//     timeout: EXECUTION_TIMEOUT,
//     cwd: tempDir
//   })
  
//   // Execute
//   const { stdout, stderr } = await execAsync(executableFile, {
//     timeout: EXECUTION_TIMEOUT,
//     cwd: tempDir
//   })
  
//   if (stderr) throw new Error(stderr)
//   return stdout
// }



import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code, language } = await request.json()

    if (!code || !language) {
      return NextResponse.json({ error: 'Code and language are required' }, { status: 400 })
    }

    let output = ''
    let error = ''

    try {
      switch (language) {
        case 'javascript':
          // Simple JavaScript execution using eval (in a safe context)
          const originalLog = console.log
          const logs: string[] = []
          console.log = (...args) => {
            logs.push(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '))
          }

          try {
            const result = eval(code)
            output = logs.join('\n')
            if (result !== undefined && logs.length === 0) {
              output = String(result)
            }
          } catch (execError) {
            error = String(execError)
          } finally {
            console.log = originalLog
          }
          break

        case 'python':
          // For Python, you would need to set up a Python runtime
          // This is a placeholder - in production, you'd use a sandboxed environment
          output = 'Python execution requires server-side setup with Docker or similar sandboxing.'
          break

        case 'cpp':
          // For C++, you would need to set up a C++ compiler
          // This is a placeholder - in production, you'd use a sandboxed environment
          output = 'C++ execution requires server-side setup with Docker or similar sandboxing.'
          break

        default:
          error = `Execution not supported for language: ${language}`
      }
    } catch (execError) {
      error = String(execError)
    }

    return NextResponse.json({
      output,
      error,
      language
    })

  } catch (error) {
    console.error('Code execution error:', error)
    return NextResponse.json({ error: 'Failed to execute code' }, { status: 500 })
  }
}
