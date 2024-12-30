const axios = require('axios');

// Конфігурація
const config = {
  token: 'uq70g5yXNurYCh3y0AH3bCGzTx8F7VUGAcllbwbQ4R_c', // Замініть на ваш тестовий токен
  baseUrl: 'https://api.monobank.ua/api',
};

// Функція створення платежу
async function createTestPayment() {
  try {
    const paymentData = {
      amount: 10000, // 100 грн
      ccy: 980,      // UAH
      merchantPaymInfo: {
        reference: `test-payment-${Date.now()}`, // Унікальний референс
        destination: "Тестове замовлення",
        basketOrder: [{
          name: "Тестовий товар",
          qty: 1,
          sum: 10000
        }]
      },
      redirectUrl: 'https://your-site.com/success', // URL для повернення після оплати
      webHookUrl: 'https://your-site.com/webhook'   // URL для отримання статусу
    };

    const response = await axios.post(`${config.baseUrl}/merchant/invoice/create`, paymentData, {
      headers: {
        'X-Token': config.token,
        'Content-Type': 'application/json'
      }
    });

    console.log('Платіж створено:', response.data);
    console.log('Посилання на оплату:', response.data.pageUrl);
    
    // Зберігаємо ID платежу для подальшої перевірки
    return response.data.invoiceId;

  } catch (error) {
    console.error('Помилка при створенні платежу:', error.response?.data || error.message);
  }
}

// Функція перевірки статусу платежу
async function checkPaymentStatus(invoiceId) {
  try {
    const response = await axios.get(`${config.baseUrl}/merchant/invoice/status?invoiceId=${invoiceId}`, {
      headers: {
        'X-Token': config.token
      }
    });

    console.log('Статус платежу:', response.data);
    return response.data;

  } catch (error) {
    console.error('Помилка при перевірці статусу:', error.response?.data || error.message);
  }
}

// Запуск тестового платежу
async function runTest() {
  console.log('Створення тестового платежу...');
  const invoiceId = await createTestPayment();
  
  if (invoiceId) {
    console.log('Очікування 5 секунд перед перевіркою статусу...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('Перевірка статусу платежу...');
    await checkPaymentStatus(invoiceId);
  }
}

// Запускаємо тест
runTest();