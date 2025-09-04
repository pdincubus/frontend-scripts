import { makeTabbable } from "../utilities/general/makeTabbable.js";

export default class MobileFooterNav {
    private container: HTMLElement | null = null;
    private activeClass: string = 'is_active';
    private toggleClass: string = 'toggle';
    private sectionLinksClass: string = 'nav-links';
    private sectionContainClass: string = 'nav-section'
    private toggles!: NodeListOf<HTMLElement>;
    private sections!: NodeListOf<HTMLElement>;
    private isReady = false;

    constructor (
        container: HTMLElement | null = document.getElementById('foot-nav'),
        toggleClass = 'toggle',
        activeClass = 'is_active',
        sectionLinksClass = 'nav-links',
        sectionContainClass = 'nav-section'
    ) {
        this.container = container;
        this.toggleClass = toggleClass;
        this.activeClass = activeClass;
        this.sectionLinksClass = sectionLinksClass;
        this.sectionContainClass = sectionContainClass;

        if (!this.container) {
            console.log('MobileFooterNav: constructor exiting.');

            return;
        }

        this.toggles = this.container.querySelectorAll<HTMLElement>(`.${this.toggleClass}`);
        this.sections = this.container.querySelectorAll<HTMLElement>(`.${this.sectionLinksClass}`);

        //console.log(this.container, this.toggleClass, this.sectionLinksClass, this.sectionContainClass, this.activeClass, this.toggles, this.sections);

        this.isReady = true;
    }

    public init(): void {
        if (!this.isReady) return;

        this.setSectionHeights();
        this.addToggleListeners();

        this.toggles.forEach(toggle => {
            toggle.removeAttribute('tabindex');

            const closestNavSection = toggle.closest(`.${this.sectionContainClass}`);

            if (!closestNavSection) return;

            const section = closestNavSection.querySelector<HTMLElement>(`.${this.sectionLinksClass}`);

            if (!section) return;

            this.close(toggle, section);
        });

        //console.log('MobileFooterNav: init.');
    }

    public setSectionHeights(): void {
        if (!this.container) return;

        //console.log('MobileFooterNav: setSectionHeights.');

        this.sections.forEach((section: HTMLElement) => {
            section.dataset.height = section.offsetHeight.toString();
        });
    }

    private addToggleListeners(): void {
        //console.log('MobileFooterNav: addToggleListeners.');

        this.toggles.forEach((toggle: HTMLElement) => {
            if (toggle.dataset.listenerAdded !== undefined) return;

            toggle.addEventListener('click', (e: MouseEvent) => {
                e.preventDefault();

                const closestNavSection = toggle.closest(`.${this.sectionContainClass}`);

                if (!closestNavSection) return;

                const section = closestNavSection.querySelector<HTMLElement>(`.${this.sectionLinksClass}`);

                //console.log(toggle, section);

                if (!section) return;

                //console.log('Eventlisteners: section:', section, 'toggle:', toggle);

                if (toggle.classList.contains(this.activeClass)) {
                    this.close(toggle, section);
                } else {
                    this.open(toggle, section);
                }
            });

            toggle.dataset.listenerAdded = 'true';
        });
    }

    private open(toggle: HTMLElement, section: HTMLElement): void {
        if (!this.isReady || !this.container) return;

        const sectionTabbableItems = Array.from(
            section.querySelectorAll<HTMLElement>('a, button, [role="menuitem"], [tabindex]')
        );

        //console.log('MobileFooterNav: open. section:', section, 'toggle:', toggle, 'tabbable:', sectionTabbableItems);

        toggle.classList.add(this.activeClass);
        toggle.setAttribute('aria-expanded', 'true');
        section.classList.add(this.activeClass);
        section.style.height = `${section.dataset.height || 0}px`;

        makeTabbable(sectionTabbableItems, 'enable');
    }

    public close(toggle: HTMLElement, section: HTMLElement): void {
        if (!this.isReady || !this.container) return;

        //console.log('MobileFooterNav: close. section:', section, 'toggle:', toggle);

        const sectionTabbableItems = Array.from(
            section.querySelectorAll<HTMLElement>('a, button, [role="menuitem"], [tabindex]')
        );

        toggle.classList.remove(this.activeClass);
        toggle.setAttribute('aria-expanded', 'false');
        section.classList.remove(this.activeClass);
        section.style.height = '0px';

        makeTabbable(sectionTabbableItems, 'disable');
    }

    public destroy(): void {
        if (!this.isReady || !this.container ) return;

        //console.log('MobileFooterNav: destroy.');

        this.toggles.forEach((toggle: HTMLElement) => {
            toggle.classList.remove(this.activeClass);
        });

        this.sections.forEach((section: HTMLElement) => {
            const sectionTabbableItems = Array.from(
                section.querySelectorAll<HTMLElement>('a, button, [role="menuitem"], [tabindex]')
            );

            section.removeAttribute('style');
            makeTabbable(sectionTabbableItems, 'remove');
        });

        this.isReady = false;
    }
}