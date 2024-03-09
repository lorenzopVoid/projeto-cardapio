$(document).ready(function(){
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 5;

var CELULAR_EMPRESA = '5584999651373';

cardapio.eventos = {

    init: () => {
        cardapio.methodos.obterItensCardapio();
        cardapio.methodos.carregarBotaoLigar();
        cardapio.methodos.carregarBotaoWhatsapp();
        cardapio.methodos.carregarBotaoReserva();
    }

}

cardapio.methodos = {
    // obtem a lista de itens do cardapio
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {

        var filtro = MENU[categoria];
        console.log(filtro);

        if (!vermais) {
            $("#itensCardapio").html('');
            $("#btnVerMais").removeClass('hidden');
        }

        $.each(filtro, (i, e) => {
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img).replace(/\${name}/g, e.name).replace(/\${preco}/g, e.price.toFixed(2).replace('.', ',')).replace(/\${id}/g, e.id)

            //botão ver mais foi clicado (12 itens)
            if (vermais && i >= 8 && i < 12) {
                $("#itensCardapio").append(temp)
            }
            // paginaçao inicial (8 itens)
            if (!vermais && i < 8) {
                $("#itensCardapio").append(temp)
            }
            
        })

        // remover o active do elemento
        $(".container-menu a").removeClass('active');

        // adiciona o active no elemento atual
        $("#menu-" + categoria).addClass('active');
    

    },
    // clique no botão ver mais
    verMais: () => {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.methodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass('hidden');

    },
    // diminuir a quantidade do item no cardapio
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }

    },
    // aumentar a quantidade do item no cardapio
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)
    },
    // adicionar ao carrinho o item do cardápio
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {

            //obter a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            //obtem a lista de itens
            let filtro = MENU[categoria];

            //obtem o item
            let item = $.grep(filtro, (e, i) => {return e.id == id});

            if (item.length > 0) {

                //validar se ja existe o item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => {return elem.id == id});
                
                //caso o item ja exista no carrinho, só altera a quantidade
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj = obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }
                //caso ainda não exista o item no carrinho, adiciona ele
                else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }

                cardapio.methodos.mensagem('Item adicionado ao carrinho', 'green');
                $("#qntd-" + id).text(0);

                cardapio.methodos.atualizarBadgeTotal();
            }

        }
    },
    // atualiza o badge de totais dos botões "meu carrinho"
    atualizarBadgeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }
        else {
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);
    },
    //abrir modal de carrinho
    abrirCarrinho: (abrir) => {

        if (abrir) {
            $("#modalCarrinho").removeClass('hidden');
            cardapio.methodos.carregarCarrinho();
        }
        else {
            $("#modalCarrinho").addClass('hidden');
        }
    },
    
    // altera os textos e exibe os botões das etapas
    carregarEtapa: (etapa) => {

        if (etapa == 1) {

            $("#lblTituloEtapa").text('Seu carrinho');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');

        }
        if (etapa == 2) {

            $("#lblTituloEtapa").text('Endereço de entrega:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');

        }
        if (etapa == 3) {

            $("#lblTituloEtapa").text('Resumo do pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');

        }
    },
    // botão de voltar etapa
    voltarEtapa: () => {

        let etapa = $(".etapa.active").length;
        cardapio.methodos.carregarEtapa(etapa - 1)

    },
    // carrega lista de itens do carrinho
    carregarCarrinho: () => {

        cardapio.methodos.carregarEtapa(1);

        if (MEU_CARRINHO.length > 0) {

            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) =>{

                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)

                $("#itensCarrinho").append(temp);

                // último item
                if ((i + 1) == MEU_CARRINHO.length) {
                    cardapio.methodos.carregarValores();
                }
                
            })

        }
        else {
            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu carrinho está vazio.</p>');
            cardapio.methodos.carregarValores();
        }

    },
    // diminuir quantidade do item no carrinho
    diminuirQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if (qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            cardapio.methodos.atualizarCarrinho(id, qntdAtual - 1);
        }
        else {
            cardapio.methodos.removerItemCarrinho(id);
        }

    },
    // aumenta quantidade do item no carrinho
    aumentarQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1);
        cardapio.methodos.atualizarCarrinho(id, qntdAtual + 1);

    },
    // botão remover item do carrinho
    removerItemCarrinho: (id) => {

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => {return e.id != id});
        cardapio.methodos.carregarCarrinho();

        // atualiza o botão carrinho na quantidade atualizada
        cardapio.methodos.atualizarBadgeTotal();

    },
    // atualiza o carrinho com a quantidade atual
    atualizarCarrinho: (id, qntd) => {

        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        // atualiza o botão carrinho na quantidade atualizada
        cardapio.methodos.atualizarBadgeTotal();
        // atualiza os valores (R$) totais do carrinho
        cardapio.methodos.carregarValores();

    },
    // carrega os valores de subtotal, entrega e total
    carregarValores: () => {

        VALOR_CARRINHO = 0;
        $("#lblSubTotal").text('R$ 0,00');
        $("#lblValorEntrega").text('+ R$ 0,00');
        $("#lblValorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) => {

            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            if((i + 1) == MEU_CARRINHO.length) {
                $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
                $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);
            }
        })

    },
    // carregar a etapa endereços
    carregarEndereco: () => {

        if (MEU_CARRINHO.length <= 0) {
            cardapio.methodos.mensagem("Seu carrinho está vazio")
            return;
        }

        cardapio.methodos.carregarEtapa(2);

    },
    // API ViaCEP
    buscarCep: () => {

        //cria a variavel com o valor do cep
        var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

        //verifica se o cep possui valor informado
        if(cep != "") {

            //expressao regular para validar o CEP
            var validacep = /^[0-9]{8}$/;

            if (validacep.test(cep)) {

                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

                    if (!("erro" in dados)) {

                        // atualizar os campos com os valores retornados
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUf").val(dados.uf);
                        $("#txtNumero").focus();

                    }
                    else {
                        cardapio.methodos.mensagem('CEP não encontrado. Preencha as informações manualmente.');
                        $("#txtEndereco").focus();
                    }

                })

            }
            else {
                cardapio.methodos.mensagem('Formato do CEP inválido.');
                $("#txtCEP").focus();
            }

        }
        else {
            cardapio.methodos.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus();
        }
    },
    // Validação antes de prosseguir para etapa 3
    resumoPedido: () => {

        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUf").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();

        if (cep.length <= 0) {
            cardapio.methodos.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus();
            return;
        }
        if (endereco.length <= 0) {
            cardapio.methodos.mensagem('Informe o Endereço, por favor.');
            $("#txtEndereco").focus();
            return;
        }
        if (bairro.length <= 0) {
            cardapio.methodos.mensagem('Informe o Bairro, por favor.');
            $("#txtBairro").focus();
            return;
        }
        if (cidade.length <= 0) {
            cardapio.methodos.mensagem('Informe a Cidade, por favor.');
            $("#txtCidade").focus();
            return;
        }
        if (uf == "-1") {
            cardapio.methodos.mensagem('Informe a UF, por favor.');
            $("#ddlUf").focus();
            return;
        }
        if (numero.length <= 0) {
            cardapio.methodos.mensagem('Informe o Número, por favor.');
            $("#txtNumero").focus();
            return;
        }
        
        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento
        }

        cardapio.methodos.carregarEtapa(3);
        cardapio.methodos.carregarResumo();
    },
    // carrega a etapa de resumo do pedido
    carregarResumo: () => {

        $("#listaItensResumo").html('');
        
        $.each(MEU_CARRINHO, (i, e) => {

            let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${qntd}/g, e.qntd)

                $("#listaItensResumo").append(temp);

        });

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`);

        cardapio.methodos.finalizarPedido();

    },
    // atualiza o link do botão do whatsapp
    finalizarPedido: () => {

        if (MEU_CARRINHO.length > 0 && MEU_ENDERECO != null) {
            var texto = 'Olá, gostaria de fazer um pedido:\n';

            texto += `\n*Itens do pedido:*\n\n\${itens}`;
            texto += '\n*Endereço de entrega:*';
            texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
            texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
            texto += `\n\n*Total (com entrega):* R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`;

            var itens = '';
            $.each(MEU_CARRINHO, (i, e) => {
                itens += `*${e.qntd}x* ${e.name} ....... R$ ${e.price.toFixed(2).replace('.', ',')} \n`;

                if((i + 1) == MEU_CARRINHO.length) {

                    texto = texto.replace(/\${itens}/g, itens);

                    // converte a url
                    let encode = encodeURI(texto);
                    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;
                    
                    $("#btnEtapaResumo").attr('href', URL);
                }
            })
        }

    },
    // carrega  link do botao reserva
    carregarBotaoReserva: () => {

        var texto = 'Olá! Gostaria de fazer uma *reserva*';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnReserva").attr('href', URL);

    },
    // carrega o botao de ligar
    carregarBotaoLigar: () => {

        $("#btnLigar").attr('href', `tel:${CELULAR_EMPRESA}`);

    },
    // abre o depoimento
    abrirDepoimento: (depoimento) => {

        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');

        $("#btnDepoimento-1").removeClass('active');
        $("#btnDepoimento-2").removeClass('active');
        $("#btnDepoimento-3").removeClass('active');

        $("#depoimento-" + depoimento).removeClass('hidden');
        $("#btnDepoimento-" + depoimento).addClass('active');

    },
    //carrega o botao do whatsapp
    carregarBotaoWhatsapp: () => {

        var texto = 'Olá! Gostaria de realizar *meu pedido*';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnWpp").attr('href', URL);

    },

    // mensagens
    mensagem: (texto, cor = 'red', tempo = 3500) => {
        
        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800);
            
        }, tempo)
    
    },

}

cardapio.templates = {

    item: `
        <div class="col-3 mb-5">
            <div class="card card-item" id="\${id}">
                    <div class="img-produto">
                        <img src="\${img}" alt="">
                    </div>
                    <p class="title-produto text-center mt-4">
                        <b>
                            \${name}
                        </b>
                    </p>
                    <p class="price-produto text-center">
                        <b>R$ \${preco}</b>
                    </p>
                    <div class="add-carrinho">
                        <span class="btn-menos" onclick="cardapio.methodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                        <span class="add-numero-itens" id="qntd-\${id}">0</span>
                        <span class="btn-mais" onclick="cardapio.methodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                        <span class="btn btn-add" onclick="cardapio.methodos.adicionarAoCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                    </div>
            </div>
        </div>
    
    `,

    itemCarrinho: `
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                    <img src="\${img}" alt="">
            </div>
            <div class="dados-produto">
                    <p class="title-produto"><b>\${name}</b></p>
                    <p class="price-produto"><b>R$ \${preco}</b></p>
            </div>
            <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.methodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                    <span class="btn-mais" onclick="cardapio.methodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-remove" onclick="cardapio.methodos.removerItemCarrinho('\${id}')"><i class="fas fa-times"></i></span>
            </div>
        </div>
    `,

    itemResumo: `
    
    <div class="col-12 item-carrinho resumo">
        <div class="img-produto-resumo">
            <img src="\${img}" alt="">
        </div>
        <div class="dados-produto">
            <p class="title-produto-resumo">
                <b>\${name}</b>
            </p>
            <p class="price-produto-resumo">
                <b>R$ \${preco}</b>
            </p>
        </div>
        <p class="quantidade-produto-resumo">
            x <b>\${qntd}</b>
        </p>
    </div>
    
    `

}