export type AppErrorCode = "PARSE" | "IMAGE" | "RENDER" | "BAKE" | "MEMORY";

export interface AppError {
  code: AppErrorCode;
  action: string;
  message: string;
}

export function toAppError(
  code: AppErrorCode,
  action: string,
  cause: unknown,
): AppError {
  const message =
    cause instanceof Error && cause.message
      ? cause.message
      : typeof cause === "string"
        ? cause
        : "未知错误";
  return { code, action, message };
}

export function formatAppError(error: AppError): string {
  return `${error.action}失败：${error.message}`;
}
