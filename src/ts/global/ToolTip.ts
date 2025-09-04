export default class ToolTip {
    private container: HTMLElement | null;
    private toggle: HTMLElement | null;
    private content: HTMLElement | null;
    private activeClass: string

    constructor(
        container: HTMLElement | null = document.querySelector('.tooltip'),
        toggle: HTMLElement | null,
        content: HTMLElement | null,
        activeClass = 'is_active',
    ) {
        this.container = container;
        this.toggle = toggle;
        this.content = content;
        this.activeClass = activeClass;

        if (!container || !toggle || !content) {
            console.log('ToolTip constructor exiting. Container:', container, 'Toggle:', toggle, 'Content:', content);

            return;
        }

        this.init();
    }

    public init(): void {
        console.log('ToolTip init');
        this.addEventListener();
    }

    public addEventListener(): void {
        const { toggle, container } = this;

        if (!toggle || !container) return;

        toggle.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();

            console.log('Toggle clicked');

            if (container.classList.contains(this.activeClass)) {
                this.close();
            } else {
                this.open();
            }
        });
    }

    public open(): void {
        console.log('ToolTip open');

        const { container } = this;

        if (!container) return;

        container.classList.add(this.activeClass);
    }

    public close(): void {
        console.log('ToolTip close');

        const { container } = this;

        if (!container) return;

        container.classList.remove(this.activeClass);
    }
}