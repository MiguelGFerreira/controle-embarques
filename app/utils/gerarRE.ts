import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { getBase64ImageFromURL } from './server';
import { Invoice } from '@/app/types';

pdfMake.vfs = pdfFonts.vfs;

export const gerarRE = async (data: Invoice) => {
  const logo = await getBase64ImageFromURL("@/../public/images/tristao.png");
  const cnpj = data.FILIAL == 21 ? "27001247/0030-13" : "27001247/0037-90";
  const valorFormatado = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(data.VALOR_INVOICE)
  const pesoLiquidoFormatado = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(data.PESO_LIQUIDO)

  const getAlchemyText = () => {
    const embalagensMap: Record<string, string> = {
      BULK: `Granel equivalente`,
      "BIG BAG": `${data.QTD_EMB} big bags equivalentes`,
      SC9: `${data.QTD_EMB} sacas de 59kg equivalentes`
    }

    return embalagensMap[data.EMBALAGEM] || ``;
  }

  const docDefinition: any = {
    content: [
      {
        image: `data:image/png;base64,${logo}`,
        width: 50,
        alignment: 'left',
        margin: [0, 0, 0, 10]
      },
      { text: 'TRISTÃO', style: 'header' },
      { text: 'CIA DE COMÉRCIO EXTERIOR', style: 'subheader' },
      '\n',
      {
        table: {
          widths: ['auto', '*'],
          body: [
            [
              { text: 'IDE', style: 'label' },
              { text: data.NUMERO_EMBARQUE, style: 'value' }
            ],
            [
              { text: 'CNPJ', style: 'label' },
              { text: cnpj, style: 'value' }
            ],
            [
              { text: 'IMPORTADOR', style: 'label' },
              {
                stack: [
                  `${data.CLIENTE} (${data.NIF})`,
                  `${data.ENDERECO_CLIENTE} - ${data.LOCAL_DESTINO}`
                ],
                style: 'value'
              }
            ],
            [
              { text: 'DESTINO', style: 'label' },
              { text: `${data.COD_PAIS}-${data.PAISDEST}`, style: 'value' }
            ],
            [
              { text: 'EMBARQUE', style: 'label' },
              { text: data.VIA, style: 'value' }
            ],
            [
              { text: 'CONDIÇÃO VENDA', style: 'label' },
              { text: data.INCOTERM, style: 'value' }
            ],
            [
              { text: 'MODALIDADE PAGAMENTO', style: 'label' },
              { text: 'COBRANÇA', style: 'value' }
            ],
            [
              { text: 'MOEDA', style: 'label' },
              { text: data.MOEDA, style: 'value' }
            ],
            [
              { text: 'NCM', style: 'label' },
              { text: '09011110-00', style: 'value' }
            ],
            [
              { text: 'NALADI', style: 'label' },
              { text: '9011110', style: 'value' }
            ],
            [
              { text: 'DESCRIÇÃO', style: 'label' },
              {
                text: data.DESCRIPTION,
                style: 'value'
              }
            ],
            [
              { text: 'VALOR US$', style: 'label' },
              { text: valorFormatado, style: 'value' }
            ],
            [
              { text: 'VALOR CONDIÇÃO VENDA', style: 'label' },
              { text: valorFormatado, style: 'value' }
            ],
            [
              { text: 'VALOR CONDIÇÃO EMBARQUE', style: 'label' },
              { text: valorFormatado, style: 'value' }
            ],
            [
              { text: 'PESO EM KILOS', style: 'label' },
              { text: pesoLiquidoFormatado, style: 'value' }
            ],
            [
              { text: 'MARCAÇÃO', style: 'label' },
              {
                stack: [
                  { text: data.MARCACOES2 },
                  { text: data.MARCACOES },
                  { text: `${getAlchemyText()} a ${Math.floor(data.PESO_LIQUIDO/60)} sacas de 60kg` }
                ],
                style: 'label'
              }
            ],
            [
              { text: 'OBSERVAÇÕES', style: 'label' },
              { text: data.OBSERVACAO, style: 'label' }
            ],
          ],
        },
        layout: 'noBorders',
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 5]
      },
      subheader: {
        fontSize: 14,
        bold: false,
        margin: [0, 0, 0, 10]
      },
      label: {
        bold: true,
        fontSize: 7,
        margin: [0, 2, 0, 2]
      },
      value: {
        fontSize: 7,
        margin: [0, 2, 0, 2],
        //alignment: 'left',
      }
    },
    defaultStyle: {
      columnGap: 10
    }
  };

  pdfMake.createPdf(docDefinition).open();
}