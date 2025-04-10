import Chart from "chart.js/auto";

// Remember to update this data file when you add notes.
import data from "./data.json";

const hours = [...Array(24).keys()];
const hourData = data
  // The timestamp is UTC but that is not indicated so we add the 'Z'.
  .map((note) => new Date(`${note.timestamp}Z`).getHours())
  .reduce((acc, hour) => {
    acc[hour] = (acc[hour] ?? 0) + 1;
    return acc;
  }, {});

// console.log(data);
// console.log(new Date(data[0].timestamp + "Z"));
// console.log(new Date(data[data.length - 1].timestamp + "Z"));
// console.log(hours);
// console.log(hourData);

(async function () {
  // eslint-disable-next-line no-undef
  new Chart(document.getElementById("note-stats"), {
    type: "bar",
    data: {
      labels: hours,
      datasets: [
        {
          label: "Notes per Hour",
          data: hours.map((hour) => hourData[hour] ?? 0),
        },
      ],
    },
  });
})();
