let DateTime = luxon.DateTime;

// MutationRecord[], bool for <a> req
const filterMutationRecords = (mutations) => {
  let elements = [];
  mutations.forEach(function (mutationRecord) {
    // console.log("MUTATIONRECORD: ");
    // console.log(mutationRecord);
    let contents = mutationRecord.addedNodes;
    // check if item is actual HTML element first
    let validElement =
      contents.length > 0 && contents[0].nodeType == Node.ELEMENT_NODE;
    if (validElement) {
      // now check if element has a chat-time container for the time
      let timeTags = contents[0].getElementsByClassName("chat-time");
      if (timeTags.length == 1) {
        // TODO: why mutations get called many times ?
        if (!elements.includes(timeTags[0])) {
          elements.push(timeTags[0]);
        }
      }
    }
  });
  return elements;
};

// mutations: An array of MutationRecord objects
const observer = new MutationObserver(function (mutations) {
  let filtered = filterMutationRecords(mutations);
  if (filtered.length === 0) {
    return;
  }
  // console.log("FILTERED MUTATIONS:");
  // console.log(filtered);
  filtered.forEach(function (tag) {
    // console.log(tag.innerText);
    // change the time into a DateTime object
    if (tag.innerText.length > 5) {
      let time = DateTime.fromFormat(tag.innerText.toUpperCase(), "t");
      // convert into military
      // console.log(time.toLocaleString(DateTime.TIME_24_SIMPLE));
      tag.innerText = time.toLocaleString(DateTime.TIME_24_SIMPLE);
    }
  });
});

const config = {
  childList: true,
  subtree: true,
};

function main() {
  let all = document.body;
  observer.observe(all, config);
}

// TODO: fix this awfulness (what if chat takes more than 1s to load?)
setTimeout(main, 1000);

// console.log("runs");
