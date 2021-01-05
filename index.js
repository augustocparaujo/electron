const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

//aplicação principal
app.on('ready', () => {
    //cria tela da aplicação
    var mainWindow = new BrowserWindow({
        //icone da aplicação
        icon: __dirname + '/assets/logo.png'
    });
    //carrega a página main - chamando o objeto principal
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    //se for fechado a janela principal, recebemos o evento e fechamos tudo
    mainWindow.on('closed', () => app.quit());
    //reconher menu template
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    //start do menu
    Menu.setApplicationMenu(mainMenu);
});

//adicionar comentário - tela
function createCommentWindow() {
    var commentWindow = new BrowserWindow({
        //icone da aplicação
        icon: __dirname + '/assets/logo.png',
        //tamanho e titulo
        width: 500,
        height: 300,
        title: 'Novo cometário',
    });
    //carrega a página comment - chamando o objeto principal
    commentWindow.loadURL(`file://${__dirname}/comment.html`);
    //remover janela commente da mémoria
    commentWindow.on('closed', () => commentWindow = null);
}

//manipulador do evento ipc
ipcMain.on('addComment', (event, comment) => {
    mainWindow.webContents.send('addComment', comment);
    //fechar janela ao enviar dados
    commentWindow.close();
})

//criar menu
const menuTemplate = [{
    label: 'Menu',
    submenu: [{
        label: 'Adicionar comentário',
        click() {
            createCommentWindow();
        }
    }, {
        label: 'Sair',
        accelerator: process.platform == 'win32' ? 'Alt+F4' : 'Cmd+Q',
        click() { app.quit(); }
    }, ]
}]

//verificar qual OS se for mac insere um array vázio na frente do menu
if (process.platform === 'darwin') {
    menuTemplate.unshift({});
}

//variável de ambiente
if (process.env.NODE_ENV !== 'production') {
    //developer - production - teste
    menuTemplate.push({
        label: 'Dev',
        accelerator: process.platform === 'win32' ? 'Ctrl+Shift+I' : 'Cmd+Alt+I',
        click(item, focusedWindow) {
            focusedWindow.toggleDevTools();
        }
    });
}