import { StudentReviewProps } from '@pages/interfaces'
import Description from '@shared/components/Description';
import Image from '@shared/components/Image';
import SectionTitle from '@shared/components/SectionTitle';
import Button from '@shared/components/Button';
import React, { useRef, useState, useEffect } from 'react'

const Review = ({ description, stars, userImage, userJob, userName, index }: StudentReviewProps & { index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const descRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    setIsClamped(el.scrollHeight >= el.clientHeight + 1);
  }, [description]);

  return (
    <div className='min-h-[25.5rem] bg-arch-card rounded-3xl
                  border border-arch-gray/10
                  p-8
                  shadow-review
                  hover:shadow-reviewHover
                  transition-all duration-500
                  hover:-translate-y-1'>
      <div className="flex items-center gap-4 mb-6">
        {userImage ? (
          <Image
            src={userImage}
            className="
                        w-16 aspect-square rounded-full object-cover
                        border-2 border-arch-accent/20
                      "
          />
        ) : (
          <div
            className="
                        w-16 aspect-square rounded-full
                        bg-arch-light
                        border-2 border-arch-accent/20
                        flex items-center justify-center
                        text-arch-accent
                        font-bold text-lg
                      "
            children={userName?.charAt(0)}
          />
        )}
        <div>
          <SectionTitle children={userName} className="text-lg font-medium text-arch-dark" />
          <Description
            children={userJob}
            className="text-sm text-arch-gray" />
        </div>
      </div>

      <div
        ref={descRef}
        className={`
          text-xl text-arch-gray leading-4
          overflow-hidden
          transition-all duration-500 ease-in-out
          ${!expanded ? "line-clamp-4" : "line-clamp-none"}
        `}
        dangerouslySetInnerHTML={{ __html: description }}
      />

      {isClamped && (
        <div className="mt-3">
          <Button
            transparent
            dontAddShadow
            dontAddHoverEffect
            dontAddPadding
            black
            clickFunction={() => setExpanded(prev => !prev)}
            className=""
          >
            {expanded ? "Show Less ↑" : "Show More ↓"}
          </Button>
        </div>
      )}

      <div className="mt-8 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const starsNumbers = Number(stars);
          const filled = i < Math.floor(starsNumbers);
          const half = !filled && i < starsNumbers;
          return (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5"
              stroke="currentColor"
              strokeWidth={1.5}
              fill="none"
              style={{ color: "var(--color-arch-accent, #B09B71)" }}
            >
              <defs>
                <clipPath id={`half-${index}-${i}`}>
                  <rect x="0" y="0" width="12" height="24" />
                </clipPath>
              </defs>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="currentColor"
                clipPath={half ? `url(#half-${index}-${i})` : undefined}
                opacity={filled || half ? 1 : 0}
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              />
            </svg>
          );
        })}
      </div>
    </div>
  )
}

export default Review