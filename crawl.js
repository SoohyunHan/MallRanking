
const cheerio = require('cheerio-without-node-native');
const axios = require('axios');
//const qs = require("querystring");

export const cralwer = async (mall_name, searchKeyword) => {
  var url_front = "https://search.shopping.naver.com/search/all.nhn?query=";
  var url_rear = "&pagingSize=40&viewType=list&sort=rel&frm=NVSHPAG&query=";
  var pageIndexKeyword = "&pagingIndex=";

  try {
    var result = new Array();
    var arrayNo = 1;
    for (var i = 1; i <= 10; i++) {
      var uri_unencoded = url_front + searchKeyword + pageIndexKeyword + i + url_rear + searchKeyword;
      const uri_encoded = encodeURI(uri_unencoded);
      const response = await axios(uri_encoded);
      const html = response.data;
      const $ = cheerio.load(html, { decodeEntities: false })
      $('li._itemSection').each(function (index, ele) {
        if ($(this).find("a.mall_img").text() == '') {
          //find 함수의 인수(찾고자 하는 태그의 조건) 중, 계층구조를 표현하고 싶을 때는, ">"를 사용하여 표현한다.
          mall_name_html = $(this).find("div>p>a>img").attr("alt");
        } else {
          mall_name_html = $(this).find("a.mall_img").text();
        }
        if (mall_name === mall_name_html) {
          result[arrayNo] = {
            "goods_name": $(this).find("a.link").attr("title"),
            "goods_link" : $(this).find("a.link").attr("href"),
            "rank": $(this).attr("data-expose-rank")
          };
          arrayNo++;
        }
      });
    }
    if(result.length == 0 ){
      result[0] = "NoMatch";
    }else{
      result[0] = "Matched";
    }
    return result;

  } catch (e) {
    console.error(e);
  }
}