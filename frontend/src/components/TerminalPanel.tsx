import { Terminal } from 'lucide-react'
import type { ApiResult } from '../lib/api'
import { useI18n } from '../i18n'

type TerminalPanelProps = {
  title: string
  subtitle?: string
  logs: ApiResult<unknown>[]
}

function formatData(data: unknown, t: (key: string) => string) {
  if (typeof data === 'string') {
    return data
  }

  if (data === null || data === undefined) {
    return t('common.noPayload')
  }

  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return String(data)
  }
}

export function TerminalPanel({ title, subtitle, logs }: TerminalPanelProps) {
  const { t } = useI18n()

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/90 shadow-2xl shadow-black/40">
      <header className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900 text-orange-600">
            <Terminal size={17} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-neutral-100">{title}</h2>
            {subtitle ? <p className="text-xs text-neutral-400">{subtitle}</p> : null}
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-neutral-800 bg-neutral-900 px-2.5 py-1 font-mono text-[11px] text-neutral-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> {t('common.live')}
        </span>
      </header>

      <div className="max-h-[420px] overflow-auto px-3 py-3 font-mono text-xs sm:px-4 sm:text-sm">
        {logs.length === 0 ? (
          <p className="rounded-md border border-dashed border-neutral-700 p-3 text-neutral-400">
            {t('terminal.noLogs')}
          </p>
        ) : (
          <ul className="space-y-3">
            {logs.map((log, index) => (
              <li key={`${log.endpoint}-${index}`} className="animate-fade-up min-w-0 rounded-md border border-neutral-800 bg-neutral-950/70 p-3">
                <p className="mb-2 break-all font-cmd text-neutral-400">
                  <span className="text-orange-600">$</span> {log.method} {log.endpoint}
                </p>
                <p className={log.ok ? 'mb-2 font-cmd text-emerald-400' : 'mb-2 font-cmd text-rose-400'}>
                  [{log.status}] {log.ok ? t('common.ok') : t('common.error')}
                </p>
                <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-all text-neutral-200">{formatData(log.data, t)}</pre>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
