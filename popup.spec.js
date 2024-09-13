const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');


describe('Event Handler', () => {
  let document;
  let fetchMock;

  beforeEach(() => {       
    global.fetch = jest.fn(); // Mock da função fetch
    fetchMock = global.fetch;
    // Carregar o HTML do arquivo
    const html = fs.readFileSync(path.resolve(__dirname, 'popup.html'), 'utf8');

    // Configurar o DOM
    const { window } = new JSDOM(html);
    global.window = window;
    global.document = window.document;
    global.navigator = window.navigator;
    require('./popup.js');
  });

  it('should handle successful JSON response', async () => {
    // Configura o mock do fetch
    fetchMock.mockResolvedValueOnce({
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: jest.fn().mockResolvedValueOnce({ success: true }),
    });

    // Simula o clique no botão
    document.getElementById('sendRequest').click();

    // Aguarda a atualização do DOM
    await new Promise(process.nextTick);

    // Verifica as mudanças no DOM
    expect(document.getElementById('loading').style.display).toBe('none');
    expect(document.getElementById('response').textContent).toBe(JSON.stringify({ success: true }, null, 2));
    expect(document.getElementById('headers_container').style.display).toBe('flex');
    expect(document.getElementById('cookies_container').style.display).toBe('none');
    expect(document.getElementById('feedback').style.display).toBe('none');
  });

  it('should handle failed request', async () => {
    // Configura o mock do fetch para retornar um erro
    fetchMock.mockRejectedValueOnce(new Error('Network error'));

    // Simula o clique no botão
    document.getElementById('sendRequest').click();

    // Aguarda a atualização do DOM
    await new Promise(process.nextTick);

    // Verifica as mudanças no DOM
    expect(document.getElementById('loading').style.display).toBe('none');
    expect(document.getElementById('feedback').textContent).toBe('Um erro ocorreu durante a tentativa de realizar a requisição');
    expect(document.getElementById('feedback').style.display).toBe('flex');
    expect(document.getElementById('response').textContent).toBe('Network error');
  });

  it('should display feedback if URL is empty', async () => {
    // Modifica o campo URL para ser vazio
    document.getElementById('url').value = '';

    // Simula o clique no botão
    document.getElementById('sendRequest').click();

    // Aguarda a atualização do DOM
    await new Promise(process.nextTick);

    // Verifica as mudanças no DOM
    expect(document.getElementById('feedback').textContent).toBe('Preencha o campo da URL');
    expect(document.getElementById('feedback').style.display).toBe('flex');
    expect(document.getElementById('loading').style.display).toBe('none');
  });
});
