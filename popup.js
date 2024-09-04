document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('url-input');
    const addUrlButton = document.getElementById('add-url');
    const urlList = document.getElementById('url-list');
    const removeButton = document.getElementById('remove-button');
    const addSiteButton = document.getElementById('add-site-button');
    const messageDiv = document.getElementById('message');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');

    let currentTabId = null;
    let currentPage = 0;
    const urlsPerPage = 5;

    function getDomain(url) {
        const a = document.createElement('a');
        a.href = url;
        return `${a.protocol}//${a.hostname}`;
    }

    function reloadPage() {
        if (currentTabId !== null) {
            chrome.tabs.reload(currentTabId);
        }
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        currentTabId = currentTab.id;
        const currentUrl = currentTab.url;
        if (currentUrl.startsWith('http')) {
            addSiteButton.classList.remove('hidden');

            addSiteButton.addEventListener('click', function() {
                const domain = getDomain(currentUrl);
                chrome.storage.sync.get('urls', function(data) {
                    let urls = data.urls || [];
                    if (urls.includes(domain)) {
                        showMessage('Website already added');
                    } else {
                        urls.push(domain);
                        chrome.storage.sync.set({ urls: urls }, function() {
                            loadPage(Math.floor((urls.length - 1) / urlsPerPage));
                            reloadPage();
                        });
                    }
                });
            });
        } else {
            addSiteButton.classList.add('hidden');
        }
    });

    chrome.storage.sync.get('urls', function(data) {
        if (data.urls) {
            loadPage(0);
        }
    });

    function loadPage(page) {
		chrome.storage.sync.get('urls', function(data) {
			const urls = data.urls || [];
			const totalPages = Math.ceil(urls.length / urlsPerPage);
			currentPage = Math.min(page, totalPages - 1);

			urlList.innerHTML = '';

			const start = currentPage * urlsPerPage;
			const end = Math.min(start + urlsPerPage, urls.length);

			if (urls.length === 0) {
				urlList.innerHTML = `<li>No URLs added yet</li>`;
			} else {
				for (let i = start; i < end; i++) {
					addUrlToList(urls[i]);
				}
			}

			prevPageButton.disabled = currentPage === 0;
			nextPageButton.disabled = currentPage >= totalPages - 1;
		});
	}


    function addUrlToList(url) {
        const li = document.createElement('li');
        li.className = 'url-item';
        li.dataset.url = url;
        li.innerHTML = `
            <input type="checkbox" class="url-checkbox">
            <span>${url}</span>
        `;
        urlList.appendChild(li);
    }

    function updateButtonState() {
        const url = urlInput.value.trim();
        if (url) {
            addUrlButton.classList.remove('disabled');
            addUrlButton.disabled = false;
        } else {
            addUrlButton.classList.add('disabled');
            addUrlButton.disabled = true;
        }
    }

    urlInput.addEventListener('input', function() {
        updateButtonState();
    });

    addUrlButton.addEventListener('click', function() {
        const url = urlInput.value.trim();
        if (url) {
            const domain = getDomain(url);
            chrome.storage.sync.get('urls', function(data) {
                let urls = data.urls || [];
                if (urls.includes(domain)) {
                    showMessage('Website already added');
                } else {
                    urls.push(domain);
                    chrome.storage.sync.set({ urls: urls }, function() {
                        loadPage(Math.floor((urls.length - 1) / urlsPerPage));
                        urlInput.value = '';
                        updateButtonState();
                        reloadPage();
                    });
                }
            });
        }
    });

    prevPageButton.addEventListener('click', function() {
        if (currentPage > 0) {
            loadPage(currentPage - 1);
        }
    });

    nextPageButton.addEventListener('click', function() {
        chrome.storage.sync.get('urls', function(data) {
            const urls = data.urls || [];
            if ((currentPage + 1) * urlsPerPage < urls.length) {
                loadPage(currentPage + 1);
            }
        });
    });

    urlList.addEventListener('change', function(event) {
        if (event.target.classList.contains('url-checkbox')) {
            const checkedCheckboxes = urlList.querySelectorAll('.url-checkbox:checked');
            if (checkedCheckboxes.length > 0) {
                removeButton.classList.remove('hidden');
            } else {
                removeButton.classList.add('hidden');
            }
        }
    });

    removeButton.addEventListener('click', function() {
        const checkedCheckboxes = urlList.querySelectorAll('.url-checkbox:checked');
        const urlsToRemove = Array.from(checkedCheckboxes).map(cb => cb.parentElement.dataset.url);

        chrome.storage.sync.get('urls', function(data) {
            let urls = data.urls || [];
            urls = urls.filter(u => !urlsToRemove.includes(u));
            chrome.storage.sync.set({ urls: urls }, function() {
                loadPage(currentPage);
                removeButton.classList.add('hidden');
                showMessage('Removed URLs successfully');
                reloadPage();
            });
        });
    });

    function showMessage(message) {
        messageDiv.textContent = message;
        messageDiv.classList.remove('hidden');
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 3000);
    }
});
