import { dbQuery } from "@/app/lib/db";
import { Invoice, shipmentRecord } from "@/app/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dateStart = searchParams.get('dateStart') || '';
    const dateEnd = searchParams.get('dateEnd') || '';
    const pedido = searchParams.get('pedido') || '';

    let conditionQuery = '';
    let hasStart = false;
    
    if (dateStart) {
		conditionQuery += `AND EEC.EEC_EMBARC <> '' AND CAST(ISNULL(EEC.EEC_DTINVO,'') AS DATE) >= '${dateStart}'`;
		hasStart = true;
		console.log(`START: ${dateStart}`);
	}

	if (dateEnd) {
		if (!hasStart) {
			conditionQuery += ` AND EEC.EEC_EMBARC <> ''`;
		}
		conditionQuery += ` AND CAST(ISNULL(EEC.EEC_DTINVO,'') AS DATE) <= '${dateEnd}'`;
		console.log(`END: ${dateEnd}`);
	}
	
	if (pedido) {
		conditionQuery += ` AND EE7.EE7_PEDIDO = '${pedido}'`;
		console.log(`PEDIDO: ${pedido}`);
	}

    const query = `
        SELECT TRIM(EEC.EEC_NRINVO) AS NUMERO_INVOICE
            ,ROW_NUMBER() OVER(ORDER BY EEC.EEC_NRINVO) AS ID
            ,STUFF(CONCAT(SUBSTRING(TRIM(EEC.EEC_PREEMB), 3, 18), '/', SUBSTRING(TRIM(EEC.EEC_PREEMB), 1, 2)),1, 1, '') NUMERO_EMBARQUE
            ,EE7.EE7_FILIAL FILIAL
            ,TRIM(EE7.EE7_PEDIDO) PEDIDO
            ,TRIM(EE7.EE7_REFIMP) AS 'PO'
            ,CAST(EE7.EE7_DTPEDI AS DATE) AS DATA_PEDIDO
            ,TRIM(EE7.EE7_CONDPA) AS CONDICAO_PAGAMENTO
            ,TRIM(EE7.EE7_STTDES) AS SITUACAO_PEDIDO
            ,CASE
                WHEN CHARINDEX('-', SY92.Y9_DESCR) > 0 THEN TRIM(SUBSTRING(SY92.Y9_DESCR,1,CHARINDEX('-',SY92.Y9_DESCR)-1))
                ELSE TRIM(SY92.Y9_DESCR)
            END AS PORTO_ORIGEM
            ,TRIM(EE7.EE7_IMPODE) AS CLIENTE
            ,TRIM(EE7.EE7_PAISET) AS COD_PAIS
            ,TRIM(EE7.EE7_MOEDA) AS MOEDA
            ,TRIM(EE7.EE7_INCOTE) AS INCOTERM
            ,TRIM(SYA.YA_DESCR) AS PAISDEST
            ,TRIM(SY9.Y9_DESCR) AS LOCAL_DESTINO
            ,TRIM(SA1.A1_END) AS ENDERECO_CLIENTE
            ,TRIM(SA1.A1_NIF) AS NIF
            ,TRIM(EE9.EE9_EMBAL1) AS EMBALAGEM
            ,SUM(EE9.EE9_QTDEM1) AS QTD_EMB
            ,EE8.EE8_PRECO AS PRECO_UNIT
            ,EE8.EE8_PRECO2 AS PRECO_60KG
            ,EE8.EE8_PRECO3 AS PRECO_CENT_LIB
            ,EE8.EE8_PRECO4 AS PRECO_TONELADAS
            ,EE8.EE8_PRECO5 AS PRECO_50KG
            ,TRIM(EEC.EEC_REFIMP) AS REF_IMPORTACAO
            ,EEC.EEC_PESLIQ AS PESO_LIQUIDO
            ,EEC.EEC_PESBRU AS PESO_BRUTO
            ,(
                SELECT STRING_AGG(TRIM(D2.D2_DOC), ',')
                FROM SD2500 D2
                WHERE D2.D_E_L_E_T_ = ' '
                    AND D2.D2_PREEMB = EEC.EEC_PREEMB
                    AND D2.D2_FILIAL = EEC.EEC_FILIAL
                ) AS DOCUMENTOS
            ,(
                SELECT SUM(D2.D2_QTSEGUM)
                FROM SD2500 D2
                WHERE D2.D_E_L_E_T_ = ' '
                    AND D2.D2_PREEMB = EEC.EEC_PREEMB
                    AND D2.D2_FILIAL = EEC.EEC_FILIAL
                ) AS SACAS
            ,TRIM(EEC.EEC_PREEMB) AS EMBARQUE
            ,TRIM(EEC.EEC_STTDES) AS STATUS_EMBARQUE
            ,CAST(EEC.EEC_DTEMBA AS DATE) AS DATA_EMBARQUE
            ,CAST(EEC.EEC_DTCONH AS DATE) AS DATA_CONHECIMENTO
            ,TRIM(EEC.EEC_PEDREF) AS PEDIDO_EXPORTACAO
            ,CASE 
                WHEN EEC.EEC_VIA = 'MA'	THEN 'MARITIMO'
                WHEN EEC.EEC_VIA = 'AE'	THEN 'AEREA'
                WHEN EEC.EEC_VIA = 'RO'	THEN 'RODOVIARIO'
            END AS VIA
            ,CAST(EEC.EEC_DTINVO AS DATE) AS DATA_INVOICE
            ,TRIM(EEC.EEC_NRCONH) AS BL
            ,EEC.EEC_VLFOB AS VALOR_INVOICE
            ,EEC.EEC_NRODUE AS NUMERO_DUE
            ,TRIM(EEC.EEC_CHVDUE) AS CHAVE_DUE
            ,CAST(EEC.EEC_DTDUE AS DATE) AS DATA_DUE
            ,CASE ISNULL(EEC.EEC_YNAVIO,'') WHEN '' THEN TRIM(EEC.EEC_EMBARC) ELSE TRIM(EEC.EEC_YNAVIO) END AS SHIPPED_PER
            ,STRING_AGG(LEFT(EXZ.EXZ_OIC,3) + '/' + SUBSTRING(EXZ.EXZ_OIC,4,4) + '/' + RIGHT(TRIM(EXZ.EXZ_OIC), 4),', ') AS OIC
            ,'USD/SCS' AS COND_PAG
            ,EE8.EE8_PRECO2 AS PRECO_FORMATADO
            ,ZQ0.ZQ0_CODPEN AS QUALIDADE
            ,dbo.RKF_LEMEMOSYPFILIAL(EEC.EEC_CODMAR,EEC.EEC_FILIAL) AS MARCACOES
            ,CAST(CAST(EEC.EEC_YMARCA AS VARBINARY(MAX)) AS VARCHAR(MAX)) MARCACOES2
            ,EEC.EEC_TCECBC AS BCO_CLIENTE
            ,EEC.EEC_TCEEND AS END_BCO_CLIENTE
        FROM EE7500 EE7 WITH(NOLOCK) -- Cabecalho do pedido de exportação
        LEFT JOIN EE8500 EE8 WITH(NOLOCK) ON EE7.EE7_FILIAL = EE8.EE8_FILIAL -- Itens do pedido de exportação
            AND EE7.EE7_PEDIDO = EE8.EE8_PEDIDO
        LEFT JOIN EEC500 EEC WITH(NOLOCK) ON EE7.EE7_FILIAL = EEC.EEC_FILIAL -- Pedidos de embarque
            AND EE7.EE7_PEDIDO = EEC.EEC_PEDREF
            AND EEC.D_E_L_E_T_ = ' '
        LEFT JOIN SA1500 SA1 WITH(NOLOCK) ON SA1.A1_FILIAL = '' -- CADASTRO DE CLIENTES
            AND SA1.A1_COD = EE7.EE7_IMPORT
            AND SA1.A1_LOJA = EE7.EE7_IMLOJA
            AND SA1.D_E_L_E_T_ = ''
        LEFT JOIN EE9500 EE9 WITH(NOLOCK) ON EEC.EEC_FILIAL = EE9.EE9_FILIAL
            AND EEC.EEC_FORN = EE9.EE9_FORN
            AND EEC.EEC_FOLOJA = EE9.EE9_FOLOJA
            AND EEC.EEC_PREEMB = EE9.EE9_PREEMB
            AND EE9.D_E_L_E_T_ = ''
        LEFT JOIN SY9500 SY9 WITH(NOLOCK) ON EEC.EEC_DEST = SY9.Y9_SIGLA -- Cadastro de Portos
            AND SY9.D_E_L_E_T_ = ' '
        LEFT JOIN SYA500 SYA WITH(NOLOCK) ON EE7.EE7_PAISET = SYA.YA_CODGI -- Cadastro de paises 
            AND SYA.D_E_L_E_T_ = ' '
        LEFT JOIN SY9500 SY92 WITH(NOLOCK) ON EEC.EEC_ORIGEM = SY92.Y9_SIGLA -- Cadastro de Portos
            AND SY92.D_E_L_E_T_ = ' '
        LEFT JOIN EXZ500 EXZ WITH(NOLOCK) ON EXZ.EXZ_FILIAL = EE9.EE9_FILIAL	-- Cadastro de OIC
            AND EXZ.EXZ_PREEMB = EE9.EE9_PREEMB
            AND EE9_SEQUEN = '1'
            AND EXZ.D_E_L_E_T_ = ''
        LEFT JOIN ZQ0500 ZQ0 WITH(NOLOCK) ON ZQ0.ZQ0_CODQUA = EE8.EE8_RKFQUA -- Cadastro de padroes
            AND ZQ0.D_E_L_E_T_ = ''
        WHERE EE7.D_E_L_E_T_ = ' '
            ${conditionQuery}
        GROUP BY EEC.EEC_NRINVO, EEC.EEC_PREEMB,EE7.EE7_FILIAL,EE7.EE7_PEDIDO,EEC.EEC_REFIMP,EE7.EE7_DTPEDI,EE7.EE7_CONDPA,EE7.EE7_STTDES,
        SY92.Y9_DESCR,EE7.EE7_IMPODE,EE7.EE7_PAISET,EE7.EE7_MOEDA,EE7.EE7_INCOTE,SYA.YA_DESCR,SY9.Y9_DESCR,SA1.A1_END,SA1.A1_NIF,EE8.EE8_EMBAL1,EE8.EE8_PRECO,EE8.EE8_PRECO2,EE8.EE8_PRECO3,
        EE8.EE8_PRECO4,EE8.EE8_PRECO5,EE7.EE7_REFIMP,EEC.EEC_PESLIQ,EEC.EEC_PESBRU,EEC.EEC_PREEMB,EEC.EEC_STTDES,EEC.EEC_DTEMBA,EEC.EEC_DTCONH,
        EEC.EEC_PEDREF,EEC.EEC_VIA,EEC.EEC_DTINVO,EEC.EEC_NRCONH,EEC.EEC_VLFOB,EEC.EEC_NRODUE,EEC.EEC_CHVDUE,EEC.EEC_DTDUE,EEC.EEC_EMBARC,
        EEC.EEC_FILIAL,EE9.EE9_EMBAL1,EE9.EE9_QTDEM1,ZQ0.ZQ0_CODPEN,EEC.EEC_CODMAR,EEC.EEC_YMARCA,EEC.EEC_TCECBC,EEC.EEC_TCEEND,EEC.EEC_YNAVIO
    `;

    console.log(query);

    try {
        const result = await dbQuery(query);
        // TODO: formatar data?
        return NextResponse.json({ data: result as Invoice[] });
    }
    catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ message: 'Erro ao buscar invoice' }, { status: 500 });
    }
}