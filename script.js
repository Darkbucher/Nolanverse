// Nolanverse Main Script
// =====================
// All initialization is now in a single DOMContentLoaded block for performance and clarity.

document.addEventListener('DOMContentLoaded', function() {
  // --- Quotes Rotation ---
  const quotes = document.querySelectorAll('#quotes .quote-box');
  let quoteIndex = 0;
  if (quotes.length) {
    quotes[0].classList.add('active');
    setInterval(() => {
      quotes[quoteIndex].classList.remove('active');
      quoteIndex = (quoteIndex + 1) % quotes.length;
      quotes[quoteIndex].classList.add('active');
    }, 5000);
  }

  // --- Recommendation Cycle (if present) ---
  const movieRecommendations = [
    { title: "The Prestige", category: "Mystery/Thriller", rating: "8.5/10", year: "2006" },
    { title: "Inception", category: "Sci-Fi/Action", rating: "8.8/10", year: "2010" },
    { title: "Interstellar", category: "Sci-Fi/Adventure", rating: "8.6/10", year: "2014" }
  ];
  const recommendationBox = document.querySelector('.recommendation-box');
  let recIndex = 0;
  if (recommendationBox) {
    function updateRecommendation(movie) {
      recommendationBox.innerHTML = `
        <div class="movie-card">
          <h3>${movie.title}</h3>
          <div class="movie-details">
            <span class="category">${movie.category}</span>
            <span class="rating">⭐ ${movie.rating}</span>
            <span class="year">${movie.year}</span>
          </div>
        </div>
      `;
    }
    updateRecommendation(movieRecommendations[0]);
    setInterval(() => {
      recIndex = (recIndex + 1) % movieRecommendations.length;
      updateRecommendation(movieRecommendations[recIndex]);
    }, 3000);
  }

  // --- Video Controls ---
  const video = document.getElementById('bg-video');
  if (video) {
    video.muted = true;
    video.addEventListener('click', () => video.muted = !video.muted);
    const videoControls = document.createElement('div');
    videoControls.className = 'video-controls';
    videoControls.innerHTML = `
      <button class="mute-btn"><i class="fas fa-volume-mute"></i></button>
      <button class="pause-btn"><i class="fas fa-pause"></i></button>
    `;
    video.parentElement.appendChild(videoControls);
    const muteBtn = videoControls.querySelector('.mute-btn');
    const pauseBtn = videoControls.querySelector('.pause-btn');
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      muteBtn.innerHTML = video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    });
    pauseBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      } else {
        video.pause();
        pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
    });
  }

  // --- Smooth Scroll for Navigation ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // --- Animate Elements on Scroll ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('animate');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.service-box, .quote-box, .news-card').forEach(el => observer.observe(el));

  // --- Search Functionality ---
  const searchInput = document.getElementById('movieSearch');
  const searchBtn = document.querySelector('.search-btn');
  const movieElements = document.querySelectorAll('.service-box, .category-table li');
  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    movieElements.forEach(element => {
      const title = element.textContent.toLowerCase();
      element.style.display = title.includes(searchTerm) ? '' : 'none';
    });
  }
  if (searchInput && searchBtn) {
    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);
  }

  // --- Trailer Modal Functionality ---
  document.querySelectorAll('.watch-trailer').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const movieTitle = this.closest('.service-box').querySelector('h2').textContent;
      const trailerUrls = {
        'Inception': 'https://www.youtube.com/embed/YoHD9XEInc0',
        'Interstellar': 'https://www.youtube.com/embed/zSWdZVtXT7E',
        'The Dark Knight': 'https://www.youtube.com/embed/EXeTwQWrcwY',
        'Dunkirk': 'https://www.youtube.com/embed/F-eMt3SrfFU',
        'Tenet': 'https://www.youtube.com/embed/AZGcmvrTX9M'
      };
      if (trailerUrls[movieTitle]) {
        const modal = document.createElement('div');
        modal.className = 'trailer-modal';
        modal.innerHTML = `
          <div class="modal-content">
            <button class="close-modal">&times;</button>
            <iframe width="560" height="315" src="${trailerUrls[movieTitle]}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
      }
    });
  });

  // --- Newsletter Functionality ---
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      // In a real app, you would send this to your backend
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = 'Thank you for subscribing!';
      this.appendChild(successMessage);
      this.reset();
      setTimeout(() => { successMessage.remove(); }, 3000);
    });
  }

  // --- Watchlist Functionality ---
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-watchlist')) {
      const movieCard = e.target.closest('.movie-card');
      const movieTitle = movieCard.querySelector('h3').textContent;
      e.target.textContent = 'Added to Watchlist';
      e.target.style.background = '#25D366';
      setTimeout(() => {
        e.target.textContent = '+ Watchlist';
        e.target.style.background = '';
      }, 2000);
    }
  });

  // --- Streaming Section Functionality ---
  const streamingFrame = document.querySelector('.streaming-frame iframe');
  const fullscreenBtn = document.querySelector('.fullscreen-btn');
  const refreshBtn = document.querySelector('.refresh-btn');
  // Check if the iframe is cross-origin
  let isCrossOrigin = false;
  try {
    streamingFrame.contentWindow.location.href;
  } catch (e) {
    isCrossOrigin = true;
  }
  if (fullscreenBtn && streamingFrame) {
    if (isCrossOrigin) {
      fullscreenBtn.disabled = true;
      fullscreenBtn.title = 'Fullscreen is not available for this embedded content.';
    } else {
      fullscreenBtn.addEventListener('click', function() {
        if (streamingFrame.requestFullscreen) {
          streamingFrame.requestFullscreen();
        } else if (streamingFrame.webkitRequestFullscreen) {
          streamingFrame.webkitRequestFullscreen();
        } else if (streamingFrame.mozRequestFullScreen) {
          streamingFrame.mozRequestFullScreen();
        } else if (streamingFrame.msRequestFullscreen) {
          streamingFrame.msRequestFullscreen();
        }
      });
    }
  }
  if (refreshBtn && streamingFrame) {
    refreshBtn.addEventListener('click', function() {
      const currentSrc = streamingFrame.src;
      streamingFrame.src = '';
      setTimeout(() => {
        streamingFrame.src = currentSrc;
      }, 100);
    });
  }

  // --- Social Links Hover for Quotes Section ---
  const quotesSection = document.getElementById('quotes');
  const socialLinks = document.querySelectorAll('.social-links a');
  if (quotesSection && socialLinks.length) {
    socialLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const color = link.getAttribute('data-color');
        quotesSection.style.background = `linear-gradient(135deg, #000000 0%, ${color} 100%)`;
      });
      link.addEventListener('mouseleave', () => {
        quotesSection.style.background = 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)';
      });
    });
  }

  // --- Slider Functionality ---
  const slider = document.querySelector('.slider-container .content');
  const slides = document.querySelectorAll('.slider-container .service-box');
  const prevBtn = document.querySelector('.slider-nav.prev-btn');
  const nextBtn = document.querySelector('.slider-nav.next-btn');
  if (slider && slides.length && prevBtn && nextBtn) {
    let currentIndex = 0;
    const slidesToShow = window.innerWidth < 768 ? 1 : 3;
    const slideWidth = slides[0].offsetWidth + 30;
    function updateSliderPosition() {
      const translateX = -currentIndex * slideWidth;
      slider.style.transform = `translateX(${translateX}px)`;
    }
    function updateButtonStates() {
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= slides.length - slidesToShow;
      prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
      nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
    }
    prevBtn.addEventListener('click', () => {
      currentIndex = Math.max(currentIndex - 1, 0);
      updateSliderPosition();
      updateButtonStates();
    });
    nextBtn.addEventListener('click', () => {
      currentIndex = Math.min(currentIndex + 1, slides.length - slidesToShow);
      updateSliderPosition();
      updateButtonStates();
    });
    window.addEventListener('resize', () => {
      currentIndex = 0;
      updateSliderPosition();
      updateButtonStates();
    });
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    slider.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    });
    slider.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentIndex < slides.length - slidesToShow) {
          currentIndex++;
        } else if (diff < 0 && currentIndex > 0) {
          currentIndex--;
        }
        updateSliderPosition();
        updateButtonStates();
      }
    });
    // Initialize
    updateSliderPosition();
    updateButtonStates();
  }

  // Show streaming controls only when streaming section is in view (mobile)
  if (window.innerWidth <= 600) {
    const streamingSection = document.getElementById('streaming-section');
    const streamingControls = document.querySelector('.streaming-controls');
    if (streamingSection && streamingControls) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              streamingControls.classList.add('visible');
            } else {
              streamingControls.classList.remove('visible');
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(streamingSection);
    }
  }

  document.querySelectorAll('.category-table td ul').forEach(ul => {
    const items = ul.querySelectorAll('li');
    let visibleCount = 10;
    // Show first 10
    items.forEach((li, i) => {
      if (i < visibleCount) li.classList.add('visible');
    });

    ul.addEventListener('scroll', function() {
      if (ul.scrollTop + ul.clientHeight >= ul.scrollHeight - 5) {
        // Show 5 more each time you reach the bottom
        let nextCount = visibleCount + 5;
        items.forEach((li, i) => {
          if (i < nextCount) li.classList.add('visible');
        });
        visibleCount = nextCount;
      }
    });
  });
});
