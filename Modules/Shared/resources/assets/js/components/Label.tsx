import EditableText from '@shared/utils/EditableText'
import React from 'react'

const Label = ({ title, path, dontEdit, className }: { className?: string, dontEdit?: boolean, path?: string, title?: string }) => {
  if (dontEdit) {
    return (
      <div
        className={`w-fit ${className} mb-6 `}
      >
        <span className='text-arch-accent text-sm font-medium mb-4 leading-5' children={title} />
      </div>
    )
  }
  else
    return (
      <EditableText
        className={`w-fit ${className} mb-6 `}
        top='40%'
        start='10%'
        path={path || ""}
        text={title || ""}
      >
        <span className='text-arch-accent text-sm font-medium mb-4 leading-5' children={title} />
      </EditableText>
    )
}

export default Label
