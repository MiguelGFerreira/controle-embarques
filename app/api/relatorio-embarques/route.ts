import { dbQuery } from "@/app/lib/db";
import { shipmentRecord } from "@/app/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const filial = searchParams.get('filial') || '20';
    const mes = searchParams.get('mes') || new Date().getMonth() + 1;
    const ano = searchParams.get('ano') || new Date().getFullYear();
    const ide = searchParams.get('ide') || '';

    const whereClausesFirst = ["EEC.D_E_L_E_T_ = ''"]

    const whereClausesSecond = ["EE9.R_E_C_N_O_ IS NULL"]
    whereClausesSecond.push("EE8.EE8_STATUS <> '*'")
    whereClausesSecond.push("EE8.D_E_L_E_T_ = ''")

    if (ide) {
        whereClausesFirst.push(`UPPER(EEC_PEDREF) LIKE '%${ide.toUpperCase()}%'`);
        
        whereClausesSecond.push(`UPPER(EE8_PEDIDO) LIKE '%${ide.toUpperCase()}%'`);
    } else {
        whereClausesFirst.push(`EEC.EEC_FILIAL = '${filial}'`);
        whereClausesFirst.push(`MONTH(EEC.EEC_ETA) = '${mes}'`);
        whereClausesFirst.push(`YEAR(EEC.EEC_ETA) = '${ano}'`);

        whereClausesSecond.push(`EE8.EE8_FILIAL = '${filial}'`);
        whereClausesSecond.push(`MONTH(EE8.EE8_DTPREM) = '${mes}'`);
        whereClausesSecond.push(`YEAR(EE8.EE8_DTPREM) = '${ano}'`);
    }

    const query = `
        SELECT
            -- COLUNA DE STATUS
            CASE
                WHEN EEC.EEC_DTEMBA = '' AND D3.D3_TCENSEQ IS NOT NULL THEN 'No Porto'
				WHEN EEC.EEC_DTEMBA <> '' THEN 'Embarcado'
				WHEN D3.D3_TCENSEQ IS NULL THEN 'Em preparação'
                --WHEN EEC.EEC_ENVAMO = '1' AND EXU.EXU_PEDIDO IS NOT NULL AND EXU.EXU_DTAPRO <> '' AND D3.D3_TCENSEQ IS NULL THEN 'Amostra Aprovada'
                --WHEN EEC.EEC_ENVAMO = '1' AND EXU.EXU_PEDIDO IS NOT NULL AND EXU.EXU_DTENV<>'' AND  EXU.EXU_DTAPRO = '' AND EXU.EXU_DTREJE = ''  AND D3.D3_TCENSEQ IS NULL THEN 'Amostra Enviada'
                --WHEN EEC.EEC_ENVAMO = '1' AND EXU.EXU_PEDIDO IS NULL  AND D3.D3_TCENSEQ IS NULL THEN 'Amostra Pendente'
                --WHEN EEC.EEC_ENVAMO <> '1' THEN 'Sem Amostra'
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
            TRIM(SY5.Y5_NOME) [Armador],
	        TRIM(SX5.X5_DESCRI) [Despachante],
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
            AND D3.D3_ESTORNO = ''
            AND D3.D_E_L_E_T_ = ''
        LEFT JOIN SY5500 SY5 WITH (NOLOCK) ON SY5.Y5_COD = EEC.EEC_YARM
            AND SY5.D_E_L_E_T_ = ''
        LEFT JOIN SX5500 SX5 WITH (NOLOCK) ON SX5.X5_FILIAL = EEC.EEC_FILIAL
            AND SX5.X5_TABELA = 'WD'
            AND SX5.X5_CHAVE = EEC.EEC_YDESPA
            AND SX5.D_E_L_E_T_ = ''
        OUTER APPLY (
			SELECT TOP 1 * FROM EXU500 EXUT WITH (NOLOCK)
			WHERE EXUT.EXU_FILIAL = EEC.EEC_FILIAL
				AND EXUT.EXU_PEDIDO = EEC.EEC_PEDREF
				AND EXUT.D_E_L_E_T_ = ''
			ORDER BY EXUT.R_E_C_N_O_ DESC
			) EXU
        -- Subquery para embalagens
        OUTER APPLY (
            SELECT SUM(EE9.EE9_SLDINI) AS QTD
                ,EE9.EE9_EMBAL1 AS EMBALAGEM
            FROM EE9500 EE9 WITH (NOLOCK)
            WHERE EE9.EE9_FILIAL = EEC.EEC_FILIAL
                AND EE9.EE9_PREEMB = EEC.EEC_PREEMB
                AND EE9.D_E_L_E_T_ = ''
            GROUP BY EE9.EE9_EMBAL1
            ) EE9
        WHERE ${whereClausesFirst.join(" AND ")}
        
        UNION ALL

        SELECT 'Pedido'			-- STATUS
            ,EE8.EE8_PEDIDO		-- IDE
            ,''					-- NAVIO
            ,''					-- DESTINO
            ,CASE EE8.EE8_FILIAL WHEN '20' THEN 'VARG' ELSE 'VIAN' END AS [ARM]
            ,''
            ,EE7.EE7_REFIMP		-- REFERENCIA IMPORTADOR
            ,EE9.EE9_EMBAL1		-- EMBALAGEM
            ,''					-- QUANTIDADE
            ,''					-- OBS PLANILHA
            ,EE8.R_E_C_N_O_		-- ID
            
            -- SECUNDARIOS
            ,''					-- PRAZO FREETIME
            ,''					-- NR BOOKING
            ,''					-- ROTA
            ,''					-- INOVICE
            ,''					-- INSPECAO FITOSSANITARIA
            ,''					-- VIAGEM
            ,''					-- FUMIGACAO
            ,''					-- LOCAL FUMIGACAO
            ,''					-- MATERIAL FUMIGACAO
            ,''					-- ARMADOR
            ,''					-- DESPACHANTE
            ,NULL				-- RETIR CNTR
            ,NULL				-- DT ESTUFAGEM
            ,NULL				-- CHEGAR PORTO
            ,EE8.EE8_DTPREM		-- ETA
            ,NULL				-- DT CONHEC
            ,NULL				-- DT FUMIGACAO
            ,NULL				-- DT INSP FITOSSAN
            ,NULL				-- DEADLINE DRAFT
            ,NULL				-- DEADLINE CARGA
            ,NULL				-- DT INVOICE
        FROM EE8500 EE8 WITH (NOLOCK)
        LEFT JOIN EE9500 EE9 WITH (NOLOCK) ON EE8.EE8_FILIAL = EE9.EE9_FILIAL
            AND EE8.EE8_PEDIDO = EE9.EE9_PEDIDO
            --AND EE8.EE8_SEQUEN = EE9.EE9_SEQUEN
            AND EE8.EE8_FORN = EE9.EE9_FORN		--FORNECEDOR ESTA TRISTAO NAS DUAS
            AND EE8.EE8_FOLOJA = EE9.EE9_FOLOJA
            --AND EE8.EE8_COD_I = EE9.EE9_COD_I
            AND EE9.D_E_L_E_T_ = ''
        LEFT JOIN EE7500 EE7 WITH (NOLOCK) ON EE7.EE7_FILIAL = EE8.EE8_FILIAL
            AND EE7.EE7_PEDIDO = EE8.EE8_PEDIDO
            AND EE7.EE7_FORN = EE8.EE8_FORN
            AND EE7.EE7_FOLOJA = EE8.EE8_FOLOJA
            AND EE7.D_E_L_E_T_ = ''
        WHERE ${whereClausesSecond.join(" AND ")}
        ORDER BY
            [ETA]
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