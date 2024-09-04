# Auto Scroller Chrome Extension

**Auto Scroller** is a Chrome extension that allows you to control the scrolling speed of any webpage using a draggable widget. You can easily add URLs to automatically scroll pages, making it convenient for reading lengthy content without manual scrolling.

## Features

- **Auto Scroller Widget:** A draggable widget that lets you adjust the scrolling speed of the current webpage.
- **Domain-Specific Scrolling:** Add URLs to automatically activate the Auto Scroller on those pages.
- **User-Friendly Interface:** A clean and simple popup interface to manage URLs and control the widget.

## Installation

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/killuazoldyckreal/Auto-Scroller.git
    ```

2. Open Chrome and navigate to `chrome://extensions/`.

3. Enable "Developer mode" using the toggle switch in the upper-right corner.

4. Click "Load unpacked" and select the folder where you cloned the repository.

5. The Auto Scroller extension should now be installed and visible in your Chrome extensions toolbar.

## How to Use

1. **Activate the Widget:** 
   - The Auto Scroller widget is automatically displayed on websites that are added to the URL list.

2. **Adjust Scrolling Speed:**
   - Use the draggable widget on the left side of the screen to control the page's scrolling speed.
   - Double-click the widget to reset the scrolling speed to zero.

3. **Manage URLs:**
   - Click the extension icon to open the popup.
   - Enter the URL in the input field and click "Add URL" to add it to the Auto Scroller list.
   - To remove a URL, check the box next to it and click "Remove".

4. **Pagination:** 
   - If there are more than 5 URLs, navigate between pages using the "Prev" and "Next" buttons at the bottom of the popup.

## Customization

- **Popup Styling:** Modify the `popup.html` and `popup.js` files to customize the popup interface.
- **Widget Appearance:** Change the appearance of the Auto Scroller widget by editing `content.js`.

## Contribution

**Developer:** [killuazoldyckreal](https://github.com/killuazoldyckreal)

Contributions are welcome! If you have any suggestions or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
