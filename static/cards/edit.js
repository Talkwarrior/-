let backgroundImg = null;

document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('option-text').addEventListener('keyup', updateCanvas)
    document.getElementById('option-text').addEventListener('keydown', updateCanvas)
    document.getElementById('option-fontSize').addEventListener('change', updateCanvas)
    document.getElementById('option-font').addEventListener('change', updateCanvas)
    document.getElementById('option-file').addEventListener('change', (event)=>{
        const canvas = document.querySelector('canvas')
        const fileInput = document.getElementById('option-file');

        let file = fileInput.files[0];
        let reader = new FileReader();
        reader.onload = ()=> {
            backgroundImg = new Image()
            backgroundImg.src = reader.result
            backgroundImg.onload = () => {
                canvas.style.backgroundImage = `url(${reader.result})`;
                updateCanvas()
            }
        }

        if (file) {
            reader.readAsDataURL(file);
        }
    })

    document.getElementById('option-background').addEventListener('change', loadBackgroundImg);

    document.getElementById('save-button').addEventListener('click', downloadImage)
    document.getElementById('share-button').addEventListener('click', shareImage)

    updateCanvas()
})

function loadBackgroundImg() {
    const canvas = document.querySelector('canvas')
    const select = document.getElementById('option-background');
    const fileInput = document.getElementById('option-file');

    if (select.value === 'Custom') {
        fileInput.disabled = false

    } else{
        fileInput.disabled = true
    }

    if (select.value === 'Custom') {
        
    } else { 
        backgroundImg = new Image()
        backgroundImg.src = `static/cards/images/${select.value}.png`
        backgroundImg.onload = () => {
            canvas.style.backgroundImage = `url(${backgroundImg.src})`;
        }
    }

    updateCanvas()
}

function updateCanvas() {
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // init state
    if (backgroundImg === null) {
        loadBackgroundImg()
    }

    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height)

    renderText()
}

function renderText() {
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    const textarea = document.getElementById('option-text')
    
    const fontSize = document.getElementById('option-fontSize').value;
    const fontFamily = document.getElementById('option-font').value;

    ctx.font = `${fontSize}px ${fontFamily}`
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';

    x = 60
    y = canvas.height / 2
    const lines = textarea.value.split('\n')

    lines.forEach((line, index) => {
        ctx.lineWidth = 2;
        ctx.strokeText(line, x, canvas.height -fontSize*(lines.length - index)*1.5);

        ctx.fillStyle = 'black';
        ctx.fillText(line, x, canvas.height -fontSize*(lines.length - index)*1.5);
    });
}

function downloadImage() {
    const canvas = document.querySelector('canvas')
    const title = document.getElementById('option-title').value
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `${title}.png`
    document.body.appendChild(a)
    a.click();
    a.remove();
}

function shareImage() {
    const formData = new FormData();

    const canvas = document.querySelector('canvas')
    const title = document.getElementById('option-title').value
    const csrf_token = document.querySelector("input[name='csrfmiddlewaretoken']").value

    formData.append('title', title)
    formData.append('csrfmiddlewaretoken', csrf_token)
    formData.append('file', canvas.toDataURL('image/png'))

    fetch('./share', {
        method: 'POST',
        body: formData
    }).then((response)=>{
        return response.json()
    }).then((response)=> {
        if (response.msg==='success') {
            alert(`업로드되었습니다! 링크는 http://${response.card_url}입니다.`)
            appendURLItem(title, response.card_url)
        } else {
            alert(`업로드 실패;; ${response.error}`)
        }
    })
}

function appendURLItem(title, url) {
    const list = document.getElementById('url-list');
    const newItem = document.createElement('div')
    
    newItem.classList.add('url-item')
    newItem.innerHTML = `${list.childElementCount+1}) ${title} 공유 성공: <a href="http://${url}">http://${url}</a>`
    list.appendChild(newItem)
}