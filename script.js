
// Tailwind configuration
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            colors: {
                warm: {
                    50: '#FDFBF7',
                    100: '#F7F2EA',
                    200: '#EFE5D5',
                    300: '#E2D1B8',
                    400: '#D2B693',
                    500: '#C29B6E',
                    600: '#A87E50',
                },
                cozy: {
                    coral: '#FF7B66',
                    coralHover: '#FF634A',
                    softBlue: '#6C8EA4',
                    deepBlue: '#2C4A5E',
                    cream: '#FFFDF9',
                    sand: '#F4EFEA',
                }
            },
            borderRadius: {
                '4xl': '2rem',
            }
        }
    }
};

// Application state
let currentSelectedImage = null;
let activeTab = 'feed';

// Initial Posts Data
const initialPosts = [
    {
        id: 1,
        author: 'Mẹ Yêu',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
        time: '2 giờ trước',
        text: 'Chiều nay mẹ làm món lẩu nấm cả nhà mình thích này! Tối nhớ về ăn đông đủ nhé các con ❤',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=600',
        likes: 4,
        comments: 2,
        liked: true
    },
    {
        id: 2,
        author: 'Bố Yêu',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        time: '5 giờ trước',
        text: 'Cuối tuần này cả nhà mình thu xếp đi dã ngoại chút không? Thời tiết dạo này đẹp lắm.',
        image: null,
        likes: 3,
        comments: 5,
        liked: false
    }
];

// Initialize application on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    renderPosts();
});

// Tab Navigation
function switchTab(tabId) {
    activeTab = tabId;

    // Update active tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });

    const activePanel = document.getElementById(`tab-${tabId}`);
    if (activePanel) {
        activePanel.classList.add('active');
    }

    // Update header title
    const headerTitle = document.getElementById('header-title');
    const titles = {
        'feed': 'Bảng Tin Gia Đình',
        'chat': 'Trò Chuyện Gia Đình',
        'memories': 'Kỷ Niệm Yêu Thương',
        'profile': 'Trang Cá Nhân'
    };
    if (headerTitle && titles[tabId]) {
        headerTitle.innerText = titles[tabId];
    }

    // Update Nav buttons state
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-cozy-coral', 'font-semibold');
        btn.classList.add('text-stone-400');
        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
        }
    });

    const activeBtn = document.getElementById(`nav-btn-${tabId}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-stone-400');
        activeBtn.classList.add('text-cozy-coral', 'font-semibold');
        const icon = activeBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
        }
    }

    // Scroll to top when changing tabs
    const mainScroll = document.getElementById('main-scroll');
    if (mainScroll) mainScroll.scrollTop = 0;
}

// Render Feed Posts
function renderPosts() {
    const container = document.getElementById('posts-list');
    if (!container) return;

    container.innerHTML = initialPosts.map(post => `
        <article class="bg-white p-4 rounded-3xl shadow-sm border border-warm-100 space-y-3 transition hover:shadow-md">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <img src="${post.avatar}" alt="${post.author}" class="w-10 h-10 rounded-full object-cover ring-2 ring-warm-200">
                    <div>
                        <h3 class="font-bold text-stone-800 text-sm font-display">${post.author}</h3>
                        <span class="text-[10px] text-stone-400">${post.time}</span>
                    </div>
                </div>
                <button onclick="showNotification('Tùy chọn bài viết')" class="text-stone-400 hover:text-stone-600 p-1">
                    <i class="fa-solid fa-ellipsis"></i>
                </button>
            </div>

            <p class="text-stone-700 text-xs leading-relaxed">${post.text}</p>

            ${post.image ? `
                <div class="rounded-2xl overflow-hidden max-h-64 border border-warm-100 cursor-pointer" onclick="openLightbox('${post.image}')">
                    <img src="${post.image}" class="w-full h-full object-cover">
                </div>
            ` : ''}

            <div class="flex items-center justify-between pt-2 border-t border-warm-100/80 text-stone-500 text-xs">
                <button onclick="toggleLike(${post.id})" class="flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-warm-50 transition ${post.liked ? 'text-cozy-coral font-medium' : ''}">
                    <i class="${post.liked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    <span>${post.likes}</span>
                </button>

                <button onclick="showNotification('Tính năng bình luận đang phát triển!')" class="flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-warm-50 transition">
                    <i class="fa-regular fa-comment"></i>
                    <span>${post.comments} bình luận</span>
                </button>

                <button onclick="showNotification('Đã lưu bài viết!')" class="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-warm-50 transition">
                    <i class="fa-regular fa-bookmark"></i>
                </button>
            </div>
        </article>
    `).join('');
}

// Feed Image Preview
function previewFeedImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentSelectedImage = e.target.result;
            const previewImg = document.getElementById('image-preview');
            const previewContainer = document.getElementById('image-preview-container');
            if (previewImg && previewContainer) {
                previewImg.src = currentSelectedImage;
                previewContainer.classList.remove('hidden');
            }
        };
        reader.readAsDataURL(file);
    }
}

function removeSelectedImage() {
    currentSelectedImage = null;
    const previewContainer = document.getElementById('image-preview-container');
    const fileInput = document.getElementById('feed-file-input');
    if (previewContainer) previewContainer.classList.add('hidden');
    if (fileInput) fileInput.value = '';
}

// Submit New Feed Post
function submitNewPost() {
    const textarea = document.getElementById('feed-post-text');
    const text = textarea ? textarea.value.trim() : '';

    if (!text && !currentSelectedImage) {
        showNotification('Vui lòng nhập nội dung hoặc thêm ảnh!');
        return;
    }

    const newPost = {
        id: Date.now(),
        author: 'Nguyễn Minh Tuấn',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        time: 'Vừa xong',
        text: text,
        image: currentSelectedImage,
        likes: 0,
        comments: 0,
        liked: false
    };

    initialPosts.unshift(newPost);
    renderPosts();

    // Reset input fields
    if (textarea) textarea.value = '';
    removeSelectedImage();
    showNotification('Đã chia sẻ bài viết mới!');
}

function toggleLike(postId) {
    const post = initialPosts.find(p => p.id === postId);
    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        renderPosts();
    }
}

// Chat Functionality
function openChatRoom(name, avatar, isGroup) {
    const chatRoomView = document.getElementById('chat-room-view');
    const roomName = document.getElementById('room-name');
    const roomAvatar = document.getElementById('room-avatar');

    if (roomName) roomName.innerText = name;
    if (roomAvatar) roomAvatar.src = avatar;

    const messagesContainer = document.getElementById('chat-messages-container');
    if (messagesContainer) {
        messagesContainer.innerHTML = `
            <div class="text-center my-2">
                <span class="text-[10px] bg-warm-200/70 text-stone-600 px-3 py-1 rounded-full font-medium">Hôm nay</span>
            </div>
            
            <div class="flex items-start gap-2 max-w-[80%]">
                <img src="${avatar}" class="w-7 h-7 rounded-full object-cover ring-1 ring-warm-200 shrink-0 mt-1">
                <div>
                    <span class="text-[10px] text-stone-400 ml-1 mb-0.5 block">${isGroup ? 'Mẹ' : name}</span>
                    <div class="bg-white p-3 bubble-other shadow-sm border border-warm-100 text-xs text-stone-700">
                        ${isGroup ? 'Tối nay cả nhà ăn cơm lúc 7h nhé!' : 'Chào con, hôm nay công việc thế nào?'}
                    </div>
                    <span class="text-[9px] text-stone-400 ml-1 mt-1 block">10:42</span>
                </div>
            </div>

            <div class="flex items-end justify-end gap-2 max-w-[80%] ml-auto">
                <div>
                    <div class="bg-cozy-coral text-white p-3 bubble-me shadow-sm text-xs">
                        Dạ vâng ạ, tí con về sớm!
                    </div>
                    <span class="text-[9px] text-stone-400 text-right mr-1 mt-1 block">10:45</span>
                </div>
            </div>
        `;
    }

    if (chatRoomView) {
        chatRoomView.classList.remove('hidden');
    }
}

function closeChatRoom() {
    const chatRoomView = document.getElementById('chat-room-view');
    if (chatRoomView) {
        chatRoomView.classList.add('hidden');
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input ? input.value.trim() : '';
    if (!message) return;

    const messagesContainer = document.getElementById('chat-messages-container');
    if (messagesContainer) {
        const msgDiv = document.createElement('div');
        msgDiv.className = "flex items-end justify-end gap-2 max-w-[80%] ml-auto";
        msgDiv.innerHTML = `
            <div>
                <div class="bg-cozy-coral text-white p-3 bubble-me shadow-sm text-xs">
                    ${message}
                </div>
                <span class="text-[9px] text-stone-400 text-right mr-1 mt-1 block">Vừa xong</span>
            </div>
        `;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    if (input) input.value = '';

    // Update last message preview in group chat item
    const groupLastMsg = document.getElementById('group-last-msg');
    if (groupLastMsg) {
        groupLastMsg.innerText = `Bạn: ${message}`;
    }
}

function sendChatImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const messagesContainer = document.getElementById('chat-messages-container');
            if (messagesContainer) {
                const msgDiv = document.createElement('div');
                msgDiv.className = "flex items-end justify-end gap-2 max-w-[80%] ml-auto";
                msgDiv.innerHTML = `
                    <div>
                        <div class="bg-cozy-coral p-1.5 bubble-me shadow-sm overflow-hidden">
                            <img src="${e.target.result}" class="rounded-xl max-h-40 object-cover">
                        </div>
                        <span class="text-[9px] text-stone-400 text-right mr-1 mt-1 block">Vừa xong</span>
                    </div>
                `;
                messagesContainer.appendChild(msgDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        };
        reader.readAsDataURL(file);
    }
}

// Lightbox modal for previewing full images
function openLightbox(imageSrc) {
    const lightbox = document.createElement('div');
    lightbox.className = "fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer animate-fade-in";
    lightbox.onclick = () => document.body.removeChild(lightbox);
    lightbox.innerHTML = `
        <div class="relative max-w-full max-h-full">
            <img src="${imageSrc}" class="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl">
            <p class="text-white/70 text-xs text-center mt-3">Nhấn vào bất kỳ đâu để đóng</p>
        </div>
    `;
    document.body.appendChild(lightbox);
}

// Notification Toast Utility
function showNotification(msg) {
    const toast = document.createElement('div');
    toast.className = "fixed top-6 left-1/2 -translate-x-1/2 bg-stone-900/90 text-white text-xs px-4 py-2.5 rounded-full shadow-lg z-50 backdrop-blur-md border border-white/10 transition-all duration-300 pointer-events-none";
    toast.innerText = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -10px)';
        setTimeout(() => {
            if (toast.parentNode) document.body.removeChild(toast);
        }, 300);
    }, 2000);
}
