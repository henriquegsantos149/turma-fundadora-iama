const url = 'https://ambientalpro.api-us1.com/api/3/contact/sync';
const token = '9617e0716b9a89bc87a2d382d9aeedc19df5bb57f5fd0af5278e9d788fe96c711fa0ebe6';

const payload = {
  contact: {
    email: 'test_agent@ambientalpro.com.br',
    firstName: 'Test Agent',
    fieldValues: [
      { field: '789', value: new Date().toISOString() }
    ]
  }
};

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Api-Token': token
  },
  body: JSON.stringify(payload)
})
.then(res => res.text())
.then(console.log)
.catch(console.error);
