// API URL for CoinGecko (we're fetching multiple cryptocurrencies)
const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,cardano,ripple,litecoin";

const cryptoTableBody = document.querySelector("#crypto-table tbody");
const ctx = document.getElementById("btcChart").getContext("2d");
let btcChart;

// Fetch Cryptocurrency Data
async function fetchCryptoData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Clear previous data in table
        cryptoTableBody.innerHTML = '';

        // Populate Crypto Table
        data.forEach(coin => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${coin.name}</td>
                <td>$${coin.current_price.toFixed(2)}</td>
                <td>${coin.price_change_percentage_24h.toFixed(2)}%</td>
            `;
            cryptoTableBody.appendChild(row);
        });

        // Create Bitcoin Price Trend Chart
        const timestamps = data[0].sparkline_in_7d.price.slice(0, 10); // Bitcoin 7-day price history
        updateChart(timestamps);
    } catch (error) {
        console.error("Error fetching cryptocurrency data:", error);
    }
}

// Update the Graph for Bitcoin
function updateChart(prices) {
    if (btcChart) {
        btcChart.destroy();
    }

    btcChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: prices.map((_, index) => `Day ${index + 1}`), // Create labels (Day 1, Day 2, ...)
            datasets: [{
                label: "Bitcoin (BTC) 7-Day Trend",
                data: prices,
                borderColor: "#007bff",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Day" } },
                y: { title: { display: true, text: "Price (USD)" } }
            }
        }
    });
}

// Fetch data and update every minute
fetchCryptoData();
setInterval(fetchCryptoData, 60000); // Refresh data every minute
