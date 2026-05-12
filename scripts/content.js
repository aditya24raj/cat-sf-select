const minimumOptions = 10;

function main() {
    const selectElements = document.querySelectorAll("select:not(.cat-sf-select)");

    for (selectElement of selectElements) {
        if (
            selectElement.options == null // do not process select elements without any options
            || selectElement.options.length <= minimumOptions // do not process select elements where options are too few
            || selectElement.checkVisibility() === false // do not process select elements until they are visible. Their visibility may change later with new options.
        ) {
            continue;
        }

        selectElement.dataset.catsfselectid = selectElement.id ? selectElement.id : `catsfselectid_${crypto.randomUUID()}`;

        const searchElement = document.createElement('input');
        searchElement.id = selectElement.dataset.catsfselectid + '_choice';
        searchElement.setAttribute('list', selectElement.dataset.catsfselectid + '_list');
        searchElement.dataset.selectId = selectElement.dataset.catsfselectid;
        searchElement.style.margin = "3px 0px";
        searchElement.style.width = "stretch";
        searchElement.style.display = "block";
        searchElement.placeholder = "Search";

        searchElement.addEventListener(
            'change',
            (event) => {
                const datalist = document.getElementById(event.target.getAttribute('list'));
                const datalistOption = [...datalist.options]
                    .find(o => o.value === event.target.value);
                const selectElement = document.querySelector(`select[data-catsfselectid='${event.target.dataset.selectId}']`);

                if (!datalistOption || !selectElement) return;

                selectElement.value = datalistOption.dataset.value;
                selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                event.target.value = "";
            }
        );

        searchElement.addEventListener('mouseover', (event) => {
            // find select element using dataset.selectId
            const selectElement = document.querySelector(`select[data-catsfselectid='${event.target.dataset.selectId}']`);
            // find datalist element using getAttribute('list')
            const datalistElement = document.getElementById(event.target.getAttribute('list'));

            // check if select element & datalist elements have diverged
            let datalistOptions = new Set();
            for (const o of datalistElement.options) {
                datalistOptions.add(o.value);
            }

            let selectOptions = new Set();
            for (const o of selectElement.options) {
                selectOptions.add(`${o.text} (${o.value})`);
            }

            if (
                selectOptions.size !== datalistOptions.size 
                || [...selectOptions].some(o => !datalistOptions.has(o))
            ) {
                // remove exisiting options
                datalistElement.replaceChildren(); 

                // add new options
                for (const o of selectElement.options) {
                    const datalistOption = document.createElement('option');
                    datalistOption.value = `${o.text} (${o.value})`;
                    datalistOption.dataset.value = o.value;
                    datalistElement.appendChild(datalistOption);
                }
            }
        })

        const datalistElement = document.createElement('datalist');
        datalistElement.id = searchElement.getAttribute('list');
        for (const o of selectElement.options) {
            const datalistOption = document.createElement('option');
            datalistOption.value = `${o.text} (${o.value})`;
            datalistOption.dataset.value = o.value;
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

observer.observe(document.querySelector("body"), { childList: true, subtree: true });

