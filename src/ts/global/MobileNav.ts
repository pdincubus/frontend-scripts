import { makeTabbable } from "../utilities/general/makeTabbable.js";

export default class MobileNav {
    private container: HTMLElement | null;
    private toggle: HTMLElement | null;
    private closeToggle: HTMLElement | null;
    private activeClass: string;
    private containerHeight?: number;
    private navTabbableItems: HTMLElement[] = [];
    private isReady = false;

    constructor(
        container: HTMLElement | null = document.getElementById('main-nav'),
        toggle: HTMLElement | null = document.getElementById('main-nav-toggle'),
        closeToggle: HTMLElement | null = document.getElementById('main-nav-close'),
        activeClass = 'is_active',
    ) {
        this.container = container;
        this.toggle = toggle;
        this.closeToggle = closeToggle;
        this.activeClass = activeClass;

        if (!container || !toggle || !closeToggle) {
            console.log('MobileNav exiting. container:', container, 'toggle:', toggle, 'closeToggle:', closeToggle);

            return;
        }

        this.isReady = true;

        this.navTabbableItems = Array.from(
            container.querySelectorAll<HTMLElement>('a, button, [role="menuitem"], [tabindex]')
        );

        //console.log(this.navTabbableItems);
    }

    public init(): void {
        if (!this.isReady) return;

        //console.log('MobileNav: init.');

        this._addToggleListeners();
        this._addKeyboardListener();
        this._setNavHeight();
        this.close();
        this.container!.setAttribute('aria-live', 'assertive');
    }

    private _addToggleListeners(): void {
        if (!this.toggle || !this.closeToggle || this.toggle.dataset.listenerAdded !== undefined) return;

        //console.log('MobileNav: _addToggleListener. listener already added:', this.toggle.dataset.listenerAdded);

        this.toggle.addEventListener('click', (e: MouseEvent) => {
            console.log('MobileNav: toggle click');

            e.preventDefault();

            if (this.toggle!.classList.contains(this.activeClass)) {
                this.close();
            } else {
                this.open();
            }
        });

        this.closeToggle.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            this.close();
        });

        this.toggle.dataset.listenerAdded = 'true';
    }

    private _addKeyboardListener(): void {
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            this.close();
        });
    }

    private _setNavHeight(): void {
        if (!this.container) return;

        this.containerHeight = this.container.offsetHeight;
        this.container.dataset.height = this.containerHeight.toString();
    }

    private open(): void {
        if (!this.isReady || !this.container || !this.toggle || !this.closeToggle) return;

        this.toggle.classList.add(this.activeClass);
        this.toggle.setAttribute('aria-expanded', 'true');

        this.container.classList.add(this.activeClass);
        this.container.style.height = `${this.container.dataset.height || 0}px`;

        makeTabbable(this.navTabbableItems, 'enable');
    }

    public close(): void {
        if (!this.isReady || !this.container || !this.toggle || !this.closeToggle) return;

        this.toggle.classList.remove(this.activeClass);
        this.toggle.setAttribute('aria-expanded', 'false');

        this.container.classList.remove(this.activeClass);
        this.container.style.height = '0px';

        makeTabbable(this.navTabbableItems, 'disable');
    }

    public destroy(): void {
        if (!this.isReady || !this.container || !this.toggle || !this.closeToggle) return;

        console.log('Destroying nav. Tabbables:', this.navTabbableItems);

        this.container.removeAttribute('aria-live');
        this.container.removeAttribute('style');

        this.toggle.classList.remove(this.activeClass);
        this.toggle.setAttribute('aria-expanded', 'false');

        makeTabbable(this.navTabbableItems, 'remove');

        this.isReady = false;
    }
}