// // form fields
// const form = document.querySelector('.form-data');
// const region = document.querySelector('.region-name');
// const apiKey = document.querySelector('.api-key');
// // results
// const errors = document.querySelector('.errors');
// const loading = document.querySelector('.loading');
// const results = document.querySelector('.result-container');
// const usage = document.querySelector('.carbon-usage');
// const fossilfuel = document.querySelector('.fossil-fuel');
// const myregion = document.querySelector('.my-region');
// const clearBtn = document.querySelector('.clear-btn');

// function reset(e) {
//     e.preventDefault();
//     localStorage.removeItem('regionName');
//     init();
// }

// function init() {
//     const storedApiKey = localStorage.getItem('apiKey');
//     const storedRegion = localStorage.getItem('regionName');
//     //set icon to be generic green
//     //todo
//     if (storedApiKey === null || storedRegion === null) {
//         form.style.display = 'block';
//         results.style.display = 'none';
//         loading.style.display = 'none';
//         clearBtn.style.display = 'none';
//         errors.textContent = '';
//     } else {
//         // displayCarbonUsage(storedApiKey, storedRegion);
//         results.style.display = 'none';
//         form.style.display = 'none';
//         clearBtn.style.display = 'block';
//     }
// };

// function handleSubmit(e) {
//     e.preventDefault();
//     setUpUser(apiKey.value, region.value);
// }

// function setUpUser(apiKey, regionName) {
//     localStorage.setItem('apiKey', apiKey);
//     localStorage.setItem('regionName', regionName);
//     loading.style.display = 'block';
//     errors.textContent = '';
//     clearBtn.style.display = 'block';
//     // displayCarbonUsage(apiKey, regionName);
// }

// form.addEventListener('submit', (e) => handleSubmit(e));
// clearBtn.addEventListener('click', (e) => reset(e));
// init();

// 익스텐션 로컬 스토리지 저장
// form fields
const form = document.querySelector('.form-data');
const region = document.querySelector('.region-name');
const apiKey = document.querySelector('.api-key');
// results
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');
const usage = document.querySelector('.carbon-usage');
const fossilfuel = document.querySelector('.fossil-fuel');
const myregion = document.querySelector('.my-region');
const clearBtn = document.querySelector('.clear-btn');

function reset(e) {
    e.preventDefault();
    chrome.storage.local.remove(['regionName', 'apiKey'], () => {
        console.log('Data removed from chrome.storage.local');
        init();
    });
}

function init() {
    chrome.storage.local.get(['apiKey', 'regionName'], (items) => {
        const { apiKey: storedApiKey, regionName: storedRegion } = items;
        console.log('Fetched data from chrome.storage.local:', items);

        if (!storedApiKey || !storedRegion) {
            form.style.display = 'block';
            results.style.display = 'none';
            loading.style.display = 'none';
            clearBtn.style.display = 'none';
            errors.textContent = '';
        } else {
            results.style.display = 'none';
            form.style.display = 'none';
            clearBtn.style.display = 'block';
        }
    });
}

function handleSubmit(e) {
    e.preventDefault();
    setUpUser(apiKey.value, region.value);
}

function setUpUser(apiKey, regionName) {
    chrome.storage.local.set({ apiKey, regionName }, () => {
        console.log('Data saved to chrome.storage.local:', { apiKey, regionName });
        loading.style.display = 'block';
        errors.textContent = '';
        clearBtn.style.display = 'block';
    });
}

// Event listeners
form.addEventListener('submit', (e) => handleSubmit(e));
clearBtn.addEventListener('click', (e) => reset(e));
init();

