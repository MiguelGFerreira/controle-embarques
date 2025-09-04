import { dbQuery } from "@/app/lib/db";
import { shipmentRecord } from "@/app/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const filial = searchParams.get('filial') || '20';
    const mes = searchParams.get('mes') || new Date().getMonth() + 1;
    const ano = searchParams.get('ano') || new Date().getFullYear();

    const query = `
        SELECT
            -- COLUNA DE STATUS
            CASE
                WHEN EEC.EEC_DTEMBA = '' AND D3.D3_TCENSEQ IS NOT NULL AND EXU.EXU_DTAPRO <> '' AND EEC.EEC_ENVAMO = '1' AND EXU.EXU_PEDIDO IS NOT NULL THEN 'No Porto'
                WHEN EEC.EEC_ENVAMO = '1' AND EXU.EXU_PEDIDO IS NOT NULL AND EXU.EXU_DTAPRO <> '' AND D3.D3_TCENSEQ IS NULL THEN 'Amostra Aprovada'
                WHEN EEC.EEC_ENVAMO = '1' AND EXU.EXU_PEDIDO IS NOT NULL AND EXU.EXU_DTENV<>'' AND  EXU.EXU_DTAPRO = '' AND EXU.EXU_DTREJE = ''  AND D3.D3_TCENSEQ IS NULL THEN 'Amostra Enviada'
                WHEN EEC.EEC_ENVAMO = '1' AND EXU.EXU_PEDIDO IS NULL  AND D3.D3_TCENSEQ IS NULL THEN 'Amostra Pendente'
                WHEN EEC.EEC_ENVAMO <> '1' THEN 'Sem Amostra'
            END AS [Status],

            -- PRINCIPAIS
            TRIM(EEC.EEC_PREEMB) [IDE],
            CASE ISNULL(EEC.EEC_YNAVIO,'') WHEN '' THEN TRIM(EEC.EEC_EMBARC) ELSE TRIM(EEC.EEC_YNAVIO) END AS [Navio],
            TRIM(SY9.Y9_DESCR) [Destino],
            CASE EEC.EEC_FILIAL WHEN '20' THEN 'VARG' ELSE 'VIAN' END AS [ARM],
            TRIM(EEC.EEC_IMPODE) [Importador],
            TRIM(EEC.EEC_REFIMP) [Ref_Import],
            TRIM(EE9.EMBALAGEM) [Embalagem],
            EE9.QTD [Quantidade],
            TRIM(EEC.EEC_YSITUA) [Obs_Planilha],
            EEC.R_E_C_N_O_ [ID],

            -- SECUNDARIOS
            TRIM(EEC.EEC_YFREET) [Prazo_Freetime],
            TRIM(EEC.EEC_YBOOK) [Nr_Booking],
            TRIM(EEC.EEC_ORIGEM) + ' - ' + TRIM(EEC.EEC_DEST) [Rota],
            TRIM(EEC.EEC_NRINVO) [Invoice],
            CASE EEC.EEC_YFITOS WHEN '1' THEN 'Sim' WHEN '2' THEN 'Nao' ELSE '' END AS [Inspecao_Fitossanitaria],
            TRIM(EEC.EEC_YNOEMB) [Viagem],
            CASE EEC.EEC_YFUMIG WHEN '1' THEN 'Sim' WHEN '2' THEN 'Nao' ELSE '' END AS [Fumigacao],
            TRIM(EEC.EEC_YLFUMI) [Local_Fumigacao],
            TRIM(EEC.EEC_YMFUMI) [Material_Fumigacao],
            CASE WHEN EEC_ETD = '' THEN NULL ELSE CAST(EEC_ETD AS DATE) END AS [Retir_CTNR],
            CASE WHEN EEC_YESTUF = '' THEN NULL ELSE CAST(EEC_YESTUF AS DATE) END AS [Dt_Estufagem],
            CASE WHEN EEC_DTFCPR = '' THEN NULL ELSE CAST(EEC_DTFCPR AS DATE) END AS [Chegar_Porto],
            CASE WHEN EEC_ETA = '' THEN NULL ELSE CAST(EEC_ETA AS DATE) END AS [ETA],
            CASE WHEN EEC_DTCONH = '' THEN NULL ELSE CAST(EEC_DTCONH AS DATE) END AS [Dt_Conhec],
            CASE WHEN EEC_DFUMIG = '' THEN NULL ELSE CAST(EEC_DFUMIG AS DATE) END AS [Dt_Fumigacao],
            CASE WHEN EEC_YDFITO = '' THEN NULL ELSE CAST(EEC_YDFITO AS DATE) END AS [Dt_Insp_Fitossan],
            CASE WHEN EEC_YDTDRA = '' THEN NULL ELSE CAST(EEC_YDTDRA AS DATE) END AS [DeadLine_Draft],
            CASE WHEN EEC_YDTCAR = '' THEN NULL ELSE CAST(EEC_YDTCAR AS DATE) END AS [DeadLine_Carga],
            CASE WHEN EEC_DTINVO = '' THEN NULL ELSE CAST(EEC_DTINVO AS DATE) END AS [Dt_Invoice]
        FROM
            EEC500 EEC WITH (NOLOCK)
        LEFT JOIN SY9500 SY9 WITH (NOLOCK) ON EEC.EEC_DEST = SY9.Y9_SIGLA
            AND SY9.D_E_L_E_T_ = ''
        LEFT JOIN EE9500 EE91 WITH (NOLOCK) ON EE91.EE9_FILIAL = EEC.EEC_FILIAL
            AND EE91.EE9_PREEMB = EEC.EEC_PREEMB
            AND TRIM(EE91.EE9_SEQEMB) = '1'
            AND EE91.D_E_L_E_T_ = ''
        LEFT JOIN SD2500 D2 WITH (NOLOCK) ON D2.D2_FILIAL = EE91.EE9_FILIAL
            AND D2.D2_DOC = EE91.EE9_NF
            AND D2.D2_PREEMB = EE91.EE9_PREEMB
            AND D2.D_E_L_E_T_ = ''
        LEFT JOIN SD3500 D3 WITH (NOLOCK) ON D3.D3_FILIAL = D2.D2_FILIAL
            AND D3.D3_COD = D2.D2_COD
            AND D3.D3_EMISSAO >= D2.D2_EMISSAO
            AND D3.D3_TCENSEQ = D2.D2_NUMSEQ
            AND D3.D_E_L_E_T_ = ''
        LEFT JOIN EXU500 EXU WITH (NOLOCK) ON EXU.EXU_FILIAL = EEC.EEC_FILIAL
            AND EXU.EXU_PEDIDO = EEC.EEC_PEDREF
            AND EXU.D_E_L_E_T_ = ''
        -- Subquery para embalagens
        OUTER APPLY (
            SELECT SUM(EE9.EE9_QTDEM1) AS QTD
                ,EE9.EE9_EMBAL1 AS EMBALAGEM
            FROM EE9500 EE9 WITH (NOLOCK)
            WHERE EE9.EE9_FILIAL = EEC.EEC_FILIAL
                AND EE9.EE9_PREEMB = EEC.EEC_PREEMB
                AND EE9.D_E_L_E_T_ = ''
            GROUP BY EE9.EE9_EMBAL1
            ) EE9
        WHERE
            EEC.EEC_FILIAL = '${filial}'
            AND MONTH(EEC.EEC_ETA) = '${mes}'
            AND YEAR(EEC.EEC_ETA) = '${ano}'
            AND EEC.D_E_L_E_T_ = ''
        ORDER BY
            EEC.EEC_ETA;
    `;

    try {
        const result = await dbQuery(query);
        // TODO: formatar data?
        return NextResponse.json({ data: result as shipmentRecord[] });
    }
    catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ message: 'Erro ao buscar dados do relatório' }, { status: 500 });
    }
}