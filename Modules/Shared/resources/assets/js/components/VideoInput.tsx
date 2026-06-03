import { usePage } from '@inertiajs/react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'

const VideoInput = ({ onChange, name, defaultValue }: { name?: string, onChange: Dispatch<SetStateAction<any>>, defaultValue?: string | File }) => {
  const [preview, setPreview] = useState<string | null>(
    defaultValue instanceof File ? URL.createObjectURL(defaultValue) : defaultValue || null
  )
  const { locale } = usePage().props

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPreview(null)
    onChange(null)
  }

  return (
    <div className='relative'>
      <label className="cursor-pointer w-full">
        <input
          name={name}
          type="file"
          hidden
          accept="video/mp4,video/webm,video/mov,video/avi"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setPreview(URL.createObjectURL(e.target.files[0]))
              onChange(e.target.files[0])
            }
          }}
        />
        <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-secondary-500 transition">
          {preview ? (
            <video
              src={preview}
              className="w-full h-48 object-cover rounded-md"
              controls
              muted
            />
          ) : (
            <span className="text-gray-500">
              {locale == "en" ? "Click to upload video" : "أضغط لتحميل فيديو"}
            </span>
          )}
        </div>
      </label>

      {preview && (
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 end-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-700 transition z-10"
          title={locale == "en" ? "Remove video" : "حذف الفيديو"}
        >
          <FiTrash2 size={14} />
        </button>
      )}
    </div>
  )
}

export default VideoInput