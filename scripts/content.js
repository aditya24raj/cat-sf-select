function main() {
    const selectElements = document.querySelectorAll("select:not([class~='cat-sf-select'])");

    for (const selectElement of selectElements) {   
        const searchElement = document.createElement('input');
        searchElement.id = selectElement.id + '_choice';
        searchElement.name = searchElement.id;
        searchElement.setAttribute('list', selectElement.id + '_list');
        searchElement.dataset.selectId = selectElement.id;
        searchElement.style.marginTop = "3px";
        searchElement.style.width = "stretch";
        searchElement.placeholder = "search the options";    
        searchElement.addEventListener(
            'change',
            (event) => {
                const datalistOption = document.querySelector(`#${event.target.getAttribute('list')} option[data-text='${event.target.value}']`);
                const selectElement = document.querySelector(`#${event.target.dataset.selectId}`);
                selectElement.value = datalistOption.dataset.value;
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

