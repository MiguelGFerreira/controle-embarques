export type FieldType = 'text' | 'select' | 'date';

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface EditableField {
    key: string;
    dbColumn: string;
    type: FieldType;
    maxLength?: number;
    options?: SelectOption[];
}

export const editableFieldsConfig: EditableField[] = [
    // --- CAMPOS DE DATA ---
    { key: 'Retir. CTNR', dbColumn: 'EEC_ETD', type: 'date', maxLength: 9 },
    { key: 'Dt. Estufagem', dbColumn: 'EEC_YESTUF', type: 'date', maxLength: 9 },
    { key: 'Chegar Porto', dbColumn: 'EEC_DTFCPR', type: 'date', maxLength: 9 },
    { key: 'ETA', dbColumn: 'EEC_ETA', type: 'date', maxLength: 9 },
    { key: 'Dt. Conhec.', dbColumn: 'EEC_DTCONH', type: 'date', maxLength: 9 },
    { key: 'Dt. Fumigacao', dbColumn: 'EEC_DFUMIG', type: 'date', maxLength: 9 },
    { key: 'Dt. Insp Fitossan.', dbColumn: 'EEC_YDFITO', type: 'date', maxLength: 9 },
    { key: 'DeadLine Draft', dbColumn: 'EEC_YDTDRA', type: 'date', maxLength: 9 },
    { key: 'DeadLine Carga', dbColumn: 'EEC_YDTCAR', type: 'date', maxLength: 9 },
    { key: 'Dt. Invoice', dbColumn: 'EEC_DTINVO', type: 'date', maxLength: 9 },

    // --- CAMPOS DE TEXTO ---
    { key: 'Prazo Freetime', dbColumn: 'EEC_YFREET', type: 'text', maxLength: 3 },
    { key: 'Local Fumigacao', dbColumn: 'EEC_YLFUMI', type: 'text', maxLength: 250 },
    { key: 'Material Fumigacao', dbColumn: 'EEC_YMFUMI', type: 'text', maxLength: 250 },
    { key: 'Navio', dbColumn: 'EEC_YNAVIO', type: 'text', maxLength: 40 },
    { key: 'Viagem', dbColumn: 'EEC_YNOEMB', type: 'text', maxLength: 20 },
    { key: 'Invoice', dbColumn: 'EEC_NRINVO', type: 'text', maxLength: 20 },
    { key: 'Obs Planilha', dbColumn: 'EEC_YSITUA', type: 'text', maxLength: 220 },
    { key: 'Nr. Booking', dbColumn: 'EEC_YBOOK', type: 'text', maxLength: 20 },

    // --- CAMPOS DE SELEÇÃO (SIM/NÃO) ---
    {
        key: 'Fumigacao ?',
        dbColumn: 'EEC_YFUMIG',
        type: 'select',
        options: [
            { label: 'Selecione...', value: '' },
            { label: 'Sim', value: 1 },
            { label: 'Não', value: 2 },
        ]
    },
    {
        key: 'Inspecao Fitossanitaria',
        dbColumn: 'EEC_YFITOS',
        type: 'select',
        options: [
            { label: 'Selecione...', value: '' },
            { label: 'Sim', value: 1 },
            { label: 'Não', value: 2 },
        ]
    }
]

// Funcao pra pegar a data do input (iso) e normalizar para o formato do protheus
// 2025-09-15 -> 20250915
export const normalizeDate = (s: string) => {
    if (!s) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s.replace(/-/g, '');
    const d = new Date(s);
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}${m}${day}`;
};

// Funcao pra formatar a data que vem do protheus para o formato dd/mm/yy
// 20250915 -> 15/09/25
export const formatarDataView = (input: string | null): string => {
    if (!input) return '';

    if (input.length !== 8) {
        return '';
    }

    const year = input.substring(0, 4);
    const month = input.substring(4, 6);
    const day = input.substring(6, 8);

    const shortYear = year.substring(2);

    return `${day}/${month}/${shortYear}`;
}

// Funcao pra formatar a data que vem do protheus para utilizar no input (iso)
// 20250915 -> 2025-09-15
export const formatarDataParaInput = (input: string | null): string => {
    if (!input) return '';

    if (input.length !== 8) {
        return '';
    }

    const year = input.substring(0, 4);
    const month = input.substring(4, 6);
    const day = input.substring(6, 8);

    return `${year}-${month}-${day}`;
};

// Funcao para formatar a data do tipo ISO para o formato dd/mm/yyyy
// 2025-09-15 -> 15/09/2025
export const formatarDataIso = (input: string | null): string => {
    if (!input) return '';

    const date = new Date(input);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

// Função para formatar a data no formato ISO (yyyy-mm-dd) para o formato de data legível
// 2025-09-15T00:00:00Z -> "15/09/2025" (Formato padrão pt-BR)
// Se o parâmetro `full` for verdadeiro, a data será formatada com o nome completo do mês e o ano completo.
// 2025-09-15 -> "September 15, 2025"
export function formatarData(dataISO: string, full = false) {
    if (!dataISO) return "";

    const partes = dataISO.split("T");
    if (partes.length === 0) return "Data Inválida";

    const [ano, mes, dia] = partes[0].split("-").map(Number);
    const data = new Date(ano, mes - 1, dia);

    if (isNaN(data.getTime())) return "Data Inválida";

    if (full) {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
        }).format(data);
    }

    return new Intl.DateTimeFormat("pt-BR").format(data);
}

// Usado na impressao da invoice pra transformar a cond. pag. que vem do banco para o padrao da invoice.
const paymentTermsMap: Record<string, string> = {
	"180D": "NET 180 DAYS",
	"120D": "NET 120 DAYS",
	"90D": "NET 90 DAYS",
	"75D": "NET 75 DAYS",
	"60D": "NET 60 DAYS",
	"45D": "NET 45 DAYS",
	"30D": "NET 30 DAYS",
	"CAD": "CAD",
	"pp": "PREPAID"
}

export const getPaymentTerm = (code: string): string => paymentTermsMap[code] || "Invalid Code";