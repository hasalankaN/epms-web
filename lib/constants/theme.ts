// =============================================
// Auth Theme Constants
// =============================================

export const COLORS = {
  // Pink shades (primary brand)
  pink600: '#E60076',
  pink500: '#F6339A',
  
  // Slate shades
  slate100: '#F1F5F9',
  slate400: '#90A1B9',
  slate600: '#45556C',
  slate700: '#314158',
  slate800: '#1D293D',
  slate900: '#0F172B',
  slate950: '#020618',
  
  // Utility
  error: '#FB2C36',
  line: '#E4E4E7',
} as const;

// =============================================
// Typography Styles
// =============================================

export const AUTH_TYPOGRAPHY = {
  /** Page title: Bold 24px, #0F172B */
  title: "text-[#0F172B] text-center font-sans text-2xl font-bold leading-[38px]",
  
  /** Subtitle: 12px, #90A1B9 */
  subtitle: "text-[#90A1B9] text-center font-sans text-xs font-normal leading-4",
  
  /** Form label: 14px medium, #1D293D */
  label: "text-sm font-medium leading-5 text-[#1D293D]",
  
  /** Required asterisk */
  required: "text-[#FB2C36]",
  
  /** Helper/info text: 12px, #45556C */
  helperText: "text-sm font-normal text-[#45556C] leading-5",
  
  /** Timer text: 12px medium, #1D293D */
  timerText: "text-[#1D293D] font-sans text-xs font-medium leading-4",
  
  /** Timer label: 12px, #45556C */
  timerLabel: "text-[#45556C] font-sans text-xs font-normal leading-4",

  /** Small Description: 12px regular, #90A1B9 */
  description: "text-[#90A1B9] font-sans text-xs font-normal leading-4",
} as const;

// =============================================
// Input Styles
// =============================================

export const AUTH_INPUT = {
  /** Standard input field */
  base: "h-10 text-sm rounded-md border-gray-300 focus-visible:ring-[#E60076]",
  
  /** Input placeholder */
  placeholder: "placeholder:text-[#90A1B9] placeholder:italic",
  
  /** Input with error */
  error: "border-red-500 focus-visible:ring-red-500",
  
  /** OTP slot */
  otpSlot: "w-12 h-12 rounded-lg border border-gray-300 ring-[#E60076] ring-offset-2 text-lg",
} as const;

// =============================================
// Button Styles
// =============================================

export const BUTTON_STYLES = {
  primary: {
    /** Full width primary button (pink) */
    full: "w-full h-10 text-sm font-semibold rounded-md transition-colors duration-200 bg-[#E60076] text-white hover:bg-[#F6339A] shadow-sm disabled:bg-[#F1F5F9] disabled:text-[#90A1B9]",
    
    /** Inline primary button */
    md: "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#E60076] px-4 py-2 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.10),0_1px_3px_0_rgba(16,24,40,0.10)] transition-colors hover:bg-[#F6339A] focus:bg-[#F6339A] disabled:bg-[#F1F5F9] disabled:text-[#CAD5E2] disabled:pointer-events-none",

    /** Responsive primary button (icon on mobile, text on desktop) */
    responsive: "flex items-center gap-2 rounded-md bg-[#E60076] px-3 py-2 sm:px-4 font-sans text-sm font-semibold leading-5 text-white shadow-sm transition-colors hover:bg-[#F6339A] focus:outline-none focus:ring-2 focus:ring-[#E60076] focus:ring-offset-2",
  },
  
  outline: {
    /** Outline button (md) */
    md: "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#E2E8F0] bg-transparent px-4 py-2 shadow-sm transition-colors hover:bg-[#F1F5F9] focus:border-[#90A1B9] focus:bg-[#F1F5F9] disabled:border-[#F1F5F9] disabled:bg-[#F1F5F9]",
  },
  
  secondary: {
    /** Disabled/inactive button style */
    disabled: "bg-[#F1F5F9] text-[#90A1B9] hover:bg-[#F1F5F9]",

    /** Secondary button (md) */
    md: "inline-flex h-[40px] items-center justify-center gap-[8px] rounded-[6px] bg-[#F1F5F9] px-[16px] py-[8px] text-[#0F172B] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-[#E2E8F0] focus:bg-[#E2E8F0] focus:ring-2 focus:ring-[#E2E8F0] focus:ring-offset-2 disabled:bg-[#F1F5F9] disabled:text-[#CAD5E2] disabled:cursor-not-allowed",
  },

  active: {
    /** Active/Selected state (pinkish) */
    md: "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#F6339A] bg-[#FDF2F8] px-4 py-2 text-[#F6339A] shadow-sm transition-colors hover:bg-[#FCE7F3]",
  },

  destructive: {
    /** Destructive (Delete) Button */
    md: "inline-flex h-[40px] items-center justify-center gap-[8px] rounded-[6px] bg-[#FB2C36] px-[16px] py-[8px] text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] hover:bg-[#FF6467] focus:bg-[#FF6467] disabled:bg-[#F1F5F9] disabled:text-[#CAD5E2] disabled:cursor-not-allowed",
  },

  ghost: {
    /** Ghost button (sm) - Pink text, transparent bg, light pink hover */
    sm: "inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-transparent px-3 text-sm font-semibold text-[#E60076] shadow-none transition-colors hover:bg-[#FDF2F8] hover:text-[#E60076]",
  },
  
  dark: {
    /** Dark button (sm) - Black text, often used for specific request actions */
    sm: "inline-flex h-[36px] items-center justify-center gap-[8px] rounded-[6px] bg-[#18181B] px-[16px] py-[8px] text-white shadow-[0_1px_2px_-1px_rgba(0,0,0,0.10),0_1px_3px_0_rgba(16,24,40,0.10)] font-sans text-[14px] font-medium leading-[20px] transition-colors hover:bg-[#18181B]/90 focus:ring-2 focus:ring-[#18181B] focus:ring-offset-2",
  },
} as const;

// =============================================
// Decorative Elements
// =============================================

export const AUTH_DECORATIVE = {
  /** Horizontal divider line (72px) */
  dividerLine: "h-[1px] w-[72px] bg-[#E4E4E7]",
} as const;

// =============================================
// Sidebar Navigation Styles
// =============================================

export const SIDEBAR_NAV = {
  /** Base styles for all nav links */
  base: "flex w-full items-center gap-2 px-2 py-1.5 h-8 rounded-md transition-colors",

  /** Active state: dark background, white text */
  active: "bg-[#0F172B] text-white hover:bg-[#0F172B]/90",

  /** Default state: transparent, dark text */
  default: "bg-transparent text-[#0F172B] hover:bg-[#FDF2F8] hover:text-[#0F172B]",

  /** Sub-item default state: slate-700 text */
  subDefault: "bg-transparent text-[#314158] hover:bg-[#FDF2F8] hover:text-[#314158]",

  /** Disabled state: light background, muted text */
  disabled: "bg-[#F1F5F9] text-[#90A1B9] cursor-not-allowed hover:bg-[#F1F5F9]",

  /** Text styling for nav link labels */
  text: "line-clamp-1 overflow-hidden text-ellipsis text-left text-sm font-sans leading-5",

  /** Icon styling */
  icon: "h-4 w-4 shrink-0",

  /** Badge for counts */
  badge: {
    active: "ml-auto text-xs font-semibold rounded-md px-2 py-0.5 bg-white text-[#0F172B]",
    default: "ml-auto text-xs font-semibold rounded-md px-2 py-0.5 bg-[#E2E8F0] text-[#45556C]",
  },
} as const;

// =============================================
// Tab Styles
// =============================================

export const TAB_STYLES = {
  /** Container for the tabs */
  container: "inline-flex h-auto items-center justify-center gap-1 rounded-md bg-[#F1F5F9] p-1",

  /** Base style for all tab triggers (common props) */
  triggerBase: "flex h-7 w-[100px] items-center justify-center gap-1 rounded-[4px] px-3 py-1 text-xs font-medium leading-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",

  /** Active state for tab triggers */
  active: "bg-white text-[#1D293D] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]",

  /** Inactive state for tab triggers */
  inactive: "text-[#62748E] hover:text-[#1D293D]", // rounded-sm is 2px, close enough to 0.125rem
  
  /** Icon style */
  icon: "h-4 w-4 shrink-0",
} as const;
