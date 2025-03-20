const banner = document.querySelector('#banner');
const bannerInput = document.querySelector('#bannerInput');

const userImg = document.querySelector('#userImg');
const userInput = document.querySelector('#userImgInput');

openFile(banner, bannerInput);
openFile(userImg, userInput);

function openFile(div, input){
    div.addEventListener('click', function(){
        input.click();
    })
} 

function alterarImg(event, input) {
    const reader = new FileReader();
    reader.onload = function(){
        const output = document.querySelector('#'+input)
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

const apresentacao = document.querySelector('#apresentacaoText');
apresentacao.style.height = "auto";
apresentacao.style.height = (apresentacao.scrollHeight)+'px';

apresentacao.addEventListener('input', () => {
    apresentacao.style.height = (apresentacao.scrollHeight)+'px';
})

const nome = document.querySelector('#userNameInput');

nome.addEventListener('input', () => {
    let newName = nome.value;
    const nomeApresentacao = document.querySelector('#nomeApresentacao');

    nomeApresentacao.textContent = newName; 
})

document.querySelector('#salvarBtn').addEventListener('click', () => {
    form = new FormData();

    const fimDeSemana = document.querySelector('#fimDeSemana');
    const abertura = document.querySelector('#horaAbertura');
    const fechamento = document.querySelector('#horaFechamento');
    const telContato = document.querySelector('#telContato');
    const banner = document.querySelector('#bannerInput');

    form.append('nome', nome.value);
    form.append('apresentacao', apresentacao.value);
    form.append('abertura', abertura.value);
    form.append('fechamento', fechamento.value);
    form.append('fimDeSemana', fimDeSemana.value);
    form.append('telContato', telContato.value);

    if(banner.files.length > 0){
        form.append('banner', banner.files[0]);
    }

    if(userInput.files.length > 0){
        form.append('fotoPerfil', userInput.files[0]);
    }
    
    fetch('editar.php', {
        method: 'POST',
        body: form
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.status);
    })
    //catch(error => console.log('erro', error));
})
