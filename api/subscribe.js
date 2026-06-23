export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Permitir apenas requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Garantir que o body seja lido corretamente (Vercel às vezes retorna string)
    let data = req.body || {};
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch (e) { data = {}; }
    }

    // Configurações do ActiveCampaign
    const AC_API_KEY = process.env.ACTIVE_API_KEY;
    const AC_BASE_URL = 'https://ambientalpro.api-us1.com/api/3';

    console.log('[subscribe] Requisição recebida. Email:', data.email || 'não informado');
    console.log('[subscribe] ACTIVE_API_KEY configurada:', AC_API_KEY ? 'SIM (' + AC_API_KEY.substring(0, 8) + '...)' : 'NÃO');

    if (!AC_API_KEY) {
      console.warn('[subscribe] ACTIVE_API_KEY não encontrada nas variáveis de ambiente!');
      return res.status(500).json({ error: 'Configuração da API ausente no servidor.' });
    }

    // Extrair os dados recebidos do front-end
    const {
      email = '',
      firstName = '',
      phone = '',
      fieldValues = []
    } = data;

    if (!email) {
      return res.status(400).json({ error: 'O email é obrigatório.' });
    }

    const contactPayload = {
      contact: {
        email: email,
        firstName: firstName,
        phone: phone,
        fieldValues: fieldValues
      }
    };

    console.log('[subscribe] Enviando para ActiveCampaign:', JSON.stringify(contactPayload).substring(0, 200));

    // Passo 1: Sincronizar contato (Cria ou Atualiza)
    const syncResponse = await fetch(`${AC_BASE_URL}/contact/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Token': AC_API_KEY
      },
      body: JSON.stringify(contactPayload)
    });

    if (!syncResponse.ok) {
      const errorData = await syncResponse.text();
      console.error('[subscribe] Erro da API do ActiveCampaign (Sync):', errorData);
      return res.status(syncResponse.status).json({ error: 'Falha ao sincronizar o contato.', details: errorData });
    }

    const syncResult = await syncResponse.json();
    const contactId = syncResult.contact.id;
    console.log('[subscribe] Contato sincronizado com sucesso. ID:', contactId);

    // Passo 2: Adicionar a Tag (ID 457 - [L01][PÓS][IA.MA] Lead)
    const tagPayload = {
      contactTag: {
        contact: contactId,
        tag: "457"
      }
    };

    const tagResponse = await fetch(`${AC_BASE_URL}/contactTags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Token': AC_API_KEY
      },
      body: JSON.stringify(tagPayload)
    });

    if (!tagResponse.ok) {
      const errorData = await tagResponse.text();
      console.error(`[subscribe] Erro ao adicionar tag para contato ${contactId}:`, errorData);
      // Prosseguir — o contato já foi criado com sucesso
    } else {
      console.log('[subscribe] Tag [L01][PÓS][IA.MA] Lead adicionada com sucesso.');
    }

    // Retorna sucesso para o front-end
    return res.status(200).json({ success: true, message: 'Inscrição registrada com sucesso!', contactId });

  } catch (error) {
    console.error('[subscribe] Erro interno não tratado:', error.message);
    return res.status(500).json({ error: 'Erro interno no processamento.', details: error.message });
  }
}
