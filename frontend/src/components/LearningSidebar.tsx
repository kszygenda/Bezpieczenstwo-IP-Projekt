import { useState } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react'
import BorderGlow from './BorderGlow'
import { PrimaryButton, SecondaryButton } from './Button'
import { useI18n } from '../i18n'

export type LearningSection = {
  id: string
  title: string
  content: string
  code?: string
}

type LearningSidebarProps = {
  moduleTitle: string
  tabLabel: string
  panelTitle: string
  sections: LearningSection[]
  prevLabel: string
  nextLabel: string
  closeLabel: string
  openSectionLabel: string
}

export function LearningSidebar({
  moduleTitle,
  tabLabel,
  panelTitle,
  sections,
  prevLabel,
  nextLabel,
  closeLabel,
  openSectionLabel,
}: LearningSidebarProps) {
  const { language, setLanguage, t } = useI18n()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const activeSection = activeIndex === null ? null : sections[activeIndex]
  const canGoPrev = activeIndex !== null && activeIndex > 0
  const canGoNext = activeIndex !== null && activeIndex < sections.length - 1

  const openSection = (index: number) => {
    setActiveIndex(index)
    setIsMobileNavOpen(false)
    setIsModalOpen(true)
  }

  const goPrev = () => {
    if (!canGoPrev || activeIndex === null) return
    setActiveIndex((prev) => (prev === null ? prev : prev - 1))
  }

  const goNext = () => {
    if (!canGoNext || activeIndex === null) return
    setActiveIndex((prev) => (prev === null ? prev : prev + 1))
  }

  return (
    <>
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-80 border-r border-neutral-800 bg-neutral-950/95 p-4 lg:block">
        <div className="mb-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
          <p className="text-sm font-semibold text-neutral-100">{t('app.title')}</p>
          <p className="text-xs text-neutral-400">{t('app.subtitle')}</p>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-neutral-300">{t('app.langLabel')}:</span>
            {language === 'pl' ? (
              <PrimaryButton type="button" onClick={() => setLanguage('pl')} size="xs">
                {t('app.langPL')}
              </PrimaryButton>
            ) : (
              <SecondaryButton type="button" onClick={() => setLanguage('pl')} size="xs">
                {t('app.langPL')}
              </SecondaryButton>
            )}
            {language === 'en' ? (
              <PrimaryButton type="button" onClick={() => setLanguage('en')} size="xs">
                {t('app.langEN')}
              </PrimaryButton>
            ) : (
              <SecondaryButton type="button" onClick={() => setLanguage('en')} size="xs">
                {t('app.langEN')}
              </SecondaryButton>
            )}
          </div>
        </div>

        <div className="mb-4 px-1">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-100">
            <BookOpen size={17} className="text-orange-600" /> {tabLabel}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.12em] text-neutral-400">{panelTitle}</p>
          <h3 className="mt-1 text-sm font-semibold text-neutral-100">{moduleTitle}</h3>
        </div>

        <nav className="space-y-2">
          {sections.map((section, index) => (
            <BorderGlow
              key={section.id}
              className="rounded-lg !border-neutral-800"
              borderRadius={8}
              glowColor="24 95 55"
              backgroundColor="rgb(23 23 23)"
              colors={['#ea580c', '#fb923c', '#fdba74']}
            >
              <button
                type="button"
                onClick={() => openSection(index)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                  index === activeIndex
                    ? 'border-orange-600 bg-orange-600/10 text-neutral-100'
                    : 'border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:border-orange-600 hover:text-neutral-100'
                }`}
              >
                {section.title}
              </button>
            </BorderGlow>
          ))}
        </nav>
      </aside>

      {!isModalOpen ? (
        <>
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(true)}
            className="fixed right-4 top-4 z-50 rounded-xl bg-orange-600 px-3 py-3 text-neutral-950 shadow-xl transition hover:bg-orange-500 lg:hidden"
            aria-label={tabLabel}
          >
            <BookOpen size={16} />
          </button>
        </>
      ) : null}

      <div className={`fixed inset-0 z-50 lg:hidden ${isMobileNavOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <button
          type="button"
          aria-label={closeLabel}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isMobileNavOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileNavOpen(false)}
        />

        <aside
          className={`absolute left-0 top-0 h-full w-[86%] max-w-xs border-r border-neutral-800 bg-neutral-950 p-4 shadow-2xl transition-transform duration-300 ${
            isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
            <div>
              <p className="text-sm font-semibold text-neutral-100">{t('app.title')}</p>
              <p className="text-xs text-neutral-400">{t('app.subtitle')}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(false)}
              className="rounded-md border border-neutral-700 bg-neutral-950 p-1 text-neutral-300 transition hover:border-orange-600 hover:text-neutral-100"
              aria-label={closeLabel}
            >
              <X size={16} />
            </button>
          </div>

          <div className="mb-4 flex items-center gap-2 text-xs">
            <span className="text-neutral-300">{t('app.langLabel')}:</span>
            {language === 'pl' ? (
              <PrimaryButton type="button" onClick={() => setLanguage('pl')} size="xs">
                {t('app.langPL')}
              </PrimaryButton>
            ) : (
              <SecondaryButton type="button" onClick={() => setLanguage('pl')} size="xs">
                {t('app.langPL')}
              </SecondaryButton>
            )}
            {language === 'en' ? (
              <PrimaryButton type="button" onClick={() => setLanguage('en')} size="xs">
                {t('app.langEN')}
              </PrimaryButton>
            ) : (
              <SecondaryButton type="button" onClick={() => setLanguage('en')} size="xs">
                {t('app.langEN')}
              </SecondaryButton>
            )}
          </div>

          <div className="mb-4 px-1">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-100">
              <BookOpen size={17} className="text-orange-600" /> {tabLabel}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-neutral-400">{panelTitle}</p>
            <h3 className="mt-1 text-sm font-semibold text-neutral-100">{moduleTitle}</h3>
          </div>

          <nav className="space-y-2 overflow-auto pr-1">
            {sections.map((section, index) => (
              <button
                key={section.id}
                type="button"
                onClick={() => openSection(index)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                  index === activeIndex
                    ? 'border-orange-600 bg-orange-600/10 text-neutral-100'
                    : 'border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:border-orange-600 hover:text-neutral-100'
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </aside>
      </div>

      {isModalOpen && activeSection ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label={closeLabel}
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              setIsModalOpen(false)
              setActiveIndex(null)
              setIsMobileNavOpen(false)
            }}
          />

          <article className="relative w-full max-w-3xl rounded-2xl border border-neutral-700 bg-neutral-950 p-5 shadow-2xl sm:p-6">
            <header className="mb-4 border-b border-neutral-800 pb-3">
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-400">{moduleTitle}</p>
              <h4 className="mt-1 text-xl font-semibold text-neutral-100">{activeSection?.title}</h4>
            </header>

            <div className="max-h-[56vh] space-y-4 overflow-auto pr-1">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-200">{activeSection?.content}</p>

              {activeSection?.code ? (
                <pre className="overflow-auto rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-xs text-neutral-100">
                  <code>{activeSection?.code}</code>
                </pre>
              ) : null}
            </div>

            <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800 pt-4">
              <SecondaryButton
                type="button"
                onClick={() => {
                  setIsModalOpen(false)
                  setActiveIndex(null)
                  setIsMobileNavOpen(false)
                }}
                size="sm"
              >
                {closeLabel}
              </SecondaryButton>

              <div className="flex items-center gap-2">
                <SecondaryButton type="button" onClick={goPrev} size="sm" disabled={!canGoPrev}>
                  <ChevronLeft size={14} /> {prevLabel}
                </SecondaryButton>
                <PrimaryButton type="button" onClick={goNext} size="sm" disabled={!canGoNext}>
                  {nextLabel} <ChevronRight size={14} />
                </PrimaryButton>
              </div>
            </footer>
          </article>
        </div>
      ) : null}

      {!isModalOpen ? (
        <span className="sr-only">{openSectionLabel}</span>
      ) : null}
    </>
  )
}
