// Data do casamento
const weddingDate = new Date("Oct 17, 2026 16:30:00").getTime();

// Função auxiliar para atualizar e animar
function updateTime(elementId, newValue) {
    const element = document.getElementById(elementId);
    
    // Formata para ter sempre 2 dígitos (ex: 05, 09)
    const formattedValue = newValue < 10 ? "0" + newValue : newValue;

    // Só atualiza se o número mudou (evita piscar a tela à toa)
    if (element.innerText !== formattedValue.toString()) {
        element.innerText = formattedValue;
        
        // --- LÓGICA DA ANIMAÇÃO ---
        // 1. Remove a classe se ela já existir
        element.classList.remove("animate-change");
        
        // 2. Força o navegador a reconhecer que removemos (Reflow)
        void element.offsetWidth;
        
        // 3. Adiciona a classe de novo para tocar a animação
        element.classList.add("animate-change");
    }
}

const countdown = setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    // Cálculos
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000); // Novo cálculo

    // Atualiza cada elemento individualmente com animação
    updateTime("days", days);
    updateTime("hours", hours);
    updateTime("minutes", minutes);
    updateTime("seconds", seconds); // Atualiza segundos

    // Quando acabar
    if (distance < 0) {
        clearInterval(countdown);
        document.getElementById("countdown").innerHTML = "<div class='leaf-content' style='width:100%'>❤️ O GRANDE DIA CHEGOU! ❤️</div>";
    }
}, 1000);
/* =========================================
   CHUVA DE PÉTALAS (Só no Header)
   ========================================= */
function createPetal() {
    // 1. Pega o container do Header
    const header = document.querySelector('.hero-card');
    
    // Se não achar o header, para tudo (segurança)
    if (!header) return;

    const petal = document.createElement('div');
    petal.classList.add('petal');

    // 2. Posição horizontal (0 a 100% da largura do header)
    petal.style.left = Math.random() * 100 + '%';

    // 3. Tamanho e Variação
    const size = Math.random() * 10 + 10;
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';

    // 4. Duração da queda
    const duration = Math.random() * 5 + 10; 
    petal.style.animationDuration = duration + 's';

    // 5. IMPORTANTE: Adiciona a pétala DENTRO do Header, não no body
    header.appendChild(petal);

    // Remove depois que cai
    setTimeout(() => {
        petal.remove();
    }, (duration + 1) * 1000); 
}

// Inicia a chuva
setInterval(createPetal, 1000);

document.addEventListener('DOMContentLoaded', () => {
    const dog = document.getElementById('the-dog');
    const scene = document.getElementById('dog-scene');
    const historySection = document.querySelector('.history-section');

    if (!dog || !scene || !historySection) return;

    let hasWalked = false;

    // Inicia a animação
    function startDogAnimation() {
        if (hasWalked) return;
        hasWalked = true;
        
        // AQUI MUDOU: Só adicionamos 'start-walking'. 
        // Não adicionamos 'bobbing' porque seu GIF já se mexe.
        dog.classList.add('start-walking'); 

        // Rastro de patas
        const pawInterval = setInterval(() => {
            const dogRect = dog.getBoundingClientRect();
            
            // Só cria pata se estiver na tela
            if (dogRect.left > 0 && dogRect.left < window.innerWidth) {
                createPawPrint(dogRect.left);
            }

            if (dogRect.left > window.innerWidth) {
                clearInterval(pawInterval);
            }
        }, 300); // Ajuste esse 300 para o ritmo das patas
    }

    function createPawPrint(x) {
        const paw = document.createElement('div');
        paw.innerText = '🐾';
        paw.classList.add('paw-print');
        
        const sceneRect = scene.getBoundingClientRect();
        // Ajuste o + 40 para a pata sair de trás do cachorro, não da frente
        paw.style.left = (x - sceneRect.left + 40) + 'px'; 
        paw.style.bottom = '15px';

        scene.appendChild(paw);
        setTimeout(() => { paw.remove(); }, 3000);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startDogAnimation();
            }
        });
    }, { threshold: 0.2 });

    observer.observe(historySection);
});

/* =========================================
   ANIMAÇÃO DA LINHA DO TEMPO (SCROLL)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    const observerOptions = {
        threshold: 0.5 // Dispara quando 50% do item estiver visível
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            // Se o item apareceu na tela...
            if (entry.isIntersecting) {
                // Adiciona a classe que revela o texto
                entry.target.classList.add('show-content');
                
                // (Opcional) Para de observar depois que mostrou uma vez
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Manda vigiar todos os itens da timeline
    const hiddenItems = document.querySelectorAll('.hidden-item');
    hiddenItems.forEach((el) => observer.observe(el));
});

/* =========================================
   FUNÇÃO DE COPIAR PIX
   ========================================= */
function copyPix(event, pixKey) {
    // 1. Impede que o cartão gire de volta ao clicar no botão
    event.stopPropagation();

    // 2. Copia para a área de transferência
    navigator.clipboard.writeText(pixKey).then(() => {
        // 3. Feedback visual (muda o texto do botão)
        const btn = event.target;
        const originalText = btn.innerText;
        
        btn.innerText = "Copiado! ✨";
        btn.style.backgroundColor = "#4CAF50"; // Fica verde
        
        // Volta ao normal depois de 2 segundos
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = ""; // Volta a cor original (var(--accent))
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
        alert("Não foi possível copiar automaticamente. A chave é: " + pixKey);
    });
}

/* =========================================
   SCROLL "CÂMERA LENTA" (EFEITO SUAVE)
   ========================================= */
function slowScroll(targetId, duration) {
    const target = document.getElementById(targetId);
    
    if (!target) {
        console.warn("Alvo não encontrado: " + targetId);
        return;
    }

    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        
        // Essa fórmula mágica faz o movimento ser suave (easeInOut)
        const run = ease(timeElapsed, startPosition, distance, duration);
        
        window.scrollTo(0, run);

        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Função de suavização (Começa lento, acelera, termina lento)
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}
/* =========================================
   EASTER EGG DO CACHORRO 🐶 (VERSÃO CORRIGIDA)
   ========================================= */
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Procura o container do cachorro
    const dogContainer = document.getElementById('dog-container');
    
    // 2. Procura TODOS os elementos com a classe heart-beat
    const hearts = document.querySelectorAll('.heart-beat');

    if (!dogContainer) {
        console.error("ERRO: Não achei a div do cachorro no HTML!");
        return;
    }

    if (hearts.length === 0) {
        console.error("ERRO: Não achei nenhum coração (.heart-beat) no HTML!");
        return;
    }

    // 3. Adiciona o clique em cada coração encontrado
    hearts.forEach(heart => {
        // Força o cursor a virar mãozinha
        heart.style.cursor = "pointer";
        // Aumenta a área de clique (opcional, ajuda no celular)
        heart.style.padding = "10px"; 

        heart.addEventListener('click', function(e) {
            console.log("Clicou no coração! Soltando o cachorro..."); // Isso aparece no Console (F12)
            
            // Se já estiver correndo, não faz nada
            if (dogContainer.classList.contains('dog-run-animation')) return;

            // Adiciona a classe que move ele
            dogContainer.classList.add('dog-run-animation');

            // Remove depois de 4s para poder clicar de novo
            setTimeout(() => {
                dogContainer.classList.remove('dog-run-animation');
            }, 15000);
        });
    });
});