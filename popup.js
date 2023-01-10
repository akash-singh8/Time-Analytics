function addDetails(site, mins, colour, favIcon, total) {
  const analytics = document.getElementById("analytics");

  const mainDiv = document.createElement("div");
  mainDiv.classList.add("siteDetails");
  mainDiv.style.boxShadow = `0 0 5px ${colour}`;
  mainDiv.addEventListener("mouseenter", function () {
    mainDiv.style.boxShadow = `0 0 10px ${colour}`;
  });
  mainDiv.addEventListener("mouseleave", function () {
    mainDiv.style.boxShadow = `0 0 5px ${colour}`;
  });

  const img = document.createElement("img");
  img.setAttribute("src", favIcon);
  img.setAttribute("alt", "icon");
  img.classList.add("favIcon");
  mainDiv.appendChild(img);

  const divParent = document.createElement("div");
  divParent.classList.add("detailsParent");
  mainDiv.appendChild(divParent);

  const div1 = document.createElement("div");
  div1.classList.add("details");
  divParent.appendChild(div1);

  const title = document.createElement("span");
  title.innerText = site;
  div1.appendChild(title);

  const time = document.createElement("span");
  time.innerText = `${mins} m`;
  div1.appendChild(time);

  const div2 = document.createElement("div");
  div2.classList.add("hourProgress");
  div2.style.backgroundColor = colour;
  div2.style.width = `${(mins / total) * 100}%`;
  divParent.appendChild(div2);

  analytics.appendChild(mainDiv);
}

const colors = [
  "rgb(200, 234, 255)",
  "rgb(0, 255, 204)",
  "rgb(0, 183, 255)",
  "rgb(255, 158, 3)",
  "rgb(234, 255, 3)",
  "rgb(24, 255, 3)",
  "rgb(255, 3, 221)",
  "rgb(250, 35, 146)",
  "rgb(3, 234, 255)",
  "rgb(211, 35, 250)",
  "rgb(213, 3, 255)",
  "rgb(250, 60, 35)",
  "rgb(185, 250, 35)",
  "rgb(169, 161, 255)",
  "rgb(250, 137, 137)",
  "rgb(156, 250, 137)",
  "rgb(255, 3, 146)",
  "rgb(156, 250, 137)",
  "rgb(232, 32, 229)",
  "rgb(232, 32, 229)",
  "rgb(237, 146, 71)",
  "rgb(237, 201, 71)",
  "rgb(220, 237, 71)",
  "rgb(143, 237, 71)",
  "rgb(71, 237, 140)",
  "rgb(71, 237, 193)",
  "rgb(71, 231, 237)",
  "rgb(71, 207, 237)",
  "rgb(71, 160, 237)",
  "rgb(71, 160, 237)",
  "rgb(237, 71, 223)",
  "rgb(237, 71, 190)",
  "rgb(237, 71, 140)",
  "rgb(237, 71, 96)",
  "rgb(175, 238, 238)",
  "rgb(237, 166, 166)",
];

// Retrieve data from local storage and update it
chrome.storage.local.get(null, function (result) {
  if (result) {
    const dataArr = Object.entries(result).sort((a, b) => b[1][0] - a[1][0]);

    const noDataPic = document.getElementById("noData");
    if (dataArr.length < 2) {
      noDataPic.style.display = "block";
    } else {
      noDataPic.style.display = "none";
    }

    let total = 0;
    let titles = [],
      time = [],
      barColors = [];

    for (let i = 1; i < dataArr.length; i++) {
      const data = dataArr[i];
      titles.push(data[0]);
      time.push(Math.floor(data[1][0] / 60));
      total += data[1][0];
      barColors.push(colors[i % 34]);
    }

    const timeUsage = document.getElementById("timeUsage");
    const totalId = document.getElementById("total");
    if (total < 60) {
      timeUsage.style.display = "block";
      totalId.style.display = "none";
    } else {
      timeUsage.style.display = "none";
      totalId.style.display = "block";
    }

    for (let i = 1; i < dataArr.length; i++) {
      const data = dataArr[i];
      addDetails(
        data[0],
        Math.floor(data[1][0] / 60),
        colors[i % 34],
        data[1][1],
        Math.floor(total / 60)
      );
    }

    // Setting up the Total Time
    total = total / 60;
    let hrs = Math.floor(total / 60);
    if (hrs < 10) hrs = `0${hrs}`;
    let mins = Math.floor(total % 60);
    if (mins < 10) mins = `0${mins}`;
    totalId.querySelector("p strong").innerText = hrs;
    totalId.querySelector("p:last-child strong").innerText = `${mins}`;

    const siteChart = document.getElementById("siteChart");
    new Chart("siteChart", {
      type: "doughnut",
      data: {
        labels: titles,
        datasets: [
          {
            borderWidth: 1,
            borderColor: "rgba(50, 50, 50, 1)",
            backgroundColor: barColors,
            data: time,
          },
        ],
      },
      options: {
        legend: { display: false },
      },
    });
  }
});
