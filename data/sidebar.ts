export type SidebarNavItem = {
  id: number;
  type: "link" | "sub" | "header";
  title: string;
  icon?: string;
  url?: string;
  value?: string;
  children?: SidebarNavItem[];
  count?: number;
  external?: boolean;
};