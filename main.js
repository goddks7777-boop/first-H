const header = document.getElementById('site-header');
document.querySelectorAll('.doctor-bio-shell').forEach(shell => {
  const bio = shell.querySelector('.doctor-bio');
  const rail = shell.querySelector('.doctor-bio-rail');
  const thumb = rail.querySelector('span');
  function updateDoctorBioIndicator() {
    const maxScroll = bio.scrollHeight - bio.clientHeight;
    const travel = rail.clientHeight - thumb.offsetHeight;
    const ratio = maxScroll > 0 ? bio.scrollTop / maxScroll : 0;
    thumb.style.setProperty('--bio-thumb-y', `${Math.max(0, Math.min(1, ratio)) * travel}px`);
  }
  bio.addEventListener('scroll', updateDoctorBioIndicator, { passive: true });
  window.addEventListener('resize', updateDoctorBioIndicator);
  updateDoctorBioIndicator();
});
const careStory = document.querySelector('.care-story');
if (careStory) {
  const cards = [...careStory.querySelectorAll('.care-list article')];
  const media = window.matchMedia('(min-width: 1051px) and (min-height: 740px), (max-width: 650px) and (min-height: 600px)');
  let ticking = false;
  function updateCareStory() {
    ticking = false;
    const enabled = media.matches;
    careStory.classList.toggle('is-scroll-care', enabled);
    if (!enabled) {
      cards.forEach(card => { card.style.removeProperty('--card-offset'); card.style.removeProperty('--card-scale'); card.style.removeProperty('--card-reveal'); card.removeAttribute('aria-hidden'); card.inert = false; });
      return;
    }
    const distance = careStory.offsetHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, -careStory.getBoundingClientRect().top / distance));
    const phase = progress * cards.length;
    const active = Math.min(cards.length - 1, Math.floor(phase));
    cards.forEach((card, i) => {
      const offset = i === 0 ? 0 : Math.max(0, Math.min(1.3 + Math.max(0, i - active - 1) * .25, (i - phase) * 1.3)) * 100;
      const reveal = Math.max(0, Math.min(1, (phase - i) * 3));
      card.style.setProperty('--card-offset', `${offset}%`);
      card.style.setProperty('--card-scale', String(1 + Math.min(offset / 100, 1) * .06));
      card.style.setProperty('--card-reveal', reveal);
      card.setAttribute('aria-hidden', String(i !== active));
      card.inert = i !== active;
    });
  }
  function scheduleCareUpdate() { if (!ticking) { ticking = true; requestAnimationFrame(updateCareStory); } }
  window.addEventListener('scroll', scheduleCareUpdate, { passive: true });
  window.addEventListener('resize', scheduleCareUpdate);
  updateCareStory();
}
const aboutStory = document.querySelector('.about-story');
if (aboutStory) {
  const panels = [...aboutStory.querySelectorAll('.about-dark')];
  const media = window.matchMedia('(min-width: 1051px) and (min-height: 740px)');
  let active = -1;
  let ticking = false;
  function updateAboutStory() {
    ticking = false;
    const enabled = media.matches;
    aboutStory.classList.toggle('is-scroll-story', enabled);
    if (!enabled) {
      panels.forEach(panel => { panel.classList.remove('is-active'); panel.removeAttribute('aria-hidden'); panel.inert = false; });
      active = -1;
      return;
    }
    const distance = aboutStory.offsetHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, -aboutStory.getBoundingClientRect().top / distance));
    const index = Math.min(panels.length - 1, Math.floor(progress * panels.length));
    if (index !== active) {
      active = index;
      aboutStory.style.setProperty('--story-step', index);
      panels.forEach((panel, i) => {
        panel.classList.toggle('is-active', i === index);
        panel.setAttribute('aria-hidden', String(i !== index));
        panel.inert = i !== index;
      });
    }
  }
  function scheduleAboutUpdate() {
    if (!ticking) { ticking = true; requestAnimationFrame(updateAboutStory); }
  }
  window.addEventListener('scroll', scheduleAboutUpdate, { passive: true });
  window.addEventListener('resize', scheduleAboutUpdate);
  updateAboutStory();

  const mobileStage = aboutStory.querySelector('.about-story-stage');
  const mobileButtons = [...aboutStory.querySelectorAll('.about-mobile-navigation button')];
  const mobileMedia = window.matchMedia('(max-width: 650px)');
  const updateMobileIndicator = () => {
    if (!mobileMedia.matches || !mobileStage.clientWidth) return;
    const index = Math.min(panels.length - 1, Math.max(0, Math.round(mobileStage.scrollLeft / mobileStage.clientWidth)));
    mobileButtons.forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  };
  mobileStage.addEventListener('scroll', updateMobileIndicator, { passive: true });
  window.addEventListener('resize', updateMobileIndicator);
  mobileButtons.forEach((button, i) => button.addEventListener('click', () => {
    mobileStage.scrollTo({ left: panels[i].offsetLeft - mobileStage.offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));
  updateMobileIndicator();
}
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const isMain = Boolean(document.querySelector('.hero-carousel'));
  const isBrand = Boolean(document.querySelector('.brand-history'));
  const selectors = isMain
    ? '.intro-inner, .director-copy, .section-heading, .beauty-grid > *, .steps-grid article, .differences-list li, .equipment-scroll article, .gallery-grid > *, .contact-grid > *, .closing-content'
    : isBrand
      ? '.brand-history-heading, .brand-story-grid > *, .doctor-content, .doctor-portrait, .brand-visit-map, .brand-visit-details > div, .closing-content'
      : null;
  const elements = selectors ? [...document.querySelectorAll(selectors)] : [];
  if (!isMain && !isBrand) {
    const groupSelector = '.thread-steps, .thread-type-grid, .booster-grid, .line-care-grid, .herbal-grid, .condition-mosaic, .treatment-grid, .accident-timeline, .after-accident-cards, .principle-grid, .personal-grid, .antler-grid, .benefit-grid, .checks-grid, .faq-list';
    document.querySelectorAll('main > section:not(.beauty-hero):not(.pain-hero):not(.herbal-hero)').forEach(section => {
      const container = section.querySelector(':scope > .container, :scope > .closing-content');
      if (!container) return;
      if (container.classList.contains('closing-content')) { elements.push(container); return; }
      if (section.classList.contains('rehab')) {
        elements.push(container.querySelector(':scope > img'), container.querySelector('h2'), container.querySelector(':scope > div > p'), ...container.querySelectorAll('ol > li'));
        return;
      }
      [...container.children].forEach(child => {
        if (child.classList.contains('personal-grid')) {
          elements.push(child);
        } else if (child.classList.contains('booster-intro')) {
          elements.push(child.firstElementChild, ...child.querySelectorAll('.skin-points > div'));
        } else if (child.matches(groupSelector)) elements.push(...child.children);
        else elements.push(child);
      });
    });
  }
  if (isMain && !window.matchMedia('(min-width: 1051px) and (min-height: 740px)').matches) {
    elements.push(...document.querySelectorAll('.about-grid'));
  }
  let boosterIconsReadyAt = 0;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        if (target.parentElement?.classList.contains('skin-points') && !boosterIconsReadyAt) {
          boosterIconsReadyAt = performance.now() + 1250;
        }
        const wait = target.parentElement?.classList.contains('booster-grid')
          ? Math.max(0, boosterIconsReadyAt - performance.now()) : 0;
        if (wait) window.setTimeout(() => target.classList.add('aos-visible'), wait);
        else target.classList.add('aos-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px -35px 0px' });
  elements.forEach(element => {
    const bounds = element.getBoundingClientRect();
    const visibleSkinPoint = element.parentElement?.classList.contains('skin-points') && bounds.bottom > 0 && bounds.top < window.innerHeight;
    if (bounds.top > window.innerHeight || visibleSkinPoint) {
      element.classList.add('aos-enter');
      observer.observe(element);
    }
  });
}
const menuButton = document.querySelector('.menu-button');
const menu = document.getElementById('primary-nav');
const isEnglish = document.documentElement.lang === 'en';
const megaMenu = document.createElement('nav');
megaMenu.className = 'mega-menu';
megaMenu.id = 'mega-menu';
megaMenu.setAttribute('aria-label', '전체 메뉴');
megaMenu.hidden = true;
megaMenu.innerHTML = `
  <div class="mega-inner">
    <div class="mega-group"><a class="mega-heading" href="index.html">제일한의원</a><a href="brand.html#top">브랜드 스토리</a><a href="brand.html#doctors">의료진 소개</a><a href="brand.html#brand-visit">오시는 길</a></div>
    <div class="mega-group"><a class="mega-heading" href="beauty.html">한방 미용 클리닉</a><a href="beauty.html#thread">매선</a><a href="beauty.html#acupuncture-title">정안침</a><a href="beauty.html#boosters-title">스킨부스터</a><a href="beauty.html#line-care-title">라인 관리</a><a href="beauty.html#inner-beauty-title">이너뷰티</a></div>
    <div class="mega-group"><a class="mega-heading" href="pain.html">통증·움직임 클리닉</a><a href="pain.html#conditions">척추·관절</a><a href="pain.html#sports-title">운동 손상</a><a href="pain.html#accident-title">교통사고 이후 통증</a></div>
    <div class="mega-group"><a class="mega-heading" href="herbal.html">맥진·한약 클리닉</a><a href="herbal.html#personal-herbs-title">개별화 한약</a><a href="herbal.html#antler-title">녹용한약</a><a href="herbal.html#gongjindan-title">공진단</a></div>
  </div>`;
if (isEnglish) {
  const englishLabels = [
    ['Jeil Clinic', 'Our Story', 'Our Doctors', 'Directions'],
    ['Aesthetics Clinic', 'Thread Lifting', 'Facial Acupuncture', 'Skin Boosters', 'Body Contouring', 'Inner Beauty'],
    ['Pain & Mobility', 'Spine & Joints', 'Sports Injuries', 'After an Accident'],
    ['Herbal Medicine', 'Personalized Herbs', 'Deer Antler Medicine', 'Gongjindan']
  ];
  megaMenu.setAttribute('aria-label', 'All navigation');
  megaMenu.querySelectorAll('.mega-group').forEach((group, i) => {
    group.querySelectorAll('a').forEach((link, j) => {
      link.textContent = englishLabels[i][j];
      link.setAttribute('href', `en/${link.getAttribute('href')}`);
    });
  });
}
header.append(megaMenu);
menuButton.setAttribute('aria-controls', 'mega-menu');
megaMenu.querySelectorAll('.mega-group').forEach(group => {
  group.querySelectorAll('a:not(.mega-heading)').forEach((link, index) => {
    link.style.setProperty('--menu-delay', `${index * 130}ms`);
  });
});

function alignMegaMenu() {
  const bounds = header.getBoundingClientRect();
  const navLinks = menu.querySelectorAll('a');
  megaMenu.querySelectorAll('.mega-group').forEach((group, index) => {
    const link = navLinks[index];
    if (!link) return;
    const rect = link.getBoundingClientRect();
    group.style.setProperty('--group-center', `${rect.left - bounds.left + rect.width / 2}px`);
  });
}
window.addEventListener('resize', () => { if (!megaMenu.hidden) alignMegaMenu(); });

let lastHeaderScroll = Math.max(0, window.scrollY);
function updateHeader() {
  const current = Math.max(0, window.scrollY);
  const scrolled = current > 80;
  header.classList.toggle('scrolled', scrolled);
  if (!scrolled) {
    header.classList.remove('scroll-hidden');
  } else if (Math.abs(current - lastHeaderScroll) >= 2) {
    const movingUp = current < lastHeaderScroll;
    header.classList.toggle('scroll-hidden', movingUp);
    if (movingUp && !megaMenu.hidden) setMenuOpen(false);
  }
  lastHeaderScroll = current;
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

let menuMode = null;
function setMenuOpen(isOpen, mode = 'click', hoverIndex = -1) {
  if (isOpen) alignMegaMenu();
  menuMode = isOpen ? mode : null;
  megaMenu.querySelectorAll('.mega-group').forEach((group, index) => {
    group.hidden = isOpen && mode === 'hover' && index !== hoverIndex;
  });
  header.classList.toggle('menu-open', isOpen && mode === 'click');
  header.classList.toggle('menu-hover', isOpen && mode === 'hover');
  megaMenu.hidden = !isOpen;
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isEnglish ? (isOpen ? 'Close menu' : 'Open menu') : (isOpen ? '메뉴 닫기' : '메뉴 열기'));
}
menuButton.addEventListener('click', () => setMenuOpen(menuMode !== 'click'));
const hoverMenuMedia = window.matchMedia('(min-width: 1051px) and (hover: hover)');
menu.querySelectorAll('a').forEach((link, index) => {
  link.addEventListener('mouseenter', () => {
    if (hoverMenuMedia.matches && menuMode !== 'click') setMenuOpen(true, 'hover', index);
  });
});
header.addEventListener('mouseleave', () => {
  if (menuMode === 'hover') setMenuOpen(false);
});
header.querySelectorAll('.brand, .header-tools').forEach(element => {
  element.addEventListener('mouseenter', () => {
    if (menuMode === 'hover') setMenuOpen(false);
  });
});
hoverMenuMedia.addEventListener('change', event => {
  if (!event.matches && menuMode === 'hover') setMenuOpen(false);
});
megaMenu.addEventListener('click', event => {
  if (event.target.closest('a')) setMenuOpen(false);
});
menu.addEventListener('click', event => {
  if (event.target.closest('a')) setMenuOpen(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !megaMenu.hidden) {
    setMenuOpen(false);
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!megaMenu.hidden && !header.contains(event.target)) setMenuOpen(false);
});

const equipment = document.querySelector('.equipment-scroll');
const progress = document.getElementById('equipment-progress');
if (equipment && progress) {
  function updateEquipmentProgress() {
    const max = equipment.scrollWidth - equipment.clientWidth;
    const range = max <= 0 ? 0 : equipment.scrollLeft / max;
    const visible = Math.min(1, equipment.clientWidth / equipment.scrollWidth);
    progress.style.width = `${visible * 100}%`;
    progress.style.transform = `translateX(${range * (1 / visible - 1) * 100}%)`;
  }
  equipment.addEventListener('scroll', updateEquipmentProgress, { passive: true });
  window.addEventListener('resize', updateEquipmentProgress);
  let equipmentDrag = null;
  let equipmentMomentum = 0;
  const reducedEquipmentMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stopEquipmentMomentum = () => {
    cancelAnimationFrame(equipmentMomentum);
    equipmentMomentum = 0;
  };
  equipment.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    stopEquipmentMomentum();
    equipmentDrag = { id: event.pointerId, startX: event.clientX, startScroll: equipment.scrollLeft, lastX: event.clientX, lastTime: performance.now(), velocity: 0 };
    equipment.classList.add('is-dragging');
    equipment.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  equipment.addEventListener('pointermove', event => {
    if (!equipmentDrag || event.pointerId !== equipmentDrag.id) return;
    const now = performance.now();
    const elapsed = Math.max(1, now - equipmentDrag.lastTime);
    equipmentDrag.velocity = Math.max(-2, Math.min(2, (equipmentDrag.lastX - event.clientX) / elapsed));
    equipmentDrag.lastX = event.clientX;
    equipmentDrag.lastTime = now;
    equipment.scrollLeft = equipmentDrag.startScroll - (event.clientX - equipmentDrag.startX);
  });
  const endEquipmentDrag = event => {
    if (!equipmentDrag || event.pointerId !== equipmentDrag.id) return;
    let velocity = performance.now() - equipmentDrag.lastTime < 100 ? equipmentDrag.velocity : 0;
    equipmentDrag = null;
    equipment.classList.remove('is-dragging');
    if (equipment.hasPointerCapture(event.pointerId)) equipment.releasePointerCapture(event.pointerId);
    if (event.type !== 'pointerup' || reducedEquipmentMotion.matches || Math.abs(velocity) < .02) return;
    let lastFrame = performance.now();
    const glide = now => {
      const elapsed = Math.min(now - lastFrame, 32);
      lastFrame = now;
      const previous = equipment.scrollLeft;
      equipment.scrollLeft += velocity * elapsed;
      velocity *= Math.pow(.94, elapsed / 16.67);
      if (Math.abs(velocity) < .02 || equipment.scrollLeft === previous) {
        equipmentMomentum = 0;
        return;
      }
      equipmentMomentum = requestAnimationFrame(glide);
    };
    equipmentMomentum = requestAnimationFrame(glide);
  };
  equipment.addEventListener('pointerup', endEquipmentDrag);
  equipment.addEventListener('pointercancel', endEquipmentDrag);
  equipment.addEventListener('lostpointercapture', event => {
    if (!event.buttons) endEquipmentDrag(event);
  });
  equipment.addEventListener('wheel', stopEquipmentMomentum, { passive: true });
  equipment.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    stopEquipmentMomentum();
    const card = equipment.querySelector('article');
    const distance = card ? card.getBoundingClientRect().width + 16 : 300;
    equipment.scrollBy({ left: event.key === 'ArrowRight' ? distance : -distance, behavior: 'smooth' });
  });
  updateEquipmentProgress();
}

const heroCarousel = document.querySelector('.hero-carousel');
if (heroCarousel) {
  const viewport = heroCarousel.querySelector('.hero-viewport');
  const track = heroCarousel.querySelector('.hero-track');
  const slides = [...track.querySelectorAll('.hero-slide')];
  const status = heroCarousel.querySelector('.hero-slide-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const labels = isEnglish ? ['Aesthetics Clinic', 'Pain & Mobility Clinic', 'Herbal Medicine Clinic'] : ['한방 미용 클리닉', '통증·움직임 클리닉', '맥진·한약 클리닉'];

  const cloneSlide = slide => {
    const clone = slide.cloneNode(true);
    clone.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    clone.setAttribute('aria-hidden', 'true');
    clone.inert = true;
    return clone;
  };
  track.prepend(cloneSlide(slides.at(-1)));
  track.append(cloneSlide(slides[0]));

  let position = 1;
  let animating = false;
  let drag = null;
  const currentIndex = () => (position - 1 + slides.length) % slides.length;
  const placeTrack = offset => {
    track.style.transform = `translate3d(calc(${-position * 100}% + ${offset}px),0,0)`;
  };
  const updateSlideState = () => {
    const index = currentIndex();
    slides.forEach((slide, slideIndex) => {
      slide.setAttribute('aria-hidden', String(slideIndex !== index));
      slide.inert = slideIndex !== index;
    });
    status.textContent = `${index + 1} / ${slides.length}: ${labels[index]}`;
  };
  const jumpTo = target => {
    track.classList.add('is-jumping');
    position = target;
    placeTrack(0);
    void track.offsetWidth;
    track.classList.remove('is-jumping');
    animating = false;
    updateSlideState();
  };
  const finishSlide = () => {
    if (position === 0) jumpTo(slides.length);
    else if (position === slides.length + 1) jumpTo(1);
    else animating = false;
  };
  const moveSlide = direction => {
    if (animating) return;
    position += direction;
    animating = true;
    placeTrack(0);
    updateSlideState();
    if (reducedMotion.matches) finishSlide();
  };
  jumpTo(1);
  track.addEventListener('transitionend', event => {
    if (event.target === track && event.propertyName === 'transform') finishSlide();
  });
  viewport.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      moveSlide(event.key === 'ArrowRight' ? 1 : -1);
    }
  });

  viewport.addEventListener('pointerdown', event => {
    if (animating || (event.pointerType === 'mouse' && event.button !== 0)) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, active: false };
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const deltaX = event.clientX - drag.x;
    const deltaY = event.clientY - drag.y;
    if (!drag.active && Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
      drag.active = true;
      viewport.classList.add('is-dragging');
    }
    if (drag.active) {
      event.preventDefault();
      placeTrack(deltaX);
    }
  });
  const endDrag = event => {
    if (!drag || event.pointerId !== drag.id) return;
    const deltaX = event.clientX - drag.x;
    const threshold = Math.max(35, Math.min(80, viewport.clientWidth * .1));
    const wasDragging = drag.active;
    drag = null;
    viewport.classList.remove('is-dragging');
    if (wasDragging && Math.abs(deltaX) >= threshold) moveSlide(deltaX < 0 ? 1 : -1);
    else placeTrack(0);
  };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', event => {
    if (!drag || event.pointerId !== drag.id) return;
    drag = null;
    viewport.classList.remove('is-dragging');
    placeTrack(0);
  });

  viewport.addEventListener('wheel', event => {
    if (Math.abs(event.deltaX) <= 25 || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    moveSlide(event.deltaX > 0 ? 1 : -1);
  }, { passive: false });
}
// Animate FAQ answers while keeping native details and summary semantics.
document.querySelectorAll('.beauty-faq .faq-list details, .pain-faq .faq-list details, .herbal-faq .faq-list details').forEach(item => {
  let animation = null;
  let expanded = item.open;
  const toggleItem = () => {
    expanded = !expanded;
    const currentHeight = item.getBoundingClientRect().height;
    if (animation) animation.cancel();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      item.open = expanded;
      item.style.height = '';
      item.style.overflow = '';
      animation = null;
      return;
    }

    item.style.height = 'auto';
    item.open = expanded;
    const targetHeight = item.getBoundingClientRect().height;
    // Keep the answer present during the closing animation.
    if (!expanded) item.open = true;
    item.style.overflow = 'hidden';
    animation = item.animate(
      { height: [`${currentHeight}px`, `${targetHeight}px`] },
      { duration: 400, easing: 'cubic-bezier(.22, .61, .36, 1)' }
    );
    animation.onfinish = () => {
      item.open = expanded;
      item.style.height = '';
      item.style.overflow = '';
      animation = null;
    };
  };
  item.addEventListener('click', event => {
    if (event.target.closest('a, button, input, select, textarea') || window.getSelection()?.toString()) return;
    event.preventDefault();
    toggleItem();
  });
});

// Show the details for one condition at a time, including keyboard and touch use.
const conditionCards = [...document.querySelectorAll('.condition-small-grid article')];
conditionCards.forEach(card => {
  const activate = () => {
    conditionCards.forEach(other => other.classList.toggle('active', other === card));
  };
  card.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse' || event.pointerType === 'pen') activate(); });
  card.addEventListener('focus', activate);
  card.addEventListener('click', activate);
});

