import gsap from "gsap";

export const heroTimeline = (
    headline: Element | string,
    subtext: Element[] | string | NodeList,
    buttons: Element[] | string | NodeList,
    background?: Element | string
) => {
    const tl = gsap.timeline();

    tl.fromTo(
        headline,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    tl.fromTo(
        subtext,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.12 },
        "-=0.6"
    );

    tl.fromTo(
        buttons,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1 },
        "-=0.6"
    );

    if (background) {
        tl.fromTo(
            background,
            { opacity: 0 },
            { opacity: 1, duration: 2, ease: "power2.inOut" },
            0
        );
    }

    return tl;
};
