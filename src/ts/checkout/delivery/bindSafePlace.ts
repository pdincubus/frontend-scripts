export function bindSafePlace(
    container: ParentNode = document
): void {
    const select = container.querySelector<HTMLSelectElement>('[data-safeplace-select]');
    const other = container.querySelector<HTMLInputElement>('[data-safeplace-other]');
    const activeClass = 'is_active';

    if (!select || !other) return;

    const update = () => {
        const isOther = select.value === 'Z:Other';
        if (isOther) {
            other.classList.add(activeClass);
            other.classList.remove('is_hidden');
        } else {
            other.classList.remove(activeClass);
            other.classList.add('is_hidden');
            other.value = '';
        }
    };

    select.addEventListener('change', update);
    update();
}