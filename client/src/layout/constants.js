import { GraduationCap, Music, HandHeart, ShieldCheck, LayoutDashboard, Settings } from 'lucide-react';
import { NAV } from '../constants/text';

export const NAV_ITEMS = [
  { id: 'estudiantes', label: NAV.estudiantes, icon: GraduationCap, path: '/estudiantes' },
  { id: 'instrumentos', label: NAV.instrumentos, icon: Music, path: '/instrumentos' },
  { id: 'comodatos', label: NAV.comodatos, icon: HandHeart, path: '/comodatos' },
  { id: 'dashboard', label: NAV.dashboard, icon: LayoutDashboard, path: '/dashboard' },
  { id: 'usuarios', label: NAV.usuarios, icon: ShieldCheck, path: '/usuarios', adminOnly: true },
  { id: 'configuracion', label: NAV.configuracion, icon: Settings, path: '/configuracion', adminOnly: true },
];
