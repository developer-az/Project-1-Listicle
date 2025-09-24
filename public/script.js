// Tech Innovations Listicle - JavaScript

class TechInnovationsApp {
    constructor() {
        this.innovations = [];
        this.filteredInnovations = [];
        this.currentFilter = '';
        this.currentSort = 'rating';
        this.init();
    }

    async init() {
        await this.loadInnovations();
        this.setupEventListeners();
        this.renderFeaturedInnovations();
        this.renderAllInnovations();
        this.hideLoading();
    }

    async loadInnovations() {
        try {
            const response = await fetch('/api/innovations');
            this.innovations = await response.json();
            this.filteredInnovations = [...this.innovations];
            console.log(`Loaded ${this.innovations.length} innovations`);
        } catch (error) {
            console.error('Error loading innovations:', error);
            this.showError('Failed to load innovations. Please refresh the page.');
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        categoryFilter.addEventListener('change', (e) => {
            this.handleCategoryFilter(e.target.value);
        });

        // Sort functionality
        const sortFilter = document.getElementById('sortFilter');
        sortFilter.addEventListener('change', (e) => {
            this.handleSort(e.target.value);
        });

        // Navigation smooth scrolling is now handled by button onclick events
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (searchTerm === '') {
            this.filteredInnovations = [...this.innovations];
        } else {
            this.filteredInnovations = this.innovations.filter(innovation => 
                innovation.title.toLowerCase().includes(searchTerm) ||
                innovation.description.toLowerCase().includes(searchTerm) ||
                innovation.company.toLowerCase().includes(searchTerm) ||
                innovation.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        this.applyFilters();
    }

    handleCategoryFilter(category) {
        this.currentFilter = category;
        this.applyFilters();
    }

    handleSort(sortBy) {
        this.currentSort = sortBy;
        this.applySorting();
    }

    applyFilters() {
        let filtered = [...this.innovations];

        // Apply category filter
        if (this.currentFilter) {
            filtered = filtered.filter(innovation => 
                innovation.category === this.currentFilter
            );
        }

        // Apply search filter
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        if (searchTerm) {
            filtered = filtered.filter(innovation => 
                innovation.title.toLowerCase().includes(searchTerm) ||
                innovation.description.toLowerCase().includes(searchTerm) ||
                innovation.company.toLowerCase().includes(searchTerm) ||
                innovation.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        this.filteredInnovations = filtered;
        this.applySorting();
    }

    applySorting() {
        this.filteredInnovations.sort((a, b) => {
            switch (this.currentSort) {
                case 'rating':
                    return b.rating - a.rating;
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'year':
                    return b.year - a.year;
                case 'company':
                    return a.company.localeCompare(b.company);
                default:
                    return b.rating - a.rating;
            }
        });
        
        this.renderAllInnovations();
    }

    renderFeaturedInnovations() {
        const featuredGrid = document.getElementById('featuredGrid');
        const featuredInnovations = this.innovations.filter(innovation => innovation.featured);
        
        featuredGrid.innerHTML = featuredInnovations.map(innovation => `
            <div class="featured-card fade-in-up" onclick="app.openInnovationDetail(${innovation.id})">
                <h3>${innovation.title}</h3>
                <p>${innovation.description}</p>
                <div class="innovation-meta">
                    <span>${innovation.company}</span>
                    <span>${innovation.category}</span>
                </div>
                <div class="rating">
                    ⭐ ${innovation.rating}/10
                </div>
            </div>
        `).join('');
    }

    renderAllInnovations() {
        const innovationsList = document.getElementById('innovationsList');
        
        if (this.filteredInnovations.length === 0) {
            innovationsList.innerHTML = `
                <div class="loading">
                    <p>No innovations found matching your criteria.</p>
                </div>
            `;
            return;
        }

        innovationsList.innerHTML = this.filteredInnovations.map((innovation, index) => `
            <div class="innovation-card fade-in-up ${innovation.featured ? 'featured' : ''}" 
                 style="animation-delay: ${index * 0.1}s"
                 onclick="app.openInnovationDetail(${innovation.id})">
                <div class="innovation-header">
                    <h3 class="innovation-title">${innovation.title}</h3>
                    <div class="innovation-rating">
                        ⭐ ${innovation.rating}/10
                    </div>
                </div>
                <div class="innovation-meta">
                    <span><strong>Company:</strong> ${innovation.company}</span>
                    <span><strong>Category:</strong> ${innovation.category}</span>
                    <span><strong>Year:</strong> ${innovation.year}</span>
                </div>
                <p class="innovation-description">${innovation.description}</p>
                <div class="innovation-tags">
                    ${innovation.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    openInnovationDetail(innovationId) {
        // Navigate to the unique endpoint for this innovation
        window.location.href = `/innovations/${innovationId}`;
    }


    hideLoading() {
        const loadingMessage = document.getElementById('loadingMessage');
        loadingMessage.style.display = 'none';
    }

    showError(message) {
        const innovationsList = document.getElementById('innovationsList');
        innovationsList.innerHTML = `
            <div class="loading">
                <p style="color: #dc2626;">❌ ${message}</p>
            </div>
        `;
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Global functions for navigation

function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
}

function clearFilters() {
    // Clear search input
    document.getElementById('searchInput').value = '';
    
    // Reset category filter
    document.getElementById('categoryFilter').value = '';
    
    // Reset sort filter
    document.getElementById('sortFilter').value = 'rating';
    
    // Reset app filters
    if (window.app) {
        window.app.currentFilter = '';
        window.app.currentSort = 'rating';
        window.app.filteredInnovations = [...window.app.innovations];
        window.app.renderAllInnovations();
    }
    
    // Show success message
    showMessage('✅ Filters cleared!', 'success');
}

function showAllFeatured() {
    if (window.app) {
        const featuredOnly = window.app.innovations.filter(innovation => innovation.featured);
        window.app.filteredInnovations = featuredOnly;
        window.app.renderAllInnovations();
        showMessage('⭐ Showing featured innovations only!', 'info');
    }
}

function shareInnovation() {
    if (navigator.share) {
        navigator.share({
            title: 'Tech Innovations 2024',
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

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TechInnovationsApp();
});

// Simple interactions
document.addEventListener('DOMContentLoaded', () => {
    // Simple hover effect for hero
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mouseenter', () => {
            hero.style.transform = 'translateY(-2px)';
        });
        
        hero.addEventListener('mouseleave', () => {
            hero.style.transform = 'translateY(0)';
        });
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Add any keyboard shortcuts here if needed
});

// Simple mobile support
document.addEventListener('DOMContentLoaded', () => {
    // Add simple touch feedback
    document.querySelectorAll('.innovation-card, .featured-card').forEach(card => {
        card.addEventListener('touchstart', () => {
            card.style.opacity = '0.8';
        });
        
        card.addEventListener('touchend', () => {
            card.style.opacity = '1';
        });
    });
});