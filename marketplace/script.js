let inputSearch = document.querySelector('#searchInput');
const iconSearch = document.querySelector('#searchIcon');
const iconClear = document.querySelector('#clearSearch');

inputSearch.addEventListener('input', inputVerification)
inputSearch.addEventListener('keydown', function(event){
    if(event.key === 'Enter' && inputSearch.value.trim() != ''){
        window.location.href = `http://localhost/marketplace/pesquisa/?pesquisa=${inputSearch.value}`;
    }
})

function inputVerification(){
    if(inputSearch.value.trim() != ""){
        iconClear.style.display = "block";
        iconClear.addEventListener('click', clearSearchInput);
        iconSearch.style.display = "none";
    }else{
        iconClear.style.display = "none";
        iconSearch.style.display = "block";
    }
    inputSearch.focus();
}

function clearSearchInput(){
    inputSearch.value = "";
    inputVerification();
}

iconSearch.addEventListener('click', function(){
    inputSearch.focus();
})

const openCart = document.querySelector('#carrinhoIcon');
const cartBox = document.querySelector('#cartBox');
const closeBtn = document.querySelectorAll('.closeBtn');
const accountBox = document.querySelector('#accountBox');
const openAccount = document.querySelector('#loginBtn');

function openBox(box){
    box.classList.remove('hidden');
    box.classList.add('open');

    box.addEventListener('click', (event) => {
        if(event.target === box){
            closeBox(box);
        }
    })

    closeBtn.forEach((btn) => {
        btn.addEventListener('click', function(){closeBox(box)});
    })
}

function closeBox(box){
    box.classList.remove('open');
    box.classList.add('hidden');
}

if(openAccount){
    openAccount.addEventListener('click', function(){openBox(accountBox)});
}

if(openCart){
    openCart.addEventListener('click', function(){openBox(cartBox)});
}

//carrinho
const moreBtn = document.querySelectorAll('.moreBtn');
const lessBtn = document.querySelectorAll('.lessBtn');
const qntDisplay = document.querySelectorAll('.qntDisplay');
const id_produto = document.querySelectorAll('.idProduto');
const id_usuario = document.querySelector('#idUsuario');
const totalDisplay = document.querySelector('#totalCart');
const valorProduto = document.querySelectorAll('.precoItemCart');
const itens = document.querySelectorAll('.cartIten');


if(more){  
    moreBtn.forEach((btn, index) => {
        btn.addEventListener('click', function(){
            more(qntDisplay[index], index);
        })
    })  
}

if(less){      
    lessBtn.forEach((btn, index) => {
        btn.addEventListener('click', function(){
            less(qntDisplay[index], index);
        });
    })
}

//if(id_produto){
    function more(display, index){
        let qnt = Number(display.textContent);
        if(qnt < 100){
            fetch(`./carrinho/controleCarrinho.php?id_usuario=${id_usuario.value}&id_produto=${id_produto[index].value}&comando=${'more'}`)
            .then(response => response.json())
            .then(data => {
                if(data.status == 'sucesso'){
                    display.textContent = qnt + 1;
                    calcularCarrinho('more', index);
                }
            })
            .catch(error => console.log('error', error))
        }
    }
    
    function less(display, index){
        let qnt = Number(display.textContent);
        if(qnt > 1){
            fetch(`./carrinho/controleCarrinho.php?id_usuario=${id_usuario.value}&id_produto=${id_produto[index].value}&comando=${'less'}`)
            .then(response => response.json())
            .then(data => {
                if(data.status == 'sucesso'){
                    display.textContent = qnt - 1;
                    calcularCarrinho('less', index);
                }
            })
            .catch(error => console.log('error', error))
        }
    }

    const deleteBtn = document.querySelectorAll('.itemRemoveBtn');

    deleteBtn.forEach((btn, index) => {
        btn.addEventListener('click', function(){  
            fetch(`./carrinho/deletarCarrinho.php?id_produto=${id_produto[index].value}&id_usuario=${id_usuario.value}`)
            .then(response => response.json())
            .then(data => {
                itens[index].classList.add('hidden');

                setTimeout(() => {
                    itens[index].style.display = 'none';
                }, 400)

                setTimeout(() => {
                    verificarCarrinho();
                }, 400)

                calcularCarrinho('delete', index);
            })
        })
    })
//}

function calcularCarrinho(calc, i){
    let totalItem = 0;
    
    if(itens[i].style.display !== 'none'){
        const precoItem = Number(itens[i].querySelector('.precoItemCart').textContent.replace('R$', '').replace(',', '.'));
        const qntItem = Number(itens[i].querySelector('.qntDisplay').textContent);
        
        total = Number(totalDisplay.textContent.replace('R$', '').replace(',','.'));
        totalItem = precoItem * qntItem;

        switch(calc){
            case 'more':
                total += precoItem;
                break;
            case 'less':
                total -= precoItem;
                break;
            case 'delete': 
                console.log('deletado');
                total -= totalItem;
                break;
            default:  return;
        }
    }

    total = total.toFixed(2);

    totalDisplay.textContent = 'R$'+total.replace('.',',');
}

let deletados = [];

function verificarCarrinho(){
    itens.forEach(iten => {
        if(window.getComputedStyle(iten).display == 'none'){
            deletados.push(iten);
        }

        console.log('tamanho do array '+deletados.length, 'tamanhos de itens ' + itens.length);

        if(deletados.length == itens.length){
            document.querySelector('#emptyCart').style.display = 'flex';
            document.querySelector('#buyBox').style.display = 'none';
        }
    })
}

if(deletados.length == itens.length){
    const emptyCart = document.querySelector('#emptyCart'); 
    if(emptyCart){
        emptyCart.style.display = 'flex';
    }
}

//carousel
const carousel = document.querySelector('.carousel');

if(carousel){
    const slides = document.querySelectorAll('.slide');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const indicators = document.querySelectorAll('.indicators input');

let index = 0;
const totalSlides = slides.length;
let autoSlideInterval;

// Atualiza a posição do carrossel
function updateCarousel() {
    carousel.style.transform = `translateX(-${index * 100}vw)`;
    indicators[index].checked = true;
}

// Avança para o próximo slide
function nextSlide() {
    index = (index + 1) % totalSlides;
    updateCarousel();
}

// Volta para o slide anterior
function prevSlide() {
    index = (index - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

// Inicia o carrossel automático
function startAutoSlide() {
    stopAutoSlide(); // Para evitar múltiplos intervalos
    autoSlideInterval = setInterval(nextSlide, 4000);
}

// Para o carrossel automático
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Eventos dos botões
nextButton.addEventListener('click', () => {
    nextSlide();
    startAutoSlide(); // Reinicia o temporizador
});

prevButton.addEventListener('click', () => {
    prevSlide();
    startAutoSlide(); // Reinicia o temporizador
});

// Eventos dos indicadores
indicators.forEach((indicator, i) => {
    indicator.addEventListener('click', () => {
        // index = i;
        updateCarousel();
        startAutoSlide(); // Reinicia o temporizador
    });
});

// Inicia o carrossel automaticamente ao carregar a página
startAutoSlide();
}


//carousel produtos
const carouselTrack = document.querySelectorAll(".carousel-track");
const prevBtn = document.querySelectorAll(".prev-btn");
const nextBtn = document.querySelectorAll(".next-btn");

const cardWidth = 220 + 30; // Largura do card + gap
const visibleCards = 3;
const scrollAmount = cardWidth * visibleCards;


carouselTrack.forEach((item, index) => {
    if(item.clientWidth === item.scrollWidth){
        prevBtn[index].style.display = 'none';
        nextBtn[index].style.display = 'none';
    }
})

nextBtn.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        carouselTrack[index].scrollBy({ left: scrollAmount, behavior: "smooth" });
    
        if((carouselTrack[index].scrollLeft + carouselTrack[index].clientWidth) > (carouselTrack[index].scrollWidth - 800)){
            btn.style.display = "none";
        }
    
        prevBtn[index].style.display = "block";

    });
})

prevBtn.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        carouselTrack[index].scrollBy({ left: -scrollAmount, behavior: "smooth" });

        if((carouselTrack[index].scrollLeft - 800) <= 0 ){
            btn.style.display = "none";
        }
    
        nextBtn[index].style.display = "block";
    });
})

