import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export interface SearchProps {
  name: string,
  translatable?: boolean
}

export interface SearchHeaderProps {
  searchFields: SearchProps[] | any
  placeHolder: string,
  onSearchModeChange?: (isSearching: boolean) => void;
}

const SearchHeader = ({ placeHolder, searchFields, onSearchModeChange }: SearchHeaderProps) => {
  const { locale } = usePage().props as any;
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const { url } = usePage();
  const currentPath = url.split('?')[0];
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const trimmed = search.trim();
    const debounce = setTimeout(() => {
      if (trimmed !== "") {
        onSearchModeChange?.(true);
        router.get(
          currentPath,
          { search, searchFields: JSON.stringify(searchFields) },
          {
            preserveState: true,
            replace: true,
            preserveScroll: true,
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
          }
        );
      } else {
        onSearchModeChange?.(false);
        setLoading(false);
        router.get(
          currentPath,
          {},
          { preserveState: true, replace: true, preserveScroll: true }
        );
      }
    }, 700);
    return () => clearTimeout(debounce);
  }, [search]);

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="relative max-w-md">

        {/* Left Search Icon */}
        <span className="absolute inset-y-0 start-0 flex items-center ps-3">
          <FiSearch className="text-gray-400" />
        </span>

        {/* Right Spinner */}
        {loading && (
          <span className="absolute inset-y-0 end-0 flex items-center pe-3">
            <svg
              className="animate-spin h-4 w-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>

              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          </span>
        )}

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full ps-10 pe-10 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 focus:outline-none sm:text-sm transition duration-150 ease-in-out"
          placeholder={
            placeHolder ||
            (locale === 'ar'
              ? 'ابحث هنا...'
              : 'Search here...')
          }
        />
      </div>
    </div>
  );
};

export default SearchHeader;