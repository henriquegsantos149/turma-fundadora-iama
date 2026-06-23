const token = '9617e0716b9a89bc87a2d382d9aeedc19df5bb57f5fd0af5278e9d788fe96c711fa0ebe6';
const base = 'https://ambientalpro.api-us1.com/api/3';

// Pergunta fields that need to be added to the group
const perguntaFieldIds = [791, 792, 793, 794, 795, 796, 797, 798];

async function addFieldToGroup(fieldId) {
  const payload = {
    fieldRel: {
      field: String(fieldId),
      relid: "0"
    }
  };

  const res = await fetch(`${base}/fieldRels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Token': token
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (res.ok) {
    console.log(`✅ Campo ${fieldId} adicionado ao grupo. FieldRel ID: ${data.fieldRel?.id}`);
  } else {
    console.error(`❌ Erro no campo ${fieldId}:`, JSON.stringify(data));
  }
  return data;
}

(async () => {
  console.log('Adicionando campos de Pergunta 1-8 ao grupo [L01][PÓS][IA.MA]...\n');
  for (const id of perguntaFieldIds) {
    await addFieldToGroup(id);
  }
  console.log('\nConcluído! Verificando resultado...');

  // Verify
  for (const id of perguntaFieldIds) {
    const res = await fetch(`${base}/fields/${id}`, { headers: { 'Api-Token': token } });
    const data = await res.json();
    const f = data.field;
    console.log(`Campo ${f.id} (${f.title.substring(0,30)}): relations = ${f.relations.length > 0 ? f.relations.join(', ') : 'NENHUMA'}`);
  }
})();
