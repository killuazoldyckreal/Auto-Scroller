(function() {
    'use strict';

    function getDomain(url) {
        const a = document.createElement('a');
        a.href = url;
        return `${a.protocol}//${a.hostname}`;
    }

    function showAutoScroller() {
        let container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '10px';
        container.style.transform = 'translateY(-50%)';
        container.style.zIndex = '1000';
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        container.style.alignItems = 'center';
        container.style.cursor = 'grab';
        document.body.appendChild(container);

        let dragIcon = document.createElement('div');
        dragIcon.style.width = '30px';
        dragIcon.style.height = '30px';
        dragIcon.style.marginRight = '10px';
        dragIcon.style.borderRadius = '50%';
        dragIcon.style.border = '2px solid black';
        dragIcon.style.display = 'flex';
        dragIcon.style.alignItems = 'center';
        dragIcon.style.justifyContent = 'center';
        dragIcon.style.cursor = 'pointer';
        container.appendChild(dragIcon);

        let arrowUp = document.createElement('div');
        arrowUp.style.width = '0';
        arrowUp.style.height = '0';
        arrowUp.style.borderLeft = '4px solid transparent';
        arrowUp.style.borderRight = '4px solid transparent';
        arrowUp.style.borderBottom = '4px solid black';
        arrowUp.style.position = 'absolute';
        arrowUp.style.top = '67px';
        dragIcon.appendChild(arrowUp);

        let circle = document.createElement('div');
        circle.style.width = '4px';
        circle.style.height = '4px';
        circle.style.borderRadius = '50%';
        circle.style.backgroundColor = 'black';
        dragIcon.appendChild(circle);

        let arrowDown = document.createElement('div');
        arrowDown.style.width = '0';
        arrowDown.style.height = '0';
        arrowDown.style.borderLeft = '4px solid transparent';
        arrowDown.style.borderRight = '4px solid transparent';
        arrowDown.style.borderTop = '4px solid black';
        arrowDown.style.position = 'absolute';
        arrowDown.style.bottom = '67px';
        dragIcon.appendChild(arrowDown);

        let slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '-100';
        slider.max = '100';
        slider.value = '0';
        slider.style.height = '150px';
        slider.style.writingMode = 'vertical-rl';
        slider.style.transform = 'rotate(180deg)';
        slider.style.visibility = 'hidden';
        slider.style.transition = 'visibility 0.3s';
        container.appendChild(slider);

        let speedFactor = 0;
        let hideSliderTimeout = null;
        let isDragging = false;
        let initialMouseX, initialMouseY, initialContainerX, initialContainerY, offsetX, offsetY;

        slider.addEventListener('input', function() {
            speedFactor = -parseInt(this.value);
            clearTimeout(hideSliderTimeout);
            resetHideSliderTimeout();
        });

        function scrollPage() {
            window.scrollBy(0, speedFactor / 10);
            requestAnimationFrame(scrollPage);
        }

        scrollPage();

        function resetHideSliderTimeout() {
            clearTimeout(hideSliderTimeout);
            hideSliderTimeout = setTimeout(() => {
                slider.style.visibility = 'hidden';
            }, 3000);
        }

        dragIcon.addEventListener('click', function(e) {
            if (e.detail === 2) {
                speedFactor = 0;
                slider.value = '0';
            } else {
                clearTimeout(hideSliderTimeout);
                slider.style.visibility = 'visible';
                resetHideSliderTimeout();
            }
        });

        dragIcon.addEventListener('mousedown', function(e) {
            if (e.button === 0) {
                isDragging = true;
                dragIcon.style.cursor = 'grabbing';
                slider.style.visibility = 'visible';
                clearTimeout(hideSliderTimeout);

                initialMouseX = e.clientX;
                initialMouseY = e.clientY;
                initialContainerX = container.getBoundingClientRect().left;
                initialContainerY = container.getBoundingClientRect().top;
                offsetX = initialContainerX - e.clientX;
                offsetY = initialContainerY - e.clientY;
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const dx = e.clientX + offsetX;
                const dy = e.clientY + offsetY;

                let newLeft = dx;
                let newTop = dy;

                if (newLeft < 0) newLeft = 0;
                if (newTop < 0) newTop = 0;
                if (newLeft + container.offsetWidth > window.innerWidth) {
                    newLeft = window.innerWidth - container.offsetWidth;
                }
                if (newTop + container.offsetHeight > window.innerHeight) {
                    newTop = window.innerHeight - container.offsetHeight;
                }

                container.style.left = newLeft + 'px';
                container.style.top = newTop + 77 + 'px';
            }
        });

        document.addEventListener('mouseup', function(e) {
            if (isDragging && e.button === 0) {
                isDragging = false;
                dragIcon.style.cursor = 'pointer';
                resetHideSliderTimeout();
            }
        });

        dragIcon.ondragstart = function() {
            return false;
        };

        resetHideSliderTimeout();
    }

    function init() {
        chrome.storage.sync.get('urls', function(data) {
            const urls = data.urls || [];
            const currentUrl = window.location.href;
            const domain = getDomain(currentUrl);
            if (urls.includes(domain)) {
                showAutoScroller();
            }
        });
    }

    init();
})();
