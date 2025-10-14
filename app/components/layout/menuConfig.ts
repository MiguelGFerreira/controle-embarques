import { IconType } from "react-icons"; // apenas para tipagem

import { BarChart3, ChartArea, LayoutDashboard, Receipt, Ship } from "lucide-react";

type MenuItem = { href: string; label: string; icon: IconType };
type MenuGroup = { category: string; Items: MenuItem[] };

export const menus: Record<string, MenuGroup[]> = {
    // Menu para o setor "trafego"
    trafego: [
        {
            category: 'Geral',
            Items: [
                { href: '/trafego', label: 'Início', icon: LayoutDashboard },
            ],
        },
        {
            category: 'Gerenciamento',
            Items: [
                { href: '/trafego/gerenciamento/embarques', label: 'Embarques', icon: Ship },
                { href: '/trafego/gerenciamento/invoice', label: 'Invoice', icon: Receipt },
            ],
        },
        {
            category: 'Relatórios',
            Items: [
                { href: '/trafego/relatorios/embarques', label: 'Embarques', icon: BarChart3 },
                { href: '/trafego/relatorios/dashboard-embarques', label: 'Dashboards', icon: ChartArea },
            ],
        },
    ],

    // Futuramente: classification, fiscal, etc.
    // classificacao: [ ... ],
    // fiscal: [ ... ],
};
