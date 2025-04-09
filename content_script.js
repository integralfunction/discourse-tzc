let DateTime = luxon.DateTime;
// console.log("runs");

// mutations: MutationRecord[]
const filterMutationRecords = (mutations) => {
  let elements = [];
  mutations.forEach(function (mutationRecord) {
    let contents = mutationRecord.addedNodes;
    // check if item is actual HTML element first
    let validElement =
      contents.length > 0 && contents[0].nodeType == Node.ELEMENT_NODE;
    if (validElement) {
      // now check if element has a chat-time container for the time
      let timeTags = contents[0].getElementsByClassName("chat-time");
      if (timeTags.length === 1) {
        // TODO: why mutations get called many times ?
        if (!elements.includes(timeTags[0])) {
          // console.log("THIS element gets added:");
          // console.log(timeTags[0]);
          elements.push(timeTags[0]);
        }
      }
    }
  });
  return elements;
};

const config = {
  childList: true,
  subtree: true,
};

// the format that discourse uses for full dates, except military time instead
// Example: Apr 8, 2025 13:03
const format = {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: false,
};

const changeSingleElement = (tag) => {
  // make a luxon object
  let date = DateTime.fromFormat(tag.title, "DD t");
  // convert into military
  let convertedTime = date.toLocaleString(DateTime.TIME_24_SIMPLE);
  // modify tag
  tag.title = date.toLocaleString(format);
  tag.textContent = convertedTime;
  return tag;
};

// TODO; inefficient
function convertLatestMessageTime() {
  let timeTags = document.body.getElementsByClassName("chat-time");
  let indx = timeTags.length - 1;
  let latestMessage = timeTags.item(indx);
  changeSingleElement(latestMessage);
  console.log("converted!");
}

// mutations: MutationRecord[]
const observer = new MutationObserver(function (mutations) {
  let filtered = filterMutationRecords(mutations);
  if (filtered.length === 0) {
    return;
  }
  filtered.forEach(function (tag) {
    changeSingleElement(tag);
    if (tag.nodeName === "SPAN") {
      // TODO
      setTimeout(convertLatestMessageTime, 2000);
    }
  });
});

function main() {
  let all = document.body;
  observer.observe(all, config);
}

main();
