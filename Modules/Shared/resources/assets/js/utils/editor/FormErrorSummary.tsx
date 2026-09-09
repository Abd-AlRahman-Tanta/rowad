import React from 'react'
import { FiAlertCircle, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'

interface FormErrorSummaryProps {
  errors: Record<string, any>
  locale: string
  fields: any[]
}

export const getScrollTargetId = (key: string): string => {
  return `field-${key.replace(/\./g, '-')}`
}

const buildFieldMap = (fields: any[]): Record<string, string> => {
  const map: Record<string, string> = {}

  const processFields = (fieldList: any[], prefix = '', repeaterLabel = '') => {
    fieldList.forEach((field: any) => {
      const fullKey = prefix ? `${prefix}.${field.name}` : field.name

      map[fullKey] = field.label

      if (['spatie', 'spatie-richtext', 'spatie-file', 'spatie-json'].includes(field.type)) {
        map[`${fullKey}.ar`] = field.label
        map[`${fullKey}.en`] = field.label
      }

      if (field.type === 'repeater' && field.repeaterFields) {
        field.repeaterFields.forEach((subField: any) => {
          map[`${field.name}.*.${subField.name}`] = subField.label

          if (['spatie', 'spatie-richtext', 'spatie-file', 'spatie-json'].includes(subField.type)) {
            map[`${field.name}.*.${subField.name}.ar`] = subField.label
            map[`${field.name}.*.${subField.name}.en`] = subField.label
          }
        })
      }
    })
  }

  processFields(fields)
  return map
}

const getFieldLabel = (key: string, fields: any[], locale: string): string => {
  const parts = key.split('.')
  const isAr = locale === 'ar'
  const fieldMap = buildFieldMap(fields)

  if (parts.length === 1) {
    return fieldMap[key] || key.replace(/_/g, ' ')
  }

  if (parts.length === 2 && (parts[1] === 'ar' || parts[1] === 'en')) {
    const baseLabel = fieldMap[parts[0]] || parts[0].replace(/_/g, ' ')
    const langSuffix = parts[1] === 'ar'
      ? (isAr ? ' (عربي)' : ' (Arabic)')
      : (isAr ? ' (إنجليزي)' : ' (English)')
    return `${baseLabel}${langSuffix}`
  }

  if (parts.length === 2 && !isNaN(Number(parts[1])) === false) {
    const parentField = fields.find(f => f.name === parts[0])
    if (parentField) {
      return parentField.label
    }
    return fieldMap[key] || parts[0].replace(/_/g, ' ')
  }

  if (parts.length >= 3 && !isNaN(Number(parts[1]))) {
    const repeaterName = parts[0]
    const index = Number(parts[1])
    const subFieldParts = parts.slice(2)
    const subFieldName = subFieldParts[0]
    const langPart = subFieldParts[subFieldParts.length - 1]

    const repeaterField = fields.find(f => f.name === repeaterName)
    const repeaterLabel = repeaterField?.label || repeaterName.replace(/_/g, ' ')

    const subField = repeaterField?.repeaterFields?.find((sf: any) => {
      const subKey = subFieldParts.join('.')
      return sf.name === subKey ||
        sf.name === subFieldName ||
        subKey.startsWith(sf.name + '.')
    })

    const subLabel = subField?.label ||
      fieldMap[`${repeaterName}.*.${subFieldName}`] ||
      subFieldName.replace(/_/g, ' ')

    const langSuffix = langPart === 'ar'
      ? (isAr ? ' (عربي)' : ' (Arabic)')
      : langPart === 'en'
        ? (isAr ? ' (إنجليزي)' : ' (English)')
        : ''

    const sectionLabel = isAr ? `#${index + 1}` : `#${index + 1}`

    return `${repeaterLabel} ${sectionLabel} › ${subLabel}${langSuffix}`
  }

  return fieldMap[key] || key.replace(/_/g, ' ')
}

const scrollToField = (key: string) => {
  const parts = key.split('.')

  const candidates: string[] = []

  candidates.push(getScrollTargetId(key))

  for (let i = parts.length - 1; i >= 1; i--) {
    candidates.push(getScrollTargetId(parts.slice(0, i).join('.')))
  }

  let el: HTMLElement | null = null
  for (const id of candidates) {
    el = document.getElementById(id)
    if (el) break
  }

  if (!el && parts.length >= 3 && !isNaN(Number(parts[1]))) {
    const prefix = getScrollTargetId(`${parts[0]}.${parts[1]}`)
    el = document.querySelector(`[id^="${prefix}"]`) as HTMLElement
  }

  if (!el && parts.length >= 2) {
    el = document.getElementById(getScrollTargetId(parts[0]))
  }

  if (el) {
    const navbarHeight = 80
    const elementTop = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({
      top: elementTop - navbarHeight - 40,
      behavior: 'smooth'
    })

    // flash effect
    el.style.transition = 'outline 0.15s'
    el.style.outline = '2px solid #f87171'
    el.style.borderRadius = '8px'
    setTimeout(() => {
      if (el) {
        el.style.outline = ''
        el.style.borderRadius = ''
      }
    }, 2500)
  }
}

// =============================================
// Component
// =============================================
const FormErrorSummary = ({ errors, locale, fields }: FormErrorSummaryProps) => {
  const [open, setOpen] = React.useState(false)
  const errorKeys = Object.keys(errors)

  if (errorKeys.length === 0) return null

  const isAr = locale === 'ar'

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/20 z-40"
        />
      )}

      <div
        className={`
          fixed bottom-0 z-50
          w-[360px] max-w-[90vw]
          bg-white
          shadow-2xl
          border border-red-200
          rounded-t-xl
          transition-transform duration-300
          ${isAr ? 'right-0' : 'left-0'}
          ${open
            ? 'translate-x-0'
            : isAr
              ? 'translate-x-full'
              : '-translate-x-full'
          }
        `}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border-b border-red-200 rounded-t-xl">
          <FiAlertCircle className="shrink-0 text-red-500" size={18} />
          <span className="font-semibold text-sm text-red-700 flex-1">
            {isAr
              ? `${errorKeys.length} خطأ في النموذج`
              : `${errorKeys.length} error${errorKeys.length > 1 ? 's' : ''} in form`}
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-red-100 text-red-500"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Error List */}
        <div className="max-h-[50vh] overflow-y-auto">
          {errorKeys.map((key) => {
            const message = Array.isArray(errors[key]) ? errors[key][0] : errors[key]
            const label = getFieldLabel(key, fields, locale)

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  scrollToField(key)
                  setOpen(false)
                }}
                className="w-full text-start px-4 py-3 hover:bg-red-50 transition-colors border-b border-red-100 last:border-0 flex items-start gap-2 group"
              >
                <span className="text-red-400 mt-0.5 shrink-0">›</span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-red-700 group-hover:underline block truncate text-sm">
                    {label}
                  </span>
                  <span className="text-red-500 block truncate text-xs mt-0.5">
                    {message}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <FiAlertCircle className="text-red-500" size={16} />
        <span>
          {isAr
            ? `${errorKeys.length} خطأ`
            : `${errorKeys.length} error${errorKeys.length > 1 ? 's' : ''}`}
        </span>
        {isAr ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
      </button>
    </>
  )
}

export default FormErrorSummary