// Code-a-Nova mark: an orbit ring around a bright core
export default function Logo({ light = false }) {
  return (
    <span className="inline-flex items-center gap-2 font-display text-xl font-extrabold">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="11" fill="none" stroke="#3B3BF5" strokeWidth="2.5" />
        <circle cx="16" cy="16" r="4" fill="#FFB800" />
        <circle cx="25" cy="10" r="2.5" fill={light ? '#fff' : '#12142B'} />
      </svg>
      <span className={light ? 'text-white' : 'text-ink'}>Code-a-Nova</span>
    </span>
  );
}
