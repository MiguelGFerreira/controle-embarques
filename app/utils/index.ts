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