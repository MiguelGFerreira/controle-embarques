import { ArrowRight, BarChart3, ChartArea, Receipt, Ship,  } from "lucide-react";
import Link from "next/link";

const dashboardCards = [
    {
        href: '/gerenciamento/embarques',
        target: "_self",
        icon: Ship,
        title: 'Gerenciar Embarques',
        description: 'Inserir amostras e gerenciar as datas dos embarques pendentes',
        color: 'text-green-600'
    },
    {
        href: '/gerenciamento/invoice',
        target: "_self",
        icon: Receipt,
        title: 'Invoice e RE',
        description: 'Emissão e impressão de Invoice e RE',
        color: 'text-green-600'
    },
    {
        href: '/relatorios/embarques',
        target: "_self",
        icon: BarChart3,
        title: 'Relatório de Embarques',
        description: 'Visualizar status e dados dos embarques',
        color: 'text-blue-600'
    },
    {
        href: '/relatorios/dashboard-embarques',
        target: "_self",
        icon: ChartArea,
        title: 'Dashboard de Embarques',
        description: 'Visualizar métricas e gráficos dos embarques',
        color: 'text-blue-600'
    },
]

export default function Home() {    
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-4xl font-bold text-gray-800">
                    Painel de Controle
                </h1>
                <p className="mt-2 text-lg text-gray-500">
                    Selecione uma das opções abaixo
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardCards.map((card) => (
                    <Link
                        key={card.href}
                        href={card.href}
                        className="group block p-6 bg-white rounded-xl shadow-md hover:shadow-lg border border-transparent hover:border-green-500 transition-all duration-300"
                        target={card.target}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 bg-gray-100 rounded-lg ${card.color}`}>
                                <card.icon size={28} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">{card.title}</h2>
                        </div>
                        <p className="mt-4 text-gray-600">{card.description}</p>
                        <div className="mt-6 flex items-center justify-end text-sm font-semibold text-green-600">
                            <span>Acessar</span>
                            <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
