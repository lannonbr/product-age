// replace no-js class with js class which allows us to write css that targets non-js or js enabled users separately
document.body.classList.replace("no-js", "js");

const routePrefix = document
  .querySelector("meta[name='routePrefix']")
  .getAttribute("content");

async function run() {
  const { Chart } = await import("chart.js/auto");
  const data = await fetch(`${routePrefix}/products`).then((resp) =>
    resp.json()
  );

  let groupByWeekPrice = new Map();
  let weekPriceVals = [
    ["under $1.00", 0, 1],
    ["under $5.00", 1, 5],
    ["under $10.00", 5, 10],
    ["under $20.00", 10, 20],
    ["under $50.00", 20, 50],
    ["over $50.00", 50],
  ];

  for (let vals of weekPriceVals) {
    if (vals.length == 3) {
      groupByWeekPrice.set(
        vals[0],
        data.filter(
          (item) =>
            parseFloat(item.weeklyCost) >= vals[1] &&
            parseFloat(item.weeklyCost) < vals[2]
        ).length
      );
    } else {
      groupByWeekPrice.set(
        vals[0],
        data.filter((item) => parseFloat(item.weeklyCost) >= vals[1]).length
      );
    }
  }

  let groupByAge = new Map();
  let ageVals = [
    ["under half a year", 0, 180],
    ["under 1 year", 180, 365],
    ["under 2 years", 365, 730],
    ["under 3 years", 730, 1095],
    ["under 4 years", 1095, 1460],
    ["under 5 years", 1460, 1825],
    ["over 5 years", 1825],
  ];

  for (let vals of ageVals) {
    if (vals.length == 3) {
      groupByAge.set(
        vals[0],
        data.filter(
          (item) =>
            parseFloat(item.days) >= vals[1] && parseFloat(item.days) < vals[2]
        ).length
      );
    } else {
      groupByAge.set(
        vals[0],
        data.filter((item) => parseFloat(item.days) >= vals[1]).length
      );
    }
  }

  let weeklyCostChart = document.getElementById("weeklyCostChart");
  new Chart(weeklyCostChart, {
    type: "bar",
    data: {
      labels: [...groupByWeekPrice.keys()],
      datasets: [
        {
          label: "weekly price",
          data: [...groupByWeekPrice.values()],
        },
      ],
    },
  });

  let ageChart = document.getElementById("ageChart");
  new Chart(ageChart, {
    type: "bar",
    data: {
      labels: [...groupByAge.keys()],
      datasets: [
        {
          label: "Age",
          data: [...groupByAge.values()],
        },
      ],
    },
  });
}

run();
