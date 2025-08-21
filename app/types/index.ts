export interface Shipment {
    R_E_C_N_O_: number;
    Filial: string;
    Embarque: string;
    IDE: string;
    Status: string;
    Importador: string;
    'Ref.Import.': string | null;
	Rota: string | null;
	'Nr. Booking': string | null;
	'Obs Planilha': string | null;
    'Retir. CTNR': string | null;
    'Dt. Estufagem': string | null;
    'Chegar Porto': string | null;
    ETA: string | null;
    'Dt. Conhec.': string | null;
    'Dt. Fumigacao': string | null;
    'Dt. Insp Fitossan.': string | null;
    'Prazo Freetime': string | null;
    'DeadLine Draft': string | null;
    'DeadLine Carga': string | null;
    'Fumigacao ?': string | null; //sim ou nao
    'Local Fumigacao': string | null;
    'Data Fumigacao': string | null;
    'Material Fumigacao': string | null;
    'Navio': string | null;
    'Viagem': string | null;
    'Inspecao Fitossanitaria': string | null; // sim ou nao
    'Invoice': string | null;
    'Dt. Invoice': string | null;
}

// resposta do get, incluindo paginacao
export interface PaginatedShipmentResponse {
    data: Shipment[];
    totalRecords: number;
    totalPages: number;
    currentPage: number;
}

export const FILIAL_NAMES: { [key: number]: string } = {
    20: 'Varginha',
    21: 'Viana',
}