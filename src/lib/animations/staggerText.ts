import gsap from "gsap";

export const staggerText = (elements: Element[] | string | NodeList, options = {}) => {
    return gsap.fromTo(
        elements,
        { y: 40, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.12,
            ...options,
        }
    );
};
