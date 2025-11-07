// Store user responses
const responses = {};
let totalQuestions = 0;
let answeredQuestions = 0;

// Initialize the form
function initializeForm() {
    const allButtons = document.querySelectorAll('.btn-option');
    totalQuestions = new Set(Array.from(allButtons).map(btn => btn.dataset.question)).size;
    
    allButtons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });
    
    // Initialize displays
    updateProgressBar();
    updateScoreDisplay();
}

// Handle button clicks
function handleButtonClick(e) {
    const button = e.target;
    const questionId = button.dataset.question;
    const value = button.dataset.value;
    
    // Get all buttons for this question
    const questionButtons = document.querySelectorAll(`[data-question="${questionId}"]`);
    
    // Remove selection from all buttons in this question
    questionButtons.forEach(btn => {
        btn.classList.remove('selected-yes', 'selected-no');
    });
    
    // Add selection to clicked button
    if (value === 'sim') {
        button.classList.add('selected-yes');
        responses[questionId] = 100; // "Sim" para boas práticas = 100%
    } else {
        button.classList.add('selected-no');
        responses[questionId] = 0; // "Não" = 0%
    }
    
    // Update answered questions count
    answeredQuestions = Object.keys(responses).length;
    
    // Update progress and score displays
    updateProgressBar();
    updateScoreDisplay();
    
    // Update score status message
    updateScoreStatus();
}

// Update the progress and score displays
function updateProgressBar() {
    const progress = (answeredQuestions / totalQuestions) * 100;
    
    // Update circular progress
    const circle = document.querySelector('.progress-ring-circle');
    if (circle) {
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDashoffset = circumference - (progress / 100) * circumference;
    }
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
        if (progress === 100) {
            progressFill.classList.add('progress-complete');
        } else {
            progressFill.classList.remove('progress-complete');
        }
    }
    
    // Update progress text
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = Math.round(progress) + '%';
    }
    
    // Update questions count
    const questionsCount = document.querySelector('.questions-count');
    if (questionsCount) {
        questionsCount.textContent = `${answeredQuestions}/${totalQuestions} questões respondidas`;
    }
}

// Update score display
function updateScoreDisplay() {
    // Calculate score
    const scores = Object.values(responses);
    if (scores.length === 0) return;
    
    const totalScore = scores.reduce((sum, val) => sum + val, 0);
    const averageScore = Math.round(totalScore / scores.length);
    
    // Update all score displays and circles in the document
    document.querySelectorAll('#scoreValue, .score-value').forEach(element => {
        if (element) {
            element.textContent = averageScore;
        }
    });
    
    // Update all score circles
    document.querySelectorAll('#scoreCircle, .score-progress').forEach(circle => {
        if (circle && circle.getBoundingClientRect().width > 0) {  // Verifica se o elemento está renderizado
            try {
                const circumference = 565.48;  // 2 * π * 90 (raio do círculo definido no SVG)
                const offset = circumference - (averageScore / 100) * circumference;
                circle.style.strokeDashoffset = offset;
                
                // Update color based on score
                if (averageScore >= 80) {
                    circle.style.stroke = '#10b981'; // Green
                } else if (averageScore >= 40) {
                    circle.style.stroke = '#f59e0b'; // Yellow
                } else {
                    circle.style.stroke = '#ef4444'; // Red
                }
            } catch (error) {
                console.warn('Circle not ready for animation yet');
            }
        }
    });
    
    // Update score title
    const scoreTitle = document.getElementById('scoreTitle');
    if (scoreTitle) {
        scoreTitle.textContent = 'Sua pontuação';
    }
    
    // Update status message
    updateScoreStatus(averageScore);
}

// Update score status message
function updateScoreStatus(score) {
    const statusElement = document.querySelector('.score-status');
    if (!statusElement) return;
    
    if (score >= 90) {
        statusElement.textContent = 'Excelente! Sua infraestrutura está muito bem gerenciada.';
        statusElement.className = 'score-status excellent';
    } else if (score >= 70) {
        statusElement.textContent = 'Bom! Mas ainda há espaço para melhorias.';
        statusElement.className = 'score-status good';
    } else if (score >= 50) {
        statusElement.textContent = 'Regular. Considere implementar mais boas práticas.';
        statusElement.className = 'score-status regular';
    } else {
        statusElement.textContent = 'Atenção! É importante revisar suas práticas de infraestrutura.';
        statusElement.className = 'score-status attention';
    }
}

// Add click event listeners to all buttons
document.querySelectorAll('.btn-option').forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

// Calculate and show final results
function calculateResults() {
    if (answeredQuestions < totalQuestions) {
        alert(`Por favor, responda todas as perguntas. Você respondeu ${answeredQuestions} de ${totalQuestions}.`);
        return;
    }
    
    // Calculate final score
    const totalScore = Object.values(responses).reduce((sum, val) => sum + val, 0);
    const finalScore = Math.round(totalScore / totalQuestions);
    
    // Determine status
    let status, statusColor, statusIcon, statusMessage;
    
    if (finalScore >= 80) {
        status = 'Está bom';
        statusColor = '#10b981';
        statusIcon = '🟢';
        statusMessage = 'Excelente! Sua infraestrutura de TI está bem estruturada. Continue mantendo as boas práticas. Além disso, contamos com uma equipe de TI altamente competente, sempre disponível para apoiar quando necessário.';
    } else if (finalScore >= 40) {
        status = 'Pontos a melhorar';
        statusColor = '#f59e0b';
        statusIcon = '🟡';
        statusMessage = 'Atenção! Há oportunidades significativas de melhoria na sua infraestrutura de TI.';
    } else {
        status = 'Situação crítica';
        statusColor = '#ef4444';
        statusIcon = '🔴';
        statusMessage = 'Alerta! Sua infraestrutura de TI requer atenção imediata. É fundamental implementar melhorias urgentes.';
    }
    
    // Show results modal
    showResultsModal(finalScore, status, statusIcon, statusMessage);
}

// Show results in a modal
function showResultsModal(score, status, icon, message) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 60px 40px;
        border-radius: 16px;
        max-width: 600px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.4s ease;
    `;
    
    modalContent.innerHTML = `
        <div style="font-size: 5rem; margin-bottom: 20px;">${icon}</div>
        <h2 style="color: #5b21b6; font-size: 2.5rem; margin-bottom: 10px;">Resultado</h2>
        <div style="font-size: 4rem; font-weight: 800; color: #7c3aed; margin: 20px 0;">${score}%</div>
        <h3 style="color: #7c3aed; font-size: 1.8rem; margin-bottom: 15px;">${status}</h3>
        <p style="color: #6b7280; font-size: 1.125rem; line-height: 1.7; margin-bottom: 30px;">${message}</p>
        <div style="display: flex; gap: 15px; justify-content: center;">
            <a href="https://api.whatsapp.com/send?phone=5511991387121&text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20um%20especialista" target="_blank" style="
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: white;
                color: #7c3aed;
                border: 2px solid #7c3aed;
                padding: 14px 32px;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                text-decoration: none;
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
                transition: all 0.3s ease;
            ">
                <svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.051 21.785h-.004A9.937 9.937 0 017.016 20.41l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar especialistas
            </a>
            <button onclick="closeModal()" style="
                background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
                color: white;
                border: none;
                padding: 14px 32px;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 8px 24px rgba(124, 58, 237, 0.3);
                transition: all 0.3s ease;
            ">Fechar</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Store modal reference
    window.currentModal = modal;
}

// Close modal
function closeModal() {
    if (window.currentModal) {
        window.currentModal.remove();
        window.currentModal = null;
    }
}

// Scroll to assessment section
function scrollToAssessment() {
    const assessmentSection = document.getElementById('assessmentSection');
    assessmentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Toggle how it works section
function toggleHowItWorks() {
    const howItWorks = document.getElementById('howItWorks');
    howItWorks.classList.toggle('hidden');
    
    if (!howItWorks.classList.contains('hidden')) {
        howItWorks.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o formulário
    initializeForm();

    // Adiciona a classe grid-four para grids com exatamente 4 perguntas
    document.querySelectorAll('.questions-grid').forEach(grid => {
        const questions = grid.querySelectorAll('.question-card');
        if (questions.length === 4) {
            grid.classList.add('grid-four');
        }
    });
});