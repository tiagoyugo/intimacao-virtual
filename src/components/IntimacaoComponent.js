import React, { useState } from 'react';
import Parse from 'parse/dist/parse.min.js';
import MaterialTable from 'material-table'
import { ThemeProvider, createTheme } from '@mui/material';

export const IntimacaoComponent = () => {

    const [inputs, setInputs] = useState({});
    const [tipoProcedimento, setTipoProcedimento] = useState("");
    const [classe, setClasse] = useState("");

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    const handleChangeSelectTipoProcedimento = (event) => {
        setTipoProcedimento(event.target.value);
    }

    const handleChangeSelectClasse = (event) => {
        setClasse(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        incluirIntimacao();
        buscarIntimacoes(event);
    }

    const [intimacoes, setIntimacoes] = useState([]);

    async function incluirIntimacao() {
        try {
            // create a new Parse Object instance
            const Intimacao = new Parse.Object('Intimacao');
            // define the attributes you want for your Object
            Intimacao.set('nome', inputs.nome);
            Intimacao.set('telefone', inputs.telefone);
            Intimacao.set('classe', classe);
            Intimacao.set('tipoProcedimento', tipoProcedimento);
            Intimacao.set('codProcedimento', inputs.codProcedimento);
            Intimacao.set('codSISP', inputs.codSISP);
            Intimacao.set('anoProcedimento', inputs.anoProcedimento);
            Intimacao.set('numProcedimento', inputs.numProcedimento);
            Intimacao.set('crime', inputs.crime);
            Intimacao.set('dataAudiencia', inputs.dataAudiencia);
            Intimacao.set('horaAudiencia', inputs.horaAudiencia);
            // save it on Back4App Data Store
            await Intimacao.save();
            alert('Intimacao incluída com sucesso!!');
        } catch (error) {
            console.log('Erro na inclusão de nova intimacao: ', error);
        }
    }

    async function buscarIntimacoes(event) {
        event.preventDefault();
        // create your Parse Query using the Person Class you've created
        const query = new Parse.Query('Intimacao');
        // use the equalTo filter to look for user which the name is John. this filter can be used in any data type
        //query.equalTo('nome', 'Tiago Yugo Iwasa');
        // run the query
        const results = await query.find();
        // access the Parse Object attributes
        const listaIntimacoes = [];
        for (const object of results) {
            const intimacao = {
                'id': object.id,
                'nome': object.get('nome'),
                'telefone': object.get('telefone'),
                'classe': object.get('classe'),
                'crime': object.get('crime'),
                'numProcedimento': object.get('numProcedimento'),
                'dataAudiencia': object.get('dataAudiencia'),
                'horaAudiencia': object.get('horaAudiencia'),
                'dataHoraAudiencia': object.get('dataAudiencia').concat(" ").concat(object.get('horaAudiencia')),
                'codProcedimento': object.get('codProcedimento'),
                'anoProcedimento': object.get('anoProcedimento'),
                'tipoProcedimento': object.get('tipoProcedimento'),
                'codSISP': object.get('codSISP')
            }
            listaIntimacoes.push(intimacao);
        }
        //console.log(`ParseObjects found: ${JSON.stringify(results)}`);
        //console.log(`Lista de intimações: ${JSON.stringify(listaIntimacoes)}`);
        setIntimacoes(listaIntimacoes);
    }

    const excluirIntimacoes = async function (event, id) {
        // Create a new Intimacao parse object instance and set intimacao id
        const Intimacao = new Parse.Object('Intimacao');
        Intimacao.set('objectId', id);
        // .destroy should be called to delete a parse object
        try {
          await Intimacao.destroy();
          alert('Intimação excluída com sucesso!');
          // Refresh intimacoes to remove this one
          buscarIntimacoes(event);
          return true;
        } catch (error) {
          // Error can be caused by lack of Internet connection
          alert(`Error ${error.message}`);
          return false;
        };
    };

    const enviarPrimeiroContato = (intimacao) => {
        let mensagemPrimeiroContato = `Prezado(a) Sr(a). %NOME%, 

        A Delegacia de Proteção ao Turista (DPTUR) - Unidade Aeroporto, da Polícia Civil do Estado de Santa Catarina, entra em contato para fim de INTIMÁ-LO(A) a prestar depoimento na condição de %CLASSE% nos autos do %PROCEDIMENTO% n. %SISP%.%ANO_PROCED%.%N_PROCED%.
        
        O procedimento refere-se à apuração de suposto ato de %CRIME%.
        
        A data prevista para sua oitiva será em *%DATA% às %HORA%*.
        
        Tendo em vista a atual situação pandêmica, estamos priorizando as oitivas através de videoconferência. Nesse caso, o(a) Sr(a). deverá conectar-se utilizando um computador com webcam e microfone ou telefone celular.
        
        Caso queira fazer-se acompanhar de advogado(a), o mesmo link poderá ser utilizado por seu(sua) procurador(a).
        
        *Para envio do link para videoconferência, solicitamos que confirme o recebimento desta mensagem*.
        
        Para dúvidas, solicitação de cópias de documentos e demais informações, favor utilizar exclusivamente o e-mail dpaeroporto@pc.sc.gov.br , com o assunto %PROCEDIMENTO% n. %SISP%.%ANO_PROCED%.%N_PROCED%.
        
        Atenciosamente,
        DELEGACIA DE PROTEÇÃO AO TURISTA (DPTUR)
        POLÍCIA CIVIL DO ESTADO DE SANTA CATARINA`;

        mensagemPrimeiroContato = mensagemPrimeiroContato.replaceAll("%NOME%", intimacao.nome);
        mensagemPrimeiroContato = mensagemPrimeiroContato.replaceAll("%CLASSE%", intimacao.classe);
        mensagemPrimeiroContato = mensagemPrimeiroContato.replaceAll("%CRIME%", intimacao.crime);
        mensagemPrimeiroContato = mensagemPrimeiroContato.replaceAll("%PROCEDIMENTO%", intimacao.tipoProcedimento);
        mensagemPrimeiroContato = mensagemPrimeiroContato.replaceAll("%SISP%", intimacao.codSISP);
        mensagemPrimeiroContato = mensagemPrimeiroContato.replaceAll("%DATA%", intimacao.dataAudiencia);
        mensagemPrimeiroContato = mensagemPrimeiroContato.replaceAll("%HORA%", intimacao.horaAudiencia);
        mensagemPrimeiroContato = mensagemPrimeiroContato.replaceAll("%PROC%", intimacao.codProcedimento);
        mensagemPrimeiroContato = mensagemPrimeiroContato.replaceAll("%N_PROCED%", intimacao.numProcedimento);
        mensagemPrimeiroContato = mensagemPrimeiroContato.replaceAll("%ANO_PROCED%", intimacao.anoProcedimento);
        
        /*fetch(mensagem1)
        .then((r) => r.text())
        .then(msg  => {
            console.log(msg)
            mensagemPrimeiroContato = msg;
            setMensagem1(msg);
        });*/

        let URL = 'https://wa.me';
        let number = intimacao.telefone;
        number = number.replace(/[^\w\s]/gi, '').replace(/ /g, '');
        let url = "".concat(URL, "/").concat(number);
        if (mensagemPrimeiroContato) {
            url += "?text=".concat(encodeURI(mensagemPrimeiroContato));
        }
        console.log(url);
        window.open(url);
    }

    const enviarLink = (intimacao) => {
        let mensagemLink = `O link para acesso à videoconferência é https://webconf.pc.sc.gov.br/dptur-%SISP%-%N_PROCED%-%ANO_PROCED%

        O link ficará ativo momentos antes da data e hora agendadas.`;
        
        mensagemLink = mensagemLink.replaceAll("%SISP%", intimacao.codSISP);
        mensagemLink = mensagemLink.replaceAll("%N_PROCED%", intimacao.numProcedimento);
        mensagemLink = mensagemLink.replaceAll("%ANO_PROCED%", intimacao.anoProcedimento);

        /*fetch(mensagem2)
        .then((r) => r.text())
        .then(msg  => {
            console.log(msg)
            mensagemLink = msg;
        });*/

        let URL = 'https://wa.me';
        let number = intimacao.telefone;
        number = number.replace(/[^\w\s]/gi, '').replace(/ /g, '');
        let url = "".concat(URL, "/").concat(number);
        if (mensagemLink) {
            url += "?text=".concat(encodeURI(mensagemLink));
        }
        console.log(url);
        window.open(url);
    }

    const enviarRelembrar = (intimacao) => {
        let mensagemRelembrar = `Prezado(a) Sr(a). %NOME%, 

        Relembramos Vossa Senhoria da audiência marcada para a data de *%DATA% às %HORA%*.
        
        O link para acesso à videoconferência é https://webconf.pc.sc.gov.br/dptur-%SISP%-%N_PROCED%-%ANO_PROCED%
        
        Atenciosamente,
        DELEGACIA DE PROTEÇÃO AO TURISTA (DPTUR)
        POLÍCIA CIVIL DO ESTADO DE SANTA CATARINA`;
        
        mensagemRelembrar = mensagemRelembrar.replaceAll("%NOME%", intimacao.nome);
        mensagemRelembrar = mensagemRelembrar.replaceAll("%DATA%", intimacao.dataAudiencia);
        mensagemRelembrar = mensagemRelembrar.replaceAll("%HORA%", intimacao.horaAudiencia);
        mensagemRelembrar = mensagemRelembrar.replaceAll("%SISP%", intimacao.codSISP);
        mensagemRelembrar = mensagemRelembrar.replaceAll("%N_PROCED%", intimacao.numProcedimento);
        mensagemRelembrar = mensagemRelembrar.replaceAll("%ANO_PROCED%", intimacao.anoProcedimento);

        /*fetch(mensagem3)
        .then((r) => r.text())
        .then(msg  => {
            console.log(msg)
            mensagemRelembrar = msg;
        });*/

        let URL = 'https://wa.me';
        let number = intimacao.telefone;
        number = number.replace(/[^\w\s]/gi, '').replace(/ /g, '');
        let url = "".concat(URL, "/").concat(number);
        if (mensagemRelembrar) {
            url += "?text=".concat(encodeURI(mensagemRelembrar));
        }
        console.log(url);
        window.open(url);
    }

    const limpar = (event) => {
        event.preventDefault();
        setInputs({});
        setClasse("");
        setTipoProcedimento("");
    }

    const defaultMaterialTheme = createTheme();

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <fieldset class="grupo">
                        <div class="campo">
                            <label for="nome">Nome:</label>
                            <input type="text" id="nome" name="nome" value={inputs.nome || ""} onChange={handleChange} />
                        </div>
                        <div class="campo">
                            <label for="telefone">Telefone:</label>
                            <input type="text" id="telefone" name="telefone" value={inputs.telefone || ""} onChange={handleChange} />
                        </div>
                        <div class="campo">
                            <label for="classe">Classe:</label>
                            <select id="classe" name="classe" value={classe} 
                                onChange={handleChangeSelectClasse}>
                                <option value="">Selecione</option>
                                <option value="Vítima">Vítima</option>
                                <option value="Testemunha">Testemunha</option>
                                <option value="Autor">Autor</option>
                                <option value="Advogado">Advogado</option>
                            </select>
                        </div>
                        <div class="campo">
                            <label for="tipoProcedimento">Tipo de Procedimento:</label>
                            <select id="tipoProcedimento" name="tipoProcedimento" value={tipoProcedimento} 
                                onChange={handleChangeSelectTipoProcedimento}>
                                <option value="">Selecione</option>
                                <option value="BO">Boletim de Ocorrência</option>
                                <option value="TC">Termo Circunstanciado</option>
                                <option value="IP">Inquérito Policial</option>
                                <option value="APF">Auto de Prisão em Flagrante</option>
                            </select>
                        </div>
                    </fieldset>
                    
                    <fieldset class="grupo">
                        <div class="campo">
                            <label for="codProcedimento">Código do Procedimento:</label>
                            <input type="text" id="codProcedimento" name="codProcedimento" value={tipoProcedimento || ""} disabled />
                        </div>
                        <div class="campo">
                            <label for="codSISP">Unidade:</label>
                            <input type="text" id="codSISP" name="codSISP" value={inputs.codSISP || ""} onChange={handleChange} />
                        </div>
                        <div class="campo">
                            <label for="anoProcedimento">Ano do Procedimento:</label>
                            <input type="text" id="anoProcedimento" name="anoProcedimento" value={inputs.anoProcedimento || ""} onChange={handleChange} />
                        </div>
                        <div class="campo">
                            <label for="numProcedimento">Número do Procedimento:</label>
                            <input type="text" id="numProcedimento" name="numProcedimento" value={inputs.numProcedimento || ""} onChange={handleChange} />
                        </div>
                    </fieldset>

                    <fieldset class="grupo">
                        <div class="campo">
                            <label for="crime">Tipo de Crime:</label>
                            <input type="text" id="crime" name="crime" value={inputs.crime || ""} onChange={handleChange} />
                        </div>
                        <div class="campo">
                            <label for="dataAudiencia">Data da Audiência:</label>
                            <input type="text" id="dataAudiencia" name="dataAudiencia" value={inputs.dataAudiencia || ""} onChange={handleChange} />
                        </div>
                        <div class="campo">
                            <label for="horaAudiencia">Hora da Audiência:</label>
                            <input type="text" id="horaAudiencia" name="horaAudiencia" value={inputs.horaAudiencia || ""} onChange={handleChange} />
                        </div>
                    </fieldset>

                    <fieldset class="grupo" style={{display: 'flex', justifyContent: 'center'}}>
                        <div class="campo">
                            <button type="submit" class="botao submit">Incluir</button>
                        </div>
                        <div class="campo">
                            <button class="botao-secundario" onClick={buscarIntimacoes}>Buscar</button>
                        </div>
                        <div class="campo">
                            <button class="botao-secundario" onClick={limpar}>Limpar</button>
                        </div>
                    </fieldset>
                </fieldset>
            </form>
            
            <ThemeProvider theme={defaultMaterialTheme}>
                <MaterialTable
                    title="Intimações"
                    columns={[
                        { title: 'Nome', field: 'nome' },
                        { title: 'Envolvimento', field: 'classe' },
                        { title: 'Crime', field: 'crime' },
                        { title: 'Procedimento', field: 'numProcedimento' },
                        { title: 'Data Audiência', field: 'dataHoraAudiencia' }
                    ]}
                    data={intimacoes}
                    actions={[
                        {
                            icon: 'outgoing_mail',
                            tooltip: 'Enviar primeiro contato',
                            onClick: (event, rowData) => enviarPrimeiroContato(rowData)
                        },
                        {
                            icon: 'link',
                            tooltip: 'Enviar link',
                            onClick: (event, rowData) => enviarLink(rowData)
                        },
                        {
                            icon: 'event_repeat',
                            tooltip: 'Relembrar oitiva',
                            onClick: (event, rowData) => enviarRelembrar(rowData)
                        },
                        {
                            icon: 'delete',
                            tooltip: 'Excluir',
                            onClick: (event, rowData) => window.confirm('Realmente deseja excluir esta intimação?') ? excluirIntimacoes(event, rowData.id) : undefined
                        }
                    ]}
                    options={{
                        actionsColumnIndex: -1,
                        tableLayout: "auto"
                    }}
                />
            </ThemeProvider>
        </div>
    );
};