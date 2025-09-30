export function bindParcelshopSelected(): void {
    window.addEventListener('evripsf-parcelshop_selected', (e: Event) => {
        const ce = e as CustomEvent<any>;
        const d = ce.detail;

        const get = (id: string) => document.getElementById(id) as HTMLInputElement | null;

        const idEl = get('selectedParcelShopID');
        const nameEl = get('selectedParcelShopName');
        const streetEl = get('selectedParcelShopStreet');
        const cityEl = get('selectedParcelShopCity');
        const pcEl = get('selectedParcelShopPostCode');
        const actionEl = get('action');
        const form = document.getElementById('deliveryForm') as HTMLFormElement | null;

        if (idEl) idEl.value = d?.externalId ?? '';
        if (nameEl) nameEl.value = d?.description ?? '';
        if (streetEl) streetEl.value = d?.address?.street ?? '';
        if (cityEl) cityEl.value = d?.address?.city ?? '';
        if (pcEl) pcEl.value = d?.address?.postCode ?? '';
        if (actionEl) actionEl.value = 'selectNewParcelShop';
        form?.submit();
    });
}