// Put all the javascript code here, that you want to execute after page load.
let DateTime = luxon.DateTime;
// let now = DateTime.now();
// console.log(now.toString());

// given a NodeList of chat messages, we change the time on each one
// almost always 1 node (new chat message) to loop thru, but we are being careful just in case
function changeDates(nodeList) {
  nodeList.forEach(function (node, currentIndex, listObj) {
    // in discourse each chat is enveloped in lots of divs and parents, we must isolate the actual element whose innerHTML is the time
    // relies on the fact that each node must contain at least one child element (and not say, a plain <a> tag)
    let timeContainer = node.getElementsByClassName("chat-time")[0];
    // change the time into a DateTime object
    let time = DateTime.fromFormat(timeContainer.innerHTML.toUpperCase(), "t");
    // convert into military
    // console.log(time.toLocaleString(DateTime.TIME_24_SIMPLE));
    timeContainer.innerHTML = time.toLocaleString(DateTime.TIME_24_SIMPLE);
  }, "myThisArg");
}

// mutations: An array of MutationRecord objects
const observer = new MutationObserver(function (mutations) {
  console.log("ALL MUTATIONS:");
  console.log(mutations);
  console.log("FUNCTION BEGINGS:");
  mutations.forEach(function (mutationRecord) {
    // console.log("MUTATIONRECORD: ");
    // console.log(mutationRecord);
    if (mutationRecord.addedNodes.length != 0) {
      if (
        mutationRecord.addedNodes[0].nodeType == Node.ELEMENT_NODE &&
        mutationRecord.addedNodes[0].getElementsByClassName("chat-time")
          .length == 1
      ) {
        console.log("MUTATIONRECORD: ");
        console.log(mutationRecord);
        // changeDates(mutationRecord.addedNodes);
        let timeContainer =
          mutationRecord.addedNodes[0].getElementsByClassName("chat-time")[0];
        console.log(timeContainer);
        // change the time into a DateTime object
        let time = DateTime.fromFormat(
          timeContainer.innerText.toUpperCase(),
          "t"
        );
        // convert into military
        console.log(time.toLocaleString(DateTime.TIME_24_SIMPLE));
        timeContainer.innerText = time.toLocaleString(DateTime.TIME_24_SIMPLE);
        // console.log(
        //   mutationRecord.addedNodes[0].getElementsByClassName("chat-time")
        // );
      }
    }
  });
});

const config = {
  childList: true,
  subtree: true,
};

// change dates initially on page load (is this really needed? mutationobserver observes initial page load too)
function changeDatesInitially(nodeList) {
  let l = 0;
  nodeList.forEach(function (node, currentIndex, listObj) {
    if (node.nodeType == Node.ELEMENT_NODE) {
      l++;
      // first 2 elements arent messages
      if (l > 2) {
        console.log(node);
        let timeContainer = node.getElementsByClassName("chat-time")[0];
        let time = DateTime.fromFormat(
          timeContainer.innerHTML.toUpperCase(),
          "t"
        );

        console.log(timeContainer.innerHTML);
        timeContainer.innerHTML = time.toLocaleString(DateTime.TIME_24_SIMPLE);
      }
    }
  }, "myThisArg");
}

function main() {
  // match exclusive for discourse
  // for some reason discourse uses a chat-message-container class for the container which contains ALL the chat messages, so we want to select only the container whose body is the chat messages. If confusing,  just look at dom tree of a discourse chat
  try {
    let all = document.body.querySelectorAll(
      ".chat-messages-container:not(.-processed)"
    )[0];
    console.log(all.childNodes);
  } catch (err) {
    //
  }
  changeDatesInitially(all.childNodes);

  // change dates on each dom change
  observer.observe(all, config);
}

// todo: fix this horrendous code
setTimeout(main, 1000);

console.log("runs");
