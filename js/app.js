function QueryKeyword(keyword, site, callback) {
  let querykeyword = keyword;
  let website = site;

  if (website == "bing") {
    $.ajax({
      url: "https://api.bing.com/osjson.aspx?JsonType=callback&JsonCallback=?",
      jsonp: "jsonp",
      dataType: "jsonp",
      data: {
        Query: querykeyword,
        Market: "en-us",
      },
      success: callback,
    });
  }

  if (website == "google") {
    $.ajax({
      url: "https://suggestqueries.google.com/complete/search",
      jsonp: "jsonp",
      dataType: "jsonp",
      data: {
        q: querykeyword,
        client: "chrome",
      },
      success: callback,
    });
  }

  if (website == "youtube") {
    $.ajax({
      url: "https://suggestqueries.google.com/complete/search",
      jsonp: "jsonp",
      dataType: "jsonp",
      data: {
        q: querykeyword,
        client: "chrome",
        ds: "yt",
      },
      success: callback,
    });
  }

  if (website == "yahoo") {
    $.ajax({
      url: "https://search.yahoo.com/sugg/gossip/gossip-us-ura/",
      dataType: "jsonp",
      data: {
        command: querykeyword,
        nresults: "20",
        output: "jsonp",
      },
      success: callback,
    });
  }

  if (website == "ebay") {
    $.ajax({
      url: "https://autosug.ebay.com/autosug",
      dataType: "jsonp",
      data: {
        kwd: querykeyword,
        v: "jsonp",
        _dg: "1",
        sId: "0",
      },
      success: callback,
    });
  }

  if (website == "amazon") {
    $.ajax({
      url: "https://completion.amazon.com/search/complete",
      dataType: "jsonp",
      data: {
        q: querykeyword,
        method: "completion",
        "search-alias": "aps",
        mkt: "1",
      },
      success: callback,
    });
  }
}

function CleanVal(input) {
  let val = input;
  val = val.replace("\\u003cb\\u003e", "");
  val = val.replace("\\u003c\\/b\\u003e", "");
  val = val.replace("\\u003c\\/b\\u003e", "");
  val = val.replace("\\u003cb\\u003e", "");
  val = val.replace("\\u003c\\/b\\u003e", "");
  val = val.replace("\\u003cb\\u003e", "");
  val = val.replace("\\u003cb\\u003e", "");
  val = val.replace("\\u003c\\/b\\u003e", "");
  val = val.replace("\\u0026amp;", "&");
  val = val.replace("\\u003cb\\u003e", "");
  val = val.replace("\\u0026", "");
  val = val.replace("\\u0026#39;", "'");
  val = val.replace("#39;", "'");
  val = val.replace("\\u003c\\/b\\u003e", "");
  val = val.replace("\\u2013", "2013");
  if (val.length > 4 && val.substring(0, 4) == "http") val = "";
  return val;
}

$(document).ready(function () {
  $("#search").keyup(function () {
    let keyword = $("#search").val();
    let linkStyle = "text-teal-900 hover:underline hover:text-teal-400 py-1";

    $("#cards").removeClass("hidden");

    QueryKeyword(keyword, "google", function (res) {
      let retList = res[1];
      let keyList = retList.reduce((acc, key) => {
        let trim = CleanVal(key);
        let encoded = encodeURIComponent(trim);
        return (
          acc +
          `<a class="${linkStyle}" href="https://www.google.com/search?q=${encoded}" target="_blank">${trim}</a><br />`
        );
      }, "");

      // retList.map((e) => {
      //   let trim = CleanVal(e);
      //   let encoded = encodeURIComponent(trim);

      //   keyList += `<a class="${linkStyle}" href="https://www.google.com/search?q=${encoded}" target="_blank">${trim}</a><br />`;
      // });

      $("#google").empty().append(keyList);

      CopyFunc("google", retList);
    });

    QueryKeyword(keyword, "yahoo", function (res) {
      let keyList = "";
      let { results } = res.gossip;

      let newKeyList = results.map((e) => e[1]);
      console.log({ newKeyList });

      results.map((e) => {
        let trim = CleanVal(e.key);
        let encoded = encodeURIComponent(trim);

        keyList += `<a class="${linkStyle}" href="https://search.yahoo.com/search?p=${encoded}" target="_blank" class="live">${trim}</a><br />`;
      });
      $("#yahoo").empty().append(keyList);

      CopyFunc("yahoo", results);
    });

    QueryKeyword(keyword, "bing", function (res) {
      let retList = res[1];
      let keyList = "";

      retList.map((e) => {
        let trim = CleanVal(e);
        let encoded = encodeURIComponent(trim);

        keyList += `<a class="${linkStyle}" href="http://www.bing.com/search?q=${encoded}" target="_blank">${trim}</a><br />`;
      });

      $("#bing").empty().append(keyList);

      CopyFunc("bing", retList);
    });

    QueryKeyword(keyword, "youtube", function (res) {
      let retList = res[1];
      let keyList = "";

      retList.map((e) => {
        let trim = CleanVal(e);
        let encoded = encodeURIComponent(trim);

        keyList += `<a class="${linkStyle}" href="https://www.youtube.com/results?search_query=${encoded}" target="_blank" class="live">${trim}</a><br />`;
      });
      $("#youtube").empty().append(keyList);

      CopyFunc("youtube", retList);
    });

    QueryKeyword(keyword, "amazon", function (res) {
      let retList = res[1];
      let keyList = "";

      retList.map((e) => {
        let trim = CleanVal(e);
        let encoded = encodeURIComponent(trim);

        keyList += `<a class="${linkStyle}" href="http://www.amazon.com/s/?field-keyList=${encoded}" target="_blank" class="live">${trim}</a><br />`;
      });
      $("#amazon").empty().append(keyList);

      CopyFunc("amazon", retList);
    });

    QueryKeyword(keyword, "ebay", function (res1) {
      let retList = res1.res.sug;
      let keyList = "";

      retList.map((e) => {
        let trim = CleanVal(e);
        let encoded = encodeURIComponent(trim);

        keyList += `<a class="${linkStyle}" href="http://www.ebay.com/sch/i.keyList?_nkw=${encoded}" target="_blank" class="live">${trim}</a><br />`;
      });
      $("#ebay").empty().append(keyList);

      CopyFunc("ebay", retList);
    });
  });
});

function CopyFunc(cId, keywords) {
  const keys = keywords;
  console.log(keys);
  const id = cId;

  const copyKeys = id.toUpperCase() + "\n" + keys.join("\n");

  const copyButton = document.querySelector(".copy." + id);
  copyButton.addEventListener("click", function (e) {
    navigator.clipboard.writeText(copyKeys);

    copyButton.innerHTML = "Copied";
    setTimeout(function () {
      copyButton.innerHTML = `<i class="fas fa-copy"></i><span> Copy</span>`;
    }, 3000);
  });
}
