import React, { useEffect, useRef, useState } from 'react';

const profileItems = ['Account', 'Settings', 'Theme', 'Logout'];

export default function Navbar({ theme, setTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <header className='sticky top-0 z-20 border-b border-white/50 bg-white/75 backdrop-blur-md'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.35em] text-brand-700'>Expense tracker</p>
          <h1 className='text-2xl font-bold text-slate-900'>Finance Overview Dashboard</h1>
        </div>

        <div className='relative' ref={menuRef}>
          <button
            type='button'
            onClick={() => setIsOpen((value) => !value)}
            className='flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'
          >
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-semibold text-white'>
              RH
            </div>
            <div className='hidden text-left sm:block'>
              <p className='text-sm font-semibold text-slate-900'>Rhea Holmes</p>
              <p className='text-xs text-slate-500'>Profile menu</p>
            </div>
          </button>

          {isOpen && (
            <div className='absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl'>
              {profileItems.map((item) => (
                <button
                  key={item}
                  type='button'
                  onClick={item === 'Theme' ? toggleTheme : undefined}
                  className='flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100'
                >
                  <span>{item}</span>
                  {item === 'Theme' ? (
                    <span className='rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500'>
                      {theme === 'dark' ? 'Dark' : 'Light'}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
