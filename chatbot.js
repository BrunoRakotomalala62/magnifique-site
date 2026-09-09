document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const attachBtn = document.getElementById('attachBtn');
  const fileInput = document.getElementById('fileInput');
  const imagePreview = document.getElementById('imagePreview');
  const previewImg = imagePreview.querySelector('img');
  const removePreview = document.getElementById('removePreview');

  let pendingImage = null;

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const setTimestamp = (el) => {
    el.textContent = formatTime();
  };

  const scrollToBottom = () => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const createMessage = (text, sender, imageUrl = null) => {
    const wrapper = document.createElement('div');
    wrapper.className = `message message--${sender}`;

    const bubble = document.createElement('div');
    bubble.className = 'message__bubble';

    if (text) {
      const p = document.createElement('p');
      p.textContent = text;
      bubble.appendChild(p);
    }

    if (imageUrl) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = sender === 'user' ? 'Image envoyée' : 'Image reçue';
      bubble.appendChild(img);
    }

    const time = document.createElement('span');
    time.className = 'message__time';
    setTimestamp(time);

    wrapper.appendChild(bubble);
    wrapper.appendChild(time);
    chatMessages.appendChild(wrapper);

    scrollToBottom();
  };

  const showTyping = () => {
    const typing = document.createElement('div');
    typing.className = 'typing';
    typing.setAttribute('id', 'typingIndicator');
    typing.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typing);
    scrollToBottom();
    return typing;
  };

  const removeTyping = () => {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
  };

  const getBotResponse = (text, hasImage) => {
    const lower = text.toLowerCase().trim();
    if (hasImage && !text) return 'Image reçue, merci ! 📷';
    if (lower.includes('bonjour') || lower.includes('salut')) return 'Bonjour ! Comment puis-je vous accompagner aujourd’hui ?';
    if (lower.includes('prix') || lower.includes('tarif') || lower.includes('combien')) return 'Nos tarifs dépendent du projet. Remplissez le formulaire de contact et nous vous enverrons un devis sur mesure.';
    if (lower.includes('site') || lower.includes('web')) return 'Nous créons des sites modernes, rapides et sur mesure. Souhaitez-vous un site vitrine, e-commerce ou une application web ?';
    if (lower.includes('contact') || lower.includes('mail') || lower.includes('téléphone')) return 'Vous pouvez nous contacter via le formulaire sur la page d’accueil. Nous vous répondrons rapidement.';
    if (hasImage) return 'Merci pour cette image ! Je la transmets à l’équipe pour étude.';
    return 'Merci pour votre message. Un membre de l’équipe Lumière vous répondra très bientôt.';
  };

  const handleSend = async () => {
    const text = chatInput.value.trim();
    const image = pendingImage;

    if (!text && !image) return;

    createMessage(text || null, 'user', image);
    chatInput.value = '';
    clearImagePreview();

    sendBtn.disabled = true;
    const typing = showTyping();

    // Simule un temps de réflexion
    await new Promise((resolve) => setTimeout(resolve, 900 + Math.random() * 800));

    removeTyping();
    createMessage(getBotResponse(text, !!image), 'bot');
    sendBtn.disabled = false;
    chatInput.focus();
  };

  const showImagePreview = (file) => {
    const url = URL.createObjectURL(file);
    pendingImage = url;
    previewImg.src = url;
    imagePreview.hidden = false;
  };

  const clearImagePreview = () => {
    if (pendingImage) {
      URL.revokeObjectURL(pendingImage);
    }
    pendingImage = null;
    previewImg.src = '';
    imagePreview.hidden = true;
    fileInput.value = '';
  };

  sendBtn.addEventListener('click', handleSend);

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  attachBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file && file.type.startsWith('image/')) {
      showImagePreview(file);
      chatInput.focus();
    }
  });

  removePreview.addEventListener('click', clearImagePreview);

  // Initial scroll
  scrollToBottom();
});
