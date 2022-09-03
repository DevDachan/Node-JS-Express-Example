
module.exports ={
  color_list:function(){
    return `
    <table border="1" >
      <tr> <td colspan="2">Room time table color </td></tr>
      <tr>
        <td width="100">사람 수</td>
        <td width="100">색상</td>
      </tr>
      <tr>
        <td width="100">0명</td>
        <td width="100"  style="background-color:#FFF0F5">  </td>
      </tr>
      <tr>
        <td width="100">1명</td>
        <td width="100"  style="background-color:#65FFBA">  </td>
      </tr>
      <tr>
        <td width="100">2명</td>
        <td width="100"  style="background-color:#87F5F5">  </td>
      </tr>
      <tr>
        <td width="100">2명 이상</td>
        <td width="100"  style="background-color:#FFBCB9">  </td>
      </tr>
    </table>
    `;
  },
  time_table1:function(us_tb,babgo_list){
    var body = `
    <tr> <td colspan="8">Room time table </td></tr>
    <tr>
      <td width="50">교시</td>
      <td width="50">월</td>
      <td width="50">화</td>
      <td width="50">수</td>
      <td width="50">목</td>
      <td width="50">금</td>
      <td width="50">토</td>
      <td width="50">일</td>
    </tr>
    `;
    var temp = '';
    for(var i = 0; i< 7; i++){
      temp = `<td width="50"> ${i+1} </td>`;
      for(var k = 0; k< 7; k++){
        if(us_tb[k][i] === "밥고"){
        temp += `
          <td width="50" style="background-color: ${babgo_list[k][i]};">${us_tb[k][i]}</td>`;
        }
        else{
          temp += `
            <td width="50" style="background-color: ${babgo_list[k][i]};"> </td>`
        }
      }
        body += `<tr>${temp}</tr>`;
    }
    return `
      <table border="1" >
      ${body}
      </table>
    `;
  },
  time_table2_main:function(my_tb,room_id){
    var day = ['월','화','수','목','금','토','일' ];
    var body = `
    <tr> <td colspan="8">My time table</td></tr>
    <tr>
      <td width="50">교시</td>
      <td width="50">월</td>
      <td width="50">화</td>
      <td width="50">수</td>
      <td width="50">목</td>
      <td width="50">금</td>
      <td width="50">토</td>
      <td width="50">일</td>
    </tr>
    `;
    var temp = '';
    for(var i = 0; i< 7; i++){
      temp = `<td width="50"> ${i+1} </td>`;
      for(var k = 0; k< 7; k++){
        var buf = "";
        if(my_tb[k][i] !== ' '){
          buf = my_tb[k][i];
        }
        else{
          buf = "       ";
        }
          temp += `
            <td width="50">
              <form method="post" id="form" >
                <input type="hidden" name="room_id" value="${room_id}">
                <input type="hidden" id="newTitle" name="newTitle">
                <input type="button" id="bt" value="${buf}"
                style=
                "
                font:15px;
                border: 0px;
                background: white;
                font-weight: 600;
                color: #646464;;
                "
                 onclick="btclick(${k},${i});">
                <script>
                  function btclick(a,b){
                    var result = document.getElementById("newTitle");
                    var temp = prompt('바꿀 내용을 입력해주세요 ','삭제 입력시 삭제');
                    result.value = temp;
                    var form = document.getElementById("form");
                    form.action = "/user/update_table?day=" + a + "&time=" +b;
                    form.submit();

                  }
                </script>
              </form>
            </td>
          `
          ;
      }
      body += `<tr>${temp}</tr>`
    }
    return `
      <table border="1">
      ${body}
      </table>
    `;
  },
  time_table2:function (my_tb,room_id){
    var day = ['월','화','수','목','금','토','일' ];
    var body = `
    <tr> <td colspan="8">My time table</td></tr>
    <tr>
      <td width="50">교시</td>
      <td width="50">월</td>
      <td width="50">화</td>
      <td width="50">수</td>
      <td width="50">목</td>
      <td width="50">금</td>
      <td width="50">토</td>
      <td width="50">일</td>
    </tr>
    `;
    var temp = '';
    for(var i = 0; i< 7; i++){
      temp = `<td width="50"> ${i+1} </td>`;
      for(var k = 0; k< 7; k++){
        var buf = "";
        if(my_tb[k][i] !== ' '){
          buf = my_tb[k][i];
        }
        else{
          buf = "       ";
        }
          temp += `
            <td width="50">
              <form method="post" id="form" >
                <input type="hidden" name="room_id" value="${room_id}">
                <input type="hidden" id="newTitle" name="newTitle">
                <input type="button" id="bt" value="${buf}" style=
                "
                font:15px;
                border: 0px;
                background: white;
                font-weight: 600;
                color: #646464;;
                "
                 onclick="btclick(${k},${i});">
                <script>
                  function btclick(a,b){
                    var result = document.getElementById("newTitle");
                    var temp = prompt('바꿀 내용을 입력해주세요 ','삭제 입력시 삭제');
                    result.value = temp;
                    var form = document.getElementById("form");
                    form.action = "/room/update_table?day=" + a + "&time=" +b;
                    form.submit();

                  }
                </script>
              </form>
            </td>
          `
          ;
      }
      body += `<tr>${temp}</tr>`
    }
    return `
      <table border="1">
      ${body}
      </table>
    `;
  },
  room_list:function(room_list){
      var body = `
      <tr> <td colspan="4">참여 방 list </td></tr>
      <tr>
        <td width="100">state</td>
        <td width="100">room_id</td>
        <td width="100" colspan="2">room_name</td>
      </tr>

      `;
      for(var k = 0; k< room_list.length; k++){
          body += `
          <tr>
            <td width="100">${room_list[k].state}</td>
            <td width="100">
              ${room_list[k].room_id}
            </td>
            <td width="100">${room_list[k].room_name}</td>
            <td width="100">
              <form action="/room?id=${room_list[k].room_id}" method="post">
                <input type="submit" value="입장"
                 style="
                 font:15px;
                 border: 1px;
                 border-radius: 15px;
                 background: #FF0063;
                 font-weight: 600;
                 color: white;;
                 width:80px;
                 ">
              </form>
            </td>
          </tr>
          `;
      }
      return `
        <table border="1" >
        ${body}
        </table>
      `;
  },
  member_list_table:function(request,member_info,room_id,state){
    var body = '';
    if(state.state === "방장"){
       body = `
       <tr> <td colspan="3">member list</td></tr>
        <tr>
          <td width="100">state</td>
          <td width="100">name</td>
          <td width="100">잘가</td>
        </tr>`;

      for(var i = 0; i<member_info.length; i++){
        var my_name = '';
        if(member_info[i].name === request.user.name){
        }
        else{
          my_name=`<input type ="submit" value="강퇴"
          style="
          font:15px;
          border: 1px;
          border-radius: 15px;
          background: #FF0063;
          font-weight: 600;
          color: white;;
          width:80px;
          ">`;
        }
        body += `
        <tr>
        <td width="100">${member_info[i].state}</td>
        <td width="100">${member_info[i].name}</td>
        <td width="100">
        <form action="/room/kick_user" method="post">
          <input type ="hidden" name="room_id" value="${room_id}">
          <input type ="hidden" name="user_id" value="${member_info[i].id}">
          ${my_name}
        </form>
        </td>
        </tr>
        `;
      }
    }else{
      body = `
      <tr> <td colspan="2">member list</td></tr>
       <tr>
         <td width="100">state</td>
         <td width="100">name</td>
       </tr>`;

     for(var i = 0; i<member_info.length; i++){
       body += `
       <tr>
       <td width="100">${member_info[i].state}</td>
       <td width="100">${member_info[i].name}</td>
       </tr>
       `;
     }

    }

    return `
      <table border="1" >
      ${body}
      </table>
    `;
  },
  babgo_list_table:function(babgo_info,room_id,state){
    var body ='';
    if(state.state === "방장"){
      body += `
       <tr> <td colspan="3">babgo list</td></tr>
        <tr>
          <td width="50">Day</td>
          <td width="50">Time</td>
          <td width="50">delete</td>

        </tr>`;
      for(var i = 0; i<babgo_info.length; i++){
        body += `
        <tr>
        <td width="50">${babgo_info[i].day}</td>
        <td width="50">${babgo_info[i].time}</td>
        <td width="50">
          <form action="/room/delete_babgo" method="post">
            <input type ="hidden" name="room_id" value="${room_id}">
            <input type ="hidden" name="day" value="${babgo_info[i].day}">
            <input type ="hidden" name="time" value="${babgo_info[i].time}">
            <input type ="submit" value="delete">
          </form>
        </td>
        </tr>
        `;
      }
    }
    else{
        body = `
         <tr> <td colspan="2">babgo list</td></tr>
          <tr>
            <td width="50">Day</td>
            <td width="50">Time</td>
          </tr>`;
        for(var i = 0; i<babgo_info.length; i++){
          body += `
          <tr>
          <td width="50">${babgo_info[i].day}</td>
          <td width="50">${babgo_info[i].time}</td>

              <input type ="hidden" name="room_id" value="${room_id}">
              <input type ="hidden" name="day" value="${babgo_info[i].day}">
              <input type ="hidden" name="time" value="${babgo_info[i].time}">
          </td>
          </tr>
          `;
        }
      }
    console.log(babgo_info);
    return `
      <table border="1" >
      ${body}
      </table>
    `;
  },kick_list_table:function(kick_info,room_id,state){
    var body ='';
    if(state === "방장"){
      body += `
       <tr> <td colspan="3">kick list</td></tr>
        <tr>
          <td width="50">id</td>
          <td width="50">delete</td>

        </tr>`;
      for(var i = 0; i<kick_info.length; i++){
        body += `
        <tr>
        <td width="50">${kick_info[i].user_id}</td>
        <td width="50">
          <form action="/room/delete_kick" method="post">
            <input type ="hidden" name="room_id" value="${room_id}">
            <input type ="hidden" name="user_id" value="${kick_info[i].user_id}">
            <input type ="submit" value="delete">
          </form>
        </td>
        </tr>
        `;
      }
      return `
        <table border="1" >
        ${body}
        </table>
      `;
    }
    else{
      return ``;
      }
  },


  login_HTML: function(feedback){
    return `
    <!doctype html>
    <html>
    <head>
      <title>Login</title>
      <meta charset="utf-8">
    </head>
    <body  >
      <style>
        form{
          text-align: center;
        }
        h1{
          bacground: black;
          text-align: center;
        }
        #submit_user,#register_user{
           border-radius: 15px 15px 15px 15px;
          border: 2px solid #D2E1FF	;
          padding: 5px;
          font-size: 15px;
          width: 100px;
          text-align: center;
          font-weight: 900;
          color: #EAF6F6	;
          background: #66BFBF;
        }
      </style>
      <p style="color:#66BFBF; font-weight: bold; font-size: 50px; text-align: center;">
      &nbsp Login page &nbsp</span></p>
      <a href="/auth/google">Login with Google</a>
      <form action="/login/user_check" method="post">
        <div style="color:red;">${feedback}</div>
        <p><input type='text' name="id" placeholder="ID" value="dachan"></p>
        <p><input type='password' name="pw" placeholder="Password" value="1111"></p>
        <p><input type="submit" id="submit_user" value="Login"></p>
      </form>
      <form action="/login/register" method="post">
        <p><input type="submit" id="register_user" value="Register"></p>
      </form>
    </body>
    </html>
    `;
  },
  register_HTML: function(feedback){
    return `
    <!doctype html>
    <html>
    <head>
      <title>Login</title>
      <meta charset="utf-8">
    </head>
    <body  >
      <style>
        form{
          text-align: center;
        }
        h1{
          bacground: black;
          text-align: center;
        }
        #register_bt{
          border-radius: 15px 15px 15px 15px;
          border: 2px solid #D2E1FF	;
          padding: 5px;
          font-size: 15px;
          width: 100px;
          text-align: center;
          font-weight: 900;
          color: #EAF6F6	;
          background: #66BFBF;
        }

      </style>
      <p style="color:#66BFBF; font-weight: bold; font-size: 50px; text-align: center;">
      &nbspRegister page&nbsp</p>
      <form action="/login/register_process" method="post">
        <div style="color:red;">${feedback}</div>
        <p><input type='text' name="id" placeholder="ID" required></p>
        <p><input type='password' name="pwd" placeholder="Password" required></p>
        <p><input type='password' name="pwd2" placeholder="Password" required></p>
        <p><input type='text' name="name" placeholder="Name" required></p>
        <p><input type="submit" id="register_bt" value="register"></p>
      </form>
    </body>
    </html>
    `;
  },
  main_HTML: function(request,user_room,feedback,user_info){
    return`
    <!doctype html>
    <html>
    <head>
      <title>Main</title>
      <meta charset="utf-8">
    </head>
    <body >
      <style>
        h1{
          bacground: black;
          text-align: center;
        }

        table{
          text-align: center;
          font-weight: 600;
          margin: auto;
          color: #646464;
          border-radius:10px
        }
        #cr_room,#et_room,#my_p{
          border-radius: 15px 15px 15px 15px;
          border: 2px solid #D2E1FF	;
          padding: 3px;
          font-size: 15px;
          width: 100px;
          hight: 50px;
          text-align: center;
          font-weight: 900;
          color: #EAF6F6	;
          background: #66BFBF;
        }
        h2{
          bacground: black;
          text-align: center;
        }
        #bt_st{
          text-align: center;
        }
      </style>
      <p style="color:#66BFBF; font-weight: bold; font-size: 50px; text-align: center;">
        &nbsp[ 우리 밥 먹자 ]&nbsp
      </p>
      <div style="float:right;">
        <form action="/user/my_profile" method="post">
          ${request.user.name}
          <input type="submit" id="my_p" value="내 정보" >
        </form>
      </div>
      <p> &nbsp</p>
      ${this.room_list(user_room)}
      <p></p>
      ${this.time_table2_main(user_info)}
      <p></p>
      <div style="color:red; text-align:center;">${feedback}</div>
      <div id="bt_st">
      <form action="/room/enter_room_state" method="post">
        <input type="text" name="input_room_id" required width="300px">
        <p></p>
        <input type="submit" id="et_room"value="방 참여하기" >
      </form>
      <p></p>
      <form action="/room/create_room" method="post">
        <input type="submit" id="cr_room" value="방 만들기" >
      </form>
      </div>
    </body>
    </html>`
    ;
  },
  room_HTML:function(request, room_info, member_info, user_info,  room_timetable,  babgo_list, babgo_info, state, kick_info){
      var del = '';
      console.log(state);
      if(state.state === "방장"){
        del = `
        <form action="/room/delete_room?room_id=${room_info.room_id}" method="post" margin:auto;>
          <p><input type="submit" id="delete_room" value="delete_room"></p>
        </form>
        `;

      }

      return `
      <!doctype html>
      <html>
      <head>
        <title>Room</title>
        <meta charset="utf-8">
      </head>
      <body  >
        <style>
          table{
            text-align: center;
            font-weight: 600;
            color: #646464;
            border-radius:10px
          }
          #create_babgo,#back,#delete_room{
            border-radius: 15px 15px 15px 15px;
            border: 2px solid white;
            padding: 3px;
            font-size: 15px;
            width: 150px;
            hight: 50px;
            text-align: center;
            font-weight: 900;
            color: #EAF6F6	;
            background: #66BFBF;
            border-radius:8px
          }

        </style>
          <p style="color:#66BFBF; font-weight: bold; font-size: 50px; text-align: center;">
            &nbsp[ ${room_info.room_name} 밥고 ]&nbsp
          </p>
          <p></p>

        <div class="alala" style="float:left; margin-left:50px;">
          ${this.time_table1(room_timetable,babgo_list)}
          <p>&nbsp</p>
          ${this.time_table2(user_info,room_info.room_id)}
        </div>
        <div class="hahaha" style="float:right; margin-right:200px;">
          ${this.color_list()}
          <p></p>
          ${this.member_list_table(request,member_info,room_info.room_id,state)}
          <p></p>
          ${this.babgo_list_table(babgo_info,room_info.room_id,state)}
          <p></p>
          ${this.kick_list_table(kick_info,room_info.room_id,state.state)}
          <form action="/room/create_babgo?room_id=${room_info.room_id}" method="post" margin:auto;>
            <p><input type="submit" id="create_babgo" value="create_babgo"></p>
          </form>
          ${del}
          <form action="/user/main" margin:auto;>
            <p><input type="submit" id="back" value="Back"></p>
          </form>
        </div>
      </body>
      </html>
      `;
    },update_user_HTML:function(request,feedback){
      var pwd = '*'.repeat(request.user.password.length);

      return `
      <!doctype html>
      <html>
      <head>
        <title>Update user info</title>
        <meta charset="utf-8">
      </head>
      <body  >
        <style>
          form{
            text-align: center;
          }
          h1{
            bacground: black;
            text-align: center;
          }
          #submit_user,#back{
            border: 2px solid  white;
            padding: 5px;
            font-size: 15px;
            width: 100px;
            text-align: center;
            font-weight: 900;
            color: #EAF6F6	;
            background: #66BFBF;
            border-radius:8px
          }
        </style>
        <p style="color:#66BFBF; font-weight: bold; font-size: 50px; text-align: center;">
        Update info </p>
        <form action="/user/update" method="post">
          <div style="color:red;">${feedback}</div>
          <p>current id : <input type='text' name="id" required value="${request.user.id}"></p>
          <p>current name : <input type='text' name="name" required value="${request.user.name}"></p>
          <p>current pwd : <input type='password' name="current_pw" required placeholder="*****"></p>
          <p>new password : <input type='password' name="newpw" required placeholder="new Password"></p>
          <p>new password again : <input type='password' name="newpw2" required placeholder="new Password"></p>
          <p><input type="submit" id="submit_user" value="Update"></p>
        </form>
        <form action="/user/main" >
          <p><input type="submit" id="back" value="Back"></p>
        </form>
      </body>
      </html>
      `;
    },
    create_room_HTML:function(request, feedback){
        return `
        <!doctype html>
        <html>
        <head>
          <title>Create room</title>
          <meta charset="utf-8">
        </head>
        <body  >
          <style>
            form{
              text-align: center;
            }
            h1{
              bacground: black;
              text-align: center;
            }
            #submit_user, #back{
              border: 2px solid white;
              padding: 5px;
              font-size: 15px;
              width: 100px;
              text-align: center;
              font-weight: 900;
              color: #EAF6F6	;
              background: #66BFBF;
              border-radius:8px
            }
          </style>
          <p style="color:#66BFBF; font-weight: bold; font-size: 50px; text-align: center;">
          Create room page </p>
          <form action="/room/create_room_state" method="post">
            <div style="color:red;">${feedback}</div>
            <p> Room id : <input type='text' name="id" required placeholder="ex) HLWE54"></p>
            <p> Room name : <input type='text' name="name" required placeholder="Name"></p>
            <p> People limit  : <input type='number' name="limit" required min="0" placeholder="5"></p>
            <p><input type="submit" id="submit_user" required value="Create"></p>
          </form>
          <form action="/user/main" >
            <p><input type="submit" id="back" value="Back"></p>
          </form>
        </body>
        </html>
        `;
    },
    create_babgo_HTML:function(request, feedback){
        return `
        <!doctype html>
        <html>
        <head>
          <title>Create babgo</title>
          <meta charset="utf-8">
        </head>
        <body  >
          <style>
            form{
              text-align: center;
            }
            h1{
              bacground: black;
              text-align: center;
            }
            #submit_babgo, #back{
              border: 2px solid #D2E1FF;
              padding: 5px;
              font-size: 15px;
              width: 100px;
              text-align: center;
              font-weight: 900;
              color: #EAF6F6	;
              background: #66BFBF;
              border-radius:8px
            }
          </style>
          <p style="color:#66BFBF; font-weight: bold; font-size: 50px; text-align: center;">
          Create babgo page </p>
          <form action="/room/create_babgo_state" method="post">
            <div style="color:red;">${feedback}</div>
            <input type="hidden" name= "id" value="${request.query.room_id}">

            <p style="font-weight: bold;"> 요일 :
            <input list="Daylist" name="day" id="day" required style="width:150px;">
            <datalist id="Daylist">
              <option value="월">
              <option value="화">
              <option value="수">
              <option value="목">
              <option value="금">
              <option value="토">
              <option value="일">
            </datalist>
            </p>
            <p style="font-weight: bold;"> 교시  : <input type='number' name="time" required min="0" max="7" style="width:150px;"></p>
            <p><input type="submit" id="submit_babgo" required value="Create"></p>
          </form>

          <form action="/room?id=${request.query.room_id}" method="post" >
            <p><input type="submit" id="back" value="Back"></p>
          </form>
        </body>
        </html>
        `;
    }
}
