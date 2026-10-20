// Contraseña secreta para entrar al panel admin
const ADMIN_SECRET = "angelica2026"; 

// Imagen de perfil por defecto
const defaultProfilePhoto = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80";

// Propiedades iniciales por defecto
const defaultProperties = [
    {
        id: 1,
        tipo: "casa",
        operacion: "venta",
        habitaciones: 4,
        banos: 4,
        metros: "320 m²",
        precio: "Consultar Precio",
        titulo: "Quinta Moderna de Lujo",
        ubicacion: "San Cristóbal, Táchira",
        fotos: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
        ]
    },
    {
        id: 2,
        tipo: "apartamento",
        operacion: "alquiler",
        habitaciones: 2,
        banos: 2,
        metros: "100 m²",
        precio: "Consultar Canon",
        titulo: "Apartamento Ejecutivo Amoblado",
        ubicacion: "Sector Residencial, San Cristóbal",
        fotos: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Menú responsivo
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // 2. Cargar datos en la página
    loadPropertiesToCatalog();
    loadProfilePhoto();

    // 3. Buscador y Filtro Dinámico
    const btnBuscar = document.getElementById('btn-buscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', (e) => {
            e.preventDefault();
            filterProperties();
        });
    }

    // 4. Activador Secreto del Panel Admin (Icono ⚙️ en el footer)
    const adminTrigger = document.getElementById('admin-trigger');
    if (adminTrigger) {
        adminTrigger.addEventListener('click', () => {
            document.getElementById('adminModal').style.display = 'flex';
            document.getElementById('adminLoginView').style.display = 'block';
            document.getElementById('adminDashboardView').style.display = 'none';
            document.getElementById('adminPasswordInput').value = '';
            document.getElementById('loginError').style.display = 'none';
        });
    }

    // 5. Animaciones limpias al hacer Scroll
    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(section => {
        observer.observe(section);
    });
});

// Cargar y guardar foto de perfil desde galería
function getStoredProfilePhoto() {
    return localStorage.getItem('angelica_profile_photo') || defaultProfilePhoto;
}

function loadProfilePhoto() {
    const profileImg = document.getElementById('profileImageDisplay');
    if (profileImg) {
        profileImg.src = getStoredProfilePhoto();
    }
}

function uploadProfilePhotoFromGallery() {
    const fileInput = document.getElementById('profileImageFile');
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Image = e.target.result;
            localStorage.setItem('angelica_profile_photo', base64Image);
            loadProfilePhoto();
            fileInput.value = '';
            alert('¡Foto de perfil actualizada con éxito desde tu galería!');
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        alert('Por favor selecciona una imagen de tu galería primero.');
    }
}

// Almacenamiento local de propiedades
function getStoredProperties() {
    const stored = localStorage.getItem('angelica_properties');
    if (!stored) {
        localStorage.setItem('angelica_properties', JSON.stringify(defaultProperties));
        return defaultProperties;
    }
    return JSON.parse(stored);
}

// Renderizar propiedades
function loadPropertiesToCatalog() {
    const container = document.getElementById('properties-container');
    if (!container) return;

    const properties = getStoredProperties();
    container.innerHTML = '';

    properties.forEach(prop => {
        const tagClass = prop.operacion === 'venta' ? 'tag-sale' : 'tag-rent';
        const tagText = prop.operacion === 'venta' ? 'Venta' : 'Alquiler';
        const firstPhoto = prop.fotos && prop.fotos.length > 0 ? prop.fotos[0] : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80';

        const card = document.createElement('article');
        card.className = 'property-card animate-fade-in';
        card.setAttribute('data-tipo', prop.tipo);
        card.setAttribute('data-operacion', prop.operacion);
        card.setAttribute('data-habitaciones', prop.habitaciones);

        card.innerHTML = `
            <div class="card-image">
                <img src="${firstPhoto}" alt="${prop.titulo}">
                <span class="tag ${tagClass}">${tagText}</span>
            </div>
            <div class="card-body">
                <span class="price">${prop.precio}</span>
                <h3>${prop.titulo}</h3>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${prop.ubicacion}</p>
                <div class="features">
                    <span><i class="fas fa-bed"></i> ${prop.habitaciones} Hab.</span>
                    <span><i class="fas fa-bath"></i> ${prop.banos} Baños</span>
                    <span><i class="fas fa-ruler-combined"></i> ${prop.metros}</span>
                </div>
                <div class="card-actions">
                    <button class="btn-gallery" onclick='openGallery(${JSON.stringify(prop.fotos)}, "${prop.titulo}")'>
                        <i class="fas fa-images"></i> Ver Fotos
                    </button>
                    <a href="https://wa.me/584147544303?text=Hola%20Ang%C3%A9lica,%20deseo%20informaci%C3%B3n%20sobre%20${encodeURIComponent(prop.titulo)}" class="btn-card-wa" target="_blank">
                        <i class="fab fa-whatsapp"></i> Consultar
                    </a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Filtrar propiedades
function filterProperties() {
    const valTipo = document.getElementById('filter-tipo').value;
    const valOperacion = document.getElementById('filter-operacion').value;
    const valHabitaciones = document.getElementById('filter-habitaciones').value;
    const propertyCards = document.querySelectorAll('.property-card');
    const noResults = document.getElementById('no-results');
    let visibles = 0;

    propertyCards.forEach(card => {
        const cardTipo = card.getAttribute('data-tipo');
        const cardOperacion = card.getAttribute('data-operacion');
        const cardHabitaciones = parseInt(card.getAttribute('data-habitaciones') || '0');

        const matchTipo = (valTipo === 'todos' || cardTipo === valTipo);
        const matchOperacion = (valOperacion === 'todos' || cardOperacion === valOperacion);
        const matchHabitaciones = (valHabitaciones === 'todos' || cardHabitaciones >= parseInt(valHabitaciones));

        if (matchTipo && matchOperacion && matchHabitaciones) {
            card.style.display = 'block';
            visibles++;
        } else {
            card.style.display = 'none';
        }
    });

    if (noResults) {
        if (visibles === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    }

    const seccionPropiedades = document.getElementById('propiedades');
    if (seccionPropiedades) {
        seccionPropiedades.scrollIntoView({ behavior: 'smooth' });
    }
}

// Seguridad del Panel Admin
function checkAdminPassword() {
    const inputPass = document.getElementById('adminPasswordInput').value;
    if (inputPass === ADMIN_SECRET) {
        document.getElementById('adminLoginView').style.display = 'none';
        document.getElementById('adminDashboardView').style.display = 'block';
        loadAdminPropertyList();
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

function closeAdminModal() {
    document.getElementById('adminModal').style.display = 'none';
}

// Agregar propiedad seleccionando múltiples fotos desde la galería
function addNewPropertyFromGallery() {
    const title = document.getElementById('newTitle').value.trim();
    const tipo = document.getElementById('newTipo').value;
    const operacion = document.getElementById('newOperacion').value;
    const price = document.getElementById('newPrice').value.trim();
    const location = document.getElementById('newLocation').value.trim();
    const habitaciones = parseInt(document.getElementById('newHabitaciones').value) || 1;
    const banos = document.getElementById('newBanos').value.trim() || '1';
    const metros = document.getElementById('newMetros').value.trim() || '100 m²';
    const filesInput = document.getElementById('propertyImagesFiles');

    if (!title || !price || !location || filesInput.files.length === 0) {
        alert('Por favor completa el título, precio, ubicación y selecciona al menos una foto de tu galería.');
        return;
    }

    let fotosArray = [];
    let filesProcessed = 0;
    const totalFiles = filesInput.files.length;

    for (let i = 0; i < totalFiles; i++) {
        const reader = new FileReader();
        reader.onload = function(e) {
            fotosArray.push(e.target.result);
            filesProcessed++;

            if (filesProcessed === totalFiles) {
                const newProp = {
                    id: Date.now(),
                    titulo: title,
                    tipo: tipo,
                    operacion: operacion,
                    precio: price,
                    ubicacion: location,
                    habitaciones: habitaciones,
                    banos: banos,
                    metros: metros,
                    fotos: fotosArray
                };

                const properties = getStoredProperties();
                properties.unshift(newProp);
                localStorage.setItem('angelica_properties', JSON.stringify(properties));

                document.getElementById('newTitle').value = '';
                document.getElementById('newPrice').value = '';
                document.getElementById('newLocation').value = '';
                document.getElementById('newHabitaciones').value = '';
                document.getElementById('newBanos').value = '';
                document.getElementById('newMetros').value = '';
                filesInput.value = '';

                loadPropertiesToCatalog();
                loadAdminPropertyList();
                alert('¡Propiedad publicada con éxito con sus fotos de galería!');
            }
        };
        reader.readAsDataURL(filesInput.files[i]);
    }
}

function loadAdminPropertyList() {
    const listContainer = document.getElementById('adminPropertyList');
    const properties = getStoredProperties();
    listContainer.innerHTML = '';

    properties.forEach((prop) => {
        const item = document.createElement('div');
        item.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.85rem; background: white; padding: 6px; border-radius: 4px; border: 1px solid var(--border-color);";
        item.innerHTML = `
            <span><b>${prop.titulo}</b> (${prop.ubicacion})</span>
            <button onclick="deleteProperty(${prop.id})" style="background: #e53e3e; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Eliminar</button>
        `;
        listContainer.appendChild(item);
    });
}

function deleteProperty(id) {
    if (confirm('¿Estás segura de eliminar esta propiedad?')) {
        let properties = getStoredProperties();
        properties = properties.filter(p => p.id !== id);
        localStorage.setItem('angelica_properties', JSON.stringify(properties));
        loadPropertiesToCatalog();
        loadAdminPropertyList();
    }
}

function resetDefaultProperties() {
    if (confirm('¿Restaurar las propiedades iniciales?')) {
        localStorage.setItem('angelica_properties', JSON.stringify(defaultProperties));
        loadPropertiesToCatalog();
        loadAdminPropertyList();
    }
}

// Servicios Interactivos
function toggleService(cardElement) {
    const isOpen = cardElement.classList.contains('active');
    document.querySelectorAll('.service-card').forEach(card => card.classList.remove('active'));
    if (!isOpen) cardElement.classList.add('active');
}

// Galería Modal
let currentPhotos = [];
let currentIndex = 0;

function openGallery(photoArray, propertyTitle) {
    currentPhotos = photoArray;
    currentIndex = 0;
    document.getElementById('galleryTitle').innerText = propertyTitle;
    document.getElementById('galleryModal').style.display = 'flex';
    updateGalleryView();
    buildThumbnails();
}

function closeGallery() {
    document.getElementById('galleryModal').style.display = 'none';
}

function updateGalleryView() {
    const activeImg = document.getElementById('galleryActiveImage');
    const counter = document.getElementById('galleryCounter');
    activeImg.style.opacity = '0';
    setTimeout(() => {
        activeImg.src = currentPhotos[currentIndex];
        activeImg.style.opacity = '1';
    }, 150);
    
    counter.innerText = `Foto ${currentIndex + 1} de ${currentPhotos.length}`;
    
    const thumbs = document.querySelectorAll('.gallery-thumbnails img');
    thumbs.forEach((thumb, idx) => {
        if (idx === currentIndex) thumb.classList.add('active-thumb');
        else thumb.classList.remove('active-thumb');
    });
}

function nextPhoto() {
    currentIndex = (currentIndex + 1) % currentPhotos.length;
    updateGalleryView();
}

function prevPhoto() {
    currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
    updateGalleryView();
}

function buildThumbnails() {
    const container = document.getElementById('galleryThumbnails');
    container.innerHTML = '';
    currentPhotos.forEach((photoUrl, idx) => {
        const thumb = document.createElement('img');
        thumb.src = photoUrl;
        thumb.alt = `Miniatura ${idx + 1}`;
        if (idx === 0) thumb.classList.add('active-thumb');
        thumb.addEventListener('click', () => {
            currentIndex = idx;
            updateGalleryView();
        });
        container.appendChild(thumb);
    });
}

window.addEventListener('click', (e) => {
    const modalGallery = document.getElementById('galleryModal');
    const modalAdmin = document.getElementById('adminModal');
    if (e.target === modalGallery) closeGallery();
    if (e.target === modalAdmin) closeAdminModal();
});