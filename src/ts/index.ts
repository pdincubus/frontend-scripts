import { debounce } from './utilities/general/debounce.js';
import { getWindowHeight } from './utilities/general/getWindowHeight.js';
import { getWindowWidth } from './utilities/general/getWindowWidth.js';

import MobileNav from './global/MobileNav.js';
import MobileFooterNav from './global/MobileFooterNav.js';
import ToolTip from './global/ToolTip.js';
import Alert from './global/Alert.js';

let currentWidth = getWindowWidth();
let currentHeight = getWindowHeight();

const tabletBreakpoint = 1280;
const mobileBreakpoint = 768;
const mobileNav = new MobileNav();
const mobileFooterNav = new MobileFooterNav();
const tooltips = document.querySelectorAll<HTMLElement>('.tooltip');
const alerts = document.querySelectorAll<HTMLElement>('.alert');

if (currentWidth < tabletBreakpoint ) {
    mobileNav.init();
}

if (currentWidth < mobileBreakpoint) {
    mobileFooterNav.init();
}

if (tooltips) {
    tooltips.forEach((tooltip) => {
        const thisTooltip = new ToolTip(
            tooltip,
            tooltip.querySelector<HTMLElement>('.toggle'),
            tooltip.querySelector<HTMLElement>('.content')
        );
    });
}

if (alerts) {
    alerts.forEach((alert) => {
        const thisAlert = new Alert(
            alert,
            alert.querySelector<HTMLElement>('.alert-close')
        );
    });
}

window.addEventListener('load', () => {
    document.documentElement.classList.remove('is_loading');
});

window.addEventListener('resize', debounce(() => {
    const newWidth = getWindowWidth();
    const newHeight = getWindowHeight();

    if (
        (newHeight !== currentHeight && newWidth === currentWidth)
        || (newWidth === currentWidth)
    ) {
        return false;
    }

    currentWidth = newWidth;
    currentHeight = newHeight;

    if (newWidth < tabletBreakpoint ) {
        mobileNav.init();
    }

    if (currentWidth < mobileBreakpoint) {
        mobileFooterNav.init();
    }

    if (newWidth >= tabletBreakpoint ) {
        mobileNav.destroy();
    }

    if (newWidth >= mobileBreakpoint ) {
        mobileFooterNav.destroy();
    }
}, 500));
