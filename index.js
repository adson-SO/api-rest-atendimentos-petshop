const customExpress = require('./config/customExpress');
const connection = require('./infrastructure/connection');
const Tables = require('./infrastructure/tables');

connection.connect(erro => {
    if(erro){
        console.log(erro);
    } else{
        console.log('Conexão realizada com sucesso.');

        Tables.init(connection);

        const app = customExpress();

        app.listen(3000, console.log('Servidor rodando na porta 3000'));
    }
});
