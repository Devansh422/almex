(function () {
  "use strict";

  const prefersReduced = false;
  const hasGsap = typeof window.gsap !== "undefined";
  const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";
  const hasLenis = typeof window.Lenis !== "undefined";

  /* ------------------------------------------------------------------ *
   * Navbar: shrink/solid on scroll + mobile menu
   * ------------------------------------------------------------------ */
  const nav = document.querySelector("[data-nav]");
  const menuToggle = nav ? nav.querySelector(".menu-toggle") : null;
  const mobileNav = nav ? nav.querySelector(".mobile-nav") : null;

  if (nav) {
    const onScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.hasAttribute("data-open");
      nav.toggleAttribute("data-open", !isOpen);
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
    });

    mobileNav.addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        nav.removeAttribute("data-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * Carousel — GSAP slide animation if available, CSS fade fallback
   * ------------------------------------------------------------------ */
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const dots   = Array.from(carousel.querySelectorAll("[data-slide]"));
    const prevButton = carousel.querySelector("[data-prev]");
    const nextButton = carousel.querySelector("[data-next]");
    if (!slides.length) return;

    let index    = slides.findIndex((s) => s.classList.contains("is-active"));
    let timerId  = null;
    let isAnimating = false;

    if (index < 0) {
      index = 0;
      slides[0].classList.add("is-active");
    }

    if (typeof window.gsap !== "undefined") {
      slides.forEach((s, i) => {
        if (i !== index) {
          window.gsap.set(s, { xPercent: 100, autoAlpha: 0 });
        } else {
          window.gsap.set(s, { xPercent: 0, autoAlpha: 1 });
        }
      });
    }

    const updateDots = (i) => {
      dots.forEach((d, di) => d.classList.toggle("is-active", di === i));
    };

    const setSlide = (nextIndex, dir = 1) => {
      if (isAnimating) return;
      const outIndex = index;
      const inIndex  = (nextIndex + slides.length) % slides.length;
      if (outIndex === inIndex) return;

      slides[outIndex].setAttribute("aria-hidden", "true");
      slides[inIndex].setAttribute("aria-hidden", "false");
      slides[inIndex].classList.add("is-active");

      if (typeof window.gsap !== "undefined") {
        isAnimating = true;
        const gsap = window.gsap;
        const dur  = 0.55;

        gsap.set(slides[inIndex], { xPercent: dir * 100, autoAlpha: 1 });
        gsap.to(slides[outIndex], { xPercent: dir * -100, duration: dur, ease: "power2.inOut" });
        gsap.to(slides[inIndex], {
          xPercent: 0,
          duration: dur,
          ease: "power2.inOut",
          onComplete: () => {
            slides[outIndex].classList.remove("is-active");
            gsap.set(slides[outIndex], { autoAlpha: 0 });
            isAnimating = false;
          },
        });
      } else {
        slides[outIndex].classList.remove("is-active");
      }

      index = inIndex;
      updateDots(index);
    };

    const next = () => setSlide(index + 1,  1);
    const prev = () => setSlide(index - 1, -1);

    const restartTimer = () => {
      clearInterval(timerId);
      timerId = setInterval(next, 6500);
    };

    if (prevButton) prevButton.addEventListener("click", () => { prev(); restartTimer(); });
    if (nextButton) nextButton.addEventListener("click", () => { next(); restartTimer(); });

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const target = Number(dot.dataset.slide);
        if (!Number.isNaN(target)) {
          const dir = target > index ? 1 : -1;
          setSlide(target, dir);
          restartTimer();
        }
      });
    });

    restartTimer();
  });

  /* ------------------------------------------------------------------ *
   * Fallback: no GSAP → show content immediately, hide preloader
   * ------------------------------------------------------------------ */
  const revealAllStatic = () => {
    document
      .querySelectorAll("[data-anim], [data-anim-title] .line")
      .forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    document.querySelectorAll("[data-count]").forEach((el) => {
      el.textContent = el.getAttribute("data-count");
    });
  };

  if (prefersReduced || !hasGsap) {
    revealAllStatic();
    const pl = document.getElementById("preloader");
    if (pl) pl.style.display = "none";
    return;
  }

  const gsap = window.gsap;
  if (hasScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
  const ScrollTrigger = window.ScrollTrigger;

  /* ------------------------------------------------------------------ *
   * Lenis smooth scroll, synced to the GSAP ticker + ScrollTrigger
   * ------------------------------------------------------------------ */
  let lenis = null;
  if (hasLenis) {
    lenis = new window.Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    if (hasScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
    }

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* Smooth anchor navigation */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--navbar-height"),
        10
      ) || 64;

      if (lenis) {
        lenis.scrollTo(target, { offset: -navHeight });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ------------------------------------------------------------------ *
   * Helper: animated count-up for metrics
   * ------------------------------------------------------------------ */
  const animateCount = (el) => {
    const end = Number(el.getAttribute("data-count")) || 0;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: end,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = Math.round(obj.val);
      },
    });
  };

  /* CSS already hides [data-anim] elements; reinforce the state for GSAP */
  const hero = document.querySelector(".hero");
  gsap.set("[data-anim], [data-anim-title] .line", { opacity: 0 });

  /* ------------------------------------------------------------------ *
   * Main animations — runs after preloader exits
   * ------------------------------------------------------------------ */
  function runMain() {
    /* Hero intro timeline */
    if (hero) {
      const heroAnims = hero.querySelectorAll("[data-anim]");

      const titleWrap = hero.querySelector("[data-anim-title]");
      let heroLines = [];
      if (titleWrap) {
        titleWrap.querySelectorAll(".line").forEach((line) => {
          const inner = document.createElement("span");
          inner.className = "line-inner";
          while (line.firstChild) inner.appendChild(line.firstChild);
          line.appendChild(inner);
        });
        heroLines = Array.from(titleWrap.querySelectorAll(".line-inner"));
        gsap.set(heroLines, { yPercent: 110 });
        gsap.set(titleWrap.querySelectorAll(".line"), { opacity: 1 });
      }

      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.1,
      });

      intro
        .to(heroLines, { yPercent: 0, duration: 0.9, stagger: 0.1 })
        .fromTo(
          [".hero .lead", ".hero-actions"],
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
          "-=0.45"
        )
        .fromTo(
          ".hero-strip",
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            onStart: () => {
              hero.querySelectorAll("[data-count]").forEach(animateCount);
            },
          },
          "-=0.4"
        );

      heroAnims.forEach((el) => el.setAttribute("data-anim-done", ""));
    }

    /* Hero cursor-follow spotlight on grid background */
    if (hero) {
      let cx = 50, cy = 50;
      let tx = 50, ty = 50;

      hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        tx = ((e.clientX - rect.left) / rect.width) * 100;
        ty = ((e.clientY - rect.top) / rect.height) * 100;
      });

      hero.addEventListener("mouseleave", () => {
        tx = 50;
        ty = 50;
      });

      gsap.ticker.add(() => {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        hero.style.setProperty("--cursor-x", cx.toFixed(2) + "%");
        hero.style.setProperty("--cursor-y", cy.toFixed(2) + "%");
      });
    }

    /* Scroll-triggered reveals for the rest of the page */
    if (hasScrollTrigger) {
      const targets = gsap.utils.toArray("[data-anim]:not([data-anim-done])");

      ScrollTrigger.batch(targets, {
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
              onComplete: () => {
                batch.forEach((el) => {
                  el.querySelectorAll("[data-count]").forEach(animateCount);
                });
              },
            }
          );
        },
      });

      ScrollTrigger.refresh();
    } else {
      gsap.set("[data-anim]:not([data-anim-done])", { opacity: 1, y: 0 });
      document.querySelectorAll("[data-count]").forEach(animateCount);
    }
  }

  /* ------------------------------------------------------------------ *
   * Preloader — enter animation, wait for page load, then exit + runMain
   * ------------------------------------------------------------------ */
  const preloaderEl = document.getElementById("preloader");

  if (preloaderEl) {
    /* Mark text slides up into view */
    gsap.fromTo(
      ".preloader-mark",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.25 }
    );

    /* Bar starts filling immediately — simulates loading progress */
    gsap.to(".preloader-fill", {
      scaleX: 0.82,
      duration: 1.5,
      ease: "power1.out",
      delay: 0.5,
    });

    const minWait = new Promise((r) => setTimeout(r, 1700));
    const pageLoad = new Promise((r) => {
      if (document.readyState === "complete") r();
      else window.addEventListener("load", r, { once: true });
    });

    Promise.all([minWait, pageLoad]).then(() => {
      gsap.timeline()
        /* Complete the bar */
        .to(".preloader-fill", { scaleX: 1, duration: 0.3, ease: "power2.in", overwrite: true })
        /* Fade mark up and out */
        .to(".preloader-mark", { opacity: 0, y: -28, duration: 0.35, ease: "power3.in" }, "-=0.1")
        /* Slide the whole panel upward */
        .to(preloaderEl, {
          yPercent: -100,
          duration: 0.8,
          ease: "power3.inOut",
          onComplete: () => {
            preloaderEl.style.display = "none";
            runMain();
          },
        });
    });
  } else {
    runMain();
  }
})();
