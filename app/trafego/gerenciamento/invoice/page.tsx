"use client"

import { Invoice } from "@/app/types";
import { gerarInvoice } from "@/app/utils/gerarInvoice";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { formatarData } from "@/app/utils"
import Modal from "@/app/trafego/components/invoice/Modal";
import { Checkbox, Radio, RadioGroup, Select, } from "@headlessui/react";
import { gerarRE } from "@/app/utils/gerarRE";
import { CircleCheck, Receipt } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
    const [filter, setFilter] = useState({
        dateStart: "",
        dateEnd: "",
        pedido: ""
    });
    const [prices, setPrices] = useState([{
        unity: '',
        price: 0
    }]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [showRFAText, setShowRFAText] = useState<boolean>(false);
    const [trigger, setTrigger] = useState<Number | null>(null);

    let invoiceDate = "date-now";

    const handleOpenModal = (invoiceId: number) => {
        const selected = response.data.find((inv: Invoice) => inv.ID === invoiceId)
        if (!selected) return;
        console.log(selected);

        setSelectedInvoice(selected);
    }

    const closeModal = () => {
        setSelectedInvoice(null);
        setIsModalOpen(false);
    }

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    }

    const handleSendForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTrigger(Date.now());
    }

    let apiUrl = `/api/invoices?`;

    if (filter.pedido) {
        console.log('Filtro pedido:', filter.pedido);
        apiUrl += `&pedido=${filter.pedido}`
    }

    if (filter.dateEnd) {
        console.log('Filtro dateEnd:', filter.dateEnd);
        apiUrl += `&dateEnd=${filter.dateEnd}`
    }

    if (filter.dateStart) {
        console.log('Filtro dateStart:', filter.dateStart);
        apiUrl += `&dateEnd=${filter.dateStart}`
    }

    const { data: response, error, isLoading } = useSWR(trigger ? apiUrl : null, fetcher, { keepPreviousData: true })

    useEffect(() => {
        if (selectedInvoice) {
            setPrices([
                { unity: 'USD/SCS', price: selectedInvoice.PRECO_60KG },
                { unity: 'USC/LB', price: selectedInvoice.PRECO_CENT_LIB },
                { unity: 'USD/Mton', price: selectedInvoice.PRECO_TONELADAS },
                { unity: 'USD/50KG', price: selectedInvoice.PRECO_50KG }
            ]);
            setIsModalOpen(true)
        }
    }, [selectedInvoice])

    useEffect(() => {
        document.title = 'Invoice'; // Muda o título da página dinamicamente no lado do cliente
    }, [])

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Tela de Invoice</h1>

            <section className="space-y-6 bg-white shadow-lg p-6 rounded-md">
                <form onSubmit={(e) => handleSendForm(e as any)} className="grid grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="dateStart">Data de</label>
                        <input type="date" id="dateStart" name="dateStart" onChange={handleFilterChange} />
                    </div>
                    <div>
                        <label htmlFor="dateEnd">Data Até</label>
                        <input type="date" id="dateEnd" name="dateEnd" onChange={handleFilterChange} />
                    </div>
                    <div>
                        <label htmlFor="pedido">Pedido/IDE</label>
                        <input type="text" id="pedido" name="pedido" onChange={handleFilterChange} />
                    </div>

                    <button
                        type="button"
                        onClick={(e) => handleSendForm(e as any)}
                        className="botao"
                    >
                        Pesquisar
                    </button>
                </form>
            </section>

            {/* {response?.data.length === 0 && } */}

            {isLoading && <div className="!text-center !p-4"><LoadingSpinner /></div>}

            {error && <p className="!text-center !p-4 !text-red-500">Falha ao carregar dados.</p>}

            {!isLoading && response?.data.length > 0 ? (
                <table className="grupotristao">
                    <thead>
                        <tr>
                            <th>Gerar</th>
                            <th>Invoice</th>
                            <th>Embarque</th>
                            <th>Filial</th>
                            <th>Pedido</th>
                            <th>PO</th>
                            <th>Data Pedido</th>
                            <th>Cond. Pag.</th>
                            <th>Sit. Pedido</th>
                            <th>Cliente</th>
                        </tr>
                    </thead>

                    <tbody>
                        {response?.data.map((invoice: Invoice) => (
                            <tr key={invoice.ID}>
                                <td><Receipt size={25} onClick={() => handleOpenModal(invoice.ID)} className="cursor-pointer hover:text-green-400" /></td>
                                <td>{invoice.NUMERO_INVOICE}</td>
                                <td>{invoice.NUMERO_EMBARQUE}</td>
                                <td>{invoice.FILIAL}</td>
                                <td>{invoice.PEDIDO}</td>
                                <td>{invoice.PO}</td>
                                <td>{formatarData(invoice.DATA_PEDIDO)}</td>
                                <td>{invoice.CONDICAO_PAGAMENTO}</td>
                                <td>{invoice.SITUACAO_PEDIDO}</td>
                                <td>{invoice.CLIENTE}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p className="texto">Use os filtros para buscar invoices</p>}

            {selectedInvoice && (
                <Modal isOpen={isModalOpen} closeModal={closeModal} title={"Invoice Selecionada"}>
                    <form onSubmit={(e) => { e.preventDefault(); gerarInvoice(selectedInvoice, showRFAText, invoiceDate) }} className="grid w-full gap-4">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="description">Descrição</label>
                                <input type="text" id="description" onChange={(desc) => setSelectedInvoice({ ...selectedInvoice, DESCRIPTION: desc.target.value })} />
                            </div>
                        </div>
                        <label>Preço</label>
                        <RadioGroup
                            value={selectedInvoice.COND_PAG}
                            onChange={(value) => {
                                const selectedPrice = prices.find((p) => p.unity === value);
                                if (selectedPrice) {
                                    setSelectedInvoice({
                                        ...selectedInvoice,
                                        COND_PAG: selectedPrice.unity,
                                        PRECO_FORMATADO: selectedPrice.price,
                                    })
                                }
                            }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {prices.map((price) => (
                                <Radio
                                    key={price.unity}
                                    value={price.unity}
                                    className="group relative flex cursor-pointer rounded-lg bg-white/5 py-4 px-5 text-black shadow-md transition focus:outline-none data-[focus]:outline-white data-[checked]:bg-green-600"
                                >
                                    <div className="flex w-full items-center justify-between">
                                        <div className="text-sm/6">
                                            <p className="group-data-[checked]:text-white">{price.unity}</p>
                                            <input className="text-black/70 group-data-[checked]:bg-white" type="text" defaultValue={price.price} onChange={(desc) => setSelectedInvoice({ ...selectedInvoice, PRECO_FORMATADO: Number(desc.target.value.replace(',', '.')) })} />
                                        </div>
                                        <CircleCheck className="absolute top-3 right-4 fill-white opacity-0 transition group-data-[checked]:opacity-100" />
                                    </div>
                                </Radio>
                            ))}
                        </RadioGroup>

                        <label>Data da Invoice</label>
                        <Select name="invoice-date" onChange={(e) => { invoiceDate = e.target.value }}>
                            <option value="date-now">Data atual</option>
                            <option value="date-bl">Data do BL</option>
                        </Select>

                        <label>Mostra texto RFA</label>
                        <Checkbox
                            checked={showRFAText}
                            onChange={setShowRFAText}
                            className="group block size-4 rounded border bg-gray-200 data-[checked]:bg-green-600"
                        >
                            {/* Checkmark icon */}
                            <svg className="stroke-white opacity-0 group-data-[checked]:opacity-100" viewBox="0 0 14 14" fill="none">
                                <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Checkbox>

                        <label htmlFor="re_obs">Observação (RE)</label>
                        <textarea name="re_obs" rows={5} id="re_obs" onChange={(obs) => setSelectedInvoice({ ...selectedInvoice, OBSERVACAO: obs.target.value })} />

                        <div className="mt-6 flex justify-between">
                            <button type="button" className="botao" onClick={() => gerarRE(selectedInvoice)}>
                                Gerar RE
                            </button>
                            <button type="submit" className="botao">
                                Gerar Invoice
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}