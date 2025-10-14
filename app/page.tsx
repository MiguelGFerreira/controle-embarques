import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {    
    return (
        <div className="space-y-8">
            Nada para ver aqui... <Link href="/trafego" className="text-blue-600 hover:underline">Ir para o tráfego <ArrowRight className="inline-block ml-1" /></Link>
        </div>
    );
}
