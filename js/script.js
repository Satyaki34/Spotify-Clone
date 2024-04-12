console.log("Working....");

let currsong = new Audio();

let Songs;

window.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

async function getSongs() {
  let a = await fetch("/songs/");
  let response = await a.text();
  //   console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let x = div.getElementsByTagName("a");
  let songs = [];
  let arr = Array.from(x);
  arr.forEach((element) => {
    if (element.href.includes(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  });
  return songs;
}

function downloadSong(songName) {
  const link = document.createElement("a");
  link.href = `/songs/${songName}`;
  link.download = songName;
  link.click();
}

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

function generateRandomDarkColor() {
  // Generating random dark color
  var red = Math.floor(Math.random() * 128); // Red component
  var green = Math.floor(Math.random() * 128); // Green component
  var blue = Math.floor(Math.random() * 128); // Blue component
  var darkColor = "rgb(" + red + "," + green + "," + blue + ")";
  return darkColor;
}
function changeBackgroundColor() {
  var colorBox = document.getElementById("randomColor");
  var color = generateRandomDarkColor();
  colorBox.style.backgroundColor = color;
}
// Change background color gradually to a random dark color every 1 second
setInterval(changeBackgroundColor, 1000);

const playMusic = (name, artist) => {
  // let music=new Audio(`/songs/${name}~${artist}.mp3`)
  console.log(name);
  nameChanger = `/songs/${name}~${artist}.mp3`;
  currsong.src = nameChanger;
  currsong.play();
  play.src = "img/pause.svg";
  document.querySelector(".playinfo").innerHTML = name;
  document.querySelector(".playtime").innerHTML = "";
};
(async function () {
  Songs = await getSongs();

  for (const song of Songs) {
    let ol = document.querySelector("ol");
    ol.innerHTML += `
              <li>
                <img class="invert music" src="img/music.svg" alt="">
                <div class="info">
                  <div>${song.replaceAll("%20", " ").split("~")[0]}</div>
                  <div>${song
        .replaceAll("%20", " ")
        .split("~")[1]
        .replace(".mp3", "")}</div>
                </div>
                <img class="invert dwnld" src="img/download.svg" alt="" onclick="downloadSong('${song}')">
              </li>`;
  }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (elem) => {
      console.log(
        e.querySelector(".info").firstElementChild.innerHTML,
        e.querySelector(".info").lastElementChild.innerHTML
      );
      playMusic(
        e.querySelector(".info").firstElementChild.innerHTML,
        e.querySelector(".info").lastElementChild.innerHTML
      );
    });
  });

  play.addEventListener("click", () => {
    if (currsong.paused) {
      currsong.play();
      play.src = "img/pause.svg";
    } else {
      currsong.pause();
      play.src = "img/play.svg";
    }
  });

  currsong.addEventListener("timeupdate", () => {
    // console.log(currsong.currentTime,currsong.duration)
    document.querySelector(".playtime").innerHTML = `${secondsToMinutesSeconds(
      currsong.currentTime
    )} / ${secondsToMinutesSeconds(currsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currsong.currentTime / currsong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    document.querySelector(".circle").style.left =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
    currsong.currentTime =
      (currsong.duration *
        (e.offsetX / e.target.getBoundingClientRect().width) *
        100) /
      100;
  });

  // const volume = document.getElementById("volume");
  // const volumeIcon = volume.querySelector("img");

  // volume.addEventListener("click", () => {
  //   console.log(volumeIcon);
  //   volumeIcon.src = "volumeMute.svg";
    
  // });



  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log(e.target.value);
      currsong.volume = parseInt(e.target.value) / 100;
    });



})();

document
  .querySelector(".nav")
  .firstElementChild.addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });

document.querySelector(".logo").children[1].addEventListener("click", () => {
  document.querySelector(".left").style.left = -100 + "%";
});

previous.addEventListener("click", () => {
  let index = Songs.indexOf(currsong.src.split("/")[4]);
  if (index >= 1) {
    let name, artist;
    name = Songs[index - 1].split("~")[0].replace(/%20/g, " ");
    artist = Songs[index - 1].split("~")[1].split(".mp3")[0];
    console.log(name, artist);
    playMusic(name, artist);
    // console.log(index,Songs[index-1],currsong);
  } else {
    console.log("not possible");
  }
});

next.addEventListener("click", () => {
  let index = Songs.indexOf(currsong.src.split("/")[4]);
  if (index + 1 < Songs.length) {
    let name, artist;
    name = Songs[index + 1].split("~")[0].replace(/%20/g, " ");
    artist = Songs[index + 1].split("~")[1].split(".mp3")[0];
    console.log(name, artist);
    playMusic(name, artist);
    // console.log(index,Songs[index-1],currsong);
  } else {
    console.log("not possible");
  }



  
});
