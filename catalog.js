(function () {
  "use strict";

  const hasGsap         = typeof window.gsap !== "undefined";
  const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";
  const hasLenis        = typeof window.Lenis !== "undefined";

  /* ------------------------------------------------------------------ *
   * Navbar: solid on scroll + mobile menu
   * ------------------------------------------------------------------ */
  const nav        = document.querySelector("[data-nav]");
  const menuToggle = nav ? nav.querySelector(".menu-toggle") : null;
  const mobileNav  = nav ? nav.querySelector(".mobile-nav")  : null;

  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.hasAttribute("data-open");
      nav.toggleAttribute("data-open", !isOpen);
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
    });
    mobileNav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        nav.removeAttribute("data-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * Fullpage Carousel
   * ------------------------------------------------------------------ */
  const fpEl = document.querySelector("[data-fp-carousel]");

  if (fpEl) {
    const slides       = Array.from(fpEl.querySelectorAll(".fp-slide"));
    const dots         = Array.from(fpEl.querySelectorAll(".fp-dots [data-slide]"));
    const prevBtn      = fpEl.querySelector("[data-fp-prev]");
    const nextBtn      = fpEl.querySelector("[data-fp-next]");
    const progressFill = fpEl.querySelector("[data-fp-progress]");

    if (slides.length) {
      const INTERVAL = 6500;
      let index      = 0;
      let timerId    = null;
      let isAnimating = false;

      /* Apply or remove light-theme class so CSS can swap control colours */
      const setThemeAttr = (i) => {
        if (slides[i].dataset.theme === "light") {
          fpEl.setAttribute("data-light-theme", "");
        } else {
          fpEl.removeAttribute("data-light-theme");
        }
      };

      /* Initial GSAP state */
      if (hasGsap) {
        slides.forEach((s, i) => {
          window.gsap.set(s, i === 0
            ? { xPercent: 0, autoAlpha: 1 }
            : { xPercent: 100, autoAlpha: 0 }
          );
        });
      }

      setThemeAttr(0);

      const updateDots = (i) => {
        dots.forEach((d, di) => {
          d.classList.toggle("is-active", di === i);
          d.setAttribute("aria-selected", String(di === i));
        });
      };

      const startProgress = () => {
        if (!progressFill || !hasGsap) return;
        window.gsap.fromTo(
          progressFill,
          { scaleX: 0 },
          { scaleX: 1, duration: INTERVAL / 1000, ease: "none", overwrite: true }
        );
      };

      const goTo = (nextIdx, dir = 1) => {
        if (isAnimating) return;
        const prev = index;
        const nxt  = ((nextIdx % slides.length) + slides.length) % slides.length;
        if (prev === nxt) return;

        slides[prev].setAttribute("aria-hidden", "true");
        slides[nxt].setAttribute("aria-hidden", "false");
        slides[nxt].classList.add("is-active");
        setThemeAttr(nxt);

        if (hasGsap) {
          isAnimating = true;
          const gsap = window.gsap;
          const dur  = 0.7;

          gsap.set(slides[nxt], { xPercent: dir * 100, autoAlpha: 1 });
          gsap.to(slides[prev], {
            xPercent: dir * -100,
            autoAlpha: 0,
            duration: dur,
            ease: "power2.inOut",
          });
          gsap.to(slides[nxt], {
            xPercent: 0,
            duration: dur,
            ease: "power2.inOut",
            onComplete: () => {
              slides[prev].classList.remove("is-active");
              gsap.set(slides[prev], { autoAlpha: 0 });
              isAnimating = false;
            },
          });
        } else {
          slides[prev].classList.remove("is-active");
        }

        index = nxt;
        updateDots(index);
      };

      const next = () => goTo(index + 1,  1);
      const prev = () => goTo(index - 1, -1);

      const restartTimer = () => {
        clearInterval(timerId);
        startProgress();
        timerId = setInterval(next, INTERVAL);
      };

      if (prevBtn) prevBtn.addEventListener("click", () => { prev(); restartTimer(); });
      if (nextBtn) nextBtn.addEventListener("click", () => { next(); restartTimer(); });

      dots.forEach((dot) => {
        dot.addEventListener("click", () => {
          const target = Number(dot.dataset.slide);
          if (!Number.isNaN(target)) {
            goTo(target, target > index ? 1 : -1);
            restartTimer();
          }
        });
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { next(); restartTimer(); }
        if (e.key === "ArrowLeft")  { prev(); restartTimer(); }
      });

      restartTimer();
    }
  }

  /* ------------------------------------------------------------------ *
   * No-GSAP fallback: reveal all animated elements immediately
   * ------------------------------------------------------------------ */
  if (!hasGsap) {
    document.querySelectorAll("[data-anim]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  const gsap = window.gsap;
  if (hasScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  /* ------------------------------------------------------------------ *
   * Lenis smooth scroll, synced to GSAP ticker
   * ------------------------------------------------------------------ */
  let lenis = null;
  if (hasLenis) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    if (hasScrollTrigger) lenis.on("scroll", window.ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* Intercept same-page anchor clicks for smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = -parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--navbar-height"),
        10
      ) || -64;
      if (lenis) {
        lenis.scrollTo(target, { offset });
      } else {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY + offset,
          behavior: "smooth",
        });
      }
    });
  });

  /* ------------------------------------------------------------------ *
   * Scroll-triggered reveals for product cards
   * ------------------------------------------------------------------ */
  gsap.set("[data-anim]", { opacity: 0 });

  if (hasScrollTrigger) {
    window.ScrollTrigger.batch("[data-anim]", {
      start: "top 88%",
      once: true,
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            overwrite: true,
          }
        );
      },
    });
    window.ScrollTrigger.refresh();
  } else {
    gsap.set("[data-anim]", { opacity: 1, y: 0 });
  }

})();
