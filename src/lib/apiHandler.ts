import { NextResponse } from 'next/server'

export function apiHandler<T extends unknown[], R>(handler: (...args: T) => Promise<R>) {
  return async (...args: T) => {
    try {
      return await handler(...args)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error'
      return NextResponse.json({ ok: false, error: message }, { status: 500 })
    }
  }
}