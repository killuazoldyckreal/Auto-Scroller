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
        container.style.width = 'fit-content';
        container.style.height = 'fit-content';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.transform = 'translateY(-50%)';
        container.style.padding = '10px';
        container.style.backgroundColor = '#ffffff';
        container.style.borderRadius = '10px';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        container.style.cursor = 'grab';
        container.style.zIndex = '1000';
        document.body.appendChild(container);

        let slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '-100';
        slider.max = '100';
        slider.value = '0';
        slider.style.alignSelf = 'center';
        slider.style.width = '20px'; 
        slider.style.height = '150px'; 
        slider.style.writingMode = 'vertical-rl'; 
		slider.style.transform = 'rotate(180deg)';
        slider.style.background = 'transparent';
        container.appendChild(slider);

        let dragIcon = document.createElement('div');
        dragIcon.style.width = '20px';
        dragIcon.style.height = '20px';
        dragIcon.style.marginTop = '10px';
        dragIcon.style.backgroundColor = '#007BFF';
        dragIcon.style.borderRadius = '50%';
        dragIcon.style.cursor = 'pointer';
		dragIcon.style.alignSelf = 'center';
        container.appendChild(dragIcon);

        let speedFactor = 0;
        let clickTimeout = null;

        slider.addEventListener('input', function() {
            speedFactor = -parseInt(this.value);
        });

        function scrollPage() {
            window.scrollBy(0, speedFactor / 10);
            requestAnimationFrame(scrollPage);
        }

        scrollPage();

        let isDragging = false;

        dragIcon.addEventListener('mousedown', function(e) {
            if (e.button === 0) {
                if (clickTimeout) {
                    clearTimeout(clickTimeout);
                    clickTimeout = null;
                    speedFactor = 0;
                    slider.value = '0';
                } else {
                    clickTimeout = setTimeout(() => {
                        isDragging = true;
                        dragIcon.style.cursor = 'grabbing';
                        clickTimeout = null;
                    }, 400);
                }
            }
        });

        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            if (isDragging) {
                isDragging = false;
                dragIcon.style.cursor = 'pointer';
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                let shiftX = e.clientX - container.offsetWidth / 2;
                let shiftY = e.clientY - container.offsetHeight / 2;

                if (shiftX < 0) shiftX = 0;
                if (shiftY < 0) shiftY = 0;
                if (shiftX + container.offsetWidth > window.innerWidth) {
                    shiftX = window.innerWidth - container.offsetWidth;
                }
                if (shiftY + container.offsetHeight > window.innerHeight) {
                    shiftY = window.innerHeight - container.offsetHeight;
                }

                container.style.left = shiftX + 'px';
                container.style.top = shiftY + 'px';
            }
        });

        document.addEventListener('mouseup', function(e) {
            if (isDragging && e.button === 2) {
                isDragging = false;
                dragIcon.style.cursor = 'pointer';
            }
        });

        dragIcon.ondragstart = function() {
            return false;
        };
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
