import * as $ from 'jquery';

function createAnalytics() {
    let counter = 0;
    let isDestroyed = false;
    const listener = () => {
        console.log(++counter, '222');
    };

    $(document).on('click', listener);

    return {
        destroy() {
            document.addEventListener('click', listener);
            isDestroyed = true;
        },

        getClicks() {
            if (isDestroyed) {
                return 'Analytics has been destroyed'
            }

            return counter;
        }
    }
}

window.analytics = createAnalytics();
