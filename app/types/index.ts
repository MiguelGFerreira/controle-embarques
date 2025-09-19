export interface Shipment {
    R_E_C_N_O_: number;
    Filial: string;
    Embarque: string;
    IDE: string;
    Status: string;
    Cliente: string;
    Loja: string;
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
    'Cod. Arm': string | '';
    'Cod Despacha': string | '';
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

export interface Sample {
    'Nro. Amostra': string;
    'Amostra por:': 'P' | 'E';
    'Status': string;
    'Quantidade': string;
    'Peso Bruto': string;
    'Dt. Envio': string | null;
    'Conh. Aereo': string;
    'Data Aprov.': string | null;
    'Dt. Rejeição': string | null;
    'Classif. Rej': string;
    'Cliente': string;
    'Loja Cliente': string;
    'Cliente Nome': string;
    R_E_C_N_O_: number;
}

// export type ShipmentStatus = 'No Porto' | 'Amostra Aprovada' | 'Amostra Pendente' | 'Amostra Enviada' | 'Sem Amostra';
export type ShipmentStatus = 'No Porto' | 'Em preparação' | 'Embarcado';

export interface shipmentRecord {
    Status: ShipmentStatus;
    IDE: string;
    ID: string;
    Navio: string;
    Destino: string;
    ARM: 'VARG' | 'VIAN';
    Importador: string;
    Ref_Import: string;
    Embalagem: string;
    Quantidade: number;
    Obs_Planilha: string;
    Prazo_Freetime: string;
    Nr_Booking: string;
    Rota: string;
    Invoice: string;
    Inspecao_Fitossanitaria: string;
    Viagem: string;
    Fumigacao: string;
    Local_Fumigacao: string;
    Material_Fumigacao: string;
    Retir_CTNR: string;
    Dt_Estufagem: string;
    Chegar_Porto: string;
    ETA: string;
    Dt_Conhec: string;
    Dt_Fumigacao: string;
    Dt_Insp_Fitossan: string;
    DeadLine_Draft: string;
    DeadLine_Carga: string;
    Dt_Invoice: string;
    Armador: string;
    Despachante: string;
}

export interface Invoice {
    NUMERO_INVOICE: string,
    ID: number,
    NUMERO_EMBARQUE: string,
    FILIAL: number,
    PEDIDO: string,
    PO: string,
    DATA_PEDIDO: string,
    CONDICAO_PAGAMENTO: string,
    SITUACAO_PEDIDO: string,
    PORTO_ORIGEM: string,
    CLIENTE: string,
    COD_PAIS: string,
    MOEDA: string,
    INCOTERM: string,
    PAISDEST: string,
    LOCAL_DESTINO: string,
    ENDERECO_CLIENTE: string,
    NIF: string,
    EMBALAGEM: string,
    QTD_EMB: number,
    PRECO_UNIT: number,
    PRECO_60KG: number,
    PRECO_CENT_LIB: number,
    PRECO_TONELADAS: number,
    PRECO_50KG: number,
    REF_IMPORTACAO: string,
    PESO_LIQUIDO: number,
    PESO_BRUTO: number,
    DOCUMENTOS: string,
    SACAS: number,
    EMBARQUE: string,
    STATUS_EMBARQUE: string,
    DATA_EMBARQUE: string,
    DATA_CONHECIMENTO: string,
    PEDIDO_EXPORTACAO: string,
    VIA: string,
    DATA_INVOICE: string,
    BL: string,
    VALOR_INVOICE: number,
    NUMERO_DUE: string,
    CHAVE_DUE: string,
    DATA_DUE: string,
    SHIPPED_PER: string,
    OIC: string,
    COND_PAG: string,
    DESCRIPTION: string,
    PRECO_FORMATADO: number,
    QUALIDADE: string,
    MARCACOES: string,
    MARCACOES2: string,
    BCO_CLIENTE: string,
    END_BCO_CLIENTE: string,
    OBSERVACAO: string,
}

export interface ShipmentDestinations {
    Filial: string;
    Embarque: string;
    Pais_Dest_Sigla: string;
    Cod_Pais: string;
    Pais_Dest: string;
    Data_Embarque: string;
    Produto: 'ARA' | 'CON';
    Quantidade: number;
}