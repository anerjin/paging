var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  async = require('async'),
  articleModel = mongoose.model('Article');

module.exports = function (app) {
  app.use('/', router);
};

// 일반 페이징
router.get('/', function (req, res) {
  // 현재 페이징 번호 쿼리스트링으로 값을 받습니다.
  var pageNum = Number(req.query.page);

  // 만약 페이징 번호가 없을 시에는 1로 설정
  if(!pageNum){
    pageNum = 1;
  }

  // 페이지에서 보여줄 컨텐츠 개수 설정
  var contentSize = 10;

  // 다음 페이지 갈 때 건너뛸 컨텐츠 개수 구하기
  var skipSize = (pageNum-1)*contentSize;

  var pnEnd,pnSize,pnStart,totalCount,pnTotal,thisArticle;

  async.waterfall([
    function(callback){
      // 컬렉션에 총 글 개수를 넘깁니다. (만약 해당 글에 조건이 있을 경우 카운트도 마찬가지로 조건을 동일하게)
      articleModel.count({},function(err, TotalCount){
        callback(null, TotalCount);
      });
    },
    function(TotalCount,callback){
      totalCount = TotalCount;
      // 페이지네이션의 전체 카운트 구하기
      pnTotal = Math.ceil(TotalCount/contentSize);
        // 페이지네이션 보여줄 개수 설정
      pnSize = 10;
        // 현재 페이지의 페이지네이션 시작 번호
      pnStart = ((Math.ceil(pageNum/pnSize) - 1) * pnSize) + 1;
        // 현재 페이지의 페이지네이션 끝 번호
      pnEnd = (pnStart + pnSize) - 1;

      articleModel.find({}).sort({_id: -1})
      .skip(skipSize) // 건너뛸 개수
      .limit(contentSize) // 컨텐츠 개수
      .exec(function(err, Article){
        // 페이지네이션 끝 번호가 페이지네이션 전체 카운트보다 높을 경우
        if(pnEnd > pnTotal){
        pnEnd = pnTotal;
        }
        thisArticle = {
          contents: Article,
          pageNum: pageNum,
          pnStart: pnStart,
          pnEnd: pnEnd,
          pnTotal: pnTotal
        };
        callback(null, thisArticle);
      });
    }
  ],function(err, Articles){
      if (err) {
        throw err;
      } else {
        res.render('normal',{
          title: '일반 페이징',
          articles: Articles
        });
      }
    }
  );
});

// 일반 Ajax 페이징
router.get('/normalAjax', function (req, res) {
  res.render('normalAjax',{
    title: '일반 Ajax 페이징'
  });
});

// 일반 Ajax 페이징 처리
router.post('/normalAjax', function (req, res) {
  // 현재 페이지 번호 값을 받습니다.
  var pageNum = req.body.page;

  // 페이지에서 보여줄 컨텐츠 개수 설정
  var contentSize = 10;

  // 다음 페이지 갈 때 건너뛸 리스트 개수 구하기
  var skipSize = (pageNum-1)*contentSize;

  var pnEnd,pnSize,pnStart,totalCount,pnTotal,thisArticle;

  async.waterfall([
    function(callback){
      // 컬렉션에 글 개수를 넘깁니다. (만약 해당 글에 조건이 있을 경우 카운트도 마찬가지로 조건을 동일하게)
      articleModel.count({},function(err, TotalCount){
        callback(null, TotalCount);
      });
    },
    function(TotalCount,callback){
      totalCount = TotalCount;
      // 페이지네이션의 전체 카운트 구하기
      pnTotal = Math.ceil(TotalCount/contentSize);
      // 페이지네이션 보여줄 개수 설정
      pnSize = 10;
      // 현재 페이지의 페이지네이션 시작 번호
      pnStart = ((Math.ceil(pageNum/pnSize) - 1) * pnSize) + 1;
      // 현재 페이지의 페이지네이션 끝 번호
      pnEnd = (pnStart + pnSize) - 1;

      articleModel.find({}).sort({_id: -1})
      .skip(skipSize) // 건너뛸 개수
      .limit(contentSize) // 컨텐츠 개수
      .exec(function(err, Article){
        // 페이지네이션 끝 번호가 페이지네이션 전체 카운트보다 높을 경우
        if(pnEnd > pnTotal){
        pnEnd = pnTotal;
        }
        thisArticle = {
          contents: Article,
          pnStart: pnStart,
          pnEnd: pnEnd,
          pnTotal: pnTotal
        };
        callback(null, thisArticle);
      });
    }
  ],function(err, Articles){
      if (err) {
        throw err;
      } else if (Articles.contents.length > 0) {
        res.json({result: true, articles: Articles});
      } else {
        res.json({result: false});
      }
    }
  );
});

// 더 보기 Ajax 페이징
router.get('/add', function (req, res) {
  res.render('add',{
    title: '더 보기 테스트'
  });
});

// 더 보기 Ajax 페이징 처리
router.post('/add', function (req, res) {
  // 현재 페이지 번호 값을 받습니다.
  var pageNum = req.body.page;

  // 페이지 컨텐츠 개수 설정
  var contentSize = 10;

  // 다음 페이지 갈 때 건너뛸 컨텐츠 개수 구하기
  var skipSize = (pageNum-1)*contentSize;

  var pnEnd,pnSize,pnStart,totalCount,pnTotal,thisArticle;

  async.waterfall([
    function(callback){
      // 컬렉션에 총 글 개수를 넘깁니다. (만약 해당 글에 조건이 있을 경우 카운트도 마찬가지로 조건을 동일하게)
      articleModel.count({},function(err, TotalCount){
        callback(null, TotalCount);
      });
    },
    function(TotalCount,callback){
      totalCount = TotalCount;
      // 페이지네이션의 전체 카운트 구하기
      pnTotal = Math.ceil(TotalCount/contentSize);

      articleModel.find({}).sort({_id: -1})
      .skip(skipSize) // 건너뛸 개수
      .limit(contentSize) // 컨텐츠 개수
      .exec(function(err, Article){

        thisArticle = {
          contents: Article,
          pnTotal: pnTotal
        };
        callback(null, thisArticle);
      });
    }
  ],function(err, Articles){
      if (err) {
        throw err;
      } else if (Articles.contents.length > 0) {
        res.json({result: true, articles: Articles});
      } else {
        res.json({result: false});
      }
    }
  );
});

// 무한 스크롤 Ajax 페이징
router.get('/scroll', function (req, res) {
  res.render('scroll',{
    title: 'Masonry + Infinite Scroll'
  });
});

// 무한 스크롤 Ajax 페이징 처리
router.post('/scroll', function (req, res) {
  // 현재 페이지 번호 값을 받습니다.
  var pageNum = req.body.page;

  // 페이지 보여줄 컨텐츠 개수 설정
  var contentSize = 12;

  // 다음 페이지 갈 때 건너뛸 컨텐츠 개수 구하기
  var skipSize = (pageNum-1)*contentSize;

  var pnEnd,pnSize,pnStart,totalCount,pnTotal,thisArticle;

  async.waterfall([
    function(callback){
      // 컬렉션에 글 개수를 넘깁니다. (만약 해당 글에 조건이 있을 경우 카운트도 마찬가지로 조건을 동일하게)
      articleModel.count({},function(err, TotalCount){
        callback(null, TotalCount);
      });
    },
    function(TotalCount,callback){
      totalCount = TotalCount;
      // 페이지네이션의 전체 카운트 구하기
      pnTotal = Math.ceil(TotalCount/contentSize);

      articleModel.find({}).sort({_id: -1})
      .skip(skipSize) // 건너뛸 개수
      .limit(contentSize) // 컨텐츠 개수
      .exec(function(err, Article){

        thisArticle = {
          contents: Article,
          pnTotal: pnTotal
        };
        callback(null, thisArticle);
      });
    }
  ],function(err, Articles){
      if (err) {
        throw err;
      } else if (Articles.contents.length > 0) {
        res.json({result: true, articles: Articles});
      } else {
        res.json({result: false});
      }
    }
  );
});

router.get('/view/:_id',function(req,res){
  var param = req.params._id;
  articleModel.findOne({_id: param},function(err,Article){
    res.render('view',{
      title: 'view 페이지',
      article: Article
    });
  });
});

// dummy insert
router.get('/test/:count',function(req,res){
  var count = req.params.count;
  if(!count){
    res.redirect('back');
  }else{
    var articles = [];
    for(var i = 1; i<=count; i++){
      articles.push({
        title: i+'번째 제목',
        text: i+'번째 글',
        image: '/img/'+Math.floor((Math.random()*10)+1)+'.jpg'
      });
    }
    articleModel.insertMany(articles, function(err,Result){
      if(err){
        throw err;
      }else{
        res.redirect('/');
      }
    });
  }
});
