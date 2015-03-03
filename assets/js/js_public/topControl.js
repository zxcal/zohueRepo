var page=1;
var allow_create;
var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
var loaded=false;

$(window).load(function(){ // 暫存回覆頁面
  var url = document.URL;
  if(url.match('forum')!=null){
    var regex = /.*forum\/+(.*)/;
    page = url.replace(regex,"$1");
  }
});

$(document).ready(function(){
  checkAuth();

  

  $( "#setUp" ).click(function() {
    if(setUpMenu.style.display=="block"){
      setUpMenu.style.display="none";
    }else{
      setUpMenu.style.display="block";
    }
  });

  $( "#editProfile" ).click(function() {
    editProfile();
  });

  $( "#forum" ).click(function() {
    window.location.assign("/forum/1");
  });

  $( "#proInfo" ).click(function() {
    window.location.assign("/proInfo/1");
  });

  $( "#editProfile" ).click(function() {
    window.location.assign("/change");
  });
  $( "#editPW" ).click(function() {
    window.location.assign("/changePassword");
  });

});

function checkAuth() {
  $.get("/checkAuth", function(auth){
    if(auth) {
      var setUp=document.getElementById("setUp");
      setUp.style.display="inline";

      var login=document.getElementById("loginSection");
      login.style.display="none";

      var simpleS=document.getElementById("signup");
      if(simpleS){
        simpleS.style.display="none";
      }
      var profile=document.getElementById("profile");
      profile.style.display="block";
      document.getElementById("userAlias").innerHTML = "嗨！ "+auth.alias;
      document.getElementById("userimg").src = auth.img;

      var logout=document.getElementById("logout");
      logout.style.display="block";

      var post=document.getElementById("post");
      if(post){
        post.style.display="block";
      }

      var post=document.getElementById("post");
      if(post){
        post.style.display="block";
      }

      var leaveMessage=document.getElementById("leaveMessage");
      if(leaveMessage) {
        leaveMessage.style.display="block";
      }

      var postformmain=document.getElementById("post-form-main");
      if(postformmain) {
        postformmain.style.width="80%";
      }

      $.get("/checkFull", function(full){
        var fullSignup=document.getElementById("fullSignup");
        if(!full){
          fullSignup.style.display="block";
        }else{
          fullSignup.style.display="none";
        }
      });
    }else{
      var setUp=document.getElementById("setUp");
      setUp.style.display="none";

      var logout=document.getElementById("logout");
      logout.style.display="none";

      var post=document.getElementById("post");
      if(post){
        post.style.display="none";
      }

      var leaveMessage=document.getElementById("leaveMessage");
      if(leaveMessage) {
        leaveMessage.style.display="none";
      }

      var postformmain=document.getElementById("post-form-main");
      if(postformmain) {
        postformmain.style.width="54%";
      }
    }
  });
}


function check(){

  allow_create = 1;
  if($("#UserAlias").val() == ""){
    $("label[id = checkAlias]").text("  *這裡也要填喔！");allow_create = 0;
  }else{
    var len = $("#UserAlias").val().replace(/[^\x00-\xff]/g,"rr").length;
    if(len > 16){
      $("label[id = checkAlias]").text("  *暱稱不能超過 8 個中文字 / 16 個英文字喔！");allow_create = 0;
    }else{$("label[id = checkAlias]").text("");}
  }

  if($("#UserAccount").val() == ""){
    $("label[id = checkAccount]").text("  *這裡也要填喔！");allow_create = 0;
  }else{$("label[id = checkAccount]").text("");}

  if($("#UserPwd").val() == ""){
    $("label[id = checkPwd]").text("  *這裡也要填喔！");allow_create = 0;
  }else{$("label[id = checkPwd]").text("");}

  if($("#UserPwdConfirm").val() == ""){
    $("label[id = checkPwdConfirm]").text("  *這裡也要填喔！");allow_create = 0;
  }else{$("label[id = checkPwdConfirm]").text("");}

  if(allow_create==1) {
    if($("#UserEmail").val() != "") {
      checkEmail();
    } else {
      if(confirm("是否真的不要輸入 e-mail？")) {
      } else {
        allow_create=0;
      }
    }
    
  }
  if(allow_create==1) {
    checkPwd();
  }

  if(allow_create==1){
    Submit();
  }
}

function checkEmail(){
  if($("#UserEmail").val().search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)== -1){
    $("label[id = checkEmail]").text("  *E-mail格式錯誤！");
    allow_create = 0;
  }
  else {
    $("label[id = checkEmail]").text("");
  }
}

function checkPwd(){
  if($("#UserPwd").val() != $("#UserPwdConfirm").val()){
    $("label[id = checkPwdConfirm]").text("  *確認密碼和原設密碼不相同！");allow_create = 0;
  }
  else{
    $("label[id = checkPwdConfirm]").text("");
  }
}

function Submit(){
  var alias = $("#UserAlias").val();
  var account = $("#UserAccount").val();
  var password = $("#UserPwd").val();
  var email = $("#UserEmail").val();
  var type = $("#UserType").val();
  var posting = $.post( "/simpleSignup", { account: account, password: password, alias: alias, email: email, type: type, isFullSignup: false}, function(res){
    alert("註冊成功！");
    loginWithAccount(account, password);
  })
    .error(function(res){
      alert(res.responseJSON.err);
    });
}

function Login(){
  var args = arguments;
  var url = document.URL;
  switch (arguments.length) {
    case 2:
      var account=arguments[0];
      var password=arguments[1];
    break;
    default:
      var account=$("#LoginAccount").val();
      var password=$("#LoginPwd").val();
    break;
  }
  
  if(account == ""|| password == ""){
    alert("帳號密碼都要輸入唷！");
  } else {
    var posting = $.post( "/login", { account: account, password: password}, function(res){
    alert("登入成功！");
    location.replace(url);
  }).error(function(res){
      alert(res.responseJSON.err);
    });
  }
}

function loginWithAccount(account, password) {
    var posting = $.post( "/login", { account: account, password: password}, function(res){
      alert("登入成功！");
    location.reload();
  })
    .error(function(res){
      alert(res.responseJSON.err);
    });
}

function Logout(){
  var url = document.URL;
  var posting = $.post( "/logout", {}, function(res){
    alert("登出成功！");
    window.location.assign("/home");
  }).error(function(res){
    alert(res.responseJSON.err);
  });
}

function editProfile(){
  content.style.display="none";
}

function enterLogin(e) {
  var keynum;
  if(window.event) {
    keynum = e.keyCode;
  } else if(e.which) {
    keynum = e.which;
  }
  if(keynum=="13") {
    Login();
  } else {
    return true;
  }
}