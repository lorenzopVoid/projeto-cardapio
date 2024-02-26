$(document).ready(function(){
    cardapio.eventos.init();
})

var cardapio = {};

cardapio.eventos = {

    init: () => {
        cardapio.methodos.obterItensCardapio();
    }

}

cardapio.methodos = {
    //obtem a lista de itens do cardapio
    obterItensCardapio: () => {

        var filtro = MENU['burgers'];
        console.log(filtro);

        $.each(filtro, (i, e) => {
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img).replace(/\${name}/g, e.name).replace(/\${preco}/g, e.price)

            $("#itensCardapio").append(temp)
        })

    },
}

cardapio.templates = {

    item: `
        <div class="col-3 mb-5">
            <div class="card card-item">
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
                        <span class="btn-menos"><i class="fas fa-minus"></i></span>
                        <span class="add-numero-itens">0</span>
                        <span class="btn-mais"><i class="fas fa-plus"></i></span>
                        <span class="btn btn-add"><i class="fas fa-shopping-bag"></i></span>
                    </div>
            </div>
        </div>
    
    `

}