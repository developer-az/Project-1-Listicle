// Detail page JavaScript for individual innovation views

class InnovationDetailPage {
    constructor() {
        this.innovationId = this.getInnovationIdFromUrl();
        this.init();
    }

    getInnovationIdFromUrl() {
        const pathParts = window.location.pathname.split('/');
        return parseInt(pathParts[pathParts.length - 1]);
    }

    async init() {
        if (!this.innovationId || isNaN(this.innovationId)) {
            this.showError();
            return;
        }

        await this.loadInnovationDetails();
    }

    async loadInnovationDetails() {
        try {
            const response = await fetch(`/api/innovations/${this.innovationId}`);
            
            if (!response.ok) {
                throw new Error('Innovation not found');
            }
            
            const innovation = await response.json();
            this.displayInnovation(innovation);
            this.hideLoading();
        } catch (error) {
            console.error('Error loading innovation details:', error);
            this.showError();
        }
    }

    displayInnovation(innovation) {
        const detailsContainer = document.getElementById('innovationDetails');
        const loadingMessage = document.getElementById('loadingMessage');
        
        // Update page title
        document.title = `${innovation.title} - Tech Innovations`;
        
        detailsContainer.innerHTML = `
            <header class="hero" style="text-align: center; padding: 2rem 0; margin-bottom: 2rem;">
                <h1 style="color: var(--primary-color); margin-bottom: 1rem;">${innovation.title}</h1>
                <div class="innovation-meta" style="justify-content: center; margin-bottom: 1rem;">
                    <span><strong>🏢 ${innovation.company}</strong></span>
                    <span><strong>📂 ${innovation.category}</strong></span>
                    <span><strong>📅 ${innovation.year}</strong></span>
                </div>
                <div class="innovation-rating" style="justify-content: center; font-size: 1.1rem;">
                    ⭐ ${innovation.rating}/10
                </div>
                ${innovation.featured ? '<div class="featured-indicator">🌟 Featured Innovation</div>' : ''}
            </header>

            <div class="innovation-content" style="max-width: 800px; margin: 0 auto;">
                <section class="modal-info-section">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">📝 Description</h3>
                    <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-color);">
                        ${innovation.description}
                    </p>
                </section>
                
                <section class="modal-info-section">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">🎯 Impact</h3>
                    <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-color);">
                        ${innovation.impact}
                    </p>
                </section>
                
                <section class="modal-info-section">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">🏷️ Tags</h3>
                    <div class="modal-tags">
                        ${innovation.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('')}
                    </div>
                </section>
                
                <div class="modal-actions" style="margin-top: 3rem;">
                    <a href="/" class="btn-primary">🏠 Back to Home</a>
                    <button onclick="shareInnovation()" class="btn-secondary">📤 Share</button>
                    ${innovation.featured ? '<a href="/#featured" class="btn-info">⭐ View Featured</a>' : ''}
                </div>
            </div>
        `;
        
        detailsContainer.style.display = 'block';
        loadingMessage.style.display = 'none';
    }

    hideLoading() {
        const loadingMessage = document.getElementById('loadingMessage');
        loadingMessage.style.display = 'none';
    }

    showError() {
        const loadingMessage = document.getElementById('loadingMessage');
        const errorMessage = document.getElementById('errorMessage');
        
        loadingMessage.style.display = 'none';
        errorMessage.style.display = 'block';
    }
}

// Global functions
function shareInnovation() {
    if (navigator.share) {
        navigator.share({
            title: 'Tech Innovations',
            text: 'Check out this amazing tech innovation!',
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showMessage('📋 Link copied to clipboard!', 'success');
        });
    }
}

function showMessage(text, type = 'info') {
    // Create a simple message element
    const message = document.createElement('div');
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--info-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        box-shadow: var(--shadow);
        z-index: 1000;
        font-weight: 500;
    `;
    
    document.body.appendChild(message);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 3000);
}

// Initialize the detail page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InnovationDetailPage();
});
