(self.webpackChunkbloglist_frontend=self.webpackChunkbloglist_frontend||[]).push([[970],{970:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return P}});var r=n(2137),o=n(7757),u=n.n(o),a=n(7294),c=n(5697),s=n(4494),i=n(332),l=n(1798),p=n(6156),f=n(9453);function g(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}var m=function(e){var t=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?g(Object(n),!0).forEach((function(t){(0,p.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):g(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},e),n=t.handleLogin,r=t.username,o=t.password;return(0,a.useEffect)((function(){document.querySelector("input").focus()}),[]),a.createElement(a.Fragment,null,a.createElement("h2",null,"Login"),a.createElement(f.Z,{onSubmit:n,className:"login-form"},a.createElement(f.Z.Group,null,a.createElement(f.Z.Input,{required:!0,label:"Username",id:"username",name:r.name,type:r.type,value:r.value,onChange:r.onChange})),a.createElement(f.Z.Group,null,a.createElement(f.Z.Input,{required:!0,label:"Password",id:"password",name:o.name,type:o.type,value:o.value,onChange:o.onChange})),a.createElement(f.Z.Button,{type:"submit"},"Login")))};m.propTypes={handleLogin:c.PropTypes.func.isRequired,username:c.PropTypes.object.isRequired,password:c.PropTypes.object.isRequired};var b=m,d=n(8999),y="".concat("https://favoriteblogs.herokuapp.com","/api/login"),v={login:function(){var e=(0,r.Z)(u().mark((function e(t){var n,r;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=(0,d.qu)(y,t),e.next=3,fetch(n);case 3:return r=e.sent,e.next=6,(0,d.UI)(r);case 6:return e.abrupt("return",e.sent);case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},O=n(2086),h=n(1479);function w(e){var t=(0,O.U)("text","username"),n=(0,O.U)("password","password"),o=e.setToken,c=e.setUser,s=e.setNotification,i=function(){var e=(0,r.Z)(u().mark((function e(r){var a;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r.preventDefault(),e.prev=1,e.next=4,v.login((0,h.gU)(t,n));case 4:a=e.sent,window.localStorage.setItem("loggedBlogAppUser",JSON.stringify(a)),o(a.token),c(a),window.location.href=window.location.origin,e.next=16;break;case 11:e.prev=11,e.t0=e.catch(1),t.setValue(""),n.setValue(""),s({error:"Login failed: ".concat(e.t0.message)});case 16:case"end":return e.stop()}}),e,null,[[1,11]])})));return function(t){return e.apply(this,arguments)}}();return a.createElement(a.Fragment,null,a.createElement("main",null,a.createElement("div",{className:"card"},a.createElement(b,{handleLogin:i,username:t,password:n}))))}var j={setNotification:i.s,setToken:l.o4,setUser:l.av};w.propTypes={setToken:c.PropTypes.func.isRequired,setUser:c.PropTypes.func.isRequired,setNotification:c.PropTypes.func.isRequired};var P=(0,s.$j)(null,j)(w)},2086:function(e,t,n){"use strict";n.d(t,{U:function(){return u}});var r=n(3391),o=n(7294),u=function(e,t){var n=(0,o.useState)(""),u=(0,r.Z)(n,2),a=u[0],c=u[1];return{name:t,type:e,value:a,onChange:function(e){c(e.target.value)},setValue:c}}},1479:function(e,t,n){"use strict";n.d(t,{Cz:function(){return a},gU:function(){return c},ww:function(){return s},R$:function(){return i},CV:function(){return l}});var r=n(6156);function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function u(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){(0,r.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var a=function(e,t){return e.filter((function(e){return e.user.username===t.username}))},c=function(){for(var e={},t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return n.forEach((function(t){e[t.name]=t.value})),e},s=function(e){return!!("http://"===e.substring(0,7)|"https://"===e.substring(0,8))},i=function(e,t){return e.map((function(e){var n=t.filter((function(t){return t.user.id===e.id}));return u(u({},e),{},{blogs:n})}))},l=function(e){return 0===Object.keys(e).length}}}]);