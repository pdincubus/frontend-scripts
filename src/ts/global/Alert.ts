export default class Alert {
    private container: HTMLElement | null;
    private toggle: HTMLElement | null;
    private activeClass: string

    constructor(
        container: HTMLElement | null = document.querySelector('.tooltip'),
        toggle: HTMLElement | null,
        activeClass = 'is_active',
    ) {
        this.container = container;
        this.toggle = toggle;
        this.activeClass = activeClass;

        if (!container || !toggle) {
            console.log('Alert constructor exiting. Container:', container, 'Toggle:', toggle);

            return;
        }

        this.init();
    }

    public init(): void {
        console.log('Alert init');
        this.addEventListener();
    }

    public addEventListener(): void {
        const { toggle } = this;

        if (!toggle) return;

        toggle.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            
            this.close();
        });
    }

    public close(): void {
        console.log('Alert close');

        const { container } = this;

        if (!container) return;

        container.classList.remove(this.activeClass);
    }
}