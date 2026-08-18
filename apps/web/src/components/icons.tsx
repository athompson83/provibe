import type { SVGProps } from 'react';
type IconProps = SVGProps<SVGSVGElement>;
function IconBase({ children, ...props }: IconProps) { return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>; }
export const Icons = {
  overview: (props: IconProps) => <IconBase {...props}><path d="M4 5h7v6H4zM13 5h7v3h-7zM13 10h7v9h-7zM4 13h7v6H4z" /></IconBase>,
  blueprint: (props: IconProps) => <IconBase {...props}><path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" /></IconBase>,
  code: (props: IconProps) => <IconBase {...props}><path d="m9 7-5 5 5 5M15 7l5 5-5 5M13 5l-2 14" /></IconBase>,
  database: (props: IconProps) => <IconBase {...props}><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></IconBase>,
  deployments: (props: IconProps) => <IconBase {...props}><path d="M12 3v12M7 8l5-5 5 5M5 15v5h14v-5" /></IconBase>,
  changes: (props: IconProps) => <IconBase {...props}><path d="M7 7h10M7 12h10M7 17h6" /><circle cx="5" cy="7" r="1" /><circle cx="5" cy="12" r="1" /><circle cx="5" cy="17" r="1" /></IconBase>,
  ask: (props: IconProps) => <IconBase {...props}><path d="M5 5h14v11H9l-4 4z" /><path d="M9 9h6M9 12h4" /></IconBase>,
  arrow: (props: IconProps) => <IconBase {...props}><path d="M5 12h14M14 7l5 5-5 5" /></IconBase>
};
