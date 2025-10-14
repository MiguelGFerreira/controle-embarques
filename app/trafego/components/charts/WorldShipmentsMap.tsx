"use client";

import { ShipmentDestinations } from '@/app/types';
import { shipmentsToWorldmap } from '@/app/utils';
import React, { useEffect, useState } from 'react';
import { WorldMap } from 'react-svg-worldmap';

function ChartSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-102 bg-gray-200 rounded-lg"></div>
        </div>
    );
}

const country: { [codigo: string]: string } = {
    "af": "Afeganistão",
    "ax": "Ilhas de Åland",
    "al": "Albânia",
    "dz": "Argélia",
    "as": "Samoa Americana",
    "ad": "Andorra",
    "ao": "Angola",
    "ai": "Anguilla",
    "aq": "Antártica",
    "ag": "Antígua e Barbuda",
    "ar": "Argentina",
    "am": "Armênia",
    "aw": "Aruba",
    "au": "Austrália",
    "at": "Áustria",
    "az": "Azerbaijão",
    "bs": "Bahamas",
    "bh": "Bahrein",
    "bd": "Bangladesh",
    "bb": "Barbados",
    "by": "Bielorrússia",
    "be": "Bélgica",
    "bz": "Belize",
    "bj": "Benim",
    "bm": "Bermudas",
    "bt": "Butão",
    "bo": "Bolívia",
    "ba": "Bósnia e Herzegovina",
    "bw": "Botsuana",
    "bv": "Ilha Bouvet",
    "br": "Brasil",
    "io": "Território Britânico do Oceano Índico",
    "bn": "Brunei",
    "bg": "Bulgária",
    "bf": "Burquina Faso",
    "bi": "Burúndi",
    "kh": "Camboja",
    "cm": "Camarões",
    "ca": "Canadá",
    "cv": "Cabo Verde",
    "ky": "Ilhas Cayman",
    "cf": "República Centro‑Africana",
    "td": "Chade",
    "cl": "Chile",
    "cn": "China",
    "cx": "Ilha Christmas",
    "cc": "Ilhas Cocos (Keeling)",
    "co": "Colômbia",
    "km": "Comores",
    "cg": "Congo",
    "cd": "República Democrática do Congo",
    "ck": "Ilhas Cook",
    "cr": "Costa Rica",
    "ci": "Costa do Marfim",
    "hr": "Croácia",
    "cu": "Cuba",
    "cy": "Chipre",
    "cz": "República Checa",
    "dk": "Dinamarca",
    "dj": "Djibuti",
    "dm": "Dominica",
    "do": "República Dominicana",
    "ec": "Equador",
    "eg": "Egito",
    "sv": "El Salvador",
    "gq": "Guiné Equatorial",
    "er": "Eritreia",
    "ee": "Estônia",
    "et": "Etiópia",
    "fk": "Ilhas Malvinas",
    "fo": "Ilhas Faroe",
    "fj": "Fiji",
    "fi": "Finlândia",
    "fr": "França",
    "gf": "Guiana Francesa",
    "pf": "Polinésia Francesa",
    "tf": "Terras Austrais Francesas",
    "ga": "Gabão",
    "gm": "Gâmbia",
    "ge": "Geórgia",
    "de": "Alemanha",
    "gh": "Gana",
    "gi": "Gibraltar",
    "gr": "Grécia",
    "gl": "Groenlândia",
    "gd": "Granada",
    "gp": "Guadalupe",
    "gu": "Guam",
    "gt": "Guatemala",
    "gg": "Guernsey",
    "gn": "Guiné",
    "gw": "Guiné‑Bissau",
    "gy": "Guiana",
    "ht": "Haiti",
    "hm": "Ilhas Heard e McDonald",
    "va": "Vaticano",
    "hn": "Honduras",
    "hk": "Hong Kong",
    "hu": "Hungria",
    "is": "Islândia",
    "in": "Índia",
    "id": "Indonésia",
    "ir": "Irã",
    "iq": "Iraque",
    "ie": "Irlanda",
    "im": "Ilha de Man",
    "il": "Israel",
    "it": "Itália",
    "jm": "Jamaica",
    "jp": "Japão",
    "je": "Jersey",
    "jo": "Jordânia",
    "kz": "Cazaquistão",
    "ke": "Quênia",
    "ki": "Kiribati",
    "kp": "Coreia do Norte",
    "kr": "Coreia do Sul",
    "kw": "Kuweit",
    "kg": "Quirguistão",
    "la": "Laos",
    "lv": "Letônia",
    "lb": "Líbano",
    "ls": "Lesoto",
    "lr": "Libéria",
    "ly": "Líbia",
    "li": "Liechtenstein",
    "lt": "Lituânia",
    "lu": "Luxemburgo",
    "mo": "Macau",
    "mk": "Macedônia do Norte",
    "mg": "Madagáscar",
    "mw": "Malawi",
    "my": "Malásia",
    "mv": "Maldivas",
    "ml": "Mali",
    "mt": "Malta",
    "mh": "Ilhas Marshall",
    "mq": "Martinica",
    "mr": "Mauritânia",
    "mu": "Maurícia",
    "yt": "Mayotte",
    "mx": "México",
    "fm": "Micronésia",
    "md": "Moldávia",
    "mc": "Mônaco",
    "mn": "Mongólia",
    "me": "Montenegro",
    "ms": "Montserrat",
    "ma": "Marrocos",
    "mz": "Moçambique",
    "mm": "Myanmar",
    "na": "Namíbia",
    "nr": "Nauru",
    "np": "Nepal",
    "nl": "Países Baixos",
    "nc": "Nova Caledônia",
    "nz": "Nova Zelândia",
    "ni": "Nicarágua",
    "ne": "Níger",
    "ng": "Nigéria",
    "nu": "Niue",
    "nf": "Ilha Norfolk",
    "mp": "Ilhas Marianas do Norte",
    "no": "Noruega",
    "om": "Omã",
    "pk": "Paquistão",
    "pw": "Palau",
    "ps": "Palestina",
    "pa": "Panamá",
    "pg": "Papua-Nova Guiné",
    "py": "Paraguai",
    "pe": "Peru",
    "ph": "Filipinas",
    "pn": "Ilhas Pitcairn",
    "pl": "Polônia",
    "pt": "Portugal",
    "pr": "Porto Rico",
    "qa": "Catar",
    "re": "Reunião",
    "ro": "Romênia",
    "ru": "Rússia",
    "rw": "Ruanda",
    "bl": "São Bartolomeu",
    "sh": "Santa Helena, Ascensão e Tristão da Cunha",
    "kn": "São Cristóvão e Nevis",
    "lc": "Santa Lúcia",
    "mf": "São Martinho",
    "pm": "São Pedro e Miquelão",
    "vc": "São Vicente e Granadinas",
    "ws": "Samoa",
    "sm": "San Marino",
    "st": "São Tomé e Príncipe",
    "sa": "Arábia Saudita",
    "sn": "Senegal",
    "rs": "Sérvia",
    "sc": "Seicheles",
    "sl": "Serra Leoa",
    "sg": "Singapura",
    "sx": "Sint Maarten",
    "sk": "Eslováquia",
    "si": "Eslovênia",
    "sb": "Ilhas Salomão",
    "so": "Somália",
    "za": "África do Sul",
    "gs": "Geórgia do Sul e Ilhas Sandwich do Sul",
    "ss": "Sudão do Sul",
    "es": "Espanha",
    "lk": "Sri Lanka",
    "sd": "Sudão",
    "sr": "Suriname",
    "sj": "Svalbard e Jan Mayen",
    "sz": "Suazilândia",
    "se": "Suécia",
    "ch": "Suíça",
    "sy": "Síria",
    "tw": "Taiwan",
    "tj": "Tajiquistão",
    "tz": "Tanzânia",
    "th": "Tailândia",
    "tl": "Timor-Leste",
    "tg": "Togo",
    "tk": "Tokerau",
    "to": "Tonga",
    "tt": "Trinidad e Tobago",
    "tn": "Tunísia",
    "tr": "Turquia",
    "tm": "Turcomenistão",
    "tc": "Ilhas Turks e Caicos",
    "tv": "Tuvalu",
    "ug": "Uganda",
    "ua": "Ucrânia",
    "ae": "Emirados Árabes Unidos",
    "gb": "Reino Unido",
    "us": "Estados Unidos",
    "um": "Ilhas Menores Distantes dos Estados Unidos",
    "uy": "Uruguai",
    "uz": "Uzbequistão",
    "vu": "Vanuatu",
    "ve": "Venezuela",
    "vn": "Vietnã",
    "vg": "Ilhas Virgens Britânicas",
    "vi": "Ilhas Virgens Americanas",
    "wf": "Wallis e Futuna",
    "eh": "Saara Ocidental",
    "ye": "Iémen",
    "zm": "Zâmbia",
    "zw": "Zimbábue",
};


export default function WorldShipmentsMap() {
    const [loading, setLoading] = useState(true);
    const [mapData, setMapData] = useState<{ country: string; value: number }[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const res = await fetch('/api/dashboard-embarques');
                if (!res.ok) throw new Error(`Erro na API: ${res.status}`);
                const response = await res.json();
                const rows: ShipmentDestinations[] = response.data;

                // se quiser somar apenas ARA, passar { product: 'ARA' } no segundo argumento
                const data = shipmentsToWorldmap(rows /*, { product: 'ARA' } */);

                setMapData(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Erro desconhecido');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return ChartSkeleton();
    if (error) return <div className="text-red-600">Erro: {error}</div>;

    return (
        <div className="flex flex-col justify-center bg-white p-4 rounded-lg shadow-md border relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Principais Destinos de Embarques dos Últimos 12 meses</h2>
            <div className='flex justify-center'>
                <WorldMap
                    color="green"
                    valueSuffix="Scs"
                    size="xxl"
                    data={mapData}
                    richInteraction
                />
            </div>
            <div className='text-right'>
                {mapData?.slice(0, 5).map((item, index) => {
                    const codigo = item?.country?.toLowerCase();
                    const nomePais = country[codigo] ?? 'Desconhecido';
                    const valorFormatado = item?.value?.toLocaleString('pt-BR', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    }) ?? '0,00';

                    return (
                        <p key={index} className="text-gray-600">
                            {nomePais}: {valorFormatado} Sacas
                        </p>
                    );
                })}
            </div>
        </div>
    );
}
