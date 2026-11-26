// Medicine Tracker - frontend script.
//
// The backend API runs at BASE_URL (default http://localhost:8000).
//
// TASKS
// -----
// Core task 1: implement fetchMedicines() and renderMedicines(data) so the page
//   fetches /medicines and displays it WITHOUT crashing on missing or invalid
//   data. The data contains records with a null name, an empty-string name, a
//   missing name, a null price, a missing price, and a non-numeric price. Decide
//   how to display each case (e.g. show "Unknown" or flag it) without throwing.
//
// Core task 2: implement fetchUnreliable() so it calls /medicines/unreliable,
//   shows a useful message in the #error area when it fails, and retries
//   sensibly. Do NOT hammer the server: use a small number of retries with a
//   short delay between them, and give up cleanly after a few tries. The
//   endpoint fails about 30% of the time.
//
// Stretch: add an average-price endpoint in backend/main.py and call it here.

const BASE_URL = "http://localhost:8000";

// DOM elements (already present in index.html - no layout work needed).
const resultsEl = document.getElementById("results");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");

/**
 * TODO (Core task 1): fetch the list of medicines from /medicines.
 * Return the medicines array. Surface network/HTTP errors so the caller can show them.
 */
async function fetchMedicines() {
    console.log("Called");

    // TODO: fetch(`${BASE_URL}/medicines`), check response.ok, return the data.
    const response = await fetch(`${BASE_URL}/medicines`);
    if(response.ok) {
        // Parse and formats medicine data
        return parseMedicineData(response);
    }
    else {
        // Return error message
        // TODO in proper response format
        return response.statusText;
    }
}

/**
 * TODO (Core task 1): render the medicines into #results without crashing on
 * missing or invalid fields. Handle: null name, empty-string name, missing name,
 * null price, missing price, non-numeric price. Show something sensible for each.
 * TODO: clear the #error area on success.
 */
function renderMedicines(data) {
    // TODO: build a table (the .results styles expect a <table>), iterate the
    // records, and render each row safely. Use the .invalid class to flag bad
    // values if you like.

    // Create table element and add it to container resultsEl
    const table = document.createElement("table");
    resultsEl.append(table);

    // Create table header
    const t_head = document.createElement("thead");
    const t_head_row = document.createElement("tr");

    const t_head_name = document.createElement("td");
    t_head_name.innerText = "Name"

    const t_head_price = document.createElement("td");
    t_head_price.innerText = "Price"

    t_head_row.append(t_head_name);
    t_head_row.append(t_head_price);
    t_head.append(t_head_row);
    table.append(t_head);

    const t_body = document.createElement("tbody");

    // Creates table rows and adds them to table body
    data.forEach(row => {
        const t_row = document.createElement("tr")
        
        const r_name = document.createElement("td")
        r_name.innerText = row.name;

        const r_price = document.createElement("td")
        r_price.innerText = row.price;

        t_row.append(r_name);
        t_row.append(r_price);
        t_body.append(t_row);
    });

   table.append(t_body);
}

/**
 * TODO (Core task 2): fetch from /medicines/unreliable with sensible retries.
 * Retry a few times with a short delay between attempts (do not hammer the
 * server). When you give up, show a useful message in #error. On success,
 * render the data and clear #error. Show/hide the #loading area while working.
 */
async function fetchUnreliable() {
    // TODO: implement the retry loop here.
    const response = await fetch(`${BASE_URL}/medicines`);
    
    if(response.ok) {
        //calls parseMedicineData
        return parseMedicineData(response);
    }
    else {
        console.log(await response.json());
        // Create html element and displays error fail and retry for x amount of times and specific interval 
    }
}

// Format Medicine data for both routes and returns it
async function parseMedicineData(response) {
    // Parse response data into javascript object
    // Try/catch would be implemented in future
    const data = (await response.json()).medicines;

    // Counter variable for logging purposes
    var count = 0;

    // Map lists to readable format and return
    return data.map((medicine) => {
        var name = medicine.name;
        var price = medicine.price;

        if(!name) {
            console.log(`Medicine name is missing at element ${count}`)
            console.log(name)
            name = "<MEDICINE NAME MISSING>"
        }
        if(!price) {
            console.log(`Price is missing at element ${count}`)
            console.log(price)
            price = "<PRICE MISSING>"
        }
        
        // Converts price to string
        price = `${price}`

        // Increment index count
        count++;

        // Return formatted medicine data
        return {
            name,
            price 
        }
    })
}

// ---- Button wiring (already works - no need to change) ----
document.getElementById("load-medicines").addEventListener("click", async () => {
    // TODO: call fetchMedicines() then renderMedicines(data),

    // Waits for medicines to be fetched and parsed.
    const medicines_response = await fetchMedicines();
    
    // Check that medicines_response is valid
    // TODO

    renderMedicines(medicines_response);
    // showing #loading and clearing #error appropriately.
});

document.getElementById("load-unreliable").addEventListener("click", async () => {
    // TODO: call fetchUnreliable().
    const med = await fetchUnreliable();

    // render meds and show error message properly
    if(med) {
        renderMedicines(med);
    }
    else {
        // Display error on frontend properly, with error message and code for reportability
    }
});
