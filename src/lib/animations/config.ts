import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export const initGsap = () => {
    if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        gsap.defaults({
            ease: "power3.out",
            duration: 1,
        });
    }
};
