export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none w-screen h-screen">
      <svg 
        className="w-full h-full" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <defs>
          <pattern id="graphgrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#fdfbf8"/>
            <line x1="20" y1="0" x2="0" y2="0" stroke="#c0c0c8" strokeWidth="1"/>
            <line x1="0" y1="0" x2="0" y2="20" stroke="#c0c0c8" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#graphgrid)" />
      </svg>
    </div>
  );
}
