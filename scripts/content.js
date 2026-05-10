function main() {
    const selectElements = document.querySelectorAll("select:not([class~='cat-sf-select'])");

    for (const [index, selectElement] of selectElements.entries()) {
        selectElement.dataset.catsfselectid = selectElement.id ? selectElement.id : `catsfselectid_${index}`;
           
        const searchElement = document.createElement('input');
        searchElement.id = selectElement.dataset.catsfselectid + '_choice';
        searchElement.name = searchElement.id;
        searchElement.setAttribute('list', selectElement.dataset.catsfselectid + '_list');
        searchElement.dataset.selectId = selectElement.dataset.catsfselectid;
        searchElement.style.margin = "3px 0px";
        searchElement.style.width = "stretch";
        searchElement.style.display = "block";

        try {
            let placeholder = "";
            document.querySelector(`label[for='${selectElement.dataset.catsfselectid}']`).childNodes.forEach((i) => {
                if (i.nodeType === Node.TEXT_NODE) {
                    placeholder += i.textContent;
                }
            });
            searchElement.placeholder = `Search ${placeholder}`;
        } catch (error) {
            searchElement.placeholder = "Search the options above";
        }  

        searchElement.addEventListener(
            'change',
            (event) => {
                const datalistOption = document.querySelector(`#${event.target.getAttribute('list')} option[data-text='${event.target.value}']`);
                const selectElement = document.querySelector(`select[data-catsfselectid='${event.target.dataset.selectId}']`);
                selectElement.value = datalistOption.dataset.value;
                selectElement.dispatchEvent(new Event('change'));
                event.target.value = null;
            }
        );

        const datalistElement = document.createElement('datalist');
        datalistElement.id = searchElement.getAttribute('list');
        for (const o of selectElement.options) {
            const datalistOption = document.createElement('option');
            datalistOption.value = o.text;
            datalistOption.dataset.value = o.value;
            datalistOption.dataset.text = o.text;
            datalistElement.appendChild(datalistOption);
        }

        selectElement.parentElement.appendChild(searchElement);
        selectElement.parentElement.appendChild(datalistElement);
        selectElement.classList.add('cat-sf-select');
    }
}

const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
}


const observer = new MutationObserver(debounce(
    main,
    250
));

observer.observe(document.querySelector("body"), { attributes: true, childList: true, subtree: true });

