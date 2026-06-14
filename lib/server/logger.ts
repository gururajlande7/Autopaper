type LogContext = Record<string, unknown>

function writeLog(
  level: 'info' | 'error',
  event: string,
  context: LogContext,
) {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...context,
  })

  if (level === 'error') {
    console.error(entry)
  } else {
    console.info(entry)
  }
}

export function logInfo(event: string, context: LogContext = {}) {
  writeLog('info', event, context)
}

export function logError(
  event: string,
  error: unknown,
  context: LogContext = {},
) {
  writeLog('error', event, {
    ...context,
    error:
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack:
              process.env.NODE_ENV === 'production' ? undefined : error.stack,
          }
        : String(error),
  })
}
